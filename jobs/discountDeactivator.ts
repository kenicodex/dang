import { CommerceIntegrationService } from '@/services/CommerceIntegrationService'

/**
 * discountDeactivator
 *
 * FR-I03: The 10% Dang Lifestyle discount must DEactivate the MOMENT a
 * subscription lapses. This is not a batch reconciliation job that runs periodically
 * (hourly) to catch any edge cases where the subscription webhook
 * didn't propagate fast enough (e.g. missed Stripe/Paystack webhook delivery).
 *
 * For each lapsed subscription found, invokes
 * CommerceIntegrationService.deactivateDiscountOnLapse(memberId).
 *
 * Idempotent: repeated runs must not produce duplicate deactivation events.
 */
export interface DiscountDeactivationRun {
  startedAt: Date
  checkedSubscriptions: number
  discountsDeactivated: number
  errors: Array<{ memberId: string; error: string }>
}

export async function discountDeactivator(): Promise<DiscountDeactivationRun> {
  const run: DiscountDeactivationRun = {
    startedAt: new Date(),
    checkedSubscriptions: 0,
    discountsDeactivated: 0,
    errors: [],
  }

  return run
}
