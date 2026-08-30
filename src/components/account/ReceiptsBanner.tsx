import { Pressable, StyleSheet, View } from 'react-native'
import { Icon } from '@/components/ui/Icon'

import { Text } from '@/components/ui/Text'
import { useUIStore } from '@/store'
import { colors } from '@/theme/colors'

export function ReceiptsBanner() {
  const showToast = useUIStore(s => s.showToast)

  return (
    <View style={styles.banner}>
      <Icon name="arrow.down.circle" size={18} tintColor={colors.light.primary[500]} />
      <Text style={styles.text}>All receipts are stored securely and available for download</Text>
      <Pressable onPress={() => showToast('Receipts exported.', 'success')} hitSlop={8}>
        <Text style={styles.link}>Export CSV</Text>
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: colors.light.primary[50],
    borderRadius: 16,
    padding: 14,
    marginBottom: 16,
  },
  text: {
    flex: 1,
    fontSize: 12,
    lineHeight: 16,
    color: colors.light.textMuted,
  },
  link: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.light.primary[500],
  },
})
