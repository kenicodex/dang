import React, { useState } from 'react'
import { View, StyleSheet, Pressable } from 'react-native'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Text } from '@/components/ui/Text'
import { Avatar } from '@/components/ui/Avatar'
import { colors } from '@/theme/colors'

interface PostComposerProps {
  onSubmit?: (content: string, isAnonymous: boolean) => void
  placeholder?: string
  userAvatar?: string
  userInitials?: string
}

export function PostComposer({
  onSubmit,
  placeholder = 'Share your thoughts with the community...',
  userAvatar,
  userInitials = 'ME',
}: PostComposerProps) {
  const [content, setContent] = useState('')
  const [isAnonymous, setIsAnonymous] = useState(false)

  const canSubmit = content.trim().length > 0

  return (
    <Card style={styles.container}>
      <View style={styles.row}>
        <Avatar uri={userAvatar} initials={userInitials} size="md" />
        <View style={styles.inputWrap}>
          <Input
            value={content}
            onChangeText={setContent}
            placeholder={placeholder}
            multiline
            numberOfLines={3}
          />
        </View>
      </View>
      <View style={styles.footer}>
        <AnonymousToggle value={isAnonymous} onChange={setIsAnonymous} />
        <Button
          title="Post"
          size="sm"
          disabled={!canSubmit}
          onPress={() => {
            if (canSubmit) {
              onSubmit?.(content.trim(), isAnonymous)
              setContent('')
            }
          }}
        />
      </View>
    </Card>
  )
}

interface AnonymousToggleProps {
  value: boolean
  onChange: (value: boolean) => void
}

export function AnonymousToggle({ value, onChange }: AnonymousToggleProps) {
  return (
    <Pressable
      style={[styles.toggle, value && styles.toggleActive]}
      onPress={() => onChange(!value)}
    >
      <Text variant="caption" style={value ? styles.toggleActiveText : styles.toggleText}>
        🎭 Post {value ? 'Anonymously' : 'as Myself'}
      </Text>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 12,
  },
  row: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10,
  },
  inputWrap: {
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  toggle: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: colors.light.surfaceAlt,
  },
  toggleActive: {
    backgroundColor: colors.light.primary[500],
  },
  toggleText: {
    color: colors.light.textAlt,
  },
  toggleActiveText: {
    color: colors.light.neutral.white,
  },
})
