import { useState } from 'react'
import { useRouter } from 'expo-router'
import { StyleSheet, TextInput, View } from 'react-native'

import { Text } from '@/components/ui/Text'
import { FlowScreen } from '@/components/flow/FlowScreen'
import { StepHeader } from '@/components/flow/StepHeader'
import { NextFab } from '@/components/flow/NextFab'
import { FooterNote } from '@/components/flow/FooterNote'
import { colors } from '@/theme/colors'

export default function NameStepScreen() {
  const router = useRouter()
  const [name, setName] = useState('')

  return (
    <FlowScreen>
      <StepHeader onBack={() => router.back()} progress={1 / 5} />

      <View style={styles.container}>
        <Text style={styles.emoji}>👋</Text>
        <Text variant="h2">What should we call you?</Text>
        <Text style={styles.subtitle}>This is how your sisters in the community will know you.</Text>

        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="Your first name"
          placeholderTextColor={colors.light.textSoft}
          autoFocus
          style={styles.underlineInput}
        />
      </View>

      <View style={styles.footer}>
        <FooterNote icon="lock.fill">Your real name keeps the community trusted</FooterNote>
        <View style={styles.fabRow}>
          <NextFab onPress={() => router.push('/(onboarding)/photo')} />
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
    marginBottom: 36,
  },
  underlineInput: {
    fontSize: 24,
    fontWeight: '600',
    color: colors.light.text,
    borderBottomWidth: 1.5,
    borderBottomColor: colors.light.primary[500],
    paddingBottom: 10,
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
