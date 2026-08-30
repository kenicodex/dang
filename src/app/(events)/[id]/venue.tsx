import { Image } from 'expo-image'
import { Linking, Pressable, ScrollView, StyleSheet, View } from 'react-native'
import { router, useLocalSearchParams } from 'expo-router'
import { Icon } from '@/components/ui/Icon'
import type { SymbolViewProps } from 'expo-symbols'
import { SafeAreaView } from 'react-native-safe-area-context'

import { Text } from '@/components/ui/Text'
import { getEventById, ticketIdFor } from '@/components/events'
import { colors } from '@/theme/colors'
import { shadows } from '@/theme/shadows'

export default function EventVenueScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const event = getEventById(id)

  if (!event) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Text>Event not found.</Text>
      </SafeAreaView>
    )
  }

  const address = event.address ?? event.venue ?? 'Lagos, Nigeria'
  const ticketId = ticketIdFor(event.id)

  const openInMaps = () => {
    const query = encodeURIComponent(address)
    Linking.openURL(`https://maps.google.com/?q=${query}`)
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.mapCard}>
          <View style={styles.mapBg}>
            <View style={[styles.mapBlock, styles.mapBlockGreen, { top: 10, left: 20, width: 90, height: 60 }]} />
            <View style={[styles.mapBlock, styles.mapBlockTan, { top: 90, right: 30, width: 70, height: 90 }]} />
            <View style={[styles.mapBlock, styles.mapBlockBlue, { bottom: 20, left: 40, width: 110, height: 50 }]} />
            <View style={styles.mapPin}>
              <Icon name="mappin" size={26} tintColor={colors.light.primary[600]} />
            </View>
          </View>

          <Pressable style={styles.backButton} onPress={() => router.back()}>
            <Icon name="chevron.left" size={18} tintColor={colors.light.text} />
          </Pressable>

          <View style={styles.mapPill}>
            <Icon name="mappin" size={12} tintColor={colors.light.primary[600]} />
            <Text style={styles.mapPillText}>{event.venue ?? 'Lagos, Nigeria'}</Text>
          </View>

          <Pressable style={styles.openMapsButton} onPress={openInMaps}>
            <Text style={styles.openMapsButtonText}>Open in Maps</Text>
          </Pressable>
        </View>

        <View style={styles.body}>
          <View style={styles.detailGrid}>
            <DetailPill icon="mappin" label="Location" value={event.venue ?? '—'} />
            <DetailPill icon="car" label="Parking" value={event.parkingLabel ?? '—'} />
            <DetailPill icon="clock" label="Time" value={event.startTime} />
            <DetailPill icon="location" label="Transit" value={event.transitLabel ?? '—'} />
          </View>

          <View style={styles.qrCard}>
            <Text style={styles.qrTitle}>Check-In QR Code</Text>
            <View style={styles.qrRow}>
              <View style={styles.qrBox}>
                <Icon name="qrcode" size={64} tintColor={colors.light.text} />
              </View>
              <View style={styles.qrInfo}>
                <Text style={styles.qrHint}>Show this at the entrance</Text>
                <Text style={styles.qrTicketId}>Ticket ID: {ticketId}</Text>
              </View>
            </View>
          </View>

          {!!event.venuePhotos?.length && (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.photoRow}>
              {event.venuePhotos.map((uri, i) => (
                <Image key={i} source={{ uri }} style={styles.photo} contentFit="cover" />
              ))}
            </ScrollView>
          )}

          {event.organizerName && (
            <ContactRow label="Organizer" name={event.organizerName} phone={event.organizerPhone} />
          )}
          {event.emergencyContactName && (
            <ContactRow label="Emergency" name={event.emergencyContactName} phone={event.emergencyContactPhone} />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

function DetailPill({ icon, label, value }: { icon: SymbolViewProps['name']; label: string; value: string }) {
  return (
    <View style={styles.detailPill}>
      <Icon name={icon} size={14} tintColor={colors.light.primary[500]} />
      <View>
        <Text style={styles.detailLabel}>{label}</Text>
        <Text style={styles.detailValue}>{value}</Text>
      </View>
    </View>
  )
}

function ContactRow({ label, name, phone }: { label: string; name: string; phone?: string }) {
  return (
    <View style={styles.contactRow}>
      <View>
        <Text style={styles.contactLabel}>{label}</Text>
        <Text style={styles.contactName}>{name}</Text>
        {phone && <Text style={styles.contactPhone}>{phone}</Text>}
      </View>
      <Pressable style={styles.chatButton}>
        <Icon name="bubble.left.fill" size={15} tintColor={colors.light.primary[500]} />
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.light.bgAlt,
  },
  mapCard: {
    height: 260,
  },
  mapBg: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#E4E7EB',
    overflow: 'hidden',
  },
  mapBlock: {
    position: 'absolute',
    borderRadius: 8,
  },
  mapBlockGreen: {
    backgroundColor: '#C9E4CE',
  },
  mapBlockTan: {
    backgroundColor: '#E8DCC4',
  },
  mapBlockBlue: {
    backgroundColor: '#C7DCEE',
  },
  mapPin: {
    position: 'absolute',
    top: 30,
    left: '48%',
  },
  backButton: {
    position: 'absolute',
    top: 16,
    left: 16,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.light.neutral.white,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.sm,
  },
  mapPill: {
    position: 'absolute',
    top: 100,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.light.neutral.white,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    ...shadows.sm,
  },
  mapPillText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.light.text,
  },
  openMapsButton: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    backgroundColor: colors.light.primary[500],
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
  },
  openMapsButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.light.neutral.white,
  },
  body: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  detailGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 16,
  },
  detailPill: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: colors.light.surface,
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  detailLabel: {
    fontSize: 11,
    color: colors.light.textSoft,
  },
  detailValue: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.light.text,
    marginTop: 1,
  },
  qrCard: {
    backgroundColor: colors.light.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  qrTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.light.text,
    marginBottom: 12,
  },
  qrRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  qrBox: {
    width: 88,
    height: 88,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: colors.light.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qrInfo: {
    flex: 1,
  },
  qrHint: {
    fontSize: 13,
    color: colors.light.textMuted,
    marginBottom: 4,
  },
  qrTicketId: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.light.text,
  },
  photoRow: {
    marginBottom: 16,
  },
  photo: {
    width: 90,
    height: 90,
    borderRadius: 14,
    marginRight: 10,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.light.surface,
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
  },
  contactLabel: {
    fontSize: 12,
    color: colors.light.textSoft,
  },
  contactName: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.light.text,
    marginTop: 2,
  },
  contactPhone: {
    fontSize: 13,
    color: colors.light.primary[500],
    marginTop: 2,
  },
  chatButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.light.primary[50],
    alignItems: 'center',
    justifyContent: 'center',
  },
})
