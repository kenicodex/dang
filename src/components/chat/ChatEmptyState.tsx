import { StyleSheet, View } from 'react-native'

import { Text } from '@/components/ui/Text'
import { Button } from '@/components/ui/Button'
import { colors } from '@/theme/colors'

interface ChatEmptyStateProps {
  title: string
  description: string
  actionLabel: string
  onAction: () => void
}

export function ChatEmptyState({ title, description, actionLabel, onAction }: ChatEmptyStateProps) {
  return (
    <View style={styles.container}>
      <ChatDoodle />
      <Text variant="h3" style={styles.title}>
        {title}
      </Text>
      <Text style={styles.description}>{description}</Text>
      <Button title={actionLabel} onPress={onAction} style={styles.action} />
    </View>
  )
}

function ChatDoodle() {
  return (
    <View style={styles.doodle}>
      <View style={[styles.cloud, styles.cloudBack]} />
      <View style={[styles.cloud, styles.cloudFront]} />
      <View style={styles.bubble}>
        <View style={styles.bubbleTail} />
      </View>
      <Text style={[styles.mark, styles.markX]}>×</Text>
      <Text style={[styles.mark, styles.markPlus]}>+</Text>
      <View style={[styles.dot, styles.dotTop]} />
      <View style={[styles.dot, styles.dotBottom]} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingTop: 48,
    paddingHorizontal: 32,
  },
  doodle: {
    width: 220,
    height: 140,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  cloud: {
    position: 'absolute',
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.light.surfaceAlt,
  },
  cloudBack: {
    width: 150,
    top: 30,
    left: 10,
  },
  cloudFront: {
    width: 110,
    bottom: 20,
    right: 10,
  },
  bubble: {
    width: 88,
    height: 78,
    borderRadius: 44,
    borderWidth: 3,
    borderColor: colors.light.primary[500],
    backgroundColor: colors.light.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bubbleTail: {
    position: 'absolute',
    bottom: -8,
    left: 18,
    width: 16,
    height: 16,
    borderRadius: 4,
    backgroundColor: colors.light.bg,
    borderWidth: 3,
    borderColor: colors.light.primary[500],
    transform: [{ rotate: '45deg' }],
  },
  mark: {
    position: 'absolute',
    fontWeight: '700',
    color: colors.light.primary[400],
  },
  markX: {
    top: 14,
    left: 62,
    fontSize: 16,
  },
  markPlus: {
    bottom: 18,
    right: 40,
    fontSize: 18,
  },
  dot: {
    position: 'absolute',
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.light.primary[400],
  },
  dotTop: {
    top: 8,
    left: 78,
  },
  dotBottom: {
    bottom: 26,
    right: 24,
  },
  title: {
    fontSize: 20,
    marginBottom: 6,
  },
  description: {
    fontSize: 13,
    color: colors.light.textMuted,
    textAlign: 'center',
    marginBottom: 24,
  },
  action: {
    alignSelf: 'stretch',
    borderRadius: 999,
    backgroundColor: colors.light.primary[500],
    paddingVertical: 16,
  },
})
