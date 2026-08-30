import { useState } from 'react'
import { useRouter } from 'expo-router'
import { Icon } from '@/components/ui/Icon'
import { Pressable, StyleSheet, View } from 'react-native'

import { Input } from '@/components/ui/Input'
import { Text } from '@/components/ui/Text'
import { Sheet } from '@/components/ui/Sheet'
import { FlowScreen } from '@/components/flow/FlowScreen'
import { StepHeader } from '@/components/flow/StepHeader'
import { NextFab } from '@/components/flow/NextFab'
import { FooterNote } from '@/components/flow/FooterNote'
import { colors } from '@/theme/colors'

const COUNTRIES = [
  { flag: '🇳🇬', name: 'Nigeria', code: '+234' },
  { flag: '🇬🇭', name: 'Ghana', code: '+233' },
  { flag: '🇰🇪', name: 'Kenya', code: '+254' },
  { flag: '🇺🇸', name: 'United States', code: '+1' },
  { flag: '🇬🇧', name: 'United Kingdom', code: '+44' },
]

export default function PhoneSignUpScreen() {
  const router = useRouter()
  const [country, setCountry] = useState(COUNTRIES[0])
  const [number, setNumber] = useState('')
  const [pickerVisible, setPickerVisible] = useState(false)

  return (
    <FlowScreen>
      <StepHeader onBack={() => router.back()} />

      <View style={styles.container}>
        <Text style={styles.emoji}>📱</Text>
        <Text variant="h2">What&rsquo;s your number?</Text>
        <Text style={styles.subtitle}>We&rsquo;ll text you a code to verify. We never share this with anyone.</Text>

        <Text style={styles.label}>
          Phone number<Text style={styles.required}> *</Text>
        </Text>
        <View style={styles.row}>
          <Pressable style={styles.countryPill} onPress={() => setPickerVisible(true)}>
            <Text style={styles.flag}>{country.flag}</Text>
            <Text style={styles.countryCode}>{country.code}</Text>
            <Icon name="chevron.down" size={12} tintColor={colors.light.textMuted} />
          </Pressable>
          <Input
            containerStyle={styles.numberField}
            value={number}
            onChangeText={setNumber}
            placeholder="812 345 6789"
            keyboardType="phone-pad"
          />
        </View>
      </View>

      <View style={styles.footer}>
        <FooterNote icon="lock.shield.fill">Your number stays private, always</FooterNote>
        <View style={styles.fabRow}>
          <NextFab
            onPress={() =>
              router.push({
                pathname: '/(auth)/verify',
                params: { method: 'phone', value: `${country.code} ${number}` },
              })
            }
          />
        </View>
      </View>

      <Sheet visible={pickerVisible} onClose={() => setPickerVisible(false)} title="Choose your country">
        <View style={styles.countryList}>
          {COUNTRIES.map(c => (
            <Pressable
              key={c.code + c.name}
              style={styles.countryRow}
              onPress={() => {
                setCountry(c)
                setPickerVisible(false)
              }}
            >
              <Text style={styles.flag}>{c.flag}</Text>
              <Text style={styles.countryName}>{c.name}</Text>
              <Text style={styles.countryCode}>{c.code}</Text>
            </Pressable>
          ))}
        </View>
      </Sheet>
    </FlowScreen>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 12,
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
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.light.textAlt,
    marginBottom: 8,
  },
  required: {
    color: colors.light.semantic.error,
  },
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  countryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    borderWidth: 1.5,
    borderColor: colors.light.border,
    borderRadius: 16,
    backgroundColor: colors.light.surface,
  },
  flag: {
    fontSize: 18,
  },
  countryCode: {
    fontSize: 15,
    color: colors.light.text,
    fontWeight: '600',
  },
  numberField: {
    flex: 1,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
  fabRow: {
    alignItems: 'flex-end',
    marginTop: 16,
  },
  countryList: {
    gap: 4,
  },
  countryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
  },
  countryName: {
    flex: 1,
    fontSize: 15,
    color: colors.light.text,
  },
})
