import { MemberListScreen } from '@/components/members/MemberListScreen'
import { getMembersByIds, SISTERHOOD_IDS } from '@/components/members/members.data'

export default function SistersNearbyScreen() {
  return (
    <MemberListScreen
      title="Sisters nearby"
      members={getMembersByIds(SISTERHOOD_IDS)}
      showLocation
      emptyMessage="No one nearby right now."
    />
  )
}
