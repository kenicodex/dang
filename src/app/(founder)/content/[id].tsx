import { View, Text } from 'react-native'
import { useLocalSearchParams } from 'expo-router'

export default function FounderPostScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  return (
    <View>
      <Text>Founder Post: {id}</Text>
    </View>
  )
}
