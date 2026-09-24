import { useState } from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { Pressable, StyleSheet, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Icon } from '@/components/ui/Icon'

import { Text } from '@/components/ui/Text'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { ApiError } from '@/api/client'
import { useInviteToSpaceMutation } from '@/api/hooks/spaces.hooks'
import { useUIStore } from '@/store'
import { colors } from '@/theme/colors'

export default function CircleInviteScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const router = useRouter()
  const showToast = useUIStore(s => s.showToast)
  const { mutateAsync: inviteToSpace, isPending } = useInviteToSpaceMutation()
  const [email, setEmail] = useState('')

  const handleInvite = async () => {
    if (!id) return
    try {
      await inviteToSpace({ id, input: { email: email.trim() } })
      showToast('Invitation sent.', 'success')
      router.back()
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Could not send this invite. Please try again.'
      showToast(message, 'error')
    }
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.back()} hitSlop={8}>
          <Icon name="chevron.left" size={18} tintColor={colors.light.text} />
        </Pressable>
        <Text variant="h3" style={styles.title}>
          Invite to Circle
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.content}>
        <Input
          label="Email address"
          required
          value={email}
          onChangeText={setEmail}
          placeholder="friend@example.com"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />
        <Button
          title="Send Invite"
          disabled={!email.trim()}
          loading={isPending}
          style={styles.submit}
          onPress={handleInvite}
        />
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.light.bgAlt,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.light.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
  },
  headerSpacer: {
    width: 40,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  submit: {
    marginTop: 24,
  },
})
