import type { Auditable } from './common'

export type BillingInterval = 'monthly' | 'quarterly' | 'yearly'
export type SubscriptionStatus =
  | 'active' | 'past_due' | 'canceled' | 'paused' | 'incomplete' | 'expired' | 'trialing'

export interface SubscriptionTier extends Auditable {
  id: string
  name: string
  slug: 'basic' | 'premium' | 'vip' | 'founders-circle'
  description: string
  order: number
  features: string[]
  monthlyPrice: number
  quarterlyPrice: number
  yearlyPrice: number
  currency: 'NGN' | 'GBP' | 'USD' | 'EUR'
  isPopular?: boolean
  isPublic: boolean
  trialDays?: number
  discounts: {
    dangLifestylePercent: number
    dropsEarlyAccessHours: number
  }
}

export interface Subscription extends Auditable {
  id: string
  memberId: string
  tier: SubscriptionTier
  tierId: string
  status: SubscriptionStatus
  billingInterval: BillingInterval
  currentPeriodStart: Date
  currentPeriodEnd: Date
  cancelAtPeriodEnd: boolean
  canceledAt?: Date
  canceledReason?: string
  pausedUntil?: Date
  pausedAt?: Date
  trialEndsAt?: Date
  nextBillingAmount: number
  currency: SubscriptionTier['currency']
  gateway: 'paystack' | 'flutterwave' | 'stripe'
  gatewayCustomerId?: string
  gatewaySubscriptionId?: string
  discountActive: boolean
}

export type PaymentMethodType = 'card' | 'bank_account' | 'mobile_money'

export interface PaymentMethod extends Auditable {
  id: string
  memberId: string
  type: PaymentMethodType
  brand?: string
  last4?: string
  expMonth?: number
  expYear?: number
  bankName?: string
  mobileNetwork?: string
  isDefault: boolean
  gateway: Subscription['gateway']
  gatewayPaymentMethodId: string
}

export type InvoiceStatus = 'paid' | 'open' | 'void' | 'uncollectible' | 'refunded'

export interface Invoice extends Auditable {
  id: string
  memberId: string
  subscriptionId: string
  number: string
  status: InvoiceStatus
  amount: number
  currency: SubscriptionTier['currency']
  tax?: number
  discount?: number
  periodStart: Date
  periodEnd: Date
  dueDate?: Date
  paidAt?: Date
  paymentAttempts: number
  nextPaymentAttemptAt?: Date
  hostedInvoiceUrl?: string
  pdfUrl?: string
  lineItems: InvoiceLineItem[]
}

export interface InvoiceLineItem {
  description: string
  quantity: number
  unitAmount: number
  totalAmount: number
  tierId?: string
}
