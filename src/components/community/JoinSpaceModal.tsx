import { Modal, Pressable, ScrollView, StyleSheet, View } from 'react-native'
import { SymbolView } from 'expo-symbols'
import { GlassView } from 'expo-glass-effect'
import { SafeAreaView } from 'react-native-safe-area-context'

import { Text } from '@/components/ui/Text'
import { Button } from '@/components/ui/Button'
import { colors } from '@/theme/colors'
import type { Channel } from '@/types/community'
import { CATEGORY_STYLE } from './spaces.data'

const PERKS = [
  'Participate in discussions',
  'Create posts and reply to members',
  'Receive updates from this Space',
]

interface JoinSpaceModalProps {
  visible: boolean
  space: Channel | null
  onClose: () => void
  onAgree: () => void
}

export function JoinSpaceModal({ visible, space, onClose, onAgree }: JoinSpaceModalProps) {
  if (!space) return null
  const dotColor = CATEGORY_STYLE[space.category ?? '']?.gradient[1] ?? colors.light.primary[500]

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="fullScreen" onRequestClose={onClose}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        <GlassView style={styles.closeButtonGlass} glassEffectStyle="regular">
          <Pressable style={styles.closeButton} onPress={onClose} hitSlop={12}>
            <SymbolView name="xmark" size={16} tintColor={colors.light.text} />
          </Pressable>
        </GlassView>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <Text style={styles.eyebrow}>Review and agree to the rules for</Text>
          <Text variant="h2" style={styles.spaceName}>
            {space.name}
          </Text>

          <View style={styles.categoryRow}>
            <View style={[styles.dot, { backgroundColor: dotColor }]} />
            <Text style={styles.categoryText}>{space.category}</Text>
          </View>

          <Text style={styles.description}>{space.description}</Text>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>By joining you&rsquo;ll be able to</Text>
            {PERKS.map(perk => (
              <View key={perk} style={styles.row}>
                <View style={styles.checkBubble}>
                  <SymbolView name="checkmark" size={11} tintColor={colors.light.primary[600]} weight="bold" />
                </View>
                <Text style={styles.rowText}>{perk}</Text>
              </View>
            ))}
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Space Guidelines</Text>
            {(space.guidelines ?? []).map((rule, i) => (
              <View key={rule} style={styles.row}>
                <View style={styles.numberBubble}>
                  <Text style={styles.numberText}>{i + 1}</Text>
                </View>
                <Text style={styles.rowText}>{rule}</Text>
              </View>
            ))}
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <Button title="Agree & Join" onPress={onAgree} style={styles.agreeButton} />
        </View>
      </SafeAreaView>
    </Modal>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.light.bgSoft,
  },
  closeButtonGlass: {
    width: 36,
    height: 36,
    borderRadius: 18,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.5)',
    marginLeft: 20,
    marginTop: 8,
  },
  closeButton: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 24,
    gap: 16,
  },
  eyebrow: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.light.textSoft,
    lineHeight: 26,
  },
  spaceName: {
    marginTop: -4,
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  categoryText: {
    fontSize: 14,
    color: colors.light.textMuted,
    fontWeight: '600',
  },
  description: {
    fontSize: 15,
    color: colors.light.textAlt,
    lineHeight: 22,
  },
  card: {
    backgroundColor: colors.light.surface,
    borderRadius: 18,
    padding: 16,
    gap: 14,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.light.text,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  checkBubble: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.light.primary[100],
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  numberBubble: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.light.primary[100],
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  numberText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.light.primary[600],
  },
  rowText: {
    flex: 1,
    fontSize: 14,
    color: colors.light.textAlt,
    lineHeight: 20,
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
  },
  agreeButton: {
    borderRadius: 999,
    backgroundColor: colors.light.primary[500],
  },
})
