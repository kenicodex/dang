import { View, Text } from 'react-native'
import { useLocalSearchParams } from 'expo-router'

export default function EventLiveRoomScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  return (
    <View>
      <Text>Live Room: {id}</Text>
    </View>
  )
}
