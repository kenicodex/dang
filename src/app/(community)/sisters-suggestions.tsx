import { MemberListScreen } from '@/components/members/MemberListScreen'
import { getMembersByIds, SISTERHOOD_IDS } from '@/components/members/members.data'

export default function SuggestionsScreen() {
  return (
    <MemberListScreen
      title="Suggestions"
      members={getMembersByIds(SISTERHOOD_IDS)}
      emptyMessage="No suggestions right now."
    />
  )
}
