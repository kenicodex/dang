import { View, Text } from 'react-native'
import { useLocalSearchParams } from 'expo-router'

export default function CourseDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  return (
    <View>
      <Text>Course: {id}</Text>
    </View>
  )
}
