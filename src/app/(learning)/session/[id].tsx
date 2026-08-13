import { View, Text } from 'react-native'
import { useLocalSearchParams } from 'expo-router'

export default function LiveSessionScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  return (
    <View>
      <Text>Live Session: {id}</Text>
    </View>
  )
}
