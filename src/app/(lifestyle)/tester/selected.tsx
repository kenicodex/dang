import { useRouter, useLocalSearchParams } from 'expo-router'
import { StyleSheet } from 'react-native'

import { Text } from '@/components/ui/Text'
import { OutcomeScreen, InfoCard, InfoCardRow, FEATURED_DROP } from '@/components/commerce'
import { colors } from '@/theme/colors'

export default function TesterSelectedScreen() {
  const router = useRouter()
  const { dropId } = useLocalSearchParams<{ dropId?: string }>()
  const dropTitle = dropId === FEATURED_DROP.id || !dropId ? FEATURED_DROP.title : dropId

  return (
    <OutcomeScreen
      topEmojis="✨ 💜 🎉"
      icon="🎉"
      title="You've been selected!"
      description={
        <>
          You&rsquo;re testing <Text style={styles.dropName}>{dropTitle}</Text>. It&rsquo;s on its way — we&rsquo;ll let
          you know the moment it ships.
        </>
      }
      ctaLabel="Got it"
      onPressCta={() => router.replace('/(tabs)/home/lifestyle')}
    >
      <InfoCard heading="What happens next">
        <InfoCardRow icon="📦" title="Product ships to your address" />
        <InfoCardRow icon="💬" title="Share feedback here after 2 weeks" />
      </InfoCard>
    </OutcomeScreen>
  )
}

const styles = StyleSheet.create({
  dropName: {
    color: colors.light.text,
    fontWeight: '700',
  },
})
