import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useAuthStore } from '@/stores/authStore';
import { storage } from '@/services/storage';
import { supabase } from '@/services/supabase';
import { t } from '@/constants/i18n';
import { Colors } from '@/constants/colors';
import CityImage from '@/components/ui/CityImage';
import GuestGate from '@/components/ui/GuestGate';

// ─── Types ───────────────────────────────────────────────────────────────────

type BadgeVariant = 'On your route' | 'Popular' | "Bon vivant's choice" | 'New guide';

interface MockCity {
  slug: string;
  name: string;
  country: string;
  region: string;
  quote: string;
  placeholderColor: string;
  badge: BadgeVariant;
}

interface MockTip {
  id: string;
  content: string;
}

interface FreeCityData {
  name: string;
  country: string;
  placeholderColor: string;
}

// ─── Mock data ────────────────────────────────────────────────────────────────

// TODO: connect to API — GET /cities
const MOCK_CITIES: MockCity[] = [
  {
    slug: 'yokohama',
    name: 'Yokohama',
    country: 'Japan',
    region: 'Pacific',
    quote: "If there is something I would eat there are the matcha from Motomachi's corners.",
    placeholderColor: '#1D9E75',
    badge: 'On your route',
  },
  {
    slug: 'singapore',
    name: 'Singapore',
    country: 'Singapore',
    region: 'Asia',
    quote: "If there is something I would eat there are the mocha from luffy's mom.",
    placeholderColor: '#185FA5',
    badge: 'Popular',
  },
  {
    slug: 'santorini',
    name: 'Santorini',
    country: 'Greece',
    region: 'Mediterranean',
    quote: "If there is something I would eat there are the mocha from luffy's mom.",
    placeholderColor: '#D85A30',
    badge: "Bon vivant's choice",
  },
  {
    slug: 'portofino',
    name: 'Portofino',
    country: 'Italy',
    region: 'Mediterranean',
    quote: "If there is something I would eat there are the mocha from luffy's mom.",
    placeholderColor: '#534AB7',
    badge: 'New guide',
  },
];

// TODO: connect to API — GET /tips/general
const MOCK_TIPS: MockTip[] = [
  { id: '1', content: 'Always arrive at the port 30 min early. The best spots fill up fast.' },
  { id: '2', content: "Skip the ship's excursions. Walk 10 min from port and save 40%." },
  { id: '3', content: 'The best local restaurants never have menus in English. Good sign.' },
];

const CRUISE_PORT_COUNT = 7; // TODO: replace with actual port count from cruise data

// TODO: replace with API call to GET /cities/:slug
const FREE_CITY_DATA: Record<string, FreeCityData> = {
  barcelona: { name: 'Barcelona', country: 'Spain', placeholderColor: '#C8860A' },
  yokohama: { name: 'Yokohama', country: 'Japan', placeholderColor: '#1D9E75' },
  rio: { name: 'Rio de Janeiro', country: 'Brazil', placeholderColor: '#D85A30' },
  singapore: { name: 'Singapore', country: 'Singapore', placeholderColor: '#185FA5' },
  santorini: { name: 'Santorini', country: 'Greece', placeholderColor: '#D85A30' },
  portofino: { name: 'Portofino', country: 'Italy', placeholderColor: '#534AB7' },
};

const BADGE_COLORS: Record<BadgeVariant, { bg: string; text: string }> = {
  'On your route': { bg: Colors.tealLight, text: Colors.tealDark },
  'Popular': { bg: Colors.amberLight, text: Colors.amberText },
  "Bon vivant's choice": { bg: Colors.purpleLight, text: Colors.purpleDark },
  'New guide': { bg: Colors.blueLight, text: Colors.blueDark },
};

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function Home() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const isGuest = useAuthStore((s) => s.isGuest);
  const [selectedCitySlug, setSelectedCitySlug] = useState<string | null>(null);
  const [emailUnconfirmed, setEmailUnconfirmed] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [guestBannerDismissed, setGuestBannerDismissed] = useState(false);

  function handleGuestAction() {
    router.push('/(auth)/register');
  }

  useEffect(() => {
    storage.getSelectedCity().then(setSelectedCitySlug);
    supabase.auth.getUser().then(({ data }) => {
      if (data.user != null && !data.user.email_confirmed_at) {
        setEmailUnconfirmed(true);
      }
    });
  }, []);

  const displayName = (() => {
    const prefix = user?.email?.split('@')[0] ?? '';
    // TODO: use full_name when profile is complete
    return prefix.charAt(0).toUpperCase() + prefix.slice(1);
  })();

  const handleResendEmail = useCallback(async () => {
    if (user?.email == null || resendLoading) return;
    setResendLoading(true);
    await supabase.auth.resend({ type: 'signup', email: user.email });
    setResendLoading(false);
  }, [user?.email, resendLoading]);

  const selectedCity = selectedCitySlug != null ? (FREE_CITY_DATA[selectedCitySlug] ?? null) : null;

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* ── 1. Header ─────────────────────────────────────────── */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.welcomeLabel}>{t('home.welcomeBack')}</Text>
            <Text style={styles.nameText}>{displayName}</Text>
          </View>
          {/* TODO: build when cruise data available */}
          <TouchableOpacity
            style={styles.cruisePill}
            onPress={() => router.push('/(app)/profile')}
            activeOpacity={0.85}
          >
            <Text style={styles.cruisePillText}>{t('home.addCruiseDate')}</Text>
          </TouchableOpacity>
        </View>

        {/* ── 1b. Guest banner ──────────────────────────────────── */}
        {isGuest && !guestBannerDismissed && (
          <View style={styles.guestBanner}>
            <Feather name="user" size={20} color={Colors.teal} />
            <View style={styles.guestBannerTexts}>
              <Text style={styles.guestBannerTitle}>{t('home.guestBanner')}</Text>
              <Text style={styles.guestBannerSub}>{t('home.guestBannerSub')}</Text>
            </View>
            <View style={styles.guestBannerRight}>
              <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
                <Text style={styles.guestBannerCta}>{t('home.guestBannerCta')}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setGuestBannerDismissed(true)}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                style={styles.guestBannerDismiss}
              >
                <Feather name="x" size={14} color={Colors.textTertiary} />
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* ── 2. Email verification banner ──────────────────────── */}
        {emailUnconfirmed && user?.email != null && (
          <View style={styles.verifyBanner}>
            <View style={styles.verifyLeft}>
              <Feather name="mail" size={18} color={Colors.amberText} />
              <View style={styles.verifyTexts}>
                <Text style={styles.verifyTitle}>{t('home.verifyEmail')}</Text>
                <Text style={styles.verifySub}>{t('home.verifyEmailSub')}</Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.resendBtn}
              onPress={handleResendEmail}
              disabled={resendLoading}
              activeOpacity={0.85}
            >
              <Text style={styles.resendText}>{t('home.resend')}</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ── 3. My Guides ──────────────────────────────────────── */}
        <View style={styles.sectionRow}>
          <Text style={styles.sectionTitle}>{t('home.myGuides')}</Text>
          <Text style={styles.sectionMeta}>{t('home.cityUnlocked', { count: '1' })}</Text>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.hScroll}
          contentContainerStyle={styles.guidesRow}
        >
          {selectedCity != null && selectedCitySlug != null && (
            <TouchableOpacity
              style={styles.cityCard}
              onPress={() => router.push(`/(app)/city/${selectedCitySlug}`)}
              activeOpacity={0.85}
            >
              <View style={styles.cityCardImg}>
                <CityImage placeholderColor={selectedCity.placeholderColor} />
              </View>
              <View style={styles.cityCardBody}>
                <Text style={styles.cityCardName}>{selectedCity.name}</Text>
                <Text style={styles.cityCardCountry}>{selectedCity.country}</Text>
                {/* TODO: badges data comes from API city detail */}
                <View style={styles.cityBadgeRow}>
                  <Text style={styles.cityBadgeItem}>{selectedCity.country}</Text>
                  <Text style={styles.cityBadgeDot}>·</Text>
                  <Text style={styles.cityBadgeItem}>
                    {t('home.guidesBadge', { count: '1' })}
                  </Text>
                  <Text style={styles.cityBadgeDot}>·</Text>
                  <Text style={styles.cityBadgeItem}>
                    {t('home.itinerariesBadge', { count: '3' })}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          )}

          {/* Add destination card — locked for guests */}
          <GuestGate isGuest={isGuest} onRegister={handleGuestAction}>
            <TouchableOpacity
              style={styles.addCard}
              onPress={() => router.push('/(app)/explore')}
              activeOpacity={0.85}
            >
              <Feather name="plus" size={24} color={Colors.textTertiary} />
              <Text style={styles.addCardLabel}>{t('home.addDestination')}</Text>
              <Text style={styles.addCardPrice}>{t('home.fromPrice')}</Text>
            </TouchableOpacity>
          </GuestGate>
        </ScrollView>

        {/* ── 4. Next Port banner ───────────────────────────────── */}
        {/* TODO: connect when cruise planning is built */}
        <View style={styles.nextPortCard}>
          <View style={styles.nextPortPlaceholderRow}>
            <Feather name="clock" size={16} color={Colors.textSecondary} />
            <Text style={styles.nextPortPlaceholderTitle}>{t('home.planCruise')}</Text>
          </View>
          <Text style={styles.nextPortPlaceholderSub}>{t('home.planCruiseSub')}</Text>
          <TouchableOpacity
            style={styles.nextPortBtn}
            onPress={() => router.push('/(app)/profile')}
            activeOpacity={0.85}
          >
            <Text style={styles.nextPortBtnText}>{t('home.setupCruise')}</Text>
          </TouchableOpacity>
        </View>

        {/* ── 5. Discover ───────────────────────────────────────── */}
        <View style={styles.discoverHeader}>
          <Text style={styles.sectionTitle}>{t('home.discover')}</Text>
          <Text style={styles.discoverSub}>{t('home.discoverSub')}</Text>
        </View>

        {/* Filter pills — TODO: filter logic when API is ready */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.hScroll}
          contentContainerStyle={styles.filterRow}
        >
          <View style={[styles.filterPill, styles.filterPillActive]}>
            <Text style={[styles.filterPillText, styles.filterPillTextActive]}>
              {t('home.filterAll')}
            </Text>
          </View>
          <View style={styles.filterPill}>
            <Text style={styles.filterPillText}>{t('home.filterRoute')}</Text>
          </View>
          <View style={styles.filterPill}>
            <Text style={styles.filterPillText}>{t('home.filterMed')}</Text>
          </View>
          <View style={styles.filterPill}>
            <Text style={styles.filterPillText}>{t('home.filterCaribbean')}</Text>
          </View>
        </ScrollView>

        {/* TODO: replace MOCK_CITIES with API call to GET /cities */}
        {MOCK_CITIES.map((city) => {
          const badge = BADGE_COLORS[city.badge];
          return (
            <TouchableOpacity
              key={city.slug}
              style={styles.discoverCard}
              onPress={() => router.push(`/(app)/city/${city.slug}`)}
              activeOpacity={0.85}
            >
              <View style={styles.discoverCardImg}>
                <CityImage placeholderColor={city.placeholderColor} />
              </View>
              <View style={styles.discoverCardBody}>
                <View style={styles.discoverCardTop}>
                  <Text style={styles.discoverCardName}>{city.name}</Text>
                  <View style={[styles.badgePill, { backgroundColor: badge.bg }]}>
                    <Text style={[styles.badgePillText, { color: badge.text }]}>
                      {city.badge}
                    </Text>
                  </View>
                </View>
                <Text style={styles.discoverCardLocation}>
                  {city.country} · {city.region}
                </Text>
                <Text style={styles.discoverCardQuote} numberOfLines={2}>
                  {city.quote}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}

        {/* ── 6. Bon Vivant Tips ────────────────────────────────── */}
        <Text style={[styles.sectionTitle, styles.tipsTitle]}>{t('home.bonVivantTips')}</Text>
        <Text style={styles.tipsSub}>{t('home.bonVivantTipsSub')}</Text>
        {/* TODO: replace MOCK_TIPS with API call to GET /tips/general */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.hScroll}
          contentContainerStyle={styles.tipsRow}
        >
          {MOCK_TIPS.map((tip) => (
            <View key={tip.id} style={styles.tipCard}>
              <Text style={styles.tipQuoteMark}>{'“'}</Text>
              <Text style={styles.tipContent}>{tip.content}</Text>
              <Text style={styles.tipAuthor}>{t('home.bonVivantAttr')}</Text>
            </View>
          ))}
        </ScrollView>

        {/* ── 7. Cruise Pack CTA — locked for guests ────────────── */}
        <GuestGate isGuest={isGuest} onRegister={handleGuestAction}>
          <View style={styles.cruisePackCard}>
            {/* TODO: replace CRUISE_PORT_COUNT with actual port count from cruise data */}
            <Text style={styles.cruisePackTitle}>
              {t('home.cruisePack', { count: String(CRUISE_PORT_COUNT) })}
            </Text>
            <Text style={styles.cruisePackSub}>{t('home.cruisePackSub')}</Text>
            <TouchableOpacity
              style={styles.cruisePackBtn}
              onPress={() => router.push('/(app)/explore')}
              activeOpacity={0.85}
            >
              <Text style={styles.cruisePackBtnText}>{t('home.cruisePackCta')}</Text>
            </TouchableOpacity>
          </View>
        </GuestGate>

        {/* ── 8. Bottom padding ─────────────────────────────────── */}
        <View style={styles.bottomPad} />
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  headerLeft: {
    flex: 1,
  },
  welcomeLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  nameText: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text,
  },
  cruisePill: {
    backgroundColor: Colors.navy,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginLeft: 12,
  },
  cruisePillText: {
    fontSize: 11,
    color: Colors.background,
    fontWeight: '500',
  },

  // Guest banner
  guestBanner: {
    backgroundColor: Colors.guestBannerBg,
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderLeftWidth: 3,
    borderLeftColor: Colors.teal,
    marginBottom: 16,
    gap: 10,
  },
  guestBannerTexts: {
    flex: 1,
  },
  guestBannerTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.text,
  },
  guestBannerSub: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  guestBannerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  guestBannerCta: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.teal,
  },
  guestBannerDismiss: {
    padding: 2,
  },

  // Email verification banner
  verifyBanner: {
    backgroundColor: Colors.amberLight,
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  verifyLeft: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
    gap: 8,
  },
  verifyTexts: {
    flex: 1,
  },
  verifyTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.amberText,
  },
  verifySub: {
    fontSize: 11,
    color: Colors.amberText,
    marginTop: 2,
    lineHeight: 16,
  },
  resendBtn: {
    backgroundColor: Colors.amberMid,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginLeft: 8,
  },
  resendText: {
    fontSize: 12,
    color: Colors.background,
    fontWeight: '600',
  },

  // Section headers
  sectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
  },
  sectionMeta: {
    fontSize: 12,
    color: Colors.textSecondary,
  },

  // Horizontal scroll shared
  hScroll: {
    marginHorizontal: -20,
  },

  // My Guides
  guidesRow: {
    paddingHorizontal: 20,
    paddingBottom: 4,
    gap: 12,
    marginBottom: 20,
  },
  cityCard: {
    width: 160,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.borderFaint,
  },
  cityCardImg: {
    width: '100%',
    height: 110,
  },
  cityCardBody: {
    padding: 10,
  },
  cityCardName: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.text,
  },
  cityCardCountry: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 2,
    marginBottom: 6,
  },
  cityBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 3,
  },
  cityBadgeItem: {
    fontSize: 10,
    color: Colors.textSecondary,
  },
  cityBadgeDot: {
    fontSize: 10,
    color: Colors.textTertiary,
  },

  // Add destination card
  addCard: {
    width: 140,
    borderRadius: 16,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: Colors.borderLight,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    paddingHorizontal: 12,
  },
  addCardLabel: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 8,
    textAlign: 'center',
  },
  addCardPrice: {
    fontSize: 12,
    color: Colors.teal,
    marginTop: 4,
    fontWeight: '600',
  },

  // Next Port banner
  nextPortCard: {
    backgroundColor: Colors.infoLight,
    borderRadius: 16,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: Colors.teal,
    marginBottom: 24,
  },
  nextPortPlaceholderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  nextPortPlaceholderTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text,
  },
  nextPortPlaceholderSub: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginBottom: 14,
  },
  nextPortBtn: {
    backgroundColor: Colors.text,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignSelf: 'flex-start',
  },
  nextPortBtnText: {
    fontSize: 13,
    color: Colors.background,
    fontWeight: '600',
  },

  // Discover
  discoverHeader: {
    marginBottom: 10,
  },
  discoverSub: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  filterRow: {
    paddingHorizontal: 20,
    paddingBottom: 4,
    gap: 8,
    marginBottom: 12,
  },
  filterPill: {
    backgroundColor: Colors.surface,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  filterPillActive: {
    backgroundColor: Colors.text,
    borderColor: Colors.text,
  },
  filterPillText: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  filterPillTextActive: {
    color: Colors.background,
  },

  // Discover cards
  discoverCard: {
    height: 90,
    flexDirection: 'row',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.borderFaint,
    backgroundColor: Colors.background,
  },
  discoverCardImg: {
    width: 100,
    height: '100%',
  },
  discoverCardBody: {
    flex: 1,
    padding: 12,
    justifyContent: 'center',
  },
  discoverCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  discoverCardName: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.text,
    flex: 1,
    marginRight: 6,
  },
  discoverCardLocation: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginBottom: 3,
  },
  discoverCardQuote: {
    fontSize: 12,
    fontStyle: 'italic',
    color: Colors.textSecondary,
    lineHeight: 16,
  },
  badgePill: {
    borderRadius: 20,
    paddingHorizontal: 7,
    paddingVertical: 3,
    flexShrink: 0,
  },
  badgePillText: {
    fontSize: 10,
    fontWeight: '600',
  },

  // Tips
  tipsTitle: {
    marginTop: 8,
  },
  tipsSub: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
    marginBottom: 12,
  },
  tipsRow: {
    paddingHorizontal: 20,
    paddingBottom: 4,
    gap: 12,
    marginBottom: 24,
  },
  tipCard: {
    width: 200,
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
  },
  tipQuoteMark: {
    fontSize: 32,
    color: Colors.teal,
    fontWeight: '700',
    lineHeight: 32,
    marginBottom: 4,
  },
  tipContent: {
    fontSize: 13,
    color: Colors.primaryLight,
    lineHeight: 20,
  },
  tipAuthor: {
    fontSize: 11,
    color: Colors.teal,
    marginTop: 8,
    fontWeight: '500',
  },

  // Cruise Pack CTA
  cruisePackCard: {
    backgroundColor: Colors.navy,
    borderRadius: 16,
    padding: 20,
    marginBottom: 8,
  },
  cruisePackTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.background,
  },
  cruisePackSub: {
    fontSize: 13,
    color: Colors.background,
    opacity: 0.7,
    marginTop: 4,
  },
  cruisePackBtn: {
    backgroundColor: Colors.teal,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignSelf: 'flex-start',
    marginTop: 16,
  },
  cruisePackBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.background,
  },

  // Bottom padding
  bottomPad: {
    height: 100,
  },
});
