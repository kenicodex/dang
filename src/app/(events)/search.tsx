import { useMemo, useState } from 'react'
import { Image } from 'expo-image'
import { router } from 'expo-router'
import { Icon } from '@/components/ui/Icon'
import type { SymbolViewProps } from 'expo-symbols'
import { Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { Text } from '@/components/ui/Text'
import { EmptyState } from '@/components/ui/EmptyState'
import { EVENTS, FILTER_CATEGORIES, POPULAR_SEARCHES, MOCK_NOW, seatsUrgent } from '@/components/events'
import { colors } from '@/theme/colors'
import { shadows } from '@/theme/shadows'
import type { Event } from '@/types/events'

type QuickFilter = 'All' | 'Today' | 'This Week' | 'This Month' | 'Virtual'

const QUICK_FILTERS: QuickFilter[] = ['All', 'Today', 'This Week', 'This Month', 'Virtual']

const FILTER_SECTIONS = [
  { key: 'location', label: 'Location', options: ['Lagos', 'Abuja', 'Virtual', 'Any'] },
  { key: 'price', label: 'Price', options: ['Free', 'Under ₦10,000', '₦10,000+'] },
  { key: 'datePosted', label: 'Date Posted', options: ['Today', 'This Week', 'This Month'] },
  { key: 'ageGroup', label: 'Age Group', options: ['18-24', '25-34', '35-44', '45+'] },
  { key: 'duration', label: 'Duration', options: ['<1 hr', '1-2 hrs', '2+ hrs'] },
]

function daysUntil(event: Event) {
  return parseInt(event.day, 10) - MOCK_NOW.getDate()
}

export default function EventSearchScreen() {
  const [query, setQuery] = useState('')
  const [quickFilter, setQuickFilter] = useState<QuickFilter>('All')
  const [filtersVisible, setFiltersVisible] = useState(false)
  const [category, setCategory] = useState<string | null>(null)
  const [expandedSection, setExpandedSection] = useState<string | null>('category')
  const [sectionValues, setSectionValues] = useState<Record<string, string>>({})

  const results = useMemo(() => {
    return EVENTS.filter(event => {
      const q = query.trim().toLowerCase()
      const matchesQuery =
        q.length === 0 ||
        event.title.toLowerCase().includes(q) ||
        event.category?.toLowerCase().includes(q) ||
        event.tags?.some(tag => tag.toLowerCase().includes(q))

      const matchesQuick =
        quickFilter === 'All' ||
        (quickFilter === 'Virtual' && event.isVirtual) ||
        (quickFilter === 'Today' && daysUntil(event) === 0) ||
        (quickFilter === 'This Week' && daysUntil(event) >= 0 && daysUntil(event) <= 7) ||
        (quickFilter === 'This Month' && true)

      const matchesCategory = !category || event.category?.toLowerCase() === category.toLowerCase()

      return matchesQuery && matchesQuick && matchesCategory
    })
  }, [query, quickFilter, category])

  const toggleSection = (key: string) => setExpandedSection(prev => (prev === key ? null : key))

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.header}>
        <Pressable style={styles.circleButton} onPress={() => router.back()}>
          <Icon name="chevron.left" size={18} tintColor={colors.light.text} />
        </Pressable>

        <View style={styles.searchBar}>
          <Icon name="magnifyingglass" size={16} tintColor={colors.light.textSoft} />
          <TextInput
            style={styles.searchInput}
            placeholder="search events, hangouts.."
            placeholderTextColor={colors.light.textSoft}
            value={query}
            onChangeText={setQuery}
            autoFocus
          />
        </View>

        <Pressable
          style={[styles.circleButton, filtersVisible && styles.circleButtonActive]}
          onPress={() => setFiltersVisible(v => !v)}
        >
          <Icon
            name="line.3.horizontal.decrease"
            size={16}
            tintColor={filtersVisible ? colors.light.neutral.white : colors.light.text}
          />
        </Pressable>
      </View>

      {filtersVisible ? (
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <Text variant="label" style={styles.filterByLabel}>
            Filter by
          </Text>

          {FILTER_SECTIONS.length >= 0 && (
            <View style={styles.accordionCard}>
              <Pressable style={styles.accordionHeader} onPress={() => toggleSection('category')}>
                <Text style={styles.accordionTitle}>Category</Text>
                <View style={styles.accordionHeaderRight}>
                  {category && (
                    <View style={styles.selectedPill}>
                      <Text style={styles.selectedPillText}>{category}</Text>
                    </View>
                  )}
                  <Icon
                    name={expandedSection === 'category' ? 'chevron.up' : 'chevron.down'}
                    size={13}
                    tintColor={colors.light.textSoft}
                  />
                </View>
              </Pressable>
              {expandedSection === 'category' && (
                <View style={styles.chipWrap}>
                  {FILTER_CATEGORIES.map(c => (
                    <Pressable
                      key={c}
                      style={[styles.filterChip, category === c && styles.filterChipActive]}
                      onPress={() => setCategory(prev => (prev === c ? null : c))}
                    >
                      <Text style={[styles.filterChipText, category === c && styles.filterChipTextActive]}>{c}</Text>
                    </Pressable>
                  ))}
                </View>
              )}
            </View>
          )}

          {FILTER_SECTIONS.map(section => (
            <View key={section.key} style={styles.accordionCard}>
              <Pressable style={styles.accordionHeader} onPress={() => toggleSection(section.key)}>
                <Text style={styles.accordionTitle}>{section.label}</Text>
                <View style={styles.accordionHeaderRight}>
                  {sectionValues[section.key] && (
                    <View style={styles.selectedPill}>
                      <Text style={styles.selectedPillText}>{sectionValues[section.key]}</Text>
                    </View>
                  )}
                  <Icon
                    name={expandedSection === section.key ? 'chevron.up' : 'chevron.down'}
                    size={13}
                    tintColor={colors.light.textSoft}
                  />
                </View>
              </Pressable>
              {expandedSection === section.key && (
                <View style={styles.chipWrap}>
                  {section.options.map(option => {
                    const active = sectionValues[section.key] === option
                    return (
                      <Pressable
                        key={option}
                        style={[styles.filterChip, active && styles.filterChipActive]}
                        onPress={() =>
                          setSectionValues(prev => ({
                            ...prev,
                            [section.key]: prev[section.key] === option ? '' : option,
                          }))
                        }
                      >
                        <Text style={[styles.filterChipText, active && styles.filterChipTextActive]}>{option}</Text>
                      </Pressable>
                    )
                  })}
                </View>
              )}
            </View>
          ))}

          <Text variant="label" style={styles.filterByLabel}>
            Popular searches
          </Text>
          <View style={styles.chipWrap}>
            {POPULAR_SEARCHES.map(term => (
              <Pressable
                key={term}
                style={styles.popularChip}
                onPress={() => {
                  setQuery(term)
                  setFiltersVisible(false)
                }}
              >
                <Text style={styles.popularChipText}>{term}</Text>
              </Pressable>
            ))}
          </View>
        </ScrollView>
      ) : (
        <>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.quickFilterScroll}>
            {QUICK_FILTERS.map(f => (
              <Pressable
                key={f}
                style={[styles.quickChip, quickFilter === f && styles.quickChipActive]}
                onPress={() => setQuickFilter(f)}
              >
                <Text style={[styles.quickChipText, quickFilter === f && styles.quickChipTextActive]}>{f}</Text>
              </Pressable>
            ))}
          </ScrollView>

          <View style={styles.resultsHeaderRow}>
            <Text style={styles.resultsLabel}>Search Results</Text>
            <Text style={styles.resultsCount}>{results.length} Found</Text>
          </View>

          <ScrollView contentContainerStyle={styles.resultsContent} showsVerticalScrollIndicator={false}>
            {results.length > 0 ? (
              results.map(event => <SearchResultCard key={event.id} event={event} />)
            ) : (
              <EmptyState
                icon={<SearchEmptyIcon />}
                title="No Result Found"
                description="Try adjusting your search to find what you are looking for"
              />
            )}
          </ScrollView>
        </>
      )}
    </SafeAreaView>
  )
}

function SearchResultCard({ event }: { event: Event }) {
  const urgent = seatsUrgent(event)
  return (
    <Pressable style={styles.resultCard} onPress={() => router.push(`/(events)/${event.id}`)}>
      <View style={styles.resultImageWrap}>
        <Image source={{ uri: event.coverUrl }} style={StyleSheet.absoluteFillObject} contentFit="cover" />
        <View style={styles.resultBookmark}>
          <Icon name="bookmark" size={12} tintColor={colors.light.neutral.white} />
        </View>
        {event.seatsRemaining != null && (
          <View style={styles.resultSeatsRow}>
            <View style={[styles.resultSeatsDot, { backgroundColor: urgent ? '#F87171' : '#34D399' }]} />
            <Text style={styles.resultSeatsText}>{event.seatsRemaining} seats left</Text>
          </View>
        )}
      </View>
      <View style={styles.resultBody}>
        <Text style={styles.resultTitle} numberOfLines={2}>
          {event.title}
        </Text>
        <View style={styles.resultMetaRow}>
          <Icon name="calendar" size={12} tintColor={colors.light.primary[500]} />
          <Text style={styles.resultMetaText}>
            {event.date} · {event.time}
          </Text>
        </View>
        <View style={styles.resultMetaRow}>
          <Icon name="mappin" size={12} tintColor={colors.light.primary[500]} />
          <Text style={styles.resultMetaText}>{event.isVirtual ? 'Virtual' : event.venue}</Text>
        </View>
      </View>
    </Pressable>
  )
}

function SearchEmptyIcon() {
  const decorations: { name: SymbolViewProps['name']; style: object }[] = [
    { name: 'multiply', style: { top: -6, left: -46 } },
    { name: 'multiply', style: { bottom: -2, left: -30 } },
    { name: 'circle', style: { top: -18, right: -20 } },
  ]
  return (
    <View style={styles.emptyIconWrap}>
      {decorations.map((d, i) => (
        <Icon key={i} name={d.name} size={10} tintColor={colors.light.primary[200]} style={[styles.emptyIconDecor, d.style]} />
      ))}
      <View style={styles.emptyIconCircle}>
        <Icon name="magnifyingglass" size={30} tintColor={colors.light.primary[500]} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.light.bgAlt,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
  },
  circleButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.light.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleButtonActive: {
    backgroundColor: colors.light.primary[500],
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.light.surface,
    borderRadius: 999,
    paddingHorizontal: 16,
    height: 40,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: colors.light.text,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  filterByLabel: {
    marginBottom: 12,
    marginTop: 8,
  },
  accordionCard: {
    backgroundColor: colors.light.surface,
    borderRadius: 16,
    marginBottom: 12,
    overflow: 'hidden',
  },
  accordionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  accordionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.light.text,
  },
  accordionHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  selectedPill: {
    backgroundColor: colors.light.primary[100],
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 999,
  },
  selectedPillText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.light.primary[600],
  },
  chipWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: colors.light.border,
    paddingTop: 14,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 999,
    backgroundColor: colors.light.bgAlt,
  },
  filterChipActive: {
    backgroundColor: colors.light.primary[500],
  },
  filterChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.light.textAlt,
  },
  filterChipTextActive: {
    color: colors.light.neutral.white,
  },
  popularChip: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 999,
    backgroundColor: colors.light.surface,
  },
  popularChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.light.textAlt,
  },
  quickFilterScroll: {
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  quickChip: {
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 999,
    backgroundColor: colors.light.surface,
    marginRight: 8,
  },
  quickChipActive: {
    backgroundColor: colors.light.primary[500],
  },
  quickChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.light.textAlt,
  },
  quickChipTextActive: {
    color: colors.light.neutral.white,
  },
  resultsHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  resultsLabel: {
    fontSize: 13,
    color: colors.light.textMuted,
  },
  resultsCount: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.light.primary[500],
  },
  resultsContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    gap: 12,
  },
  resultCard: {
    flexDirection: 'row',
    backgroundColor: colors.light.surface,
    borderRadius: 16,
    overflow: 'hidden',
    ...shadows.sm,
  },
  resultImageWrap: {
    width: 110,
  },
  resultBookmark: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  resultSeatsRow: {
    position: 'absolute',
    left: 8,
    bottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  resultSeatsDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  resultSeatsText: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.light.neutral.white,
  },
  resultBody: {
    flex: 1,
    padding: 14,
    justifyContent: 'center',
    gap: 6,
  },
  resultTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.light.text,
  },
  resultMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  resultMetaText: {
    fontSize: 12,
    color: colors.light.textMuted,
  },
  emptyIconWrap: {
    width: 100,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  emptyIconCircle: {
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 2,
    borderColor: colors.light.primary[300],
    backgroundColor: colors.light.primary[50],
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyIconDecor: {
    position: 'absolute',
  },
})
