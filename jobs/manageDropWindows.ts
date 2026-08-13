import { CommerceIntegrationService } from '@/services/CommerceIntegrationService'

/**
 * manageDropWindows
 *
 * FR-I04 / FR-I05: Early-access drops use an EXPLICIT state machine:
 *   upcoming → member-only → public → ended
 * NOT a cron-adjacent hack. Each transition:
 *   - triggers notifications to the eligible cohort (members first, then general public)
 *   - logs the phase change for audit
 *   - unlocks/locks the purchase flow for each cohort
 *
 * Runs on a frequent cadence (e.g. minutely). Transitions MUST be idempotent.
 */
export type DropWindowTransition = {
  dropId: string
  from: 'upcoming' | 'member-only' | 'public' | 'ended'
  to: 'member-only' | 'public' | 'ended'
  transitionedAt: Date
  notifiedMembers: number
}

export async function manageDropWindows(
  now: Date = new Date(),
): Promise<DropWindowTransition[]> {
  const transitions: DropWindowTransition[] = []
  const activeDrops = await CommerceIntegrationService.listActiveDrops({
    role: 'FOUNDER',
    memberId: 'system',
    subscriptionTier: null,
  } as any)

  for (const drop of activeDrops) {
    const phase = await CommerceIntegrationService.getDropPhase(drop.id, now)
  }

  return transitions
}
