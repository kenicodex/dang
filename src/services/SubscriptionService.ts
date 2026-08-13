import type { SubscriptionTier, Subscription, PaymentMethod, Invoice } from '@/types/subscriptions'
import type { Paginated, PaginationParams } from '@/types/common'
import type { AuthContext } from '@/types/auth'

export type Currency = 'NGN' | 'GBP' | 'USD' | 'EUR'
export type Gateway = 'paystack' | 'flutterwave' | 'stripe'

export interface CheckoutSession {
  id: string
  gateway: Gateway
  currency: Currency
  amount: number
  redirectUrl?: string
  expiresAt: Date
}

export interface SubscriptionServiceInterface {
  listTiers(auth?: AuthContext): Promise<SubscriptionTier[]>
  getSubscription(auth: AuthContext): Promise<Subscription | null>
  getTier(tierId: string): Promise<SubscriptionTier>
  createCheckoutSession(
    auth: AuthContext,
    tierId: string,
    currency: Currency,
  ): Promise<CheckoutSession>
  confirmPayment(auth: AuthContext, sessionId: string, gatewayPayload: unknown): Promise<Subscription>
  upgrade(auth: AuthContext, toTierId: string): Promise<CheckoutSession>
  downgrade(auth: AuthContext, toTierId: string, effectiveAt?: 'next-cycle' | 'immediate'): Promise<Subscription>
  cancel(auth: AuthContext, reason?: string): Promise<Subscription>
  pause(auth: AuthContext, months: number): Promise<Subscription>
  resume(auth: AuthContext): Promise<Subscription>
  listInvoices(auth: AuthContext, params?: PaginationParams): Promise<Paginated<Invoice>>
  downloadInvoice(auth: AuthContext, invoiceId: string): Promise<{ url: string; format: 'pdf' }>
  listPaymentMethods(auth: AuthContext): Promise<PaymentMethod[]>
  addPaymentMethod(auth: AuthContext, gatewayToken: string, gateway: Gateway): Promise<PaymentMethod>
  removePaymentMethod(auth: AuthContext, paymentMethodId: string): Promise<void>
  handleFailedPayment(memberId: string, invoiceId: string, attempt: number): Promise<{
    retried: boolean
    nextAttemptAt?: Date
    accessRevoked: boolean
    notificationsSent: number
  }>
}

export const SubscriptionService: SubscriptionServiceInterface = {
  async listTiers(_auth) {
    throw new Error('SubscriptionService.listTiers not implemented')
  },
  async getSubscription(_auth) {
    throw new Error('SubscriptionService.getSubscription not implemented')
  },
  async getTier(_tierId) {
    throw new Error('SubscriptionService.getTier not implemented')
  },
  async createCheckoutSession(_auth, _tierId, _currency) {
    throw new Error('SubscriptionService.createCheckoutSession not implemented — currency selects gateway (NGN→Paystack/Flutterwave, GBP/USD/EUR→Stripe) FR-J01/J05')
  },
  async confirmPayment(_auth, _sessionId, _gatewayPayload) {
    throw new Error('SubscriptionService.confirmPayment not implemented')
  },
  async upgrade(_auth, _toTierId) {
    throw new Error('SubscriptionService.upgrade not implemented')
  },
  async downgrade(_auth, _toTierId, _effectiveAt) {
    throw new Error('SubscriptionService.downgrade not implemented')
  },
  async cancel(_auth, _reason) {
    throw new Error('SubscriptionService.cancel not implemented')
  },
  async pause(_auth, _months) {
    throw new Error('SubscriptionService.pause not implemented')
  },
  async resume(_auth) {
    throw new Error('SubscriptionService.resume not implemented')
  },
  async listInvoices(_auth, _params) {
    throw new Error('SubscriptionService.listInvoices not implemented')
  },
  async downloadInvoice(_auth, _invoiceId) {
    throw new Error('SubscriptionService.downloadInvoice not implemented')
  },
  async listPaymentMethods(_auth) {
    throw new Error('SubscriptionService.listPaymentMethods not implemented')
  },
  async addPaymentMethod(_auth, _gatewayToken, _gateway) {
    throw new Error('SubscriptionService.addPaymentMethod not implemented')
  },
  async removePaymentMethod(_auth, _paymentMethodId) {
    throw new Error('SubscriptionService.removePaymentMethod not implemented')
  },
  async handleFailedPayment(_memberId, _invoiceId, _attempt) {
    throw new Error('SubscriptionService.handleFailedPayment not implemented — retry + notify BEFORE revoking access (FR-J04)')
  },
}
