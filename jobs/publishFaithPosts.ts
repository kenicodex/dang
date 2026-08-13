import { FaithRitualService } from '@/services/FaithRitualService'

/**
 * publishFaithPosts
 *
 * FR-B01–B04: Faith ritual posts must be live within 60s of the configured
 * schedule (NFR-P02: treat missed/late notifications as P1 bug, not a background hiccup).
 *
 * Run by a durable scheduler (BullMQ, Temporal, pg_cron, etc.) — not setTimeout.
 * The job SHOULD be idempotent: duplicate invocations for the same scheduled slot MUST NOT
 * produce duplicate posts or duplicate notifications.
 */
export interface PublishFaithPostsResult {
  scheduledWindowStart: Date
  scheduledWindowEnd: Date
  postsPublished: number
  notificationsQueued: number
  notificationErrors: Array<{ memberId: string; error: string }>
}

export async function publishFaithPosts(
  windowStart: Date,
  windowEnd: Date,
): Promise<PublishFaithPostsResult> {
  const result: PublishFaithPostsResult = {
    scheduledWindowStart: windowStart,
    scheduledWindowEnd: windowEnd,
    postsPublished: 0,
    notificationsQueued: 0,
    notificationErrors: [],
  }

  const dispatch = await FaithRitualService.triggerNotificationDispatch(windowStart)
  result.notificationsQueued = dispatch.dispatched
  return result
}
