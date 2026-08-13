import { View, Text } from 'react-native'
import { useLocalSearchParams } from 'expo-router'

export default function EventRSVPScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  return (
    <View>
      <Text>RSVP for Event: {id}</Text>
    </View>
  )
}
