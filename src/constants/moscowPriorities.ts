export type RequirementPriority = 'MUST' | 'SHOULD' | 'COULD' | 'WONT'

export interface PrioritizedRequirement {
  id: string
  section: string
  title: string
  priority: RequirementPriority
  domain:
    | 'community'
    | 'faith'
    | 'anonymity'
    | 'connection'
    | 'gated'
    | 'circles'
    | 'learning'
    | 'events'
    | 'commerce'
    | 'subscriptions'
    | 'data'
    | 'nfr'
  linked?: string[]
}

export const moscowPriorities: PrioritizedRequirement[] = [
  { id: 'FR-A01', section: 'A', title: 'Channels & threads', priority: 'MUST', domain: 'community' },
  { id: 'FR-A02', section: 'A', title: 'Search across archive', priority: 'MUST', domain: 'community' },
  { id: 'FR-A03', section: 'A', title: 'Post pinning', priority: 'SHOULD', domain: 'community' },
  { id: 'FR-B01', section: 'B', title: 'Faith scheduled posts', priority: 'MUST', domain: 'faith' },
  { id: 'FR-B02', section: 'B', title: 'Notification timing', priority: 'MUST', domain: 'faith' },
  { id: 'FR-B03', section: 'B', title: 'Daily streak tracking', priority: 'SHOULD', domain: 'faith' },
  { id: 'FR-B04', section: 'B', title: 'Per-member timezone', priority: 'MUST', domain: 'faith' },
  { id: 'FR-C01', section: 'C', title: 'Anonymous posting', priority: 'MUST', domain: 'anonymity' },
  { id: 'FR-C02', section: 'C', title: 'Identity separation at DB layer (NFR-S02)', priority: 'MUST', domain: 'anonymity' },
  { id: 'FR-C03', section: 'C', title: 'Founder/admin unmask with audit log', priority: 'MUST', domain: 'anonymity' },
  { id: 'FR-C04', section: 'C', title: 'Anonymous toggle in composer', priority: 'SHOULD', domain: 'anonymity' },
  { id: 'FR-D01', section: 'D', title: 'Member directory', priority: 'SHOULD', domain: 'connection' },
  { id: 'FR-D02', section: 'D', title: 'Member matching', priority: 'COULD', domain: 'connection' },
  { id: 'FR-D03', section: 'D', title: 'Direct messages', priority: 'SHOULD', domain: 'connection' },
  { id: 'FR-E01', section: 'E', title: 'Founder gated content', priority: 'MUST', domain: 'gated' },
  { id: 'FR-E02', section: 'E', title: 'Tier-based gating', priority: 'MUST', domain: 'gated' },
  { id: 'FR-E03', section: 'E', title: 'No share/embed outside platform', priority: 'MUST', domain: 'gated' },
  { id: 'FR-E04', section: 'E', title: 'Direct URL unreachable by non-members (NFR-S05)', priority: 'MUST', domain: 'gated' },
  { id: 'FR-F01', section: 'F', title: 'Private circles', priority: 'SHOULD', domain: 'circles' },
  { id: 'FR-F02', section: 'F', title: 'Circle invites', priority: 'SHOULD', domain: 'circles' },
  { id: 'FR-F03', section: 'F', title: 'Circle leaders / mods', priority: 'SHOULD', domain: 'circles' },
  { id: 'FR-G01', section: 'G', title: 'Courses & progress', priority: 'SHOULD', domain: 'learning' },
  { id: 'FR-G02', section: 'G', title: 'Live sessions', priority: 'SHOULD', domain: 'learning' },
  { id: 'FR-G03', section: 'G', title: 'No third-party redirect for live rooms', priority: 'MUST', domain: 'learning' },
  { id: 'FR-G04', section: 'G', title: 'Session replays', priority: 'COULD', domain: 'learning' },
  { id: 'FR-H01', section: 'H', title: 'Events & RSVPs', priority: 'SHOULD', domain: 'events' },
  { id: 'FR-H02', section: 'H', title: 'In-platform live rooms', priority: 'MUST', domain: 'events' },
  { id: 'FR-H03', section: 'H', title: 'Event recordings', priority: 'COULD', domain: 'events' },
  { id: 'FR-I01', section: 'I', title: 'Dang Lifestyle SSO bridge', priority: 'SHOULD', domain: 'commerce' },
  { id: 'FR-I02', section: 'I', title: 'Auto-applied 10% member discount', priority: 'MUST', domain: 'commerce' },
  { id: 'FR-I03', section: 'I', title: 'Discount deactivates on lapse', priority: 'MUST', domain: 'commerce' },
  { id: 'FR-I04', section: 'I', title: 'Early-access drop window (members first)', priority: 'SHOULD', domain: 'commerce' },
  { id: 'FR-I05', section: 'I', title: 'Drop state machine (member-only → public → ended)', priority: 'MUST', domain: 'commerce' },
  { id: 'FR-J01', section: 'J', title: 'Paystack/Flutterwave (NGN)', priority: 'MUST', domain: 'subscriptions' },
  { id: 'FR-J02', section: 'J', title: 'Tiered subscriptions', priority: 'MUST', domain: 'subscriptions' },
  { id: 'FR-J03', section: 'J', title: 'Self-serve upgrade/downgrade/cancel/pause', priority: 'MUST', domain: 'subscriptions' },
  { id: 'FR-J04', section: 'J', title: 'Retry + notify before revoking access', priority: 'MUST', domain: 'subscriptions' },
  { id: 'FR-J05', section: 'J', title: 'Stripe (GBP/USD/EUR) for diaspora', priority: 'SHOULD', domain: 'subscriptions' },
  { id: 'NFR-D01', section: 'NFR-D', title: 'Self-serve full data export (CSV/JSON)', priority: 'MUST', domain: 'data' },
  { id: 'NFR-D02', section: 'NFR-D', title: 'Founder-admin bulk export', priority: 'MUST', domain: 'data' },
  { id: 'NFR-D03', section: 'NFR-D', title: 'Right to erasure (GDPR + NDPR, NFR-S04)', priority: 'MUST', domain: 'data' },
  { id: 'NFR-P01', section: 'NFR-P', title: 'Core page load <3s on mobile', priority: 'MUST', domain: 'nfr' },
  { id: 'NFR-P02', section: 'NFR-P', title: 'Faith post notifications <60s from trigger', priority: 'MUST', domain: 'nfr' },
  { id: 'NFR-P03', section: 'NFR-P', title: 'Live rooms 100+ concurrent users', priority: 'SHOULD', domain: 'nfr' },
  { id: 'NFR-P04', section: 'NFR-P', title: 'Archive search <2s', priority: 'MUST', domain: 'nfr' },
  { id: 'NFR-S01', section: 'NFR-S', title: 'Encryption at rest + TLS 1.2', priority: 'MUST', domain: 'nfr' },
  { id: 'NFR-S02', section: 'NFR-S', title: 'Structural anonymity separation', priority: 'MUST', domain: 'anonymity' },
  { id: 'NFR-S05', section: 'NFR-S', title: 'Gated content: direct URL unreachable for non-members', priority: 'MUST', domain: 'gated' },
  { id: 'NFR-S06', section: 'NFR-S', title: '2FA available', priority: 'SHOULD', domain: 'nfr' },
  { id: 'NFR-U01', section: 'NFR-U', title: 'Mobile-web-first, no native app required', priority: 'MUST', domain: 'nfr' },
  { id: 'NFR-U03', section: 'NFR-U', title: 'First post within 5 minutes of signup', priority: 'SHOULD', domain: 'nfr' },
  { id: 'NFR-U04', section: 'NFR-U', title: 'Brand tokens once in theme, no inline hex', priority: 'MUST', domain: 'nfr' },
  { id: 'NFR-U05', section: 'NFR-U', title: 'Dark mode via Tailwind dark: variant', priority: 'MUST', domain: 'nfr' },
]

export function requirementsByPriority(p: RequirementPriority): PrioritizedRequirement[] {
  return moscowPriorities.filter(r => r.priority === p)
}

export function requirementsByDomain(domain: PrioritizedRequirement['domain']): PrioritizedRequirement[] {
  return moscowPriorities.filter(r => r.domain === domain)
}
