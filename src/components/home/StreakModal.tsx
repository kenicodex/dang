import { Modal, Pressable, StyleSheet, View } from 'react-native'
import { Icon } from '@/components/ui/Icon'
import { LinearGradient } from 'expo-linear-gradient'
import { SafeAreaView } from 'react-native-safe-area-context'

import { Text } from '@/components/ui/Text'
import { colors } from '@/theme/colors'

const DAY_LABELS = ['M', 'T', 'W', 'T', 'F', 'S', 'S']
const RAY_COUNT = 16

interface StreakModalProps {
  visible: boolean
  onClose: () => void
  streakCount?: number
  completedDays?: boolean[]
}

export function StreakModal({
  visible,
  onClose,
  streakCount = 4,
  completedDays = [true, true, true, true, false, false, false],
}: StreakModalProps) {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.wrap}>
        <View style={styles.panel}>
          <View style={styles.rayField} pointerEvents="none">
            {Array.from({ length: RAY_COUNT }, (_, i) => (
              <View
                key={i}
                style={[
                  styles.ray,
                  {
                    backgroundColor: i % 2 === 0 ? 'rgba(255,255,255,0.35)' : 'rgba(102,96,224,0.18)',
                    transform: [{ rotate: `${(360 / RAY_COUNT) * i}deg` }],
                  },
                ]}
              />
            ))}
          </View>

          <SafeAreaView edges={['top', 'bottom']} style={styles.content}>
            <Pressable style={styles.closeButton} onPress={onClose} hitSlop={12}>
              <Icon name="xmark" size={16} tintColor={colors.light.text} />
            </Pressable>

            <View style={styles.body}>
              <View style={styles.mascotGlow}>
                <Text style={styles.mascotEmoji}>🔥</Text>
              </View>

              <Text style={styles.count}>{streakCount}</Text>
              <Text style={styles.countLabel}>Days Streak!</Text>

              <View style={styles.daysRow}>
                {DAY_LABELS.map((label, i) =>
                  completedDays[i] ? (
                    <View key={i} style={styles.dayFlame}>
                      <Text style={styles.dayFlameEmoji}>🔥</Text>
                    </View>
                  ) : (
                    <Text key={i} style={styles.dayLetter}>
                      {label}
                    </Text>
                  ),
                )}
              </View>
            </View>

            <LinearGradient
              colors={[colors.light.primary[500], colors.light.primary[700]]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.messageCard}
            >
              <View style={styles.messageBadgeOuter}>
                <View style={styles.messageBadgeInner}>
                  <Text style={styles.messageBadgeEmoji}>🔥</Text>
                </View>
              </View>
              <Text style={styles.messageTitle}>Look at you go!</Text>
              <Text style={styles.messageSubtitle}>Don&rsquo;t stop now!</Text>
            </LinearGradient>
          </SafeAreaView>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  panel: {
    height: '88%',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    overflow: 'hidden',
    backgroundColor: colors.light.primary[50],
  },
  rayField: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ray: {
    position: 'absolute',
    width: 6,
    height: 900,
    borderRadius: 3,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  closeButton: {
    alignSelf: 'flex-end',
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  body: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mascotGlow: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(255,255,255,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  mascotEmoji: {
    fontSize: 88,
  },
  count: {
    fontSize: 56,
    fontWeight: '900',
    color: colors.light.text,
    letterSpacing: -1,
  },
  countLabel: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.light.text,
    marginTop: 2,
    marginBottom: 24,
  },
  daysRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  dayFlame: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayFlameEmoji: {
    fontSize: 20,
  },
  dayLetter: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.light.text,
    width: 44,
    textAlign: 'center',
  },
  messageCard: {
    borderRadius: 24,
    alignItems: 'center',
    paddingVertical: 28,
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  messageBadgeOuter: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  messageBadgeInner: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: 'rgba(255,255,255,0.28)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  messageBadgeEmoji: {
    fontSize: 26,
  },
  messageTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.light.neutral.white,
  },
  messageSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.85)',
    marginTop: 4,
  },
})
