import { router } from 'expo-router'
import { Pressable, ScrollView, StyleSheet, View } from 'react-native'
import { Icon } from '@/components/ui/Icon'
import type { SymbolViewProps } from 'expo-symbols'
import { SafeAreaView } from 'react-native-safe-area-context'

import { Avatar } from '@/components/ui/Avatar'
import { Text } from '@/components/ui/Text'
import { Tabs } from '@/components/ui/Tabs'
import { DangFooter } from '@/components/account/DangFooter'
import { HELP_TOPICS } from '@/components/support/support.data'
import { useAuthStore } from '@/store/useAuthStore'
import { colors } from '@/theme/colors'

export default function HelpSupportScreen() {
  const user = useAuthStore(s => s.user)
  const firstName = user?.displayName?.split(' ')[0] ?? 'Amy'

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.header}>
        <Avatar uri={user?.avatarUrl} initials={firstName.slice(0, 2).toUpperCase()} size="sm" />
        <Text variant="h3" style={styles.headerTitle}>
          Help & Support
        </Text>
        <View style={styles.headerActions}>
          <Pressable style={styles.iconButton} onPress={() => router.push('/(account)/help/contact')}>
            <Icon name="headphones" size={16} tintColor={colors.light.text} />
          </Pressable>
          <Pressable style={styles.iconButton}>
            <Icon name="magnifyingglass" size={16} tintColor={colors.light.text} />
          </Pressable>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.heroRow}>
          <View style={styles.heroText}>
            <Text style={styles.heroTitle}>Hi, how can we{'\n'}help you?</Text>
            <Text style={styles.heroSubtitle}>We are here to make your Dang experience amazing!</Text>
          </View>
          <View style={styles.heroArt}>
            <Icon name="bubble.left.fill" size={44} tintColor={colors.light.primary[100]} />
            <Icon
              name="headphones"
              size={30}
              tintColor={colors.light.primary[500]}
              style={styles.heroArtHeadphones}
            />
            <Icon name="plus" size={12} tintColor={colors.light.primary[400]} style={styles.heroArtPlus} />
          </View>
        </View>

        <Tabs
          tabs={[
            { value: 'faqs', label: 'FAQS' },
            { value: 'track', label: 'Track Request' },
          ]}
          value="faqs"
          onChange={value => {
            if (value === 'track') router.push('/(account)/help/requests')
          }}
          stretch
          style={styles.tabs}
        />

        <Text variant="label" style={styles.sectionLabel}>
          Popular Help Topics
        </Text>

        <View style={styles.topicList}>
          {HELP_TOPICS.map((topic, index) => (
            <Pressable
              key={topic.id}
              style={[styles.topicRow, index === HELP_TOPICS.length - 1 && styles.topicRowLast]}
              onPress={() => router.push(`/(account)/help/topic/${topic.id}`)}
            >
              <View style={styles.topicIcon}>
                <Icon
                  name={topic.icon as SymbolViewProps['name']}
                  size={18}
                  tintColor={colors.light.primary[500]}
                />
              </View>
              <View style={styles.topicText}>
                <Text style={styles.topicTitle}>{topic.title}</Text>
                <Text style={styles.topicDescription} numberOfLines={2}>
                  {topic.description}
                </Text>
              </View>
              <Icon name="chevron.right" size={16} tintColor={colors.light.textSoft} />
            </Pressable>
          ))}
        </View>

        <LinearNeedHelpCard />

        <DangFooter />
      </ScrollView>
    </SafeAreaView>
  )
}

function LinearNeedHelpCard() {
  return (
    <View style={styles.needHelpCard}>
      <View style={styles.needHelpIcon}>
        <Icon name="headphones" size={20} tintColor={colors.light.neutral.white} />
      </View>
      <View style={styles.needHelpText}>
        <Text style={styles.needHelpTitle}>Still Need Help?</Text>
        <Text style={styles.needHelpSubtitle}>
          Our support team is ready to support you, we usually reply within 24 hours
        </Text>
      </View>
      <Pressable style={styles.needHelpButton} onPress={() => router.push('/(account)/help/contact')}>
        <Text style={styles.needHelpButtonText}>Contact Support</Text>
      </Pressable>
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
    gap: 12,
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 4,
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 10,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.light.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  heroRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  heroText: {
    flex: 1,
    gap: 8,
    paddingRight: 12,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.light.text,
    lineHeight: 30,
  },
  heroSubtitle: {
    fontSize: 14,
    color: colors.light.textMuted,
    lineHeight: 20,
  },
  heroArt: {
    width: 88,
    height: 88,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroArtHeadphones: {
    position: 'absolute',
    right: 6,
    bottom: 10,
  },
  heroArtPlus: {
    position: 'absolute',
    top: 4,
    right: 14,
  },
  tabs: {
    marginBottom: 20,
  },
  sectionLabel: {
    marginBottom: 12,
  },
  topicList: {
    backgroundColor: colors.light.surface,
    borderRadius: 20,
    overflow: 'hidden',
  },
  topicRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.light.borderAlt,
  },
  topicRowLast: {
    borderBottomWidth: 0,
  },
  topicIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.light.primary[50],
    alignItems: 'center',
    justifyContent: 'center',
  },
  topicText: {
    flex: 1,
    gap: 2,
  },
  topicTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.light.text,
  },
  topicDescription: {
    fontSize: 12,
    lineHeight: 16,
    color: colors.light.textMuted,
  },
  needHelpCard: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    backgroundColor: '#1B1330',
    borderRadius: 24,
    padding: 20,
    marginTop: 24,
    gap: 14,
  },
  needHelpIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  needHelpText: {
    flex: 1,
    minWidth: 180,
    gap: 4,
  },
  needHelpTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.light.neutral.white,
  },
  needHelpSubtitle: {
    fontSize: 13,
    lineHeight: 18,
    color: 'rgba(255,255,255,0.75)',
  },
  needHelpButton: {
    width: '100%',
    backgroundColor: colors.light.neutral.white,
    borderRadius: 999,
    paddingVertical: 14,
    alignItems: 'center',
  },
  needHelpButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.light.primary[600],
  },
})
