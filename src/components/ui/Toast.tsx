import { View, Text, StyleSheet, Dimensions, Platform } from 'react-native'

import { useUIStore } from '@/store/useUIStore'

export function ToastHost() {
  const toasts = useUIStore(s => s.toasts)

  return (
    <View style={styles.container} pointerEvents="none">
      {toasts.map(toast => (
        <View key={toast.id} style={[styles.toast, styles[`type_${toast.type}`]]}>
          <Text style={styles.toastText}>{toast.message}</Text>
        </View>
      ))}
    </View>
  )
}

const { width: SCREEN_WIDTH } = Dimensions.get('window')

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 100,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 9999,
  },
  toast: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 8,
    width: SCREEN_WIDTH - 32,
    ...Platform.select({
      web: {
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      },
      default: {
        shadowColor: '#000',
        shadowOpacity: 0.15,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
        elevation: 8,
      },
    }),
  },
  type_success: {
    backgroundColor: '#10B981',
  },
  type_error: {
    backgroundColor: '#EF4444',
  },
  type_info: {
    backgroundColor: '#3B82F6',
  },
  type_warning: {
    backgroundColor: '#F59E0B',
  },
  toastText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
})
