import React from 'react'
import { Modal, Pressable, StyleSheet, View } from 'react-native'
import { Image } from 'expo-image'
import { LinearGradient } from 'expo-linear-gradient'
import { Icon } from '@/components/ui/Icon'
import type { SymbolViewProps } from 'expo-symbols'
import { useRouter } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { Avatar } from '@/components/ui/Avatar'
import { Text } from '@/components/ui/Text'
import { colors } from '@/theme/colors'

interface DrawerItem {
  icon: SymbolViewProps['name']
  label: string
  route?: string
}

const MENU_ITEMS: DrawerItem[] = [
  { icon: 'person', label: 'Profile', route: '/(account)/profile' },
  { icon: 'circle.grid.3x3', label: 'Private Circles', route: '/(circles)' },
  { icon: 'globe', label: 'Sisters Near You', route: '/(community)/sisters' },
  { icon: 'book', label: 'Learning Hub', route: '/(learning)' },
  { icon: 'bag', label: 'Dang Lifestyle', route: '/home/lifestyle' },
  { icon: 'clock.arrow.circlepath', label: 'History', route: '/(account)/history' },
  { icon: 'chart.bar.fill', label: 'Leaderboard', route: '/(account)/leaderboard' },
]

const SUPPORT_ITEMS: DrawerItem[] = [
  { icon: 'headphones', label: 'Help & Support', route: '/(account)/help' },
  { icon: 'gearshape', label: 'Settings', route: '/(account)/settings' },
]

interface SideDrawerProps {
  visible: boolean
  onClose: () => void
  name: string
  avatarUri?: string
  avatarInitials?: string
}

export function SideDrawer({ visible, onClose, name, avatarUri, avatarInitials }: SideDrawerProps) {
  const router = useRouter()
  const insets = useSafeAreaInsets()

  const handlePress = (item: DrawerItem) => {
    onClose()
    if (item.route) router.push(item.route as Parameters<typeof router.push>[0])
  }

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <LinearGradient
          colors={['#6660E0', '#817CE6']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.panel}
        >
          <View
            style={[
              styles.panelContent,
              { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 20 },
            ]}
          >
            <View style={styles.profileRow}>
              <Avatar uri={avatarUri} initials={avatarInitials} size="lg" />
              <Text style={styles.name}>{name}</Text>
            </View>

            <View style={styles.menu}>
              {MENU_ITEMS.map(item => (
                <Pressable key={item.label} style={styles.menuItem} onPress={() => handlePress(item)}>
                  <Icon name={item.icon} size={20} tintColor={colors.light.neutral.white} />
                  <Text style={styles.menuLabel}>{item.label}</Text>
                </Pressable>
              ))}
            </View>

            <View style={styles.divider} />

            <View style={styles.menu}>
              {SUPPORT_ITEMS.map(item => (
                <Pressable key={item.label} style={styles.menuItem} onPress={() => handlePress(item)}>
                  <Icon name={item.icon} size={20} tintColor={colors.light.neutral.white} />
                  <Text style={styles.menuLabel}>{item.label}</Text>
                </Pressable>
              ))}
            </View>

            <View style={styles.footer}>
              <Image
                source={require('@/assets/images/dang-logo-white.svg')}
                contentFit="contain"
                style={styles.logo}
              />
            </View>
          </View>
        </LinearGradient>

        <Pressable style={styles.backdrop} onPress={onClose} />
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    flexDirection: 'row',
  },
  panel: {
    width: '78%',
    maxWidth: 320,
  },
  panelContent: {
    flex: 1,
    paddingHorizontal: 24,
  },
  profileRow: {
    gap: 12,
    marginBottom: 28,
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.light.neutral.white,
  },
  menu: {
    gap: 4,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingVertical: 12,
  },
  menuLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.light.neutral.white,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.2)',
    marginVertical: 12,
  },
  footer: {
    marginTop: 'auto',
    alignItems: 'flex-start',
    paddingBottom: 12,
  },
  logo: {
    width: 100,
    height: 36,
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
})
