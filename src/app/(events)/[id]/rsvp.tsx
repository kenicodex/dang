import { useState } from 'react'
import { Image } from 'expo-image'
import { router, useLocalSearchParams } from 'expo-router'
import { Icon } from '@/components/ui/Icon'
import { Pressable, ScrollView, StyleSheet, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { LinearGradient } from 'expo-linear-gradient'

import { Text } from '@/components/ui/Text'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { ActionSheet } from '@/components/ui/ActionSheet'
import { getEventById, seatsUrgent, formatNaira } from '@/components/events'
import { useEventsStore, useUIStore } from '@/store'
import { colors } from '@/theme/colors'
import { shadows } from '@/theme/shadows'

type RSVPStep = 'details' | 'payment' | 'confirmation' | 'success'

const DISABILITY_OPTIONS = [
  'None',
  'Mobility access needed',
  'Visual or hearing support needed',
  'Dietary restriction',
  'Prefer not to say',
]

const COUPON_CODE = 'WOMEN10'

export default function EventRSVPScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const event = getEventById(id)
  const rsvp = useEventsStore(s => s.rsvp)
  const showToast = useUIStore(s => s.showToast)

  const [step, setStep] = useState<RSVPStep>('details')
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [disability, setDisability] = useState('')
  const [optionsVisible, setOptionsVisible] = useState(false)
  const [cardNumber, setCardNumber] = useState('')
  const [expiry, setExpiry] = useState('')
  const [cvv, setCvv] = useState('')
  const [couponCode, setCouponCode] = useState('')
  const [couponApplied, setCouponApplied] = useState(false)

  if (!event) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Text>Event not found.</Text>
      </SafeAreaView>
    )
  }

  const isPaid = !!event.priceAmount && event.priceAmount > 0
  const steps: { key: RSVPStep; label: string }[] = isPaid
    ? [
        { key: 'details', label: 'Details' },
        { key: 'payment', label: 'Payment' },
        { key: 'confirmation', label: 'Confirmation' },
      ]
    : [
        { key: 'details', label: 'Details' },
        { key: 'confirmation', label: 'Confirmation' },
      ]
  const stepIndex = steps.findIndex(s => s.key === step)
  const urgent = seatsUrgent(event)

  const ticketPrice = event.priceAmount ?? 0
  const processingFee = event.processingFee ?? 0
  const discount = couponApplied ? Math.round(ticketPrice * 0.1) : 0
  const total = ticketPrice + processingFee - discount

  const capacity = event.capacity ?? 0
  const remaining = event.seatsRemaining ?? 0
  const progress = capacity > 0 ? Math.min(1, remaining / capacity) : 0
  const canConfirm = fullName.trim().length > 0 && email.trim().length > 0
  const canPay = cardNumber.trim().length > 0 && expiry.trim().length > 0 && cvv.trim().length > 0

  const goBack = () => {
    if (step === 'payment') setStep('details')
    else if (step === 'confirmation') setStep(isPaid ? 'payment' : 'details')
    else router.back()
  }

  if (step === 'success') {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        <View style={styles.topBar}>
          <Pressable style={styles.circleButton} onPress={() => router.back()}>
            <Icon name="chevron.left" size={18} tintColor={colors.light.text} />
          </Pressable>
          <View style={styles.circleButton}>
            <Icon name="ellipsis" size={16} tintColor={colors.light.text} />
          </View>
        </View>

        <View style={styles.successBody}>
          <View style={styles.successIcon}>
            <Icon name="checkmark" size={30} tintColor={colors.light.semantic.success} weight="bold" />
          </View>
          <Text variant="h2" style={styles.successTitle}>
            You&rsquo;re Registered!
          </Text>
          <Text style={styles.successSubtitle}>
            {event.title}
            {'\n'}
            {event.date} · {event.startTime}
          </Text>
        </View>

        <View style={styles.successFooter}>
          <LinearGradient
            colors={[colors.light.primary[500], colors.light.primary[700]]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.calendarGradient}
          >
            <Button
              title="Add to Calendar"
              onPress={() => showToast('Added to your calendar.', 'success')}
              style={styles.calendarButton}
            />
          </LinearGradient>

          <View style={styles.successActionsRow}>
            <Pressable
              style={styles.successActionButton}
              onPress={() => showToast('Invite link ready to share.', 'info')}
            >
              <Icon name="person.badge.plus" size={15} tintColor={colors.light.text} />
              <Text style={styles.successActionText}>Invite Friends</Text>
            </Pressable>
            <Pressable
              style={styles.successActionButton}
              onPress={() => showToast('Invite shared.', 'info')}
            >
              <Icon name="square.and.arrow.up" size={15} tintColor={colors.light.text} />
              <Text style={styles.successActionText}>Share Invite</Text>
            </Pressable>
          </View>

          <Pressable style={styles.returnLink} onPress={() => router.push('/(events)')}>
            <Text style={styles.returnLinkText}>Return Home</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <View style={styles.topBar}>
        <Pressable style={styles.circleButton} onPress={goBack}>
          <Icon name="chevron.left" size={18} tintColor={colors.light.text} />
        </Pressable>
        <View style={styles.circleButton}>
          <Icon name="ellipsis" size={16} tintColor={colors.light.text} />
        </View>
      </View>

      <View style={styles.stepperRow}>
        {steps.map((s, i) => {
          const done = i < stepIndex
          const current = i === stepIndex
          return (
            <View key={s.key} style={styles.stepGroup}>
              <View style={styles.stepNode}>
                <View style={[styles.stepCircle, (done || current) && styles.stepCircleDone]}>
                  {done || current ? (
                    <Icon name="checkmark" size={12} tintColor={colors.light.neutral.white} weight="bold" />
                  ) : (
                    <Text style={styles.stepPendingText}>{String(i + 1).padStart(2, '0')}</Text>
                  )}
                </View>
                <Text style={done || current ? styles.stepLabelActive : styles.stepLabelPending}>{s.label}</Text>
              </View>
              {i < steps.length - 1 && <View style={styles.stepLine} />}
            </View>
          )
        })}
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.summaryCard}>
          <Image source={{ uri: event.coverUrl }} style={styles.summaryImage} contentFit="cover" />
          <View style={styles.summaryInfo}>
            <Text style={styles.summaryTitle} numberOfLines={2}>
              {event.title}
            </Text>
            <View style={styles.summaryDateRow}>
              <Icon name="calendar" size={12} tintColor={colors.light.primary[500]} />
              <Text style={styles.summaryDate}>
                {event.date} · {event.time}
              </Text>
            </View>
            <Text style={[styles.summaryPrice, event.priceLabel === 'Free' && styles.summaryPriceFree]}>
              {event.priceLabel ?? 'Free'}
            </Text>
          </View>
        </View>

        {capacity > 0 && (
          <View style={[styles.seatsCard, urgent && styles.seatsCardUrgent]}>
            <View style={styles.seatsRow}>
              <Icon
                name="person.2.fill"
                size={14}
                tintColor={urgent ? colors.light.semantic.error : colors.light.semantic.success}
              />
              <Text style={[styles.seatsLabel, urgent && styles.seatsLabelUrgent]}>{remaining} seats remaining</Text>
            </View>
            <View style={styles.seatsBarRow}>
              <View style={[styles.seatsBarTrack, urgent && styles.seatsBarTrackUrgent]}>
                <View style={[styles.seatsBarFill, urgent && styles.seatsBarFillUrgent, { width: `${progress * 100}%` }]} />
              </View>
              <Text style={styles.seatsTotal}>{capacity}</Text>
            </View>
          </View>
        )}

        {step === 'details' ? (
          <>
            <Text variant="label" style={styles.sectionLabel}>
              Secure your attendance
            </Text>

            <Input
              label="Full Name"
              placeholder="e.g. Sarah Johnatan"
              value={fullName}
              onChangeText={setFullName}
              containerStyle={styles.field}
            />
            <Input
              label="Email Address"
              placeholder="e.g. sarah@techher.org"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
              containerStyle={styles.field}
            />

            <Text style={styles.fieldLabel}>Do you have any disabilities?</Text>
            <Pressable style={styles.selectField} onPress={() => setOptionsVisible(true)}>
              <Text style={[styles.selectFieldText, !disability && styles.selectFieldPlaceholder]}>
                {disability || 'Select an option'}
              </Text>
              <Icon name="chevron.down" size={14} tintColor={colors.light.textSoft} />
            </Pressable>
          </>
        ) : step === 'payment' ? (
          <>
            <Text variant="h3" style={styles.paymentSectionTitle}>
              Make Payment
            </Text>

            <View style={styles.paymentCard}>
              <View style={styles.paymentFieldLabelRow}>
                <Icon name="creditcard" size={14} tintColor={colors.light.textMuted} />
                <Text style={styles.paymentFieldLabel}>Card Number</Text>
              </View>
              <Input
                placeholder="1234 5678 9012 3456"
                keyboardType="number-pad"
                value={cardNumber}
                onChangeText={setCardNumber}
                containerStyle={styles.field}
              />
              <View style={styles.row}>
                <Input
                  placeholder="MM / YY"
                  value={expiry}
                  onChangeText={setExpiry}
                  containerStyle={styles.rowField}
                />
                <Input
                  placeholder="CVV"
                  keyboardType="number-pad"
                  secureTextEntry
                  value={cvv}
                  onChangeText={setCvv}
                  containerStyle={styles.rowField}
                />
              </View>
            </View>

            <View style={styles.paymentCard}>
              <View style={styles.paymentFieldLabelRow}>
                <Icon name="tag" size={14} tintColor={colors.light.textMuted} />
                <Text style={styles.paymentFieldLabel}>Coupon Code (Optional)</Text>
              </View>
              <View style={styles.couponRow}>
                <Input
                  placeholder="Enter code..."
                  autoCapitalize="characters"
                  value={couponCode}
                  onChangeText={setCouponCode}
                  containerStyle={styles.couponInput}
                />
                <Pressable
                  style={styles.applyButton}
                  onPress={() => {
                    if (couponCode.trim().toUpperCase() === COUPON_CODE) {
                      setCouponApplied(true)
                      showToast('Coupon applied — 10% off.', 'success')
                    } else {
                      showToast('Invalid coupon code.', 'error')
                    }
                  }}
                >
                  <Text style={styles.applyButtonText}>Apply</Text>
                </Pressable>
              </View>
            </View>

            <View style={styles.priceBreakdownCard}>
              <View style={styles.priceRow}>
                <Text style={styles.priceRowLabel}>Event ticket</Text>
                <Text style={styles.priceRowValue}>{formatNaira(ticketPrice)}</Text>
              </View>
              <View style={styles.priceRow}>
                <Text style={styles.priceRowLabel}>Processing fee</Text>
                <Text style={styles.priceRowValue}>{formatNaira(processingFee)}</Text>
              </View>
              {couponApplied && (
                <View style={styles.priceRow}>
                  <Text style={styles.priceRowLabel}>Coupon ({COUPON_CODE})</Text>
                  <Text style={styles.discountValue}>-{formatNaira(discount)}</Text>
                </View>
              )}
              <View style={styles.priceDivider} />
              <View style={styles.priceRow}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalValue}>{formatNaira(total)}</Text>
              </View>
            </View>
          </>
        ) : (
          <View style={styles.confirmSection}>
            <View style={styles.confirmIcon}>
              <Icon name="checkmark" size={26} tintColor={colors.light.semantic.success} weight="bold" />
            </View>
            <Text variant="h3" style={styles.confirmTitle}>
              All set!
            </Text>
            <Text style={styles.confirmSubtitle}>Review your details and confirm your spot.</Text>

            <View style={styles.detailRowsCard}>
              <DetailRow label="Event" value={event.title} />
              <DetailRow label="Date" value={`${event.date} at ${event.startTime}`} />
              <DetailRow label="Location" value={event.isVirtual ? 'Virtual' : `${event.venue}, Nigeria`} />
              <DetailRow label="Type" value={event.isVirtual ? 'Virtual' : 'In Person'} />
              <DetailRow label="Price" value={isPaid ? formatNaira(total) : event.priceLabel ?? 'Free'} />
            </View>
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        {step === 'details' ? (
          <>
            <Button
              title="Confirm Attendance"
              disabled={!canConfirm}
              onPress={() => setStep(isPaid ? 'payment' : 'confirmation')}
              style={styles.footerButton}
            />
            <Text style={styles.footerHint}>A calendar invite &amp; entry QR code will be sent to your email.</Text>
          </>
        ) : step === 'payment' ? (
          <>
            <Button
              title={`Pay ${formatNaira(total)}`}
              disabled={!canPay}
              onPress={() => setStep('confirmation')}
              style={styles.footerButton}
            />
            <Text style={styles.footerHint}>A calendar invite &amp; entry QR code will be sent to your email.</Text>
          </>
        ) : (
          <Button
            title="Confirm Registration"
            onPress={() => {
              rsvp(event.id)
              setStep('success')
            }}
            style={styles.footerButton}
          />
        )}
      </View>

      <ActionSheet
        visible={optionsVisible}
        onClose={() => setOptionsVisible(false)}
        actions={DISABILITY_OPTIONS.map(option => ({ label: option, onPress: () => setDisability(option) }))}
      />
    </SafeAreaView>
  )
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.detailRow}>
      <Text style={styles.detailRowLabel}>{label}</Text>
      <Text style={styles.detailRowValue} numberOfLines={1}>
        {value}
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.light.bgAlt,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  circleButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.light.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingTop: 20,
    paddingBottom: 8,
  },
  stepGroup: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  stepNode: {
    alignItems: 'center',
    gap: 6,
    width: 78,
  },
  stepCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepCircleDone: {
    backgroundColor: colors.light.primary[500],
  },
  stepCirclePending: {
    backgroundColor: colors.light.surface,
    borderWidth: 1.5,
    borderColor: colors.light.border,
  },
  stepPendingText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.light.textSoft,
  },
  stepLabelActive: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.light.primary[600],
  },
  stepLabelPending: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.light.textSoft,
  },
  stepLine: {
    width: 32,
    height: 1.5,
    backgroundColor: colors.light.border,
    marginTop: 13,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 40,
  },
  summaryCard: {
    flexDirection: 'row',
    backgroundColor: colors.light.surface,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    ...shadows.sm,
  },
  summaryImage: {
    width: 64,
    height: 64,
  },
  summaryInfo: {
    flex: 1,
    padding: 12,
    justifyContent: 'center',
    gap: 4,
  },
  summaryTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.light.text,
  },
  summaryDateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  summaryDate: {
    fontSize: 12,
    color: colors.light.textMuted,
  },
  summaryPrice: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.light.text,
  },
  summaryPriceFree: {
    color: colors.light.semantic.success,
  },
  seatsCard: {
    backgroundColor: colors.light.semantic.successBg,
    borderRadius: 16,
    padding: 14,
    marginBottom: 20,
  },
  seatsCardUrgent: {
    backgroundColor: colors.light.semantic.errorBg,
  },
  seatsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  seatsLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.light.semantic.success,
  },
  seatsLabelUrgent: {
    color: colors.light.semantic.error,
  },
  seatsBarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  seatsBarTrack: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(16,185,129,0.2)',
    overflow: 'hidden',
  },
  seatsBarTrackUrgent: {
    backgroundColor: 'rgba(239,68,68,0.15)',
  },
  seatsBarFill: {
    height: '100%',
    backgroundColor: colors.light.semantic.success,
    borderRadius: 3,
  },
  seatsBarFillUrgent: {
    backgroundColor: colors.light.semantic.error,
  },
  seatsTotal: {
    fontSize: 12,
    color: colors.light.textMuted,
  },
  sectionLabel: {
    marginBottom: 12,
  },
  field: {
    marginBottom: 14,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.light.textAlt,
    marginBottom: 8,
  },
  selectField: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1.5,
    borderColor: colors.light.border,
    borderRadius: 16,
    backgroundColor: colors.light.surface,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  selectFieldText: {
    fontSize: 15,
    color: colors.light.text,
  },
  selectFieldPlaceholder: {
    color: colors.light.textSoft,
  },
  paymentSectionTitle: {
    marginBottom: 14,
  },
  paymentCard: {
    backgroundColor: colors.light.surface,
    borderRadius: 16,
    padding: 14,
    marginBottom: 14,
  },
  paymentFieldLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 10,
  },
  paymentFieldLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.light.textAlt,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  rowField: {
    flex: 1,
  },
  couponRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  couponInput: {
    flex: 1,
  },
  applyButton: {
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderRadius: 16,
    backgroundColor: colors.light.primary[100],
  },
  applyButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.light.primary[600],
  },
  priceBreakdownCard: {
    backgroundColor: colors.light.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 8,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  priceRowLabel: {
    fontSize: 13,
    color: colors.light.textMuted,
  },
  priceRowValue: {
    fontSize: 13,
    color: colors.light.textAlt,
  },
  discountValue: {
    fontSize: 13,
    color: colors.light.semantic.success,
    fontWeight: '600',
  },
  priceDivider: {
    height: 1,
    backgroundColor: colors.light.border,
    marginVertical: 6,
  },
  totalLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.light.text,
  },
  totalValue: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.light.text,
  },
  confirmSection: {
    alignItems: 'center',
    paddingTop: 8,
  },
  confirmIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.light.semantic.successBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  confirmTitle: {
    marginBottom: 4,
  },
  confirmSubtitle: {
    fontSize: 13,
    color: colors.light.textMuted,
    marginBottom: 24,
  },
  detailRowsCard: {
    width: '100%',
    gap: 10,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.light.surface,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  detailRowLabel: {
    fontSize: 13,
    color: colors.light.textMuted,
  },
  detailRowValue: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.light.text,
    flexShrink: 1,
    marginLeft: 12,
    textAlign: 'right',
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
  },
  footerButton: {
    borderRadius: 999,
  },
  footerHint: {
    fontSize: 12,
    color: colors.light.textSoft,
    textAlign: 'center',
    marginTop: 10,
  },
  successBody: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  successIcon: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: colors.light.semantic.successBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  successTitle: {
    marginBottom: 8,
  },
  successSubtitle: {
    fontSize: 14,
    color: colors.light.textMuted,
    textAlign: 'center',
    lineHeight: 20,
  },
  successFooter: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  calendarGradient: {
    borderRadius: 999,
    marginBottom: 12,
  },
  calendarButton: {
    backgroundColor: 'transparent',
    borderRadius: 999,
  },
  successActionsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  successActionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.light.surface,
    borderRadius: 999,
    paddingVertical: 14,
  },
  successActionText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.light.text,
  },
  returnLink: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  returnLinkText: {
    fontSize: 14,
    color: colors.light.textMuted,
  },
})
