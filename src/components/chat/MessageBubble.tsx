import { Image } from 'expo-image'
import { Pressable, StyleSheet, View } from 'react-native'
import { Icon } from '@/components/ui/Icon'

import { Text } from '@/components/ui/Text'
import { colors } from '@/theme/colors'
import type { ChatMessage } from '@/types/chat'

interface MessageBubbleProps {
  message: ChatMessage
  onLongPress?: () => void
}

const WAVEFORM_HEIGHTS = [6, 12, 18, 10, 20, 8, 16, 22, 12, 6, 14, 20, 10, 18, 8, 16, 12, 20, 6, 14]

export function MessageBubble({ message, onLongPress }: MessageBubbleProps) {
  if (message.kind === 'divider') {
    return (
      <View style={styles.dividerRow}>
        <View style={[styles.dividerLine, styles.dividerLineDanger]} />
        <Text style={styles.dividerTextDanger}>{message.content}</Text>
        <View style={[styles.dividerLine, styles.dividerLineDanger]} />
      </View>
    )
  }

  return (
    <View>
      {!!message.dateLabel && (
        <Text style={styles.dateLabel}>{message.dateLabel}</Text>
      )}

      <View style={[styles.row, message.fromMe ? styles.rowMe : styles.rowThem]}>
        {message.kind === 'call' && !message.fromMe && (
          <CallBubbleGutter kind="menu-right" />
        )}

        <Pressable onLongPress={onLongPress} delayLongPress={350} style={styles.pressableWrap}>
          {message.isPinned && (
            <View style={message.fromMe ? styles.pinBadgeMe : styles.pinBadgeThem}>
              <Icon name="pin.fill" size={9} tintColor={colors.light.neutral.white} />
            </View>
          )}
          {message.kind === 'text' && <TextBubble message={message} />}
          {message.kind === 'call' && <CallBubble message={message} />}
          {message.kind === 'voice' && <VoiceBubble message={message} />}
          {message.kind === 'link' && <LinkBubble message={message} />}
        </Pressable>

        {message.kind === 'call' && message.fromMe && (
          <CallBubbleGutter kind="menu-left" />
        )}
      </View>
    </View>
  )
}

function CallBubbleGutter({ kind }: { kind: 'menu-left' | 'menu-right' }) {
  return (
    <View style={kind === 'menu-left' ? styles.gutterLeft : styles.gutterRight}>
      <Icon name="ellipsis" size={16} tintColor={colors.light.textSoft} />
    </View>
  )
}

function ReadTicks({ status }: { status?: ChatMessage['status'] }) {
  if (!status) return null
  return (
    <Icon
      name={status === 'sent' ? 'checkmark' : 'checkmark'}
      size={12}
      tintColor={status === 'read' ? colors.light.semantic.success : 'rgba(255,255,255,0.8)'}
    />
  )
}

function TextBubble({ message }: { message: ChatMessage }) {
  return (
    <View style={[styles.bubble, message.fromMe ? styles.bubbleMe : styles.bubbleThem]}>
      {!!message.quoted && (
        <View style={styles.quoteBlock}>
          <View style={styles.quoteBar} />
          <Text style={styles.quoteText} numberOfLines={1}>
            {message.quoted}
          </Text>
        </View>
      )}
      <Text style={message.fromMe ? styles.bubbleTextMe : styles.bubbleTextThem}>{message.content}</Text>
      <View style={styles.bubbleFooter}>
        <Text style={message.fromMe ? styles.timeTextMe : styles.timeTextThem}>{message.time}</Text>
        {message.fromMe && <ReadTicks status={message.status} />}
      </View>
    </View>
  )
}

function CallBubble({ message }: { message: ChatMessage }) {
  const call = message.call!
  const missed = !!call.missed
  const title = missed
    ? `Missed ${call.kind === 'video' ? 'Video' : 'Audio'} Call`
    : `${call.kind === 'video' ? 'Video' : 'Audio'} Call Ended`

  if (missed) {
    return (
      <View style={styles.callBubbleOutline}>
        <View style={styles.callIconCircleDanger}>
          <Icon
            name={call.kind === 'video' ? 'video.fill' : 'phone.down.fill'}
            size={16}
            tintColor={colors.light.neutral.white}
          />
        </View>
        <View>
          <Text style={styles.callTitleDark}>{title}</Text>
          <Text style={styles.callSubtitleDark}>{call.duration}</Text>
        </View>
      </View>
    )
  }

  return (
    <View style={styles.callBubbleFilled}>
      <View style={styles.callIconCircleLight}>
        <Icon name={call.kind === 'video' ? 'video.fill' : 'phone.fill'} size={16} tintColor={colors.light.semantic.success} />
      </View>
      <View>
        <Text style={styles.callTitleLight}>{title}</Text>
        <Text style={styles.callSubtitleLight}>{call.duration}</Text>
      </View>
    </View>
  )
}

function VoiceBubble({ message }: { message: ChatMessage }) {
  return (
    <View style={[styles.bubble, styles.bubbleMe, styles.voiceBubble]}>
      <View style={styles.voiceRow}>
        <View style={styles.playButton}>
          <Icon name="play.fill" size={14} tintColor={colors.light.primary[500]} />
        </View>
        <View style={styles.waveform}>
          {WAVEFORM_HEIGHTS.map((h, i) => (
            <View key={i} style={[styles.waveformBar, { height: h }]} />
          ))}
        </View>
      </View>
      <View style={styles.bubbleFooter}>
        <Text style={styles.timeTextMe}>{message.voice?.duration}</Text>
        <Text style={styles.timeTextMe}>{message.time}</Text>
        <ReadTicks status={message.status} />
      </View>
    </View>
  )
}

function LinkBubble({ message }: { message: ChatMessage }) {
  const link = message.link!
  return (
    <View style={[styles.bubble, styles.bubbleMe, styles.linkBubble]}>
      {!!link.imageUrl && <Image source={{ uri: link.imageUrl }} style={styles.linkImage} contentFit="cover" />}
      <Text style={styles.bubbleTextMe}>{link.title}</Text>
      <View style={styles.bubbleFooter}>
        <Text style={styles.linkUrl} numberOfLines={1}>
          {link.url}
        </Text>
      </View>
      <View style={styles.linkFooterRow}>
        <Text style={styles.timeTextMe}>{message.time}</Text>
        <ReadTicks status={message.status} />
        {message.status === 'sent' && <Text style={styles.sentLabel}>Sent</Text>}
      </View>
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
  },
  dividerLineDanger: {
    backgroundColor: 'rgba(239,68,68,0.3)',
  },
  dividerTextDanger: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.light.semantic.error,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  pressableWrap: {
    position: 'relative',
  },
  pinBadgeMe: {
    position: 'absolute',
    top: -6,
    left: -6,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.light.primary[600],
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
    transform: [{ rotate: '-30deg' }],
  },
  pinBadgeThem: {
    position: 'absolute',
    top: -6,
    right: -6,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.light.primary[600],
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
    transform: [{ rotate: '-30deg' }],
  },
  rowMe: {
    justifyContent: 'flex-end',
  },
  rowThem: {
    justifyContent: 'flex-start',
  },
  gutterLeft: {
    marginRight: 8,
  },
  gutterRight: {
    marginLeft: 8,
  },
  bubble: {
    maxWidth: 280,
    borderRadius: 18,
    padding: 12,
  },
  bubbleMe: {
    backgroundColor: colors.light.primary[500],
    borderBottomRightRadius: 4,
  },
  bubbleThem: {
    backgroundColor: colors.light.surface,
    borderWidth: 1,
    borderColor: colors.light.border,
    borderBottomLeftRadius: 4,
  },
  quoteBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.light.surfaceAlt,
    borderRadius: 10,
    paddingVertical: 6,
    paddingHorizontal: 8,
    marginBottom: 8,
  },
  quoteBar: {
    width: 3,
    height: 16,
    borderRadius: 2,
    backgroundColor: colors.light.primary[400],
  },
  quoteText: {
    fontSize: 13,
    color: colors.light.textMuted,
    flexShrink: 1,
  },
  bubbleTextMe: {
    fontSize: 15,
    color: colors.light.neutral.white,
    lineHeight: 21,
  },
  bubbleTextThem: {
    fontSize: 15,
    color: colors.light.text,
    lineHeight: 21,
  },
  bubbleFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 4,
    marginTop: 6,
  },
  timeTextMe: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.75)',
  },
  timeTextThem: {
    fontSize: 11,
    color: colors.light.textSoft,
  },
  callBubbleFilled: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: colors.light.semantic.success,
    borderRadius: 18,
    padding: 12,
    minWidth: 220,
  },
  callIconCircleLight: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
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
  callBubbleOutline: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: colors.light.surface,
    borderWidth: 1,
    borderColor: colors.light.border,
    borderRadius: 18,
    padding: 12,
    minWidth: 220,
  },
  callIconCircleDanger: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.light.semantic.error,
    alignItems: 'center',
    justifyContent: 'center',
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
  voiceBubble: {
    minWidth: 220,
  },
  voiceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  playButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.light.neutral.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  waveform: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  waveformBar: {
    width: 2,
    borderRadius: 1,
    backgroundColor: 'rgba(255,255,255,0.85)',
  },
  linkBubble: {
    minWidth: 240,
    borderWidth: 1.5,
    borderColor: colors.light.primary[300],
  },
  linkImage: {
    width: '100%',
    height: 120,
    borderRadius: 10,
    marginBottom: 8,
  },
  linkUrl: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    flex: 1,
  },
  linkFooterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 4,
    marginTop: 4,
  },
  sentLabel: {
    fontSize: 11,
    color: colors.light.semantic.success,
    marginLeft: 4,
  },
})
