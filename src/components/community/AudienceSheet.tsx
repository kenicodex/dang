import type { ReactNode } from 'react'
import { Image, Pressable, ScrollView, StyleSheet, View } from 'react-native'
import { Icon } from '@/components/ui/Icon'

import { Sheet } from '@/components/ui/Sheet'
import { Text } from '@/components/ui/Text'
import { colors } from '@/theme/colors'
import type { Circle } from '@/types/circles'

export const ALL_SISTERS = 'all-sisters'

interface AudienceSheetProps {
  visible: boolean
  onClose: () => void
  communities: Circle[]
  selectedId: string
  onSelect: (id: string) => void
}

export function AudienceSheet({ visible, onClose, communities, selectedId, onSelect }: AudienceSheetProps) {
  return (
    <Sheet visible={visible} onClose={onClose} title="Choose audience">
      <AudienceRow
        selected={selectedId === ALL_SISTERS}
        onPress={() => onSelect(ALL_SISTERS)}
        icon={
          <View style={styles.allSistersIcon}>
            <Icon name="person.2.fill" size={18} tintColor={colors.light.primary[500]} />
          </View>
        }
        title="All Sisters"
      />

      <Text style={styles.sectionLabel}>My Communities</Text>
      <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
        {communities.map(community => (
          <AudienceRow
            key={community.id}
            selected={selectedId === community.id}
            onPress={() => onSelect(community.id)}
            icon={
              community.coverUrl ? (
                <Image source={{ uri: community.coverUrl }} style={styles.cover} />
              ) : (
                <View style={styles.coverFallback}>
                  <Text style={styles.coverEmoji}>{community.emoji || '👥'}</Text>
                </View>
              )
            }
            title={community.name}
            subtitle={[`${community.memberCount.toLocaleString()} members`, community.category]
              .filter(Boolean)
              .join(', ')}
          />
        ))}
      </ScrollView>
    </Sheet>
  )
}

interface AudienceRowProps {
  icon: ReactNode
  title: string
  subtitle?: string
  selected: boolean
  onPress: () => void
}

function AudienceRow({ icon, title, subtitle, selected, onPress }: AudienceRowProps) {
  return (
    <Pressable style={styles.row} onPress={onPress}>
      {icon}
      <View style={styles.rowText}>
        <Text style={styles.rowTitle}>{title}</Text>
        {subtitle && <Text variant="caption">{subtitle}</Text>}
      </View>
      <View style={[styles.radio, selected && styles.radioSelected]}>
        {selected && <View style={styles.radioDot} />}
      </View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
  },
  rowText: {
    flex: 1,
  },
  rowTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.light.text,
  },
  allSistersIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.light.primary[50],
    alignItems: 'center',
    justifyContent: 'center',
  },
  cover: {
    width: 44,
    height: 44,
    borderRadius: 12,
  },
  coverFallback: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.light.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  coverEmoji: {
    fontSize: 20,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.light.textMuted,
    marginTop: 12,
    marginBottom: 4,
  },
  list: {
    maxHeight: 320,
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: colors.light.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioSelected: {
    borderColor: colors.light.primary[500],
  },
  radioDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.light.primary[500],
  },
})
