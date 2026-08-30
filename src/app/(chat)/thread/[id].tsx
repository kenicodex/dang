import { useRef, useState } from 'react'
import {
  KeyboardAvoidingView,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native'
import * as Clipboard from 'expo-clipboard'
import { router, useLocalSearchParams } from 'expo-router'
import { Icon } from '@/components/ui/Icon'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'

import { Avatar } from '@/components/ui/Avatar'
import { Text } from '@/components/ui/Text'
import { ActionSheet, ActionSheetAction } from '@/components/ui/ActionSheet'
import {
  MessageBubble,
  GroupMessageBubble,
  PinnedSessionBanner,
  HeaderMenu,
  DeleteMessageModal,
  findThread,
  findCircleSession,
} from '@/components/chat'
import { useAuthStore, useChatStore } from '@/store'
import { colors } from '@/theme/colors'
import type { ChatMessage } from '@/types/chat'

function messagePreview(message: ChatMessage): string {
  if (message.content) return message.content
  if (message.call) return `${message.call.kind === 'video' ? 'Video' : 'Audio'} call`
  if (message.voice) return 'Voice message'
  if (message.link) return message.link.title
  return ''
}

export default function ChatThreadScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const thread = findThread(id)
  const session = findCircleSession(id)
  const insets = useSafeAreaInsets()
  const user = useAuthStore(s => s.user)
  const isGroup = thread?.kind === 'group'

  const messages = useChatStore(s => s.getMessages(id))
  const sendMessage = useChatStore(s => s.sendMessage)
  const deleteMessage = useChatStore(s => s.deleteMessage)
  const togglePinMessage = useChatStore(s => s.togglePinMessage)

  const [draft, setDraft] = useState('')
  const [replyTarget, setReplyTarget] = useState<ChatMessage | null>(null)
  const [menuVisible, setMenuVisible] = useState(false)
  const [actionSheetMessage, setActionSheetMessage] = useState<ChatMessage | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<ChatMessage | null>(null)
  const [bannerExpanded, setBannerExpanded] = useState(true)
  const [bannerDismissed, setBannerDismissed] = useState(false)
  const scrollRef = useRef<ScrollView>(null)

  if (!thread) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <Text style={styles.emptyRoute}>This conversation is no longer available.</Text>
      </SafeAreaView>
    )
  }

  const handleSend = () => {
    if (!draft.trim()) return
    sendMessage(thread.id, draft.trim(), replyTarget ? messagePreview(replyTarget) : undefined)
    setDraft('')
    setReplyTarget(null)
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 50)
  }

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const y = e.nativeEvent.contentOffset.y
    setBannerExpanded(y < 24)
  }

  const actionSheetActions: ActionSheetAction[] = actionSheetMessage
    ? [
        { label: 'Reply', onPress: () => setReplyTarget(actionSheetMessage) },
        {
          label: 'Copy Text',
          onPress: () => {
            const text = messagePreview(actionSheetMessage)
            if (text) Clipboard.setStringAsync(text)
          },
        },
        { label: 'Pin Message', onPress: () => togglePinMessage(thread.id, actionSheetMessage.id) },
        { label: 'Delete Message', destructive: true, onPress: () => setDeleteTarget(actionSheetMessage) },
      ]
    : []

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.header}>
        <Pressable style={styles.iconButton} onPress={() => router.back()} hitSlop={8}>
          <Icon name="chevron.left" size={18} tintColor={colors.light.text} />
        </Pressable>

        <Pressable style={styles.headerIdentity} onPress={() => router.push(`/(chat)/profile/${thread.id}`)}>
          {isGroup && thread.memberAvatars ? (
            <View style={styles.headerAvatarStack}>
              {thread.memberAvatars.slice(0, 2).map((uri, i) => (
                <Avatar key={uri + i} uri={uri} size="xs" style={[styles.headerStackAvatar, i > 0 && styles.headerStackAvatarOverlap]} />
              ))}
              {thread.isOnline && <View style={styles.headerOnlineDot} />}
            </View>
          ) : (
            <Avatar uri={thread.avatarUrl} initials={thread.title.slice(0, 2)} size="sm" />
          )}
          <View>
            <View style={styles.headerNameRow}>
              <Text style={styles.headerName}>{thread.title}</Text>
              {!isGroup && thread.isOnline && (
                <View style={styles.onlinePill}>
                  <Text style={styles.onlinePillText}>Online</Text>
                </View>
              )}
            </View>
            {isGroup ? (
              <Text style={styles.headerHandle}>
                {thread.memberCount} People · <Text style={styles.headerHandleActive}>{thread.activeCount} Active</Text>
              </Text>
            ) : (
              !!thread.handle && <Text style={styles.headerHandle}>{thread.handle}</Text>
            )}
          </View>
        </Pressable>

        {isGroup ? (
          <View style={styles.headerCallButtons}>
            <Pressable style={styles.headerCallButton} onPress={() => router.push(`/(chat)/call/${thread.id}?kind=video`)}>
              <Icon name="video.fill" size={15} tintColor={colors.light.text} />
            </Pressable>
            <Pressable style={styles.headerCallButton} onPress={() => router.push(`/(chat)/call/${thread.id}?kind=audio`)}>
              <Icon name="phone.fill" size={15} tintColor={colors.light.text} />
            </Pressable>
          </View>
        ) : (
          <Pressable style={styles.iconButton} onPress={() => setMenuVisible(true)} hitSlop={8}>
            <Icon name="ellipsis" size={18} tintColor={colors.light.text} />
          </Pressable>
        )}
      </View>

      {isGroup && session && !bannerDismissed && (
        <PinnedSessionBanner
          session={session}
          expanded={bannerExpanded}
          onClose={() => setBannerDismissed(true)}
          onPress={() => router.push(`/(chat)/session/${thread.id}`)}
          onGoing={() => {}}
          onAddToCalendar={() => {}}
          onJoin={() => router.push(`/(chat)/call/${thread.id}?kind=audio`)}
        />
      )}

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={insets.top + 56}
      >
        {messages.length === 0 ? (
          <View style={styles.emptyBody}>
            <Text style={styles.emptyWave}>👋</Text>
            <Text style={styles.emptyName}>{thread.title}</Text>
            <Text style={styles.emptyCaption}>
              Say Hai, to start your conversation with {thread.title.split(' ')[0]}.
            </Text>
          </View>
        ) : (
          <ScrollView
            ref={scrollRef}
            contentContainerStyle={styles.messagesContent}
            showsVerticalScrollIndicator={false}
            onScroll={isGroup ? handleScroll : undefined}
            scrollEventThrottle={16}
            onContentSizeChange={isGroup ? undefined : () => scrollRef.current?.scrollToEnd({ animated: false })}
          >
            {messages.map(message =>
              isGroup ? (
                <GroupMessageBubble
                  key={message.id}
                  message={message}
                  onLongPress={() => setActionSheetMessage(message)}
                  onPressCall={() => router.push(`/(chat)/call/${thread.id}?kind=${message.call?.kind ?? 'audio'}`)}
                  onPressMore={() => setActionSheetMessage(message)}
                />
              ) : (
                <MessageBubble
                  key={message.id}
                  message={message}
                  onLongPress={() => setActionSheetMessage(message)}
                />
              ),
            )}
          </ScrollView>
        )}

        {!!replyTarget && (
          <View style={styles.replyPreview}>
            <View style={styles.replyPreviewBar} />
            <Text style={styles.replyPreviewText} numberOfLines={1}>
              {messagePreview(replyTarget)}
            </Text>
            <Pressable onPress={() => setReplyTarget(null)} hitSlop={8}>
              <Icon name="xmark" size={14} tintColor={colors.light.textSoft} />
            </Pressable>
          </View>
        )}

        <View style={styles.composer}>
          <Pressable style={styles.attachButton} hitSlop={6}>
            <Icon name="plus" size={18} tintColor={colors.light.text} />
          </Pressable>
          <View style={styles.inputField}>
            <TextInput
              value={draft}
              onChangeText={setDraft}
              placeholder={messages.length === 0 ? 'Hello' : 'Write message here'}
              placeholderTextColor={colors.light.textSoft}
              style={styles.input}
              multiline
            />
            <Icon name="face.smiling" size={18} tintColor={colors.light.textSoft} />
          </View>
          <Pressable style={styles.sendButton} onPress={handleSend}>
            <Icon name="paperplane.fill" size={16} tintColor={colors.light.neutral.white} />
          </Pressable>
        </View>
      </KeyboardAvoidingView>

      {!isGroup && (
        <HeaderMenu
          visible={menuVisible}
          onClose={() => setMenuVisible(false)}
          topOffset={insets.top + 56}
          items={[
            { icon: 'eye', label: 'View info', onPress: () => router.push(`/(chat)/profile/${thread.id}`) },
            { icon: 'video', label: 'Video call', onPress: () => router.push(`/(chat)/call/${thread.id}?kind=video`) },
            { icon: 'phone', label: 'Audio call', onPress: () => router.push(`/(chat)/call/${thread.id}?kind=audio`) },
            { icon: 'trash', label: 'Delete chat', destructive: true, onPress: () => router.replace('/chat') },
          ]}
        />
      )}

      <ActionSheet
        visible={!!actionSheetMessage}
        onClose={() => setActionSheetMessage(null)}
        actions={actionSheetActions}
      />

      {!!deleteTarget && (
        <DeleteMessageModal
          visible={!!deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onConfirm={() => {
            deleteMessage(thread.id, deleteTarget.id)
            setDeleteTarget(null)
          }}
          authorName={deleteTarget.fromMe ? user?.displayName ?? 'You' : deleteTarget.senderName ?? thread.title}
          authorAvatarUrl={deleteTarget.fromMe ? user?.avatarUrl : deleteTarget.senderAvatarUrl ?? thread.avatarUrl}
          timeLabel={deleteTarget.time ?? ''}
          preview={messagePreview(deleteTarget)}
        />
      )}
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
  emptyRoute: {
    padding: 20,
    color: colors.light.textMuted,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.light.border,
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.light.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerIdentity: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerAvatarStack: {
    flexDirection: 'row',
    width: 44,
    position: 'relative',
  },
  headerStackAvatar: {
    borderWidth: 2,
    borderColor: colors.light.bg,
  },
  headerStackAvatarOverlap: {
    marginLeft: -10,
  },
  headerOnlineDot: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.light.semantic.success,
    borderWidth: 2,
    borderColor: colors.light.bg,
  },
  headerNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerName: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.light.text,
  },
  onlinePill: {
    backgroundColor: colors.light.semantic.successBg,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
  },
  onlinePillText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.light.semantic.success,
  },
  headerHandle: {
    fontSize: 12,
    color: colors.light.textMuted,
  },
  headerHandleActive: {
    color: colors.light.semantic.success,
    fontWeight: '600',
  },
  headerCallButtons: {
    flexDirection: 'row',
    gap: 6,
    backgroundColor: colors.light.surface,
    borderRadius: 999,
    padding: 4,
  },
  headerCallButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  messagesContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
  },
  emptyBody: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  emptyWave: {
    fontSize: 28,
    marginBottom: 8,
  },
  emptyName: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.light.text,
  },
  emptyCaption: {
    fontSize: 13,
    color: colors.light.textMuted,
    marginTop: 4,
  },
  replyPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginHorizontal: 16,
    marginBottom: 8,
    padding: 10,
    backgroundColor: colors.light.surfaceAlt,
    borderRadius: 12,
  },
  replyPreviewBar: {
    width: 3,
    height: 18,
    borderRadius: 2,
    backgroundColor: colors.light.primary[400],
  },
  replyPreviewText: {
    flex: 1,
    fontSize: 13,
    color: colors.light.textMuted,
  },
  composer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  attachButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputField: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.light.surface,
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingVertical: 10,
    maxHeight: 100,
  },
  input: {
    flex: 1,
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
})
