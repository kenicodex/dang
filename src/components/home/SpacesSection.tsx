import { ScrollView, StyleSheet, View } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { Icon } from '@/components/ui/Icon'
import type { SymbolViewProps } from 'expo-symbols'

import { Text } from '@/components/ui/Text'
import { colors } from '@/theme/colors'

export interface Space {
  name: string
  newPosts: number
  active: number
  icon: SymbolViewProps['name']
  gradient: [string, string]
}

interface SpacesSectionProps {
  spaces: Space[]
}

export function SpacesSection({ spaces }: SpacesSectionProps) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scroll}>
      {spaces.map(space => (
        <LinearGradient key={space.name} colors={space.gradient} style={styles.tile}>
          <View style={styles.iconBadge}>
            <Icon name={space.icon} size={18} tintColor={colors.light.neutral.white} />
          </View>
          <Text style={styles.name}>{space.name}</Text>
          <Text style={styles.posts}>{space.newPosts} new posts</Text>
          <View style={styles.activeRow}>
            <View style={styles.activeDot} />
            <Text style={styles.activeText}>{space.active} active</Text>
          </View>
        </LinearGradient>
      ))}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  scroll: {
    marginHorizontal: -20,
  },
  tile: {
    width: 150,
    marginLeft: 20,
    borderRadius: 20,
    padding: 16,
    gap: 6,
  },
  iconBadge: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  name: {
    color: colors.light.neutral.white,
    fontWeight: '700',
    fontSize: 15,
  },
  posts: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 12,
  },
  activeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 2,
  },
  activeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.light.tertiary[400],
  },
  activeText: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 11,
  },
})
