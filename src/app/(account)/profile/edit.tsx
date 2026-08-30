import { useState } from 'react'
import { Image } from 'expo-image'
import { LinearGradient } from 'expo-linear-gradient'
import { Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native'
import { router } from 'expo-router'
import { Icon } from '@/components/ui/Icon'
import { SafeAreaView } from 'react-native-safe-area-context'

import { Avatar } from '@/components/ui/Avatar'
import { Text } from '@/components/ui/Text'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { GlassView } from '@/components/ui/GlassView'
import { ActionSheet } from '@/components/ui/ActionSheet'
import { MOCK_PROFILE, PROFILE_INTERESTS } from '@/components/account/profile.data'
import { useAuthStore } from '@/store/useAuthStore'
import { colors } from '@/theme/colors'

const COVER_HEIGHT = 240
const AVATAR_BOX = 104
const FOOTER_SPACE = 80

export default function EditProfileScreen() {
  const authUser = useAuthStore(s => s.user)
  const profile = authUser ?? MOCK_PROFILE

  const [name, setName] = useState(profile.displayName)
  const [username, setUsername] = useState(profile.handle)
  const [location, setLocation] = useState(profile.location ?? '')
  const [website, setWebsite] = useState(profile.website ?? '')
  const [bio, setBio] = useState(profile.bio ?? '')
  const [interests, setInterests] = useState<string[]>(profile.interests ?? [])
  const [photoSheetVisible, setPhotoSheetVisible] = useState(false)

  const toggleInterest = (interest: string) => {
    setInterests(current => (current.includes(interest) ? current.filter(i => i !== interest) : [...current, interest]))
  }

  return (
    <View style={styles.root}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.coverWrap}>
          <Image source={{ uri: profile.coverImageUrl }} style={styles.cover} contentFit="cover" />
          <LinearGradient colors={['rgba(255,255,255,0)', colors.light.bgAlt]} style={styles.coverFade} />

          <SafeAreaView edges={['top']} style={styles.coverBar}>
            <GlassView style={styles.circleButtonGlass} radius="full" glassEffectStyle="clear" isInteractive>
              <Pressable style={styles.circleButtonInner} onPress={() => router.back()}>
                <Icon name="chevron.left" size={18} tintColor={colors.light.neutral.white} />
              </Pressable>
            </GlassView>
            <Text style={styles.headerTitle}>Edit Profile</Text>
            <GlassView style={styles.circleButtonGlass} radius="full" glassEffectStyle="clear" isInteractive>
              <Pressable style={styles.circleButtonInner}>
                <Icon name="ellipsis" size={18} tintColor={colors.light.neutral.white} />
              </Pressable>
            </GlassView>
          </SafeAreaView>

          <View style={styles.avatarSection}>
            <View style={styles.avatarWrap}>
              <Avatar uri={profile.avatarUrl} initials={profile.displayName.slice(0, 2).toUpperCase()} size="xl" />
              <Pressable style={styles.cameraBadge} onPress={() => setPhotoSheetVisible(true)} hitSlop={4}>
                <Icon name="camera.fill" size={14} tintColor={colors.light.neutral.white} />
              </Pressable>
            </View>
            <Pressable onPress={() => setPhotoSheetVisible(true)}>
              <Text style={styles.changePhoto}>Change Photo</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.form}>
          <Input label="Name" value={name} onChangeText={setName} containerStyle={styles.field} />
          <Input label="Username" value={username} onChangeText={setUsername} containerStyle={styles.field} />
          <Input label="Location" value={location} onChangeText={setLocation} containerStyle={styles.field} />
          <Input label="Website" value={website} onChangeText={setWebsite} containerStyle={styles.field} />

          <View style={styles.field}>
            <Text style={styles.bioLabel}>
              Bio <Text style={styles.bioOptional}>(Optional)</Text>
            </Text>
            <TextInput
              value={bio}
              onChangeText={setBio}
              placeholder="Enter a description..."
              placeholderTextColor={colors.light.textSoft}
              multiline
              textAlignVertical="top"
              style={styles.bioInput}
            />
          </View>

          <View style={styles.tagsRow}>
            {PROFILE_INTERESTS.map(interest => {
              const selected = interests.includes(interest)
              return (
                <Pressable
                  key={interest}
                  style={[styles.tag, selected && styles.tagSelected]}
                  onPress={() => toggleInterest(interest)}
                >
                  <Text style={[styles.tagLabel, selected && styles.tagLabelSelected]}>{interest}</Text>
                </Pressable>
              )
            })}
          </View>

          <Button title="Save" style={styles.saveButton} onPress={() => router.back()} />
        </View>
      </ScrollView>

      <ActionSheet
        visible={photoSheetVisible}
        onClose={() => setPhotoSheetVisible(false)}
        actions={[
          { label: 'Photo Library', onPress: () => {} },
          { label: 'Camera', onPress: () => {} },
          { label: 'Remove', onPress: () => {}, destructive: true },
        ]}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.light.bgAlt,
  },
  scrollContent: {
    paddingBottom: 60,
  },
  coverWrap: {
    height: COVER_HEIGHT + FOOTER_SPACE,
  },
  cover: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: COVER_HEIGHT,
  },
  coverFade: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: COVER_HEIGHT * 0.6 + FOOTER_SPACE,
  },
  coverBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.light.neutral.white,
  },
  circleButtonGlass: {
    width: 36,
    height: 36,
  },
  circleButtonInner: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarSection: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: COVER_HEIGHT - AVATAR_BOX / 2,
    alignItems: 'center',
  },
  avatarWrap: {
    padding: 4,
    backgroundColor: colors.light.bgAlt,
    borderRadius: 999,
  },
  cameraBadge: {
    position: 'absolute',
    right: 2,
    bottom: 2,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.light.primary[500],
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.light.bgAlt,
  },
  changePhoto: {
    marginTop: 10,
    fontSize: 14,
    fontWeight: '600',
    color: colors.light.primary[500],
  },
  form: {
    paddingHorizontal: 20,
    paddingTop: 8,
    gap: 18,
  },
  field: {
    gap: 0,
  },
  bioLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.light.textAlt,
    marginBottom: 8,
  },
  bioOptional: {
    fontWeight: '400',
    fontStyle: 'italic',
    color: colors.light.textSoft,
  },
  bioInput: {
    height: 130,
    borderWidth: 1.5,
    borderColor: colors.light.border,
    borderRadius: 16,
    backgroundColor: colors.light.surface,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: colors.light.text,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 999,
    backgroundColor: colors.light.surface,
  },
  tagSelected: {
    backgroundColor: colors.light.primary[500],
  },
  tagLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.light.text,
  },
  tagLabelSelected: {
    color: colors.light.neutral.white,
  },
  saveButton: {
    borderRadius: 999,
    marginTop: 8,
    backgroundColor: colors.light.primary[500],
  },
})
