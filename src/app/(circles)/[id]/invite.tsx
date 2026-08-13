import { View, Text } from 'react-native'
import { useLocalSearchParams } from 'expo-router'

export default function CircleInviteScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  return (
    <View>
      <Text>Invite to Circle: {id}</Text>
    </View>
  )
}
