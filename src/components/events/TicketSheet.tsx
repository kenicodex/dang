import { Modal, Pressable, StyleSheet, View } from 'react-native'
import { Icon } from '@/components/ui/Icon'

import { Text } from '@/components/ui/Text'
import { Button } from '@/components/ui/Button'
import { colors } from '@/theme/colors'
import { shadows } from '@/theme/shadows'
import { ticketIdFor } from './events.data'
import type { Event } from '@/types/events'

interface TicketSheetProps {
  visible: boolean
  onClose: () => void
  event: Event
  attendeeName: string
}

export function TicketSheet({ visible, onClose, event, attendeeName }: TicketSheetProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Pressable style={StyleSheet.absoluteFillObject} onPress={onClose} />
        <View style={styles.card}>
          <Text style={styles.eyebrow}>Your Ticket</Text>
          <Text variant="h3" style={styles.title}>
            {event.title}
          </Text>

          <View style={styles.qrBox}>
            <Icon name="qrcode" size={130} tintColor={colors.light.text} />
          </View>

          <View style={styles.stub}>
            <View style={styles.dashedLine} />
          </View>

          <View style={styles.detailsGrid}>
            <View style={styles.detailFull}>
              <Text style={styles.detailLabel}>Name</Text>
              <Text style={styles.detailValue}>{attendeeName}</Text>
            </View>
            <View style={styles.detailsRow}>
              <View style={styles.detailHalf}>
                <Text style={styles.detailLabel}>Date</Text>
                <Text style={styles.detailValue}>{event.date}</Text>
              </View>
              <View style={styles.detailHalf}>
                <Text style={styles.detailLabel}>Time</Text>
                <Text style={styles.detailValue}>{event.startTime}</Text>
              </View>
            </View>
            <View style={styles.detailFull}>
              <Text style={styles.detailLabel}>Location</Text>
              <Text style={styles.detailValue}>{event.isVirtual ? 'Virtual' : `${event.venue}, NG`}</Text>
            </View>
          </View>

          <Text style={styles.showAtCheckin}>Show at check-in · {ticketIdFor(event.id)}</Text>

          <Button title="Close" onPress={onClose} style={styles.closeButton} />
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: colors.light.neutral.white,
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    ...shadows.lg,
  },
  eyebrow: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: colors.light.primary[500],
    marginBottom: 6,
  },
  title: {
    textAlign: 'center',
    marginBottom: 20,
  },
  qrBox: {
    width: 170,
    height: 170,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: colors.light.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.light.surfaceAlt,
  },
  stub: {
    width: '100%',
    alignItems: 'center',
    marginVertical: 16,
  },
  dashedLine: {
    width: '100%',
    borderTopWidth: 1.5,
    borderStyle: 'dashed',
    borderTopColor: colors.light.border,
  },
  detailsGrid: {
    width: '100%',
    gap: 14,
    marginBottom: 16,
  },
  detailsRow: {
    flexDirection: 'row',
    gap: 14,
  },
  detailFull: {
    width: '100%',
  },
  detailHalf: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    color: colors.light.textSoft,
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.light.text,
  },
  showAtCheckin: {
    fontSize: 12,
    color: colors.light.textSoft,
    marginBottom: 20,
  },
  closeButton: {
    width: '100%',
    borderRadius: 999,
  },
})
