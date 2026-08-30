import { useState } from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { Icon } from '@/components/ui/Icon'
import { Pressable, ScrollView, StyleSheet, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { Text } from '@/components/ui/Text'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Sheet } from '@/components/ui/Sheet'
import { FEATURED_DROP, SKIN_TYPES, TESTER_INTERESTS } from '@/components/commerce'
import { useLifestyleStore } from '@/store'
import { colors } from '@/theme/colors'

function toggle(list: string[], value: string) {
  return list.includes(value) ? list.filter(v => v !== value) : [...list, value]
}

export default function BecomeATesterScreen() {
  const router = useRouter()
  const { dropId } = useLocalSearchParams<{ dropId?: string }>()
  const applyForTester = useLifestyleStore(s => s.applyForTester)

  const resolvedDropId = dropId ?? FEATURED_DROP.id
  const [interests, setInterests] = useState<string[]>([])
  const [skinType, setSkinType] = useState('')
  const [address, setAddress] = useState('')
  const [skinTypeSheetVisible, setSkinTypeSheetVisible] = useState(false)

  const canSubmit = interests.length > 0 && !!skinType && address.trim().length > 0

  const submit = () => {
    if (!canSubmit) return
    const outcome = applyForTester({
      dropId: resolvedDropId,
      interests,
      skinType,
      deliveryAddress: address.trim(),
    })
    router.replace(`/(lifestyle)/tester/${outcome === 'selected' ? 'selected' : outcome}?dropId=${resolvedDropId}` as any)
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <Pressable style={styles.iconButton} onPress={() => router.back()}>
          <Icon name="chevron.left" size={18} tintColor={colors.light.text} />
        </Pressable>
        <Text variant="h3" style={styles.headerTitle}>
          Become a Tester
        </Text>
        <View style={styles.iconButton} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.introCard}>
          <Text style={styles.introTitle}>Try it first.{'\n'}Tell us the truth. 🧪</Text>
          <Text style={styles.introText}>
            Selected testers get Dang Lifestyle products free, then share honest feedback right here.
          </Text>
        </View>

        <Text style={styles.label}>What are you into?</Text>
        <View style={styles.chipRow}>
          {TESTER_INTERESTS.map(interest => {
            const active = interests.includes(interest)
            return (
              <Pressable
                key={interest}
                style={[styles.chip, active && styles.chipActive]}
                onPress={() => setInterests(prev => toggle(prev, interest))}
              >
                <Text style={[styles.chipText, active && styles.chipTextActive]}>{interest}</Text>
              </Pressable>
            )
          })}
        </View>

        <Text style={styles.label}>Skin type</Text>
        <Pressable style={styles.selectField} onPress={() => setSkinTypeSheetVisible(true)}>
          <Text style={skinType ? styles.selectValue : styles.selectPlaceholder}>
            {skinType || 'select your skin type'}
          </Text>
          <Icon name="chevron.down" size={14} tintColor={colors.light.textSoft} />
        </Pressable>

        <Text style={styles.label}>Delivery address</Text>
        <Input
          value={address}
          onChangeText={setAddress}
          placeholder="where should we send products?"
          multiline
        />
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title="Submit application"
          disabled={!canSubmit}
          onPress={submit}
          style={styles.submitButton}
        />
      </View>

      <Sheet visible={skinTypeSheetVisible} onClose={() => setSkinTypeSheetVisible(false)} title="Skin type">
        {SKIN_TYPES.map(type => {
          const selected = skinType === type
          return (
            <Pressable
              key={type}
              style={styles.skinTypeRow}
              onPress={() => {
                setSkinType(type)
                setSkinTypeSheetVisible(false)
              }}
            >
              <Text style={styles.skinTypeRowText}>{type}</Text>
              <View style={[styles.radio, selected && styles.radioSelected]}>
                {selected && <View style={styles.radioDot} />}
              </View>
            </Pressable>
          )
        })}
      </Sheet>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.light.bg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 12,
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.light.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    gap: 20,
  },
  introCard: {
    backgroundColor: colors.light.primary[50],
    borderWidth: 1,
    borderColor: colors.light.primary[100],
    borderRadius: 20,
    padding: 20,
  },
  introTitle: {
    fontSize: 20,
    fontWeight: '800',
    lineHeight: 26,
    color: colors.light.primary[700],
    marginBottom: 10,
  },
  introText: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.light.primary[600],
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.light.text,
    marginBottom: -8,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: colors.light.border,
    backgroundColor: colors.light.surface,
  },
  chipActive: {
    borderColor: colors.light.primary[500],
    backgroundColor: colors.light.primary[50],
  },
  chipText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.light.textAlt,
  },
  chipTextActive: {
    color: colors.light.primary[600],
  },
  selectField: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1.5,
    borderColor: colors.light.border,
    borderRadius: 16,
    backgroundColor: colors.light.surface,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  selectValue: {
    fontSize: 16,
    color: colors.light.text,
  },
  selectPlaceholder: {
    fontSize: 16,
    color: colors.light.textSoft,
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 8,
  },
  submitButton: {
    borderRadius: 999,
    backgroundColor: colors.light.primary[500],
  },
  skinTypeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
  },
  skinTypeRowText: {
    fontSize: 16,
    color: colors.light.text,
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: colors.light.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioSelected: {
    borderColor: colors.light.primary[500],
  },
  radioDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.light.primary[500],
  },
})
