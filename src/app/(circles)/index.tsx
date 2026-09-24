import { useRouter } from 'expo-router'
import { Pressable, ScrollView, StyleSheet, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Icon } from '@/components/ui/Icon'

import { Text } from '@/components/ui/Text'
import { useSpaces } from '@/api/hooks/spaces.hooks'
import { colors } from '@/theme/colors'

export default function CirclesScreen() {
  const router = useRouter()
  const { data: spacesPage, isLoading } = useSpaces()
  const circles = (spacesPage?.items ?? []).filter(space => space.isPrivate)

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.back()} hitSlop={8}>
          <Icon name="chevron.left" size={18} tintColor={colors.light.text} />
        </Pressable>
        <Text variant="h3" style={styles.title}>
          Circles
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {isLoading && <Text style={styles.empty}>Loading circles…</Text>}
        {!isLoading && circles.length === 0 && (
          <Text style={styles.empty}>No private circles yet.</Text>
        )}
        {circles.map(circle => (
          <Pressable key={circle.id} style={styles.row} onPress={() => router.push(`/(circles)/${circle.id}`)}>
            <View style={styles.emojiWrap}>
              <Text style={styles.emoji}>{circle.emoji ?? '🔒'}</Text>
            </View>
            <View style={styles.rowText}>
              <Text style={styles.rowTitle}>{circle.name}</Text>
              <Text style={styles.rowSubtitle}>{circle.memberCount} members</Text>
            </View>
            <Icon name="chevron.right" size={14} tintColor={colors.light.textSoft} />
          </Pressable>
        ))}
      </ScrollView>
    </SafeAreaView>
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
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.light.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
  },
  headerSpacer: {
    width: 40,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
    gap: 10,
  },
  empty: {
    textAlign: 'center',
    color: colors.light.textMuted,
    marginTop: 40,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderRadius: 16,
    backgroundColor: colors.light.surface,
  },
  emojiWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.light.primary[50],
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: {
    fontSize: 20,
  },
  rowText: {
    flex: 1,
  },
  rowTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.light.text,
  },
  rowSubtitle: {
    fontSize: 13,
    color: colors.light.textMuted,
    marginTop: 2,
  },
})
