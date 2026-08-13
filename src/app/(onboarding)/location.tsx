import { useState } from 'react'
import { useRouter } from 'expo-router'
import { SymbolView } from 'expo-symbols'
import { StyleSheet, TextInput, View } from 'react-native'

import { Text } from '@/components/ui/Text'
import { FlowScreen } from '@/components/flow/FlowScreen'
import { StepHeader } from '@/components/flow/StepHeader'
import { NextFab } from '@/components/flow/NextFab'
import { FooterNote } from '@/components/flow/FooterNote'
import { colors } from '@/theme/colors'

export default function LocationStepScreen() {
  const router = useRouter()
  const [city, setCity] = useState('')

  return (
    <FlowScreen>
      <StepHeader onBack={() => router.back()} progress={3 / 5} />

      <View style={styles.container}>
        <Text style={styles.emoji}>📍</Text>
        <Text variant="h2">Where are you based?</Text>
        <Text style={styles.subtitle}>
          We&rsquo;ll connect you with sisters in your city. Your exact location is never shared.
        </Text>

        <View style={styles.searchField}>
          <SymbolView name="magnifyingglass" size={16} tintColor={colors.light.textSoft} />
          <TextInput
            value={city}
            onChangeText={setCity}
            placeholder="search your city"
            placeholderTextColor={colors.light.textSoft}
            style={styles.searchInput}
          />
        </View>
      </View>

      <View style={styles.footer}>
        <FooterNote icon="lock.shield.fill">Only your city is shown, never your address</FooterNote>
        <View style={styles.fabRow}>
          <NextFab onPress={() => router.push('/(onboarding)/field')} />
        </View>
      </View>
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
  searchField: {
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
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: colors.light.text,
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
