import { View, Text } from 'react-native'
import { useLocalSearchParams } from 'expo-router'

export default function CircleDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  return (
    <View>
      <Text>Circle: {id}</Text>
    </View>
  )
}
