import { useMemo, useState } from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { Icon } from '@/components/ui/Icon'
import { Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native'

import { Text } from '@/components/ui/Text'
import { Sheet } from '@/components/ui/Sheet'
import { FlowScreen } from '@/components/flow/FlowScreen'
import { StepHeader } from '@/components/flow/StepHeader'
import { NextFab } from '@/components/flow/NextFab'
import { FooterNote } from '@/components/flow/FooterNote'
import { NIGERIA_STATES } from '@/constants/nigeriaStates'
import { colors } from '@/theme/colors'

const COUNTRY = 'Nigeria'

export default function LocationStepScreen() {
  const router = useRouter()
  const params = useLocalSearchParams<{ email?: string; password?: string; phone?: string; name?: string }>()
  const [state, setState] = useState('')
  const [query, setQuery] = useState('')
  const [sheetVisible, setSheetVisible] = useState(false)

  const results = useMemo(() => {
    const trimmed = query.trim().toLowerCase()
    if (!trimmed) return NIGERIA_STATES
    return NIGERIA_STATES.filter(s => s.toLowerCase().includes(trimmed))
  }, [query])

  const canSubmit = !!state

  const goNext = () =>
    router.push({ pathname: '/(onboarding)/field', params: { ...params, city: state, country: COUNTRY } })

  return (
    <FlowScreen>
      <StepHeader onBack={() => router.back()} progress={3 / 5} />

      <View style={styles.container}>
        <Text style={styles.emoji}>📍</Text>
        <Text variant="h2">Where are you based?</Text>
        <Text style={styles.subtitle}>
          We&rsquo;ll connect you with sisters in your state. Your exact location is never shared.
        </Text>

        <Pressable style={styles.selector} onPress={() => setSheetVisible(true)}>
          <Icon name="magnifyingglass" size={16} tintColor={colors.light.textSoft} />
          <Text style={[styles.selectorText, !state && styles.selectorPlaceholder]}>
            {state || 'select your state'}
          </Text>
          <Icon name="chevron.down" size={12} tintColor={colors.light.textMuted} />
        </Pressable>
      </View>

      <View style={styles.footer}>
        <FooterNote icon="lock.shield.fill">Only your state is shown, never your address</FooterNote>
        <View style={styles.fabRow}>
          <NextFab onPress={goNext} disabled={!canSubmit} />
        </View>
      </View>

      <Sheet visible={sheetVisible} onClose={() => setSheetVisible(false)} title="Choose your state">
        <View style={styles.searchField}>
          <Icon name="magnifyingglass" size={16} tintColor={colors.light.textSoft} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search states"
            placeholderTextColor={colors.light.textSoft}
            style={styles.searchInput}
            autoFocus
          />
        </View>
        <ScrollView style={styles.stateList} keyboardShouldPersistTaps="handled">
          {results.map(s => (
            <Pressable
              key={s}
              style={styles.stateRow}
              onPress={() => {
                setState(s)
                setQuery('')
                setSheetVisible(false)
              }}
            >
              <Text style={styles.stateRowText}>{s}</Text>
              {state === s && <Icon name="checkmark" size={16} weight="bold" tintColor={colors.light.primary[500]} />}
            </Pressable>
          ))}
          {results.length === 0 && <Text style={styles.empty}>No states found.</Text>}
        </ScrollView>
      </Sheet>
    </FlowScreen>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  emoji: {
    fontSize: 36,
    lineHeight: 44,
    marginBottom: 12,
  },
  subtitle: {
    color: colors.light.textMuted,
    marginTop: 8,
    marginBottom: 28,
  },
  selector: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderRadius: 999,
    backgroundColor: colors.light.surface,
    borderWidth: 1.5,
    borderColor: colors.light.border,
  },
  selectorText: {
    flex: 1,
    fontSize: 15,
    color: colors.light.text,
  },
  selectorPlaceholder: {
    color: colors.light.textSoft,
  },
  searchField: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 999,
    backgroundColor: colors.light.surfaceAlt,
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: colors.light.text,
  },
  stateList: {
    maxHeight: 360,
  },
  stateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.light.border,
  },
  stateRowText: {
    fontSize: 15,
    color: colors.light.text,
  },
  empty: {
    textAlign: 'center',
    color: colors.light.textMuted,
    paddingVertical: 24,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
  fabRow: {
    alignItems: 'flex-end',
    marginTop: 16,
  },
})
