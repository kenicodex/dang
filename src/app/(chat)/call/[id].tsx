import { useEffect, useState } from 'react'
import { Image } from 'expo-image'
import { Pressable, StyleSheet, View } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { router, useLocalSearchParams } from 'expo-router'
import { Icon } from '@/components/ui/Icon'
import type { SymbolViewProps } from 'expo-symbols'
import { SafeAreaView } from 'react-native-safe-area-context'

import { Text } from '@/components/ui/Text'
import { findThread } from '@/components/chat'
import { colors } from '@/theme/colors'

const WAVEFORM_HEIGHTS = [6, 12, 18, 10, 20, 8, 16, 22, 12, 6, 14, 20, 10, 18, 8, 16, 12, 20, 6, 14]

function formatTimer(totalSeconds: number) {
  const h = Math.floor(totalSeconds / 3600)
  const m = Math.floor((totalSeconds % 3600) / 60)
  const s = totalSeconds % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

export default function ActiveCallScreen() {
  const { id, kind } = useLocalSearchParams<{ id: string; kind?: string }>()
  const thread = findThread(id)
  const [videoOn, setVideoOn] = useState(kind === 'video')
  const [micOn, setMicOn] = useState(true)
  const [speakerOn, setSpeakerOn] = useState(false)
  const [seconds, setSeconds] = useState(4525)

  useEffect(() => {
    const interval = setInterval(() => setSeconds(s => s + 1), 1000)
    return () => clearInterval(interval)
  }, [])

  if (!thread) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <Text style={styles.emptyRoute}>This call is no longer available.</Text>
      </SafeAreaView>
    )
  }

  const avatarUrl = thread.avatarUrl ?? thread.memberAvatars?.[0]

  return (
    <View style={styles.root}>
      <Image source={{ uri: avatarUrl }} style={StyleSheet.absoluteFillObject} contentFit="cover" blurRadius={40} />
      <View style={styles.scrim} />

      <SafeAreaView style={styles.content} edges={['top', 'bottom']}>
        {videoOn ? (
          <View style={styles.pipWrap}>
            <View style={styles.pipRing}>
              <Image source={{ uri: avatarUrl }} style={styles.pipImage} contentFit="cover" />
            </View>
          </View>
        ) : (
          <View style={styles.centerAvatarWrap}>
            <LinearGradient
              colors={['#F59E0B', '#EC4899', '#6660E0']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.avatarRing}
            >
              <Image source={{ uri: avatarUrl }} style={styles.avatarImage} contentFit="cover" />
            </LinearGradient>
          </View>
        )}

        <View style={styles.infoBlock}>
          <View style={styles.waveform}>
            {WAVEFORM_HEIGHTS.map((h, i) => (
              <View key={i} style={[styles.waveformBar, { height: h }]} />
            ))}
          </View>
          <Text style={styles.name}>{thread.title}</Text>
          <View style={styles.timerRow}>
            <View style={styles.timerPill}>
              <View style={styles.timerDot} />
              <Text style={styles.timerText}>{formatTimer(seconds)}</Text>
            </View>
            <Pressable style={styles.addPersonButton} hitSlop={6}>
              <Icon name="person.badge.plus" size={15} tintColor={colors.light.neutral.white} />
            </Pressable>
          </View>
        </View>

        <View style={styles.controlsBar}>
          <CallControlButton
            icon={micOn ? 'mic.fill' : 'mic.slash.fill'}
            active={!micOn}
            onPress={() => setMicOn(v => !v)}
          />
          <CallControlButton
            icon={speakerOn ? 'speaker.wave.3.fill' : 'speaker.fill'}
            active={speakerOn}
            onPress={() => setSpeakerOn(v => !v)}
          />
          <CallControlButton icon="video.fill" active={videoOn} onPress={() => setVideoOn(v => !v)} />
          <CallControlButton icon="phone.down.fill" danger onPress={() => router.back()} />
        </View>
      </SafeAreaView>
    </View>
  )
}

function CallControlButton({
  icon,
  active,
  danger,
  onPress,
}: {
  icon: SymbolViewProps['name']
  active?: boolean
  danger?: boolean
  onPress?: () => void
}) {
  return (
    <Pressable
      style={[styles.controlButton, active && styles.controlButtonActive, danger && styles.controlButtonDanger]}
      onPress={onPress}
    >
      <Icon name={icon} size={20} tintColor={colors.light.neutral.white} />
    </Pressable>
  )
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#000',
  },
  emptyRoute: {
    padding: 20,
    color: colors.light.textMuted,
  },
  safeArea: {
    flex: 1,
  },
  scrim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    paddingTop: 40,
  },
  centerAvatarWrap: {
    alignItems: 'center',
    marginTop: 60,
  },
  avatarRing: {
    width: 168,
    height: 168,
    borderRadius: 84,
    padding: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 80,
    borderWidth: 3,
    borderColor: '#000',
  },
  pipWrap: {
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    marginTop: 20,
  },
  pipRing: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 3,
    borderColor: colors.light.primary[500],
    overflow: 'hidden',
  },
  pipImage: {
    width: '100%',
    height: '100%',
  },
  infoBlock: {
    alignItems: 'center',
    gap: 10,
  },
  waveform: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    height: 24,
  },
  waveformBar: {
    width: 2,
    borderRadius: 1,
    backgroundColor: 'rgba(255,255,255,0.85)',
  },
  name: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.light.neutral.white,
  },
  timerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  timerPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  timerDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.light.semantic.error,
  },
  timerText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.light.neutral.white,
  },
  addPersonButton: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  controlsBar: {
    flexDirection: 'row',
    alignSelf: 'center',
    gap: 16,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 999,
    padding: 10,
    marginBottom: 20,
  },
  controlButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  controlButtonActive: {
    backgroundColor: 'rgba(255,255,255,0.35)',
  },
  controlButtonDanger: {
    backgroundColor: colors.light.semantic.error,
  },
})
