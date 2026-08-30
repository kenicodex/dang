import React, { useRef, useState } from 'react'
import { Pressable, StyleSheet, TextInput, View } from 'react-native'
import { Icon } from '@/components/ui/Icon'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { Text } from '@/components/ui/Text'
import { Avatar } from '@/components/ui/Avatar'
import { GlassView } from '@/components/ui/GlassView'
import { colors } from '@/theme/colors'

interface ReplyComposerBarProps {
  replyingToName?: string
  onCancelReplyTo?: () => void
  onSubmit: (content: string) => void
  userAvatarUri?: string
  userInitials?: string
}

export function ReplyComposerBar({
  replyingToName,
  onCancelReplyTo,
  onSubmit,
  userAvatarUri,
  userInitials = 'ME',
}: ReplyComposerBarProps) {
  const [content, setContent] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  const inputRef = useRef<TextInput>(null)
  const insets = useSafeAreaInsets()

  const expanded = isFocused || content.length > 0 || !!replyingToName
  const canSubmit = content.trim().length > 0

  const submit = () => {
    if (!canSubmit) return
    onSubmit(content.trim())
    setContent('')
    inputRef.current?.blur()
  }

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom + 10 }]}>
      {expanded && replyingToName && (
        <View style={styles.replyingRow}>
          <Text variant="caption">
            Replying to <Text style={styles.replyingName}>{replyingToName}</Text>
          </Text>
          <Pressable hitSlop={8} onPress={onCancelReplyTo}>
            <Icon name="xmark" size={12} tintColor={colors.light.textSoft} />
          </Pressable>
        </View>
      )}

      <View style={styles.inputRow}>
        <Avatar uri={userAvatarUri} initials={userInitials} size="sm" />
        <GlassView
          style={styles.fieldWrap}
          radius="2xl"
          glassEffectStyle="clear"
          tintColor={colors.light.surfaceAlt}
        >
          <Pressable onPress={() => inputRef.current?.focus()}>
            <TextInput
              ref={inputRef}
              style={styles.input}
              value={content}
              onChangeText={setContent}
              placeholder="Join the conversation"
              placeholderTextColor={colors.light.textSoft}
              multiline
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
            />
          </Pressable>
        </GlassView>
        {!expanded && (
          <Pressable hitSlop={8} onPress={() => inputRef.current?.focus()}>
            <Icon name="paperplane" size={20} tintColor={colors.light.textSoft} />
          </Pressable>
        )}
      </View>

      {expanded && (
        <View style={styles.toolRow}>
          <View style={styles.toolIcons}>
            <Pressable hitSlop={6}>
              <Icon name="photo" size={18} tintColor={colors.light.textAlt} />
            </Pressable>
            <Pressable hitSlop={6}>
              <Icon name="camera" size={18} tintColor={colors.light.textAlt} />
            </Pressable>
            <Pressable hitSlop={6} onPress={() => setContent(c => `${c}@`)}>
              <Icon name="at" size={18} tintColor={colors.light.textAlt} />
            </Pressable>
          </View>
          <Pressable
            style={[styles.replyButton, !canSubmit && styles.replyButtonDisabled]}
            disabled={!canSubmit}
            onPress={submit}
          >
            <Text style={styles.replyButtonText}>Reply</Text>
          </Pressable>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    borderTopWidth: 1,
    borderTopColor: colors.light.border,
    backgroundColor: colors.light.bg,
    paddingHorizontal: 16,
    paddingTop: 10,
    gap: 10,
  },
  replyingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  replyingName: {
    color: colors.light.primary[600],
    fontWeight: '700',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  fieldWrap: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 10,
    maxHeight: 100,
  },
  input: {
    fontSize: 15,
    color: colors.light.text,
    padding: 0,
  },
  toolRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  toolIcons: {
    flexDirection: 'row',
    gap: 16,
  },
  replyButton: {
    backgroundColor: colors.light.primary[500],
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 999,
  },
  replyButtonDisabled: {
    opacity: 0.4,
  },
  replyButtonText: {
    color: colors.light.neutral.white,
    fontWeight: '700',
    fontSize: 14,
  },
})
