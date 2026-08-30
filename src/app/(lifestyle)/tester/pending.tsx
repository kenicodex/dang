import { useRouter } from 'expo-router'
import { StyleSheet } from 'react-native'

import { Text } from '@/components/ui/Text'
import { OutcomeScreen, InfoCard, InfoCardRow } from '@/components/commerce'
import { colors } from '@/theme/colors'

export default function TesterPendingScreen() {
  const router = useRouter()

  return (
    <OutcomeScreen
      icon="📮"
      title="You're on the list"
      description="Your tester application is in. Ifedayo's team reviews applications for each drop — if you're picked, you'll hear from us right here."
      ctaLabel="Back to DANG Lifestyle"
      onPressCta={() => router.replace('/(tabs)/home/lifestyle')}
    >
      <InfoCard tone="amber">
        <InfoCardRow icon="⏳" title="Status: under review" subtitle="Testers are chosen per product drop" />
      </InfoCard>
      <InfoCard>
        <Text style={styles.tip}>
          💜 in the meantime, keep showing up — active members are more likely to be picked as testers.
        </Text>
      </InfoCard>
    </OutcomeScreen>
  )
}

const styles = StyleSheet.create({
  tip: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.light.primary[700],
  },
})
