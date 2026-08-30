import { useRouter } from 'expo-router'

import { OutcomeScreen, InfoCard, InfoCardRow } from '@/components/commerce'

export default function TesterRejectedScreen() {
  const router = useRouter()

  return (
    <OutcomeScreen
      icon="🌱"
      title="Not this round"
      description="This drop's testers have been chosen, and it wasn't your turn this time. Don't worry, your application stays active for future drops."
      ctaLabel="Back to DANG Lifestyle"
      onPressCta={() => router.replace('/(tabs)/home/lifestyle')}
    >
      <InfoCard heading="Boost your chances">
        <InfoCardRow icon="🔥" title="Keep your streak going" />
        <InfoCardRow icon="💬" title="Stay active in your Spaces" />
        <InfoCardRow icon="✍️" title="Complete your profile" />
      </InfoCard>
    </OutcomeScreen>
  )
}
