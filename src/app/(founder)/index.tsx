import { useState } from 'react'
import { Pressable, ScrollView, StyleSheet, Switch, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Icon } from '@/components/ui/Icon'

import { Text } from '@/components/ui/Text'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Sheet } from '@/components/ui/Sheet'
import { ApiError } from '@/api/client'
import { useCreateSpaceMutation, useSpaces, useUpdateSpaceMutation } from '@/api/hooks/spaces.hooks'
import type { Space } from '@/api/services/spaces.service'
import { useUIStore } from '@/store'
import { colors } from '@/theme/colors'

interface SpaceFormState {
  name: string
  description: string
  category: string
  guidelines: string
  isPrivate: boolean
}

const EMPTY_FORM: SpaceFormState = {
  name: '',
  description: '',
  category: '',
  guidelines: '',
  isPrivate: false,
}

export default function FounderContentScreen() {
  const showToast = useUIStore(s => s.showToast)
  const { data: spacesPage, isLoading } = useSpaces()
  const { mutateAsync: createSpace, isPending: isCreating } = useCreateSpaceMutation()
  const { mutateAsync: updateSpace, isPending: isUpdating } = useUpdateSpaceMutation()

  const [sheetVisible, setSheetVisible] = useState(false)
  const [editingSpace, setEditingSpace] = useState<Space | null>(null)
  const [form, setForm] = useState<SpaceFormState>(EMPTY_FORM)

  const openCreateSheet = () => {
    setEditingSpace(null)
    setForm(EMPTY_FORM)
    setSheetVisible(true)
  }

  const openEditSheet = (space: Space) => {
    setEditingSpace(space)
    setForm({
      name: space.name,
      description: space.description,
      category: space.category ?? '',
      guidelines: space.guidelines ?? '',
      isPrivate: space.isPrivate,
    })
    setSheetVisible(true)
  }

  const handleSubmit = async () => {
    const input = {
      name: form.name.trim(),
      description: form.description.trim(),
      category: form.category.trim() || undefined,
      guidelines: form.guidelines.trim() || undefined,
      isPrivate: form.isPrivate,
      type: 'CHANNEL',
    }
    try {
      if (editingSpace) {
        await updateSpace({ id: editingSpace.id, input })
      } else {
        await createSpace(input)
      }
      setSheetVisible(false)
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Could not save this space. Please try again.'
      showToast(message, 'error')
    }
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.header}>
        <Text variant="h3" style={styles.title}>
          Manage Spaces
        </Text>
        <Pressable style={styles.addButton} onPress={openCreateSheet} hitSlop={8}>
          <Icon name="plus" size={18} tintColor={colors.light.neutral.white} />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {isLoading && <Text style={styles.empty}>Loading spaces…</Text>}
        {!isLoading && (spacesPage?.items.length ?? 0) === 0 && (
          <Text style={styles.empty}>No spaces yet. Create the first one.</Text>
        )}
        {spacesPage?.items.map(space => (
          <Pressable key={space.id} style={styles.row} onPress={() => openEditSheet(space)}>
            <View style={styles.rowText}>
              <Text style={styles.rowTitle}>{space.name}</Text>
              <Text style={styles.rowSubtitle}>
                {space.category ?? 'Uncategorized'} · {space.isPrivate ? 'Private' : 'Public'} · {space.memberCount}{' '}
                members
              </Text>
            </View>
            <Icon name="chevron.right" size={14} tintColor={colors.light.textSoft} />
          </Pressable>
        ))}
      </ScrollView>

      <Sheet visible={sheetVisible} onClose={() => setSheetVisible(false)} title={editingSpace ? 'Edit Space' : 'Create Space'}>
        <Input
          label="Name"
          required
          value={form.name}
          onChangeText={name => setForm(f => ({ ...f, name }))}
          containerStyle={styles.field}
        />
        <Input
          label="Description"
          required
          value={form.description}
          onChangeText={description => setForm(f => ({ ...f, description }))}
          containerStyle={styles.field}
        />
        <Input
          label="Category"
          value={form.category}
          onChangeText={category => setForm(f => ({ ...f, category }))}
          containerStyle={styles.field}
        />
        <Input
          label="Guidelines"
          value={form.guidelines}
          onChangeText={guidelines => setForm(f => ({ ...f, guidelines }))}
          containerStyle={styles.field}
        />
        <View style={styles.switchRow}>
          <Text style={styles.switchLabel}>Private (requires application to join)</Text>
          <Switch
            value={form.isPrivate}
            onValueChange={isPrivate => setForm(f => ({ ...f, isPrivate }))}
          />
        </View>
        <Button
          title={editingSpace ? 'Save Changes' : 'Create Space'}
          disabled={!form.name.trim() || !form.description.trim()}
          loading={isCreating || isUpdating}
          style={styles.submit}
          onPress={handleSubmit}
        />
      </Sheet>
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
  title: {
    fontSize: 18,
  },
  addButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.light.primary[500],
    alignItems: 'center',
    justifyContent: 'center',
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
  field: {
    marginBottom: 14,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  switchLabel: {
    flex: 1,
    fontSize: 14,
    color: colors.light.textAlt,
    marginRight: 12,
  },
  submit: {
    marginBottom: 8,
  },
})
