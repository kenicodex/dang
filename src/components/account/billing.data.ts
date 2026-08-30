export interface CurrentPlan {
  name: string
  monthlyPrice: number
  currency: 'NGN'
  renewalDate: Date
  features: string[]
}

export interface SavedPaymentMethod {
  provider: string
  last4: string
}

export const CURRENT_PLAN: CurrentPlan = {
  name: 'Dang Boss',
  monthlyPrice: 10000,
  currency: 'NGN',
  renewalDate: new Date('2026-09-01T00:00:00Z'),
  features: [
    'Free expert led classes- 90 minutes',
    'Exclusive DANG product testing',
    'Monthly therapy session',
    'Member spotlight',
    'Access to newsletter',
    'BTS content',
    'Early access to resources',
    'Discount on products',
  ],
}

export const SAVED_PAYMENT_METHOD: SavedPaymentMethod = {
  provider: 'Apple Pay',
  last4: '4242',
}

export type PlanKey = 'dangLeader' | 'dangBoss' | 'dangBaby'

export interface PlanTier {
  key: PlanKey
  label: string
  recommended?: boolean
  description: string
  monthly: number
  features: string[]
}

export const PLAN_TIERS: Record<PlanKey, PlanTier> = {
  dangLeader: {
    key: 'dangLeader',
    label: 'Dang Leader',
    description: 'The full Dang experience, with direct access to Ifedayo and VIP perks.',
    monthly: 25000,
    features: [
      ...CURRENT_PLAN.features,
      '1:1 mentorship calls with Ifedayo',
      'VIP access to in-person events',
    ],
  },
  dangBoss: {
    key: 'dangBoss',
    label: 'Dang Boss',
    recommended: true,
    description: "Full access including Ifedayo's exclusive content, courses, and lifestyle perks.",
    monthly: CURRENT_PLAN.monthlyPrice,
    features: CURRENT_PLAN.features,
  },
  dangBaby: {
    key: 'dangBaby',
    label: 'Dang Baby',
    description: 'The daily essentials to grow your faith and streaks.',
    monthly: 4000,
    features: [
      'Daily faith posts & reflections',
      'Community access & streaks',
      'Basic prayer library',
    ],
  },
}

/** Left-to-right tab order for the plan picker. */
export const PLAN_TIER_ORDER: PlanKey[] = ['dangLeader', 'dangBoss', 'dangBaby']

export type PaymentMethodKind = 'card' | 'wallet'

export interface PaymentMethodOption {
  id: string
  kind: PaymentMethodKind
  label: string
  isCurrent?: boolean
}

export const WALLET_PAYMENT_METHODS: PaymentMethodOption[] = [
  { id: 'apple-pay', kind: 'wallet', label: 'Apple Pay', isCurrent: true },
  { id: 'paystack', kind: 'wallet', label: 'Paystack' },
  { id: 'flutterwave', kind: 'wallet', label: 'Flutterwave' },
]

export interface PaymentHistoryItem {
  id: string
  date: Date
  description: string
  amount: number
  currency: 'NGN' | 'USD'
  status: 'paid' | 'refunded'
  transactionId: string
  paymentMethodLabel: string
  processor: string
}

export const PAYMENT_HISTORY: PaymentHistoryItem[] = [
  {
    id: 'inv-5',
    date: new Date('2026-08-01T00:00:00Z'),
    description: 'Pro Plan — Yearly',
    amount: 4999,
    currency: 'NGN',
    status: 'paid',
    transactionId: 'TXN-00000001',
    paymentMethodLabel: 'Visa •••• 4242',
    processor: 'Paystack',
  },
  {
    id: 'inv-4',
    date: new Date('2026-07-01T00:00:00Z'),
    description: 'Pro Plan — Monthly',
    amount: 4999,
    currency: 'NGN',
    status: 'paid',
    transactionId: 'TXN-00000002',
    paymentMethodLabel: 'Visa •••• 4242',
    processor: 'Paystack',
  },
  {
    id: 'inv-3',
    date: new Date('2026-06-15T00:00:00Z'),
    description: 'Investing 101 for Women (event)',
    amount: 15,
    currency: 'USD',
    status: 'paid',
    transactionId: 'TXN-00000003',
    paymentMethodLabel: 'Visa •••• 4242',
    processor: 'Flutterwave',
  },
  {
    id: 'inv-2',
    date: new Date('2026-06-01T00:00:00Z'),
    description: 'Pro Plan — Monthly',
    amount: 4999,
    currency: 'NGN',
    status: 'paid',
    transactionId: 'TXN-00000004',
    paymentMethodLabel: 'Visa •••• 4242',
    processor: 'Paystack',
  },
  {
    id: 'inv-1',
    date: new Date('2026-05-01T00:00:00Z'),
    description: 'Pro Plan — Monthly',
    amount: 4999,
    currency: 'NGN',
    status: 'paid',
    transactionId: 'TXN-00000005',
    paymentMethodLabel: 'Visa •••• 4242',
    processor: 'Paystack',
  },
]

export const PAUSE_DURATIONS = [1, 2, 3]

export const CANCELLATION_LOSSES = [
  '10 courses/month',
  'Anonymous posting',
  'Data export',
  'Priority support',
]

export function formatNaira(amount: number) {
  return `₦${amount.toLocaleString('en-NG')}`
}

export function formatMoney(amount: number, currency: 'NGN' | 'USD') {
  return currency === 'USD' ? `$${amount.toLocaleString('en-US')}` : formatNaira(amount)
}

export function formatPlanDate(date: Date) {
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export function addMonths(date: Date, months: number) {
  const next = new Date(date)
  next.setMonth(next.getMonth() + months)
  return next
}
