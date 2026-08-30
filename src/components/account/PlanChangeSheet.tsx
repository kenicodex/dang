import { useState } from 'react'
import { Pressable, ScrollView, StyleSheet, Switch, View } from 'react-native'

import { Text } from '@/components/ui/Text'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Sheet } from '@/components/ui/Sheet'
import { Badge } from '@/components/ui/Badge'
import { CURRENT_PLAN, WALLET_PAYMENT_METHODS, formatNaira, formatPlanDate, type PlanTier } from './billing.data'
import { colors } from '@/theme/colors'

interface AddedCard {
  id: string
  bankName: string
}

interface PlanChangeSheetProps {
  visible: boolean
  onClose: () => void
  plan: PlanTier
  cycle: 'monthly' | 'yearly'
  amount: number
  isCurrentPlan: boolean
  onConfirmed: (methodLabel: string) => void
}

export function PlanChangeSheet({
  visible,
  onClose,
  plan,
  cycle,
  amount,
  isCurrentPlan,
  onConfirmed,
}: PlanChangeSheetProps) {
  const [step, setStep] = useState<'pay' | 'add-card'>('pay')
  const [cards, setCards] = useState<AddedCard[]>([])
  const [selectedId, setSelectedId] = useState('apple-pay')
  const [cardholderName, setCardholderName] = useState('')
  const [cardNumber, setCardNumber] = useState('')
  const [expiry, setExpiry] = useState('')
  const [cvv, setCvv] = useState('')
  const [saveCard, setSaveCard] = useState(true)

  const reset = () => {
    setStep('pay')
    setCardholderName('')
    setCardNumber('')
    setExpiry('')
    setCvv('')
  }

  const handleClose = () => {
    onClose()
    reset()
  }

  const handleAddCard = () => {
    const id = `card-${cards.length + 1}`
    setCards(prev => [...prev, { id, bankName: 'UBA' }])
    setSelectedId(id)
    setStep('pay')
    setCardholderName('')
    setCardNumber('')
    setExpiry('')
    setCvv('')
  }

  const selectedLabel =
    cards.find(c => c.id === selectedId)?.bankName ??
    WALLET_PAYMENT_METHODS.find(m => m.id === selectedId)?.label ??
    'Apple Pay'

  const handleConfirm = () => {
    onConfirmed(selectedLabel)
    handleClose()
  }

  const title = `${isCurrentPlan ? 'Renew' : 'Change to'} ${plan.label}`

  return (
    <Sheet visible={visible} onClose={handleClose} snapPoint={640}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {step === 'pay' ? (
          <View>
            <View style={styles.headerRow}>
              <View style={styles.headerLeft}>
                <Text style={styles.headerEmoji}>🌱</Text>
                <Text variant="h3" style={styles.headerTitle}>
                  {title}
                </Text>
              </View>
              <Pressable onPress={() => setStep('add-card')} hitSlop={8}>
                <Text style={styles.addCardLink}>Add New Card</Text>
              </Pressable>
            </View>
            <Text style={styles.subtitle}>
              {cycle === 'yearly' ? formatNaira(amount) + '/yr' : formatNaira(amount) + '/mo'} • Next cycle:{' '}
              {formatPlanDate(CURRENT_PLAN.renewalDate)}
            </Text>

            <Text style={styles.sectionLabel}>Pay with</Text>

            {cards.length > 0 && (
              <>
                <Text style={styles.groupLabel}>Card</Text>
                <View style={styles.methodGroup}>
                  {cards.map(card => (
                    <MethodRow
                      key={card.id}
                      label={card.bankName}
                      selected={selectedId === card.id}
                      onPress={() => setSelectedId(card.id)}
                    />
                  ))}
                </View>
                <Text style={styles.groupLabel}>Mobile Wallet</Text>
              </>
            )}

            <View style={styles.methodGroup}>
              {WALLET_PAYMENT_METHODS.map(method => (
                <MethodRow
                  key={method.id}
                  label={method.label}
                  current={method.isCurrent}
                  selected={selectedId === method.id}
                  onPress={() => setSelectedId(method.id)}
                />
              ))}
            </View>

            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total due today</Text>
              <Text style={styles.totalAmount}>{formatNaira(amount)}/{cycle === 'yearly' ? 'yr' : 'mo'}</Text>
            </View>

            <Button
              title={`${isCurrentPlan ? 'Renew' : 'Change Plan'} • ${formatNaira(amount)}`}
              onPress={handleConfirm}
              style={styles.confirmButton}
            />
            <Pressable style={styles.cancelLink} onPress={handleClose}>
              <Text style={styles.cancelLinkText}>Cancel</Text>
            </Pressable>
          </View>
        ) : (
          <View>
            <Text variant="h3">Add New Card</Text>
            <Text style={styles.subtitle}>
              {formatNaira(amount)}/{cycle === 'yearly' ? 'yr' : 'mo'} • Next cycle:{' '}
              {formatPlanDate(CURRENT_PLAN.renewalDate)}
            </Text>

            <Input
              label="Cardholder Name"
              placeholder="Amara Johnson"
              value={cardholderName}
              onChangeText={setCardholderName}
              containerStyle={styles.field}
            />
            <Input
              label="Card Number"
              placeholder="0000 0000 0000 0000"
              keyboardType="number-pad"
              value={cardNumber}
              onChangeText={setCardNumber}
              containerStyle={styles.field}
            />
            <View style={styles.row}>
              <Input
                label="Expiry Date"
                placeholder="MM/YY"
                value={expiry}
                onChangeText={setExpiry}
                containerStyle={[styles.field, styles.rowField]}
              />
              <Input
                label="CVV"
                placeholder="123"
                keyboardType="number-pad"
                secureTextEntry
                value={cvv}
                onChangeText={setCvv}
                containerStyle={[styles.field, styles.rowField]}
              />
            </View>

            <Pressable style={styles.saveRow} onPress={() => setSaveCard(v => !v)}>
              <Switch
                value={saveCard}
                onValueChange={setSaveCard}
                trackColor={{ true: colors.light.primary[500], false: colors.light.border }}
              />
              <Text style={styles.saveLabel}>Save My Card</Text>
            </Pressable>

            <View style={styles.row}>
              <Button
                title="Scan Card"
                variant="outline"
                style={[styles.confirmButton, styles.rowField]}
              />
              <Button
                title="Add Card"
                onPress={handleAddCard}
                style={[styles.confirmButton, styles.rowField]}
              />
            </View>

            <Pressable style={styles.cancelLink} onPress={() => setStep('pay')}>
              <Text style={styles.cancelLinkText}>Go Back</Text>
            </Pressable>
          </View>
        )}
      </ScrollView>
    </Sheet>
  )
}

function MethodRow({
  label,
  selected,
  current,
  onPress,
}: {
  label: string
  selected: boolean
  current?: boolean
  onPress: () => void
}) {
  return (
    <Pressable style={[styles.methodRow, selected && styles.methodRowSelected]} onPress={onPress}>
      <View style={[styles.radio, selected && styles.radioSelected]}>
        {selected && <View style={styles.radioDot} />}
      </View>
      <Text style={styles.methodLabel}>{label}</Text>
      {current && <Badge label="Current" tone="success" />}
    </Pressable>
  )
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  headerEmoji: {
    fontSize: 18,
  },
  headerTitle: {
    flexShrink: 1,
  },
  addCardLink: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.light.primary[500],
  },
  subtitle: {
    fontSize: 13,
    color: colors.light.textMuted,
    marginTop: 4,
    marginBottom: 20,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    color: colors.light.textSoft,
    marginBottom: 10,
  },
  groupLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.light.textMuted,
    marginBottom: 8,
    marginTop: 4,
  },
  methodGroup: {
    gap: 10,
    marginBottom: 12,
  },
  methodRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.light.primary[50],
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: 'transparent',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  methodRowSelected: {
    borderColor: colors.light.primary[500],
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: colors.light.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioSelected: {
    borderColor: colors.light.primary[500],
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.light.primary[500],
  },
  methodLabel: {
    flex: 1,
    fontSize: 15,
    fontWeight: '700',
    color: colors.light.text,
  },
  totalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
    marginBottom: 20,
  },
  totalLabel: {
    fontSize: 14,
    color: colors.light.textMuted,
  },
  totalAmount: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.light.text,
  },
  confirmButton: {
    borderRadius: 999,
    backgroundColor: colors.light.primary[500],
  },
  cancelLink: {
    alignItems: 'center',
    paddingVertical: 14,
  },
  cancelLinkText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.light.textMuted,
  },
  field: {
    marginBottom: 14,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  rowField: {
    flex: 1,
  },
  saveRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 20,
  },
  saveLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.light.text,
  },
})
