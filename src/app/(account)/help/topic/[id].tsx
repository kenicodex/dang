import { router, useLocalSearchParams } from 'expo-router'
import { Pressable, ScrollView, StyleSheet, View } from 'react-native'
import { Icon } from '@/components/ui/Icon'
import type { SymbolViewProps } from 'expo-symbols'
import { SafeAreaView } from 'react-native-safe-area-context'

import { Text } from '@/components/ui/Text'
import { DangFooter } from '@/components/account/DangFooter'
import { FAQAccordionItem } from '@/components/support/FAQAccordionItem'
import { HELP_TOPICS } from '@/components/support/support.data'
import { colors } from '@/theme/colors'

export default function HelpTopicScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const topic = HELP_TOPICS.find(t => t.id === id)

  if (!topic) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.header}>
          <Pressable style={styles.backButton} onPress={() => router.back()} hitSlop={8}>
            <Icon name="chevron.left" size={18} tintColor={colors.light.text} />
          </Pressable>
          <Text variant="h3" style={styles.headerTitle}>
            Topic
          </Text>
          <View style={styles.headerSpacer} />
        </View>
        <Text style={styles.empty}>This topic is no longer available.</Text>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.back()} hitSlop={8}>
          <Icon name="chevron.left" size={18} tintColor={colors.light.text} />
        </Pressable>
        <Text variant="h3" style={styles.headerTitle}>
          {topic.title}
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.heroCard}>
          <View style={styles.heroIcon}>
            <Icon
              name={topic.icon as SymbolViewProps['name']}
              size={20}
              tintColor={colors.light.primary[600]}
            />
          </View>
          <View style={styles.heroText}>
            <Text style={styles.heroTitle}>{topic.title}</Text>
            <Text style={styles.heroDescription}>{topic.description}</Text>
          </View>
        </View>

        <Text variant="label" style={styles.sectionLabel}>
          FAQs
        </Text>

        <View style={styles.faqList}>
          {topic.faqs.map((faq, index) => (
            <FAQAccordionItem key={faq.id} faq={faq} defaultOpen={index === 0} />
          ))}
        </View>

        <View style={styles.helpCard}>
          <View style={styles.helpText}>
            <Text style={styles.helpTitle}>Didn’t Find Your Answer?</Text>
            <Text style={styles.helpSubtitle}>Our support team will help you out</Text>
          </View>
          <Pressable
            style={styles.helpButton}
            onPress={() => router.push(`/(account)/help/contact?category=${encodeURIComponent(topic.title)}`)}
          >
            <Text style={styles.helpButtonText}>Contact Us</Text>
          </Pressable>
        </View>

        <DangFooter />
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
  headerTitle: {
    flex: 1,
    fontSize: 17,
    textAlign: 'center',
  },
  headerSpacer: {
    width: 40,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
  },
  heroCard: {
    flexDirection: 'row',
    gap: 14,
    backgroundColor: colors.light.primary[500],
    borderRadius: 24,
    padding: 20,
    marginBottom: 24,
  },
  heroIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: colors.light.neutral.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroText: {
    flex: 1,
    gap: 4,
  },
  heroTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.light.neutral.white,
  },
  heroDescription: {
    fontSize: 13,
    lineHeight: 18,
    color: 'rgba(255,255,255,0.9)',
  },
  sectionLabel: {
    marginBottom: 12,
  },
  faqList: {
    gap: 12,
    marginBottom: 24,
  },
  helpCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#1B1330',
    borderRadius: 20,
    padding: 18,
  },
  helpText: {
    flex: 1,
    gap: 2,
  },
  helpTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.light.neutral.white,
  },
  helpSubtitle: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.75)',
  },
  helpButton: {
    backgroundColor: colors.light.neutral.white,
    borderRadius: 999,
    paddingHorizontal: 18,
    paddingVertical: 12,
  },
  helpButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.light.primary[600],
  },
  empty: {
    textAlign: 'center',
    color: colors.light.textMuted,
    marginTop: 40,
  },
})
