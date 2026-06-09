import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useAuthStore } from '@/stores/authStore';
import { storage } from '@/services/storage';
import { supabase } from '@/services/supabase';
import { Colors } from '@/constants/colors';
import { Spacing, Radius } from '@/constants/spacing';
import { Typography, FontFamily } from '@/constants/typography';
import CityImage from '@/components/ui/CityImage';

// Exact gradient from Mathias design spec
const GRADIENT_COLORS = ['#76A7FF', Colors.bgPrimary, 'rgba(242,242,247,0)'] as const;
const GRADIENT_LOCS = [0, 0.9615, 1] as const;

const { width: SCREEN_W } = Dimensions.get('window');
const CARD_H_PAD = Spacing.screenHorizontal;

// ─── Mock data (replace with API) ────────────────────────────────────────────

interface GuideCard {
  slug: string;
  name: string;
  country: string;
  spotsCount: number;
  itinerariesCount: number;
  placeholderColor: string;
  progress?: number; // 0–1
}

interface TrendingCard {
  slug: string;
  name: string;
  country: string;
  spotsCount: number;
  itinerariesCount: number;
  quote: string;
  highlights: Array<{ text: string; locked: boolean }>;
  placeholderColor: string;
  isNew: boolean;
}

const MOCK_MY_GUIDES: GuideCard[] = [
  {
    slug: 'barcelona',
    name: 'Barcelona',
    country: 'Spain',
    spotsCount: 6,
    itinerariesCount: 4,
    placeholderColor: '#C8860A',
    progress: 0.35,
  },
];

const MOCK_TRENDING: TrendingCard[] = [
  {
    slug: 'portofino',
    name: 'Portofino',
    country: 'Italy',
    spotsCount: 9,
    itinerariesCount: 3,
    quote: "Portofino is a 5-hour masterpiece — if you know where to go. Most cruisers don't.",
    highlights: [
      { text: 'The cliffside trattoria with no sign outside', locked: false },
      { text: 'The viewpoint only fishermen know about', locked: false },
      { text: 'The one thing everyone does wrong at port', locked: true },
    ],
    placeholderColor: '#534AB7',
    isNew: true,
  },
  {
    slug: 'dubrovnik',
    name: 'Dubrovnik',
    country: 'Croatia',
    spotsCount: 7,
    itinerariesCount: 3,
    quote: "Inside the walls is a trap. Outside them is the real Dubrovnik — and almost nobody goes there.",
    highlights: [
      { text: 'The bar above the city that locals keep secret', locked: false },
      { text: 'Three spots on the walls worth the climb', locked: false },
      { text: 'The one beach the cruise maps never show', locked: true },
    ],
    placeholderColor: '#1A4A8A',
    isNew: false,
  },
];

const MOCK_NEXT_STOP = {
  slug: 'barcelona',
  cityName: 'Barcelona, Spain',
  dateLabel: 'Next stop · June 18',
  quote: '"Skip La Rambla, the real Barcelona is in El Born. Start at Mercat de Santa Caterina instead."',
  attribution: '— Bon Vivant',
};

const CRUISE_PORT_COUNT = 7;

// ─── Sub-components ───────────────────────────────────────────────────────────

function CruisePill({ label, value }: { label: string; value: string }) {
  return (
    <LinearGradient
      colors={['#16162D', '#27273E']}
      start={{ x: 0.5, y: 1 }}
      end={{ x: 0.5, y: 0 }}
      style={pill.wrap}
    >
      <Text style={pill.label}>{label}</Text>
      <Text style={pill.days}>{value}</Text>
    </LinearGradient>
  );
}

const pill = StyleSheet.create({
  wrap: {
    width: 160,
    height: 59,
    borderRadius: 4,
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingLeft: 16,
    marginRight: -CARD_H_PAD,
  },
  days: {
    fontFamily: FontFamily.ui,
    fontSize: 12,
    lineHeight: 12,
    fontWeight: '400',
    color: Colors.blueLight,
  },
  label: {
    fontFamily: FontFamily.ui,
    fontSize: 16,
    lineHeight: 16,
    fontWeight: '700',
    color: Colors.white,
  },
});

function GuideCardItem({
  card,
  onPress,
}: {
  card: GuideCard;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity style={gc.card} onPress={onPress} activeOpacity={0.85}>
      <View style={gc.imgWrap}>
        <CityImage placeholderColor={card.placeholderColor} />
      </View>
      <View style={gc.body}>
        <Text style={gc.name}>{card.name}</Text>
        <Text style={gc.meta}>
          <Text style={gc.metaGray}>{card.country} · </Text>
          <Text style={gc.metaAccent}>{card.spotsCount} spots</Text>
          <Text style={gc.metaGray}> · </Text>
          <Text style={gc.metaAccent}>{card.itinerariesCount} itineraries</Text>
        </Text>
      </View>
      <View style={gc.progressTrack}>
        <View style={[gc.progressFill, { width: `${Math.round((card.progress ?? 0) * 100)}%` }]} />
      </View>
    </TouchableOpacity>
  );
}

const gc = StyleSheet.create({
  card: {
    width: 210,
    borderRadius: Radius.md + 4,
    overflow: 'hidden',
    backgroundColor: Colors.bgCard,
    borderWidth: 1,
    borderColor: Colors.borderFaint,
  },
  imgWrap: {
    width: '100%',
    height: 130,
  },
  body: {
    paddingHorizontal: 10,
    paddingTop: 8,
    paddingBottom: 10,
  },
  name: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  meta: {
    fontSize: 11,
    lineHeight: 15,
  },
  metaGray: {
    color: Colors.textSecondary,
  },
  metaAccent: {
    color: Colors.blueAccent,
    fontWeight: '500',
  },
  progressTrack: {
    height: 4,
    backgroundColor: Colors.borderLight,
  },
  progressFill: {
    height: 4,
    backgroundColor: Colors.blueAccent,
  },
});

function AddCard({ onPress }: { onPress: () => void }) {
  return (
    <TouchableOpacity style={add.card} onPress={onPress} activeOpacity={0.85}>
      <View style={add.circle}>
        <Feather name="plus" size={20} color={Colors.blueAccent} />
      </View>
      <Text style={add.label}>Add destination</Text>
    </TouchableOpacity>
  );
}

const add = StyleSheet.create({
  card: {
    width: 140,
    borderRadius: Radius.md + 4,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: Colors.borderLight,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24,
    paddingHorizontal: 12,
    backgroundColor: Colors.bgCard,
  },
  circle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(118, 167, 255, 0.18)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  label: {
    fontSize: 13,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
  },
});

function NextStopCard({
  stop,
  onOpenGuide,
  onViewItineraries,
}: {
  stop: typeof MOCK_NEXT_STOP;
  onOpenGuide: () => void;
  onViewItineraries: () => void;
}) {
  return (
    <View style={ns.card}>
      <Text style={ns.dateLabel}>{stop.dateLabel}</Text>
      <Text style={ns.cityName}>{stop.cityName}</Text>
      <Text style={ns.quote}>{stop.quote}</Text>
      <Text style={ns.attribution}>{stop.attribution}</Text>
      <View style={ns.btnRow}>
        <TouchableOpacity style={ns.btnYellow} onPress={onOpenGuide} activeOpacity={0.85}>
          <Text style={ns.btnYellowText}>Open guide</Text>
        </TouchableOpacity>
        <TouchableOpacity style={ns.btnBlue} onPress={onViewItineraries} activeOpacity={0.85}>
          <Text style={ns.btnBlueText}>View itineraries</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const ns = StyleSheet.create({
  card: {
    backgroundColor: Colors.navy,
    borderRadius: Radius.md + 8,
    padding: Spacing.xl,
    marginBottom: Spacing.xxl,
  },
  dateLabel: {
    fontSize: 12,
    color: Colors.textMeta,
    marginBottom: 6,
    fontWeight: '500',
  },
  cityName: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.white,
    marginBottom: 10,
    lineHeight: 28,
  },
  quote: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.75)',
    lineHeight: 20,
    fontStyle: 'italic',
  },
  attribution: {
    fontSize: 12,
    color: Colors.textMeta,
    marginTop: 6,
    marginBottom: Spacing.xl,
    fontWeight: '500',
  },
  btnRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  btnYellow: {
    backgroundColor: Colors.yellow,
    borderRadius: Radius.full,
    paddingHorizontal: 18,
    paddingVertical: 10,
  },
  btnYellowText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.navy,
  },
  btnBlue: {
    backgroundColor: Colors.blueAccent,
    borderRadius: Radius.full,
    paddingHorizontal: 18,
    paddingVertical: 10,
  },
  btnBlueText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.white,
  },
});

function TrendingCard({
  card,
  onDiscover,
}: {
  card: TrendingCard;
  onDiscover: () => void;
}) {
  return (
    <View style={tc.card}>
      {/* Image */}
      <View style={tc.imgWrap}>
        <CityImage placeholderColor={card.placeholderColor} />
        {card.isNew && (
          <View style={tc.newBadge}>
            <Text style={tc.newBadgeText}>New guide</Text>
          </View>
        )}
      </View>

      {/* Body */}
      <View style={tc.body}>
        <Text style={tc.cityName}>{card.name}</Text>
        <Text style={tc.meta}>
          {card.country} · {card.spotsCount} spots · {card.itinerariesCount} itineraries
        </Text>

        <Text style={tc.quote}>"{card.quote}"</Text>
        <Text style={tc.attribution}>— Bon Vivant</Text>

        <View style={tc.highlights}>
          {card.highlights.map((h, i) => (
            <View key={i} style={tc.highlightRow}>
              {h.locked ? (
                <Feather name="lock" size={13} color={Colors.textSecondary} style={tc.highlightIcon} />
              ) : (
                <View style={tc.bullet}>
                  <Text style={tc.bulletNum}>{i + 1}</Text>
                </View>
              )}
              <Text style={[tc.highlightText, h.locked && tc.highlightLocked]}>
                {h.text}
              </Text>
            </View>
          ))}
        </View>

        <TouchableOpacity style={tc.discoverBtn} onPress={onDiscover} activeOpacity={0.85}>
          <Text style={tc.discoverText}>Discover {card.name}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const tc = StyleSheet.create({
  card: {
    backgroundColor: Colors.bgCard,
    borderRadius: Radius.md + 8,
    overflow: 'hidden',
    width: SCREEN_W - CARD_H_PAD * 2,
  },
  imgWrap: {
    width: '100%',
    height: 200,
    position: 'relative',
  },
  newBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: Colors.badgeGreenBg,
    borderRadius: Radius.full,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  newBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.badgeGreenText,
  },
  body: {
    padding: Spacing.xl,
  },
  cityName: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 3,
  },
  meta: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
  },
  quote: {
    fontSize: 13,
    fontStyle: 'italic',
    color: Colors.textPrimary,
    lineHeight: 20,
  },
  attribution: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 4,
    marginBottom: Spacing.lg,
  },
  highlights: {
    gap: Spacing.sm,
    marginBottom: Spacing.xl,
  },
  highlightRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
  },
  bullet: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.blueAccent,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
    flexShrink: 0,
  },
  bulletNum: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.white,
  },
  highlightIcon: {
    marginTop: 2,
    width: 20,
    textAlign: 'center',
  },
  highlightText: {
    flex: 1,
    fontSize: 13,
    color: Colors.textPrimary,
    lineHeight: 20,
  },
  highlightLocked: {
    color: Colors.textSecondary,
  },
  discoverBtn: {
    backgroundColor: Colors.blueAccent,
    borderRadius: Radius.md,
    paddingVertical: 14,
    alignItems: 'center',
  },
  discoverText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.white,
  },
});

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function Home() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const isGuest = useAuthStore((s) => s.isGuest);
  const [selectedCitySlug, setSelectedCitySlug] = useState<string | null>(null);
  const [emailUnconfirmed, setEmailUnconfirmed] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [trendingIndex, setTrendingIndex] = useState(0);

  useEffect(() => {
    storage.getSelectedCity().then(setSelectedCitySlug);
    supabase.auth.getUser().then(({ data }) => {
      if (data.user != null && !data.user.email_confirmed_at) {
        setEmailUnconfirmed(true);
      }
    });
  }, []);

  const handleResendEmail = useCallback(async () => {
    if (user?.email == null || resendLoading) return;
    setResendLoading(true);
    await supabase.auth.resend({ type: 'signup', email: user.email });
    setResendLoading(false);
  }, [user?.email, resendLoading]);

  const displayName = (() => {
    const prefix = user?.email?.split('@')[0] ?? 'there';
    return prefix.charAt(0).toUpperCase() + prefix.slice(1);
  })();

  // Use selectedCitySlug from onboarding, or fall back to first mock guide
  const myGuides: GuideCard[] = selectedCitySlug != null
    ? MOCK_MY_GUIDES.map((g) => (g.slug === selectedCitySlug ? g : MOCK_MY_GUIDES[0]!))
    : MOCK_MY_GUIDES;

  const nextStop = MOCK_NEXT_STOP;

  function handleTrendingScroll(e: NativeSyntheticEvent<NativeScrollEvent>) {
    const idx = Math.round(e.nativeEvent.contentOffset.x / (SCREEN_W - CARD_H_PAD * 2));
    setTrendingIndex(idx);
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* ── Gradient header — paddingBottom provides the 29px gap + fade room ── */}
        <LinearGradient
          colors={GRADIENT_COLORS}
          locations={GRADIENT_LOCS}
          style={styles.gradientSection}
        >
          {/* Email verification banner */}
          {emailUnconfirmed && (
            <View style={styles.verifyBanner}>
              <View style={styles.verifyLeft}>
                <Feather name="mail" size={16} color={Colors.amberText} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.verifyTitle}>Verify your email</Text>
                  <Text style={styles.verifySub}>Tap the link we sent to unlock offline mode</Text>
                </View>
              </View>
              <TouchableOpacity onPress={handleResendEmail} disabled={resendLoading}>
                <Text style={styles.resendText}>{resendLoading ? '...' : 'Resend'}</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.welcomeLabel}>Welcome back</Text>
              <Text style={styles.nameText}>{displayName}</Text>
            </View>
            <CruisePill label="Next cruise" value="12 days" />
          </View>
        </LinearGradient>

        {/* ── bgPrimary: My Guides + rest of content ── */}
        <View style={styles.contentBelow}>

          {/* My Guides */}
          <View style={styles.sectionRow}>
            <Text style={styles.sectionTitle}>My Guides</Text>
            <Text style={styles.sectionMeta}>1 city unlocked</Text>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.hScroll}
            contentContainerStyle={styles.guidesRow}
          >
            {myGuides.map((g) => (
              <GuideCardItem
                key={g.slug}
                card={g}
                onPress={() => router.push(`/(app)/city/${g.slug}`)}
              />
            ))}
            <AddCard onPress={() => router.push('/(app)/explore')} />
          </ScrollView>


          {/* Next Stop card */}
          <NextStopCard
            stop={nextStop}
            onOpenGuide={() => router.push(`/(app)/city/${nextStop.slug}`)}
            onViewItineraries={() => router.push(`/(app)/city/${nextStop.slug}`)}
          />

          {/* Trending */}
          <View style={styles.sectionRow}>
            <View>
              <Text style={styles.sectionTitle}>Trending</Text>
              <Text style={styles.sectionSubtitle}>Find your next favorite city</Text>
            </View>
          </View>

          <FlatList
            data={MOCK_TRENDING}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            keyExtractor={(c) => c.slug}
            onScroll={handleTrendingScroll}
            scrollEventThrottle={16}
            snapToInterval={SCREEN_W - CARD_H_PAD * 2}
            decelerationRate="fast"
            contentContainerStyle={styles.trendingList}
            style={styles.trendingScroll}
            renderItem={({ item }) => (
              <TrendingCard
                card={item}
                onDiscover={() => router.push(`/(app)/city/${item.slug}`)}
              />
            )}
          />

          {/* Pagination dots */}
          <View style={styles.dotsRow}>
            {MOCK_TRENDING.map((_, i) => (
              <View
                key={i}
                style={[styles.dot, i === trendingIndex && styles.dotActive]}
              />
            ))}
          </View>

          {/* Cruise CTA */}
          <View style={styles.cruiseCard}>
            <Text style={styles.cruiseTitle}>
              Your cruise visits {CRUISE_PORT_COUNT} ports
            </Text>
            <Text style={styles.cruiseSub}>Your guides are ready when you are</Text>
            <TouchableOpacity
              style={styles.cruiseBtn}
              onPress={() => router.push('/(app)/explore')}
              activeOpacity={0.85}
            >
              <Text style={styles.cruiseBtnText}>View packs</Text>
            </TouchableOpacity>
          </View>

          <View style={{ height: 100 }} />
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#76A7FF', // matches gradient start color
  },
  scroll: {
    flex: 1,
    backgroundColor: Colors.bgPrimary,
  },

  // Gradient container — paddingBottom provides the 29px gap AND space for the fade to complete
  gradientSection: {
    paddingHorizontal: CARD_H_PAD,
    paddingTop: Spacing.lg,
    paddingBottom: 29,
  },

  // bgPrimary section — My Guides onwards; spacing comes from gradientSection.paddingBottom
  contentBelow: {
    paddingHorizontal: CARD_H_PAD,
    paddingTop: 0,
    backgroundColor: Colors.bgPrimary,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 0,
  },
  welcomeLabel: {
    ...Typography.welcomeText,
    color: Colors.white,
    marginBottom: 3,
  },
  nameText: {
    ...Typography.displayName,
    color: Colors.textPrimary,
  },

  // Email banner
  verifyBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.amberLight,
    borderRadius: Radius.md + 4,
    paddingHorizontal: Spacing.lg,
    paddingVertical: 10,
    marginBottom: Spacing.lg,
    gap: Spacing.sm,
  },
  verifyLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
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
    lineHeight: 15,
  },
  resendText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.amberMid,
    flexShrink: 0,
  },

  // Section rows
  sectionRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    ...Typography.sectionHeading,
    color: Colors.textPrimary,
  },
  sectionMeta: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 4,
    fontWeight: '400',
  },
  sectionSubtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 2,
  },

  // Horizontal scroll (negative margin escapes gradientSection padding)
  hScroll: {
    marginHorizontal: -CARD_H_PAD,
    marginBottom: 0,
  },
  guidesRow: {
    paddingHorizontal: CARD_H_PAD,
    gap: Spacing.md,
    paddingBottom: Spacing.xl,
  },

  // Trending carousel
  trendingScroll: {
    marginHorizontal: -CARD_H_PAD,
  },
  trendingList: {
    paddingHorizontal: CARD_H_PAD,
    gap: Spacing.md,
  },

  // Pagination dots
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    marginTop: Spacing.md,
    marginBottom: Spacing.xxl,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.borderLight,
  },
  dotActive: {
    backgroundColor: Colors.blueAccent,
    width: 18,
  },

  // Cruise CTA
  cruiseCard: {
    backgroundColor: Colors.navy,
    borderRadius: Radius.md + 8,
    padding: Spacing.xl,
    marginBottom: Spacing.lg,
    alignItems: 'center',
  },
  cruiseTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.white,
    textAlign: 'center',
    lineHeight: 26,
    marginBottom: 6,
  },
  cruiseSub: {
    fontSize: 13,
    color: Colors.blueLight,
    textAlign: 'center',
    marginBottom: Spacing.xl,
  },
  cruiseBtn: {
    backgroundColor: Colors.white,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.xxl,
    paddingVertical: 12,
  },
  cruiseBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.navy,
  },
});
