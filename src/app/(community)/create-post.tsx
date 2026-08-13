import { useState } from 'react'
import { Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native'
import { router } from 'expo-router'
import { SymbolView, type SymbolViewProps } from 'expo-symbols'
import { SafeAreaView } from 'react-native-safe-area-context'

import { Text } from '@/components/ui/Text'
import { AudienceSheet, ALL_SISTERS, RichTextToolbar, type TextFormat } from '@/components/community'
import { MOCK_COMMUNITIES } from '@/components/community/mockData'
import { colors } from '@/theme/colors'

const MAX_LENGTH = 1000

const FORMAT_MARKERS: Record<TextFormat, [string, string]> = {
  bold: ['**', '**'],
  italic: ['_', '_'],
  underline: ['++', '++'],
  strikethrough: ['~~', '~~'],
  bullet: ['', ''],
  numbered: ['', ''],
  link: ['[', '](url)'],
}

const PLACEHOLDER_TEXT: Partial<Record<TextFormat, string>> = {
  bold: 'bold text',
  italic: 'italic text',
  underline: 'underlined text',
  strikethrough: 'struck text',
  link: 'link text',
}

export default function CreatePostScreen() {
  const [content, setContent] = useState('')
  const [selection, setSelection] = useState({ start: 0, end: 0 })
  const [communityId, setCommunityId] = useState(MOCK_COMMUNITIES[0]?.id ?? ALL_SISTERS)
  const [audienceVisible, setAudienceVisible] = useState(false)
  const [isAnonymous, setIsAnonymous] = useState(false)

  const community = MOCK_COMMUNITIES.find(c => c.id === communityId)
  const audienceLabel = communityId === ALL_SISTERS ? 'All Sisters' : community?.name ?? 'Choose a space'
  const canPost = content.trim().length > 0

  const applyFormat = (format: TextFormat) => {
    const { start, end } = selection

    if (format === 'bullet' || format === 'numbered') {
      const lineStart = content.lastIndexOf('\n', start - 1) + 1
      const marker = format === 'bullet' ? '- ' : '1. '
      const next = content.slice(0, lineStart) + marker + content.slice(lineStart)
      setContent(next)
      const cursor = start + marker.length
      setSelection({ start: cursor, end: cursor })
      return
    }

    const [open, close] = FORMAT_MARKERS[format]
    const selected = content.slice(start, end) || PLACEHOLDER_TEXT[format] || ''
    const next = content.slice(0, start) + open + selected + close + content.slice(end)
    setContent(next)
    setSelection({ start: start + open.length, end: start + open.length + selected.length })
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.header}>
        <Pressable style={styles.iconButton} onPress={() => router.back()}>
          <SymbolView name="chevron.left" size={18} tintColor={colors.light.text} />
        </Pressable>
        <Text variant="h3">Create Post</Text>
        <Pressable
          style={[styles.postButton, !canPost && styles.postButtonDisabled]}
          disabled={!canPost}
          onPress={() => router.back()}
        >
          <Text style={styles.postButtonText}>Post</Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Pressable style={styles.audienceRow} onPress={() => setAudienceVisible(true)}>
          <Text style={styles.audienceLabel}>Posting in:</Text>
          <Text style={styles.audienceValue}>{audienceLabel}</Text>
          <SymbolView name="chevron.down" size={12} tintColor={colors.light.primary[500]} />
        </Pressable>

        <View style={styles.textBox}>
          <TextInput
            style={styles.textInput}
            value={content}
            onChangeText={setContent}
            onSelectionChange={e => setSelection(e.nativeEvent.selection)}
            placeholder="What's on your mind, sister?"
            placeholderTextColor={colors.light.textSoft}
            multiline
            maxLength={MAX_LENGTH}
          />
        </View>

        <RichTextToolbar length={content.length} maxLength={MAX_LENGTH} onFormat={applyFormat} />

        <View style={styles.iconRow}>
          <RowIconButton icon="photo" />
          <RowIconButton icon="camera" />
          <RowIconButton icon="at" onPress={() => setContent(c => `${c}@`)} />
          <RowIconButton icon="number" onPress={() => setContent(c => `${c}#`)} />
        </View>

        <Pressable style={styles.anonymousRow} onPress={() => setIsAnonymous(v => !v)}>
          <View style={styles.anonymousText}>
            <Text style={styles.anonymousTitle}>Post Anonymously</Text>
            <Text variant="caption">Your identity will remain hidden from other sisters.</Text>
          </View>
          <Toggle value={isAnonymous} onChange={setIsAnonymous} />
        </Pressable>
      </ScrollView>

      <AudienceSheet
        visible={audienceVisible}
        onClose={() => setAudienceVisible(false)}
        communities={MOCK_COMMUNITIES}
        selectedId={communityId}
        onSelect={id => {
          setCommunityId(id)
          setAudienceVisible(false)
        }}
      />
    </SafeAreaView>
  )
}

function RowIconButton({ icon, onPress }: { icon: SymbolViewProps['name']; onPress?: () => void }) {
  return (
    <Pressable style={styles.rowIconButton} onPress={onPress}>
      <SymbolView name={icon} size={18} tintColor={colors.light.textAlt} />
    </Pressable>
  )
}

function Toggle({ value, onChange }: { value: boolean; onChange: (value: boolean) => void }) {
  return (
    <Pressable
      style={[styles.toggleTrack, value && styles.toggleTrackActive]}
      onPress={() => onChange(!value)}
      hitSlop={6}
    >
      <View style={[styles.toggleThumb, value && styles.toggleThumbActive]} />
    </Pressable>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.light.bg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 12,
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.light.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  postButton: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: colors.light.primary[500],
  },
  postButtonDisabled: {
    opacity: 0.4,
  },
  postButtonText: {
    color: colors.light.neutral.white,
    fontWeight: '700',
    fontSize: 14,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    gap: 16,
  },
  audienceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  audienceLabel: {
    color: colors.light.textMuted,
    fontSize: 14,
  },
  audienceValue: {
    color: colors.light.primary[500],
    fontWeight: '700',
    fontSize: 14,
  },
  textBox: {
    borderWidth: 1.5,
    borderColor: colors.light.border,
    borderRadius: 16,
    backgroundColor: colors.light.surface,
    minHeight: 220,
  },
  textInput: {
    flex: 1,
    padding: 16,
    fontSize: 16,
    color: colors.light.text,
    textAlignVertical: 'top',
  },
  iconRow: {
    flexDirection: 'row',
    gap: 12,
  },
  rowIconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.light.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  anonymousRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: colors.light.border,
    paddingTop: 16,
    gap: 12,
  },
  anonymousText: {
    flex: 1,
    gap: 2,
  },
  anonymousTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.light.text,
  },
  toggleTrack: {
    width: 48,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.light.border,
    padding: 3,
  },
  toggleTrackActive: {
    backgroundColor: colors.light.primary[500],
  },
  toggleThumb: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.light.neutral.white,
  },
  toggleThumbActive: {
    transform: [{ translateX: 20 }],
  },
})
