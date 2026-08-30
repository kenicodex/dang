import { MemberListScreen } from '@/components/members/MemberListScreen'
import { getMembersByIds, SISTERHOOD_IDS } from '@/components/members/members.data'

export default function ProfileFollowersScreen() {
  return (
    <MemberListScreen
      title="Followers"
      members={getMembersByIds(SISTERHOOD_IDS)}
      emptyMessage="No followers yet."
    />
  )
}
