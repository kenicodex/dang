import { useState } from 'react'
import { router, useLocalSearchParams } from 'expo-router'
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native'
import { Icon } from '@/components/ui/Icon'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'

import { Badge } from '@/components/ui/Badge'
import { Text } from '@/components/ui/Text'
import { ActionSheet } from '@/components/ui/ActionSheet'
import { STATUS_META } from '@/components/support/support.data'
import { useSupportStore } from '@/store/useSupportStore'
import { colors } from '@/theme/colors'

export default function SupportChatScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const request = useSupportStore(s => s.requests.find(r => r.id === id))
  const sendMessage = useSupportStore(s => s.sendMessage)
  const resolveRequest = useSupportStore(s => s.resolveRequest)
  const reopenRequest = useSupportStore(s => s.reopenRequest)
  const insets = useSafeAreaInsets()

  const [draft, setDraft] = useState('')
  const [menuVisible, setMenuVisible] = useState(false)

  if (!request) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <Text style={styles.empty}>This conversation is no longer available.</Text>
      </SafeAreaView>
    )
  }

  const status = STATUS_META[request.status]
  const isResolved = request.status === 'resolved'

  const handleSend = () => {
    if (!draft.trim()) return
    sendMessage(request.id, draft.trim())
    setDraft('')
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.back()} hitSlop={8}>
          <Icon name="chevron.left" size={18} tintColor={colors.light.text} />
        </Pressable>
        <View style={styles.headerAvatar}>
          <Icon name="headphones" size={16} tintColor={colors.light.primary[600]} />
        </View>
        <View style={styles.headerText}>
          <Text style={styles.headerName}>Support Team</Text>
          <View style={styles.onlineRow}>
            <View style={styles.onlineDot} />
            <Text style={styles.onlineText}>Online</Text>
          </View>
        </View>
        <Pressable style={styles.moreButton} onPress={() => setMenuVisible(true)} hitSlop={8}>
          <Icon name="ellipsis" size={18} tintColor={colors.light.text} />
        </Pressable>
      </View>

      <View style={styles.subjectBar}>
        <View style={styles.subjectText}>
          <Text style={styles.subjectTitle} numberOfLines={1}>
            {request.subject}
          </Text>
          <Text style={styles.subjectId}>#{request.id}</Text>
        </View>
        <Badge label={status.label} tone={status.tone} />
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 12 : 0}
      >
        <ScrollView contentContainerStyle={styles.messages} showsVerticalScrollIndicator={false}>
          <Text style={styles.dateDivider}>{request.submittedAt.split(',')[0]}</Text>

          {request.messages.map(message => (
            <View
              key={message.id}
              style={[styles.bubbleRow, message.fromSupport ? styles.bubbleRowLeft : styles.bubbleRowRight]}
            >
              <View style={[styles.bubble, message.fromSupport ? styles.bubbleSupport : styles.bubbleUser]}>
                <Text style={message.fromSupport ? styles.bubbleTextSupport : styles.bubbleTextUser}>
                  {message.content}
                </Text>
              </View>
              <View style={message.fromSupport ? styles.metaRowLeft : styles.metaRowRight}>
                <Text style={styles.metaTime}>{message.time}</Text>
                {!message.fromSupport && (
                  <>
                    <Icon name="checkmark" size={10} tintColor={colors.light.primary[400]} />
                    <Text style={styles.metaSent}>Sent</Text>
                  </>
                )}
              </View>
            </View>
          ))}

          {isResolved && (
            <View style={styles.feedbackCard}>
              <Text style={styles.feedbackTitle}>Was Your Issue Resolved?</Text>
              <Text style={styles.feedbackSubtitle}>Your feedback helps us improve</Text>
              <View style={styles.feedbackRow}>
                <Pressable style={[styles.feedbackButton, styles.feedbackButtonYes]}>
                  <Icon name="hand.thumbsup" size={16} tintColor={colors.light.semantic.success} />
                  <Text style={[styles.feedbackButtonText, { color: colors.light.semantic.success }]}>Yes</Text>
                </Pressable>
                <Pressable
                  style={[styles.feedbackButton, styles.feedbackButtonNo]}
                  onPress={() => resolveRequest(request.id, false)}
                >
                  <Icon name="hand.thumbsdown" size={16} tintColor={colors.light.semantic.error} />
                  <Text style={[styles.feedbackButtonText, { color: colors.light.semantic.error }]}>No</Text>
                </Pressable>
              </View>
              <Pressable style={styles.reopenRow} onPress={() => reopenRequest(request.id)}>
                <Icon name="arrow.clockwise" size={13} tintColor={colors.light.primary[600]} />
                <Text style={styles.reopenText}>Reopen Issue</Text>
              </Pressable>
            </View>
          )}
        </ScrollView>

        {!isResolved && (
          <View style={[styles.composer, { paddingBottom: insets.bottom + 10 }]}>
            <TextInput
              value={draft}
              onChangeText={setDraft}
              placeholder="Type a message..."
              placeholderTextColor={colors.light.textSoft}
              style={styles.composerInput}
              multiline
            />
            <Pressable
              style={[styles.sendButton, !draft.trim() && styles.sendButtonDisabled]}
              disabled={!draft.trim()}
              onPress={handleSend}
            >
              <Icon name="paperplane.fill" size={16} tintColor={colors.light.neutral.white} />
            </Pressable>
          </View>
        )}
      </KeyboardAvoidingView>

      <ActionSheet
        visible={menuVisible}
        onClose={() => setMenuVisible(false)}
        actions={[
          { label: 'View request details', onPress: () => router.push(`/(account)/help/request/${request.id}`) },
        ]}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.light.bg,
  },
  flex: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 10,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.light.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerAvatar: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: colors.light.primary[100],
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    flex: 1,
    gap: 2,
  },
  headerName: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.light.text,
  },
  onlineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  onlineDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.light.semantic.success,
  },
  onlineText: {
    fontSize: 12,
    color: colors.light.semantic.success,
    fontWeight: '600',
  },
  moreButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  subjectBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: colors.light.surfaceAlt,
  },
  subjectText: {
    flex: 1,
  },
  subjectTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.light.text,
  },
  subjectId: {
    fontSize: 12,
    color: colors.light.textSoft,
  },
  messages: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
    gap: 14,
  },
  dateDivider: {
    alignSelf: 'center',
    fontSize: 12,
    color: colors.light.textSoft,
    marginBottom: 4,
  },
  bubbleRow: {
    maxWidth: '82%',
  },
  bubbleRowLeft: {
    alignSelf: 'flex-start',
    alignItems: 'flex-start',
  },
  bubbleRowRight: {
    alignSelf: 'flex-end',
    alignItems: 'flex-end',
  },
  bubble: {
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  bubbleSupport: {
    backgroundColor: colors.light.surface,
    borderWidth: 1,
    borderColor: colors.light.border,
    borderBottomLeftRadius: 4,
  },
  bubbleUser: {
    backgroundColor: colors.light.primary[500],
    borderBottomRightRadius: 4,
  },
  bubbleTextSupport: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.light.text,
  },
  bubbleTextUser: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.light.neutral.white,
    fontWeight: '600',
  },
  metaRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
    paddingLeft: 4,
  },
  metaRowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
    paddingRight: 4,
  },
  metaTime: {
    fontSize: 11,
    color: colors.light.textSoft,
  },
  metaSent: {
    fontSize: 11,
    color: colors.light.textSoft,
  },
  feedbackCard: {
    marginTop: 10,
    backgroundColor: colors.light.surface,
    borderWidth: 1,
    borderColor: colors.light.border,
    borderRadius: 18,
    padding: 18,
    alignItems: 'center',
  },
  feedbackTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.light.text,
    marginBottom: 4,
  },
  feedbackSubtitle: {
    fontSize: 12,
    color: colors.light.textMuted,
    marginBottom: 16,
  },
  feedbackRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  feedbackButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 999,
    borderWidth: 1.5,
  },
  feedbackButtonYes: {
    borderColor: colors.light.semantic.success,
  },
  feedbackButtonNo: {
    borderColor: colors.light.semantic.error,
  },
  feedbackButtonText: {
    fontSize: 14,
    fontWeight: '700',
  },
  reopenRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  reopenText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.light.primary[600],
  },
  composer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 10,
    paddingHorizontal: 16,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: colors.light.border,
    backgroundColor: colors.light.bg,
  },
  composerInput: {
    flex: 1,
    maxHeight: 100,
    backgroundColor: colors.light.surfaceAlt,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 15,
    color: colors.light.text,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.light.primary[500],
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    opacity: 0.4,
  },
  empty: {
    textAlign: 'center',
    color: colors.light.textMuted,
    marginTop: 40,
    paddingHorizontal: 20,
  },
})
