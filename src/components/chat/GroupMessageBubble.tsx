import { Pressable, StyleSheet, View } from 'react-native'
import { Icon } from '@/components/ui/Icon'

import { Avatar } from '@/components/ui/Avatar'
import { Badge } from '@/components/ui/Badge'
import { Text } from '@/components/ui/Text'
import { useAuthStore } from '@/store/useAuthStore'
import { colors } from '@/theme/colors'
import type { ChatMessage } from '@/types/chat'

interface GroupMessageBubbleProps {
  message: ChatMessage
  onLongPress?: () => void
  onPressCall?: () => void
  onPressMore?: () => void
}

export function GroupMessageBubble({ message, onLongPress, onPressCall, onPressMore }: GroupMessageBubbleProps) {
  if (message.kind === 'divider') {
    return (
      <View style={styles.dividerRow}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerText}>{message.content}</Text>
        <View style={styles.dividerLine} />
      </View>
    )
  }

  const user = useAuthStore(s => s.user)
  const fromMe = message.fromMe
  const name = fromMe ? 'You' : message.senderName ?? ''
  const avatarUrl = fromMe ? user?.avatarUrl : message.senderAvatarUrl

  return (
    <View>
      {!!message.dateLabel && <Text style={styles.dateLabel}>{message.dateLabel}</Text>}

      <View style={[styles.row, fromMe && styles.rowReverse]}>
        <Avatar uri={avatarUrl} initials={name.slice(0, 2)} size="xs" />

        <View style={[styles.column, fromMe && styles.columnEnd]}>
          <View style={[styles.headerRow, fromMe && styles.headerRowReverse]}>
            <Text style={styles.senderName}>{name}</Text>
            {!!message.senderRole && <Badge label={message.senderRole} tone="info" />}
            <Text style={styles.time}>{message.time}</Text>
            {!!message.status && (
              <Icon name="checkmark" size={11} tintColor={colors.light.semantic.success} />
            )}
          </View>

          <Pressable onLongPress={onLongPress} delayLongPress={350}>
            {message.kind === 'text' && (
              <View style={[styles.bubble, fromMe ? styles.bubbleMe : styles.bubbleThem]}>
                <Text style={fromMe ? styles.bubbleTextMe : styles.bubbleTextThem}>{message.content}</Text>
              </View>
            )}
            {message.kind === 'call' && (
              <CallBubble message={message} onPressCall={onPressCall} onPressMore={onPressMore} />
            )}
          </Pressable>

          {!!message.reactions?.length && (
            <View style={[styles.reactionsRow, fromMe && styles.reactionsRowEnd]}>
              {message.reactions.map(r => (
                <View key={r.emoji} style={styles.reactionPill}>
                  <Text style={styles.reactionEmoji}>{r.emoji}</Text>
                  <Text style={styles.reactionCount}>{r.count}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </View>
    </View>
  )
}

function CallBubble({
  message,
  onPressCall,
  onPressMore,
}: {
  message: ChatMessage
  onPressCall?: () => void
  onPressMore?: () => void
}) {
  const call = message.call!
  const title = call.ongoing
    ? `Ongoing ${call.kind === 'video' ? 'Video' : 'Audio'} Call`
    : call.missed
      ? `Missed ${call.kind === 'video' ? 'Video' : 'Audio'} Call`
      : `${call.kind === 'video' ? 'Video' : 'Audio'} Call Ended`

  return (
    <View style={styles.callRow}>
      <Pressable
        style={[styles.callBubble, call.ongoing && styles.callBubbleOngoing]}
        onPress={call.ongoing ? onPressCall : undefined}
      >
        <View style={[styles.callIconCircle, call.ongoing && styles.callIconCircleOngoing]}>
          <Icon
            name={call.kind === 'video' ? 'video.fill' : 'phone.fill'}
            size={16}
            tintColor={call.ongoing ? colors.light.neutral.white : colors.light.text}
          />
        </View>
        <View>
          <Text style={call.ongoing ? styles.callTitleLight : styles.callTitleDark}>{title}</Text>
          <Text style={call.ongoing ? styles.callSubtitleLight : styles.callSubtitleDark}>{call.duration}</Text>
        </View>
      </Pressable>
      <Pressable style={styles.callMenu} onPress={onPressMore} hitSlop={8}>
        <Icon name="ellipsis" size={16} tintColor={colors.light.textSoft} />
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  dateLabel: {
    textAlign: 'center',
    fontSize: 12,
    color: colors.light.textSoft,
    marginVertical: 12,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginVertical: 16,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(239,68,68,0.3)',
  },
  dividerText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.light.semantic.error,
  },
  row: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  rowReverse: {
    flexDirection: 'row-reverse',
  },
  column: {
    flex: 1,
    alignItems: 'flex-start',
  },
  columnEnd: {
    alignItems: 'flex-end',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  headerRowReverse: {
    flexDirection: 'row-reverse',
  },
  senderName: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.light.text,
  },
  time: {
    fontSize: 11,
    color: colors.light.textSoft,
  },
  bubble: {
    maxWidth: 280,
    borderRadius: 16,
    padding: 12,
  },
  bubbleMe: {
    backgroundColor: colors.light.primary[500],
    borderBottomRightRadius: 4,
  },
  bubbleThem: {
    backgroundColor: colors.light.surfaceAlt,
    borderBottomLeftRadius: 4,
  },
  bubbleTextMe: {
    fontSize: 14,
    color: colors.light.neutral.white,
    lineHeight: 20,
  },
  bubbleTextThem: {
    fontSize: 14,
    color: colors.light.textAlt,
    lineHeight: 20,
  },
  reactionsRow: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 8,
  },
  reactionsRowEnd: {
    justifyContent: 'flex-end',
  },
  reactionPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.light.surfaceAlt,
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  reactionEmoji: {
    fontSize: 12,
  },
  reactionCount: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.light.textMuted,
  },
  callRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  callBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: colors.light.surfaceAlt,
    borderRadius: 16,
    padding: 12,
    minWidth: 220,
  },
  callBubbleOngoing: {
    backgroundColor: colors.light.primary[500],
  },
  callIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.light.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  callIconCircleOngoing: {
    backgroundColor: colors.light.primary[600],
  },
  callTitleDark: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.light.text,
  },
  callSubtitleDark: {
    fontSize: 12,
    color: colors.light.textMuted,
    marginTop: 1,
  },
  callTitleLight: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.light.neutral.white,
  },
  callSubtitleLight: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.85)',
    marginTop: 1,
  },
  callMenu: {
    padding: 4,
  },
})
