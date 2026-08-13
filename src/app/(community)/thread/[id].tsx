import { View, Text } from 'react-native'
import { useLocalSearchParams } from 'expo-router'

export default function ThreadDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  return (
    <View>
      <Text>Thread: {id}</Text>
    </View>
  )
}
