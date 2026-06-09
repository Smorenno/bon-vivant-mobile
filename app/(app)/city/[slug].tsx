import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import CityImage from '@/components/ui/CityImage';
import ContextCard from '@/components/city/ContextCard';
import PortContent from '@/components/city/PortContent';
import type { PortData } from '@/components/city/PortContent';
import AttractionsContent from '@/components/city/AttractionsContent';
import type { AttractionsData } from '@/components/city/AttractionsContent';
import GourmetContent from '@/components/city/GourmetContent';
import TipsContent from '@/components/city/TipsContent';
import WhatToKnowContent from '@/components/city/WhatToKnowContent';
import ItinerariesContent from '@/components/city/ItinerariesContent';
import ItineraryDetail from '@/components/city/ItineraryDetail';
import { Colors } from '@/constants/colors';
import { Spacing, Radius } from '@/constants/spacing';
import { Typography } from '@/constants/typography';
import type { CityGuide, Itinerary, TransportMethod } from '@/types/guide';
// DEV ONLY: resolved mocks in Spanish — replace with API store when services are wired
import yokohamaMock from '@/mocks/yokohama.guide.json';
import barcelonaMock from '@/mocks/barcelona.guide.json';
import { MOCK_GUIDES } from '@/services/mock/cities';
import { resolveGuide } from '@/services/i18n/resolveGuide';
import type { Locale } from '@/types/i18n';

// --- Constants ---

const LOCALE: Locale = 'en'; // TODO: wire to user locale store

const CITY_PLACEHOLDER: Record<string, string> = {
  yokohama: '#2C6E6A',
  barcelona: '#C8860A',
  rio: '#D85A30',
};

const HIGHLIGHT_COLORS: Record<string, string[]> = {
  yokohama: ['#1A2B5E', '#8B1A1A', '#2D6A4F'],
  barcelona: ['#8B4513', '#4A4A6A', '#1A7BBF'],
  rio: ['#5A7A3A', '#1A6BBF', '#8B5A2B'],
};

const SPOT_COLORS: Record<string, string> = {
  'yk-s1': '#1A2B5E',
  'yk-s2': '#8B1A1A',
  'yk-s3': '#1A3A5E',
  'yk-f1': '#2C3E6B',
  'yk-f2': '#3B1A1A',
  'yk-f3': '#1A2B3C',
  'bcn-s1': '#6B3A2A',
  'bcn-s2': '#2A3A5E',
  'bcn-s3': '#3A2A5E',
  'bcn-f1': '#5E2A1A',
  'bcn-f2': '#1A3A4A',
  'bcn-f3': '#2A4A2A',
  'rio-s1': '#5A7A3A',
};

const PORT_IMAGE_COLORS: Record<string, string> = {
  yokohama: '#8A9BB0',
  barcelona: '#5A7A8A',
  rio: '#3A5E7A',
};

const METHOD_LABEL: Record<TransportMethod, string> = {
  walk: 'Walking',
  metro: 'Metro',
  tram: 'Tram / VLT',
  taxi: 'Taxi / Uber',
  train: 'Train',
  ferry: 'Shuttle / Ferry',
};

const INTERCITY_METHODS: TransportMethod[] = ['train', 'ferry'];

// Tabs whose content needs a dark card background
const DARK_TABS = new Set(['gourmet', 'tips', 'itineraries'] as const);

// --- Tabs ---

const TABS = [
  { key: 'overview', label: 'Overview' },
  { key: 'port', label: 'Port' },
  { key: 'attractions', label: 'Attractions & Exploration' },
  { key: 'gourmet', label: 'Gourmet experience' },
  { key: 'itineraries', label: 'Itineraries' },
  { key: 'tips', label: 'Tips' },
  { key: 'whatToKnow', label: 'What to Know' },
] as const;

type TabKey = (typeof TABS)[number]['key'];

// --- Resolved mock map (DEV ONLY) ---
const DEV_GUIDES: Record<string, CityGuide> = {
  yokohama: yokohamaMock as unknown as CityGuide,
  barcelona: barcelonaMock as unknown as CityGuide,
};

// --- Screen ---

export default function CityGuide() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [activeTab, setActiveTab] = useState<TabKey>('overview');
  const [selectedItinerary, setSelectedItinerary] = useState<Itinerary | null>(null);

  const guide = useMemo<CityGuide>(() => {
    const preResolved = DEV_GUIDES[slug ?? ''];
    if (preResolved != null) return preResolved;
    const raw = MOCK_GUIDES[slug ?? ''] ?? MOCK_GUIDES.yokohama;
    return resolveGuide(raw, LOCALE);
  }, [slug]);

  const citySlug = guide.meta.slug;
  const placeholderColor = CITY_PLACEHOLDER[citySlug] ?? '#2C6E6A';
  const highlightColors = HIGHLIGHT_COLORS[citySlug] ?? [];
  const portImageColor = PORT_IMAGE_COLORS[citySlug] ?? '#8A9BB0';

  const isDark = DARK_TABS.has(activeTab as 'gourmet' | 'tips' | 'itineraries');
  const isDetailView = selectedItinerary != null;

  function handleTabChange(tab: TabKey) {
    setActiveTab(tab);
    setSelectedItinerary(null);
  }

  // --- Memoized props ---

  const portData: PortData = useMemo(() => ({
    subtitle: 'Where, how to get to the city, distance & facilities',
    locationTitle: 'Port Location & Description',
    locationBody: guide.meta.portDescription.split('\n\n').filter(Boolean),
    distance: {
      title: 'Distance to City Center',
      summary: guide.meta.distanceToCenter,
      options: guide.transport.map((opt, i) => ({
        id: String(i + 1),
        label: METHOD_LABEL[opt.method] ?? opt.method,
        time: opt.timeLabel,
        description: opt.tips,
        separatorBefore: INTERCITY_METHODS.includes(opt.method),
      })),
    },
    recommendationImageColor: portImageColor,
    recommendation: guide.meta.portRecommendation,
    facilitiesTitle: 'Port Facilities & Accessibility',
    facilitiesBody: guide.meta.portFacilities,
  }), [guide, portImageColor]);

  const attractionsData: AttractionsData = useMemo(() => ({
    subtitle: 'You know what to do, but here are some of my highlights',
    items: guide.spots
      .filter((s) => s.kind === 'attraction')
      .sort((a, b) => a.rankOrder - b.rankOrder)
      .map((s) => ({
        id: s.id,
        tag: s.tagLine ?? '',
        name: s.name,
        placeholderColor: SPOT_COLORS[s.id] ?? '#2C6E6A',
        quote: s.manuelQuote ?? '',
        whatItIs: s.whatItIs ?? '',
        whyItMatters: s.whyItMatters ?? '',
        info: (s.address || s.website)
          ? { address: s.address ?? undefined, website: s.website ?? undefined }
          : undefined,
      })),
  }), [guide.spots]);

  const gourmetSpots = useMemo(
    () => guide.spots.filter((s) => s.kind === 'food').sort((a, b) => a.rankOrder - b.rankOrder),
    [guide.spots],
  );

  const sortedTips = useMemo(
    () => guide.tips.slice().sort((a, b) => a.rankOrder - b.rankOrder),
    [guide.tips],
  );

  const sortedItineraries = useMemo(
    () => guide.itineraries.slice().sort((a, b) => a.rankOrder - b.rankOrder),
    [guide.itineraries],
  );

  // --- Tab bar (shared between normal and detail views) ---
  const tabBar = (
    <View style={[styles.tabBar, { paddingBottom: insets.bottom }]}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tabScroll}
      >
        {TABS.map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={styles.tab}
            onPress={() => handleTabChange(tab.key)}
            activeOpacity={0.7}
          >
            <Text style={[styles.tabLabel, activeTab === tab.key && styles.tabLabelActive]}>
              {tab.label}
            </Text>
            {activeTab === tab.key && <View style={styles.tabUnderline} />}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  // --- Itinerary detail view (replaces normal guide layout) ---
  if (isDetailView) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={[styles.card, styles.cardDark]}>
          <ItineraryDetail
            itinerary={selectedItinerary}
            onBack={() => setSelectedItinerary(null)}
          />
          {tabBar}
        </View>
      </SafeAreaView>
    );
  }

  // --- Normal guide view ---
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={[styles.card, isDark && styles.cardDark]}>

        <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>

          {/* Header: back button + city name */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.back} onPress={() => router.back()}>
              <Feather name="chevron-left" size={20} color={Colors.white} />
            </TouchableOpacity>
            <Text style={[styles.cityName, isDark && styles.cityNameLight]}>
              {guide.meta.name.toUpperCase()}
            </Text>
          </View>

          {/* Hero image */}
          <View style={styles.heroWrap}>
            <CityImage placeholderColor={placeholderColor} />
          </View>

          {/* Content */}
          <View style={styles.content}>

            {/* Offline badge */}
            <View style={styles.badgeRow}>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>Offline ✓</Text>
              </View>
            </View>

            {/* ---- OVERVIEW ---- */}
            {activeTab === 'overview' && (
              <>
                <Text style={styles.overviewHeading}>Overview</Text>
                <Text style={styles.subHeading}>City Introduction</Text>
                {guide.meta.intro.split('\n\n').filter(Boolean).map((para, i) => (
                  <Text key={i} style={[styles.body, i > 0 && styles.bodyGap]}>{para}</Text>
                ))}
                <View style={styles.contextWrap}>
                  <ContextCard
                    title="Key Historical Context"
                    body={guide.meta.historicalContext.split('\n\n').filter(Boolean)}
                    placeholderColor={placeholderColor}
                  />
                </View>
                <Text style={styles.subHeading}>
                  Top {guide.highlights.length} Highlights
                </Text>
                <View style={styles.highlights}>
                  {guide.highlights.map((h, i) => (
                    <View key={h.id} style={styles.highlightRow}>
                      <View style={styles.highlightTextWrap}>
                        <Text style={styles.highlightName}>{h.label}</Text>
                        <Text style={styles.highlightDesc}>{h.description}</Text>
                      </View>
                      <View style={styles.highlightImgWrap}>
                        <CityImage placeholderColor={highlightColors[i] ?? placeholderColor} />
                      </View>
                    </View>
                  ))}
                </View>
                <View style={styles.disclaimer}>
                  <Text style={styles.disclaimerLabel}>Disclaimer</Text>
                  <Text style={styles.disclaimerBody}>
                    Members should be aware that information is in constant evolution.
                    It is quite possible that the menu has changed in a restaurant, a shop may
                    have a new owner, a coffee place closed during winter.
                    Every effort will be made to incorporate such changes in a timely manner.
                  </Text>
                </View>
                <TouchableOpacity style={styles.helpBtn} activeOpacity={0.8}>
                  <Text style={styles.helpBtnText}>
                    Help us telling us if there is an unexpected change
                  </Text>
                </TouchableOpacity>
              </>
            )}

            {/* ---- PORT ---- */}
            {activeTab === 'port' && <PortContent data={portData} />}

            {/* ---- ATTRACTIONS ---- */}
            {activeTab === 'attractions' && <AttractionsContent data={attractionsData} />}

            {/* ---- GOURMET ---- */}
            {activeTab === 'gourmet' && <GourmetContent spots={gourmetSpots} />}

            {/* ---- ITINERARIES ---- */}
            {activeTab === 'itineraries' && (
              <ItinerariesContent
                itineraries={sortedItineraries}
                onOpen={(it) => {
                  setSelectedItinerary(it);
                }}
              />
            )}

            {/* ---- TIPS ---- */}
            {activeTab === 'tips' && (
              <TipsContent tips={sortedTips} cityName={guide.meta.name} />
            )}

            {/* ---- WHAT TO KNOW ---- */}
            {activeTab === 'whatToKnow' && (
              <WhatToKnowContent items={guide.whatToKnow} />
            )}

            <View style={styles.scrollBottom} />
          </View>

        </ScrollView>

        {tabBar}

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.navy,
  },
  card: {
    flex: 1,
    backgroundColor: Colors.bgCard,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
  },
  cardDark: {
    backgroundColor: Colors.navy,
  },
  scroll: {
    flex: 1,
  },
  // --- Header ---
  header: {
    paddingHorizontal: Spacing.screenHorizontal,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  back: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.navy,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  cityName: {
    ...Typography.guideDisplayTitle,
    color: Colors.textPrimary,
  },
  cityNameLight: {
    color: Colors.white,
  },
  // --- Hero ---
  heroWrap: {
    height: 280,
  },
  // --- Content ---
  content: {
    paddingHorizontal: Spacing.screenHorizontal,
  },
  badgeRow: {
    alignItems: 'flex-end',
    marginTop: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  badge: {
    backgroundColor: Colors.blueAccent,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.lg,
    paddingVertical: 6,
  },
  badgeText: {
    ...Typography.guideSmall,
    color: Colors.white,
    fontWeight: '500',
  },
  overviewHeading: {
    ...Typography.guideOverviewHeading,
    color: Colors.textPrimary,
    marginBottom: Spacing.lg,
  },
  subHeading: {
    ...Typography.guideSubHeading,
    color: Colors.textPrimary,
    marginTop: Spacing.xl,
    marginBottom: Spacing.sm,
  },
  body: {
    ...Typography.guideBody,
    color: Colors.textPrimary,
  },
  bodyGap: {
    marginTop: Spacing.md,
  },
  contextWrap: {
    marginTop: Spacing.xl,
  },
  highlights: {
    gap: Spacing.xl,
    marginTop: Spacing.sm,
  },
  highlightRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.md,
  },
  highlightTextWrap: {
    flex: 1,
    gap: Spacing.xs,
  },
  highlightName: {
    ...Typography.guideBody,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  highlightDesc: {
    ...Typography.guideBody,
    color: Colors.textPrimary,
  },
  highlightImgWrap: {
    width: 140,
    height: 140,
    borderRadius: Radius.md,
    overflow: 'hidden',
  },
  disclaimer: {
    marginTop: Spacing.xxl,
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
  },
  disclaimerLabel: {
    ...Typography.guideSmall,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
  },
  disclaimerBody: {
    ...Typography.guideSmall,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  helpBtn: {
    marginTop: Spacing.lg,
    backgroundColor: Colors.textSecondary,
    borderRadius: Radius.md,
    paddingVertical: 14,
    alignItems: 'center',
  },
  helpBtnText: {
    ...Typography.guideBody,
    color: Colors.white,
    fontWeight: '500',
  },
  scrollBottom: {
    height: Spacing.xl,
  },
  // --- Tab bar ---
  tabBar: {
    backgroundColor: Colors.bgCard,
    shadowColor: Colors.navy,
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 8,
  },
  tabScroll: {
    paddingHorizontal: Spacing.lg,
  },
  tab: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.sm,
    marginRight: Spacing.md,
    alignItems: 'center',
    position: 'relative',
  },
  tabLabel: {
    ...Typography.guideBody,
    color: Colors.textSecondary,
  },
  tabLabelActive: {
    fontWeight: '600',
    color: Colors.navy,
  },
  tabUnderline: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: Colors.navy,
    borderRadius: 1,
  },
});
