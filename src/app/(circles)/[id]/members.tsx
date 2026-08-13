import { View, Text } from 'react-native'
import { useLocalSearchParams } from 'expo-router'

export default function CircleMembersScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  return (
    <View>
      <Text>Circle Members: {id}</Text>
    </View>
  )
}
