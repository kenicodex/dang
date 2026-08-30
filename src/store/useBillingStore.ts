import { create } from './zustand'
import type { SubscriptionStatus } from '@/types/subscriptions'

export interface BillingState {
  status: SubscriptionStatus
  cancelAtPeriodEnd: boolean
  pausedUntil: Date | null
  pauseMonths: number | null
  paymentMethodRemoved: boolean
  pauseSubscription: (months: number, resumesAt: Date) => void
  resumeSubscription: () => void
  cancelSubscription: () => void
  keepSubscription: () => void
  removePaymentMethod: () => void
}

export const useBillingStore = create<BillingState>(set => ({
  status: 'active',
  cancelAtPeriodEnd: false,
  pausedUntil: null,
  pauseMonths: null,
  paymentMethodRemoved: false,
  pauseSubscription: (months, resumesAt) => set({ status: 'paused', pausedUntil: resumesAt, pauseMonths: months }),
  resumeSubscription: () => set({ status: 'active', pausedUntil: null, pauseMonths: null }),
  cancelSubscription: () => set({ cancelAtPeriodEnd: true }),
  keepSubscription: () => set({ cancelAtPeriodEnd: false }),
  removePaymentMethod: () => set({ paymentMethodRemoved: true }),
}))
