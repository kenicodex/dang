import { MemberListScreen } from '@/components/members/MemberListScreen'
import { getMembersByIds, SISTERHOOD_IDS } from '@/components/members/members.data'

export default function ProfileFollowingScreen() {
  return (
    <MemberListScreen
      title="Following"
      members={getMembersByIds(SISTERHOOD_IDS)}
      showLocation
      emptyMessage="Not following anyone yet."
    />
  )
}
