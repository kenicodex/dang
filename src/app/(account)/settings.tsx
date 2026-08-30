import { ReactNode, useState } from 'react'
import { Pressable, ScrollView, StyleSheet, Switch, TextInput, View } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { router } from 'expo-router'
import { Icon } from '@/components/ui/Icon'
import type { SymbolViewProps } from 'expo-symbols'
import { SafeAreaView } from 'react-native-safe-area-context'

import { Avatar } from '@/components/ui/Avatar'
import { Text } from '@/components/ui/Text'
import { Button } from '@/components/ui/Button'
import { Sheet } from '@/components/ui/Sheet'
import { MOCK_PROFILE } from '@/components/account/profile.data'
import { useAuthStore } from '@/store/useAuthStore'
import { useUIStore } from '@/store/useUIStore'
import { colors } from '@/theme/colors'

type RowTone = 'default' | 'warning' | 'danger'

const TONE_COLORS: Record<RowTone, { bg: string; icon: string; title: string }> = {
  default: { bg: colors.light.primary[50], icon: colors.light.primary[600], title: colors.light.text },
  warning: { bg: colors.light.semantic.warningBg, icon: colors.light.semantic.warning, title: colors.light.semantic.warning },
  danger: { bg: colors.light.semantic.errorBg, icon: colors.light.semantic.error, title: colors.light.semantic.error },
}

const SESSIONS = [
  { id: 'session-1', device: 'iPhone 14 Pro', icon: 'iphone' as const, subtitle: 'Lagos, NG · This device · Now', current: true },
  { id: 'session-2', device: 'MacBook Pro', icon: 'laptopcomputer' as const, subtitle: 'Lagos, NG · Last active 2h ago', current: false },
]

function formatJoined(date: Date) {
  return new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(date)
}

function SettingsSection({ label, children }: { label: string; children: ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionLabel}>{label}</Text>
      <View style={styles.sectionCard}>{children}</View>
    </View>
  )
}

function SettingsRow({
  icon,
  title,
  subtitle,
  onPress,
  right,
  tone = 'default',
  isFirst,
}: {
  icon: SymbolViewProps['name']
  title: string
  subtitle?: string
  onPress?: () => void
  right?: ReactNode
  tone?: RowTone
  isFirst?: boolean
}) {
  const toneColors = TONE_COLORS[tone]
  return (
    <Pressable style={[styles.row, !isFirst && styles.rowDivider]} onPress={onPress} disabled={!onPress}>
      <View style={[styles.rowIcon, { backgroundColor: toneColors.bg }]}>
        <Icon name={icon} size={17} tintColor={toneColors.icon} />
      </View>
      <View style={styles.rowText}>
        <Text style={[styles.rowTitle, { color: toneColors.title }]}>{title}</Text>
        {!!subtitle && (
          <Text style={styles.rowSubtitle} numberOfLines={1}>
            {subtitle}
          </Text>
        )}
      </View>
      {right ?? (onPress && <Icon name="chevron.right" size={14} tintColor={colors.light.textSoft} />)}
    </Pressable>
  )
}

export default function SettingsScreen() {
  const authUser = useAuthStore(s => s.user)
  const logout = useAuthStore(s => s.logout)
  const openDrawer = useUIStore(s => s.openDrawer)
  const profile = authUser ?? MOCK_PROFILE

  const [pushEnabled, setPushEnabled] = useState(true)
  const [twoFAEnabled, setTwoFAEnabled] = useState(profile.has2FA)

  const [emailSheetVisible, setEmailSheetVisible] = useState(false)
  const [phoneSheetVisible, setPhoneSheetVisible] = useState(false)
  const [sessionsSheetVisible, setSessionsSheetVisible] = useState(false)
  const [blockedSheetVisible, setBlockedSheetVisible] = useState(false)
  const [logoutSheetVisible, setLogoutSheetVisible] = useState(false)

  const [newEmail, setNewEmail] = useState('')
  const [newPhone, setNewPhone] = useState('')

  const handleLogout = () => {
    setLogoutSheetVisible(false)
    logout()
    router.replace('/(auth)')
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.headerRow}>
        <Pressable onPress={openDrawer} hitSlop={8}>
          <Avatar uri={profile.avatarUrl} initials={profile.displayName.slice(0, 2).toUpperCase()} size="sm" />
        </Pressable>
        <Text variant="h3" style={styles.headerTitle}>
          Settings
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <LinearGradient
          colors={[colors.light.primary[500], colors.light.primary[700]]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.profileBanner}
        >
          <Avatar uri={profile.avatarUrl} initials={profile.displayName.slice(0, 2).toUpperCase()} size="md" />
          <View style={styles.profileBannerText}>
            <Text style={styles.profileBannerName}>{profile.displayName}</Text>
            <Text style={styles.profileBannerHandle}>{profile.handle}</Text>
            <View style={styles.tierBadge}>
              <Icon name="drop.fill" size={10} tintColor={colors.light.tertiary[600]} />
              <Text style={styles.tierBadgeText}>Growth Member</Text>
            </View>
          </View>
          <Pressable style={styles.editPill} onPress={() => router.push('/(account)/profile/edit')}>
            <Text style={styles.editPillText}>Edit</Text>
            <Icon name="chevron.right" size={11} tintColor={colors.light.neutral.white} />
          </Pressable>
        </LinearGradient>

        <SettingsSection label="Account">
          <SettingsRow
            icon="lock.fill"
            title="Change Password"
            subtitle="Update your login password"
            onPress={() => router.push('/(account)/security')}
            isFirst
          />
          <SettingsRow icon="phone" title="Phone Number" subtitle="+234 000-0000" onPress={() => setPhoneSheetVisible(true)} />
          <SettingsRow icon="envelope" title="Email Address" subtitle={profile.email} onPress={() => setEmailSheetVisible(true)} />
          <SettingsRow icon="globe" title="Language" subtitle="English" onPress={() => router.push('/(account)/language')} />
          <SettingsRow icon="shield.fill" title="Two-Factor Auth" subtitle="Add extra login security" right={
            <Switch
              value={twoFAEnabled}
              onValueChange={setTwoFAEnabled}
              trackColor={{ false: colors.light.border, true: colors.light.primary[500] }}
              thumbColor={colors.light.neutral.white}
            />
          } />
          <SettingsRow icon="checkmark.shield.fill" title="Active Sessions" subtitle="Manage signed-in devices" onPress={() => setSessionsSheetVisible(true)} />
        </SettingsSection>

        <SettingsSection label="Billing & Subscription">
          <SettingsRow
            icon="creditcard.fill"
            title="Subscription"
            subtitle="Growth · ₦10,000/mo · Renews Aug 1, 2026"
            onPress={() => router.push('/(account)/subscription')}
            isFirst
          />
          <SettingsRow icon="receipt" title="Payment History" subtitle="Receipts & invoices" onPress={() => router.push('/(account)/billing')} />
        </SettingsSection>

        <SettingsSection label="Notifications">
          <SettingsRow
            icon="bell.fill"
            title="Push Notifications"
            subtitle="Events, replies, mentions"
            isFirst
            right={
              <Switch
                value={pushEnabled}
                onValueChange={setPushEnabled}
                trackColor={{ false: colors.light.border, true: colors.light.primary[500] }}
                thumbColor={colors.light.neutral.white}
              />
            }
          />
        </SettingsSection>

        <SettingsSection label="Data & Privacy">
          <SettingsRow
            icon="arrow.down.circle"
            title="Export My Data"
            subtitle="Download all data · GDPR / NDPR"
            onPress={() => router.push('/(account)/data')}
            isFirst
          />
          <SettingsRow icon="person.2.slash.fill" title="Blocked Accounts" subtitle="0 accounts blocked" onPress={() => setBlockedSheetVisible(true)} />
          <SettingsRow icon="flag.fill" title="Report a Problem" subtitle="Let us know what's wrong" onPress={() => router.push('/(account)/report-problem')} />
          <SettingsRow icon="doc.text" title="Privacy Policy" subtitle="GDPR (UK) & NDPR (Nigeria)" onPress={() => router.push('/(account)/privacy-policy')} />
          <SettingsRow icon="doc.plaintext" title="Terms of Service" subtitle="Community guidelines & terms" onPress={() => router.push('/(account)/terms')} />
          <SettingsRow icon="questionmark.circle.fill" title="Help Centre" subtitle="FAQs, guides & support" onPress={() => {}} />
        </SettingsSection>

        <SettingsSection label="Account Actions">
          <SettingsRow
            icon="rectangle.portrait.and.arrow.right"
            title="Log Out"
            subtitle="Sign out of your account"
            onPress={() => setLogoutSheetVisible(true)}
            tone="warning"
            isFirst
          />
          <SettingsRow
            icon="trash.fill"
            title="Delete Account"
            subtitle="Permanently erase all your data (GDPR)"
            onPress={() => router.push('/(account)/delete-account')}
            tone="danger"
          />
        </SettingsSection>

        <Text style={styles.footer}>Member since {formatJoined(profile.createdAt)} · Dang v1.0</Text>
      </ScrollView>

      <Sheet visible={emailSheetVisible} onClose={() => setEmailSheetVisible(false)} title="Update Email Address">
        <Text style={styles.sheetLabel}>Email Address</Text>
        <TextInput
          value={newEmail}
          onChangeText={setNewEmail}
          placeholder="amara@gmail.com"
          placeholderTextColor={colors.light.textSoft}
          keyboardType="email-address"
          autoCapitalize="none"
          style={styles.sheetInput}
        />
        <Text style={styles.sheetHelper}>A verification link will be sent to your new email address.</Text>
        <Button title="Send Verification" style={styles.sheetButton} onPress={() => setEmailSheetVisible(false)} />
        <Pressable style={styles.sheetCancel} onPress={() => setEmailSheetVisible(false)}>
          <Text style={styles.sheetCancelText}>Cancel</Text>
        </Pressable>
      </Sheet>

      <Sheet visible={phoneSheetVisible} onClose={() => setPhoneSheetVisible(false)} title="Update Phone Number">
        <Text style={styles.sheetLabel}>Phone Number</Text>
        <View style={styles.phoneRow}>
          <View style={styles.phoneCode}>
            <Text style={styles.phoneCodeText}>+234</Text>
            <Icon name="chevron.down" size={11} tintColor={colors.light.textSoft} />
          </View>
          <TextInput
            value={newPhone}
            onChangeText={setNewPhone}
            placeholder="8219876123"
            placeholderTextColor={colors.light.textSoft}
            keyboardType="phone-pad"
            style={[styles.sheetInput, styles.phoneInput]}
          />
        </View>
        <Text style={styles.sheetHelper}>A verification code will be sent to your new phone number.</Text>
        <Button title="Save" style={styles.sheetButton} onPress={() => setPhoneSheetVisible(false)} />
        <Pressable style={styles.sheetCancel} onPress={() => setPhoneSheetVisible(false)}>
          <Text style={styles.sheetCancelText}>Cancel</Text>
        </Pressable>
      </Sheet>

      <Sheet visible={sessionsSheetVisible} onClose={() => setSessionsSheetVisible(false)} title="Active Sessions">
        <View style={styles.sessionsList}>
          {SESSIONS.map(session => (
            <View key={session.id} style={styles.sessionRow}>
              <View style={styles.sessionIcon}>
                <Icon name={session.icon} size={18} tintColor={colors.light.primary[600]} />
              </View>
              <View style={styles.rowText}>
                <Text style={styles.rowTitle}>{session.device}</Text>
                <Text style={styles.rowSubtitle}>{session.subtitle}</Text>
              </View>
              {session.current ? (
                <View style={styles.currentBadge}>
                  <Text style={styles.currentBadgeText}>Current</Text>
                </View>
              ) : (
                <Pressable>
                  <Text style={styles.signOutText}>Sign out</Text>
                </Pressable>
              )}
            </View>
          ))}
        </View>
        <Button
          title="Sign out on all other devices"
          variant="outline"
          style={styles.signOutAllButton}
          onPress={() => setSessionsSheetVisible(false)}
        />
      </Sheet>

      <Sheet visible={blockedSheetVisible} onClose={() => setBlockedSheetVisible(false)} title="Blocked Accounts">
        <View style={styles.blockedEmpty}>
          <View style={styles.blockedIconWrap}>
            <Icon name="person.crop.square" size={40} tintColor={colors.light.primary[400]} />
          </View>
          <Text style={styles.blockedTitle}>No blocked accounts</Text>
          <Text style={styles.blockedDescription}>
            Block someone from their profile to prevent them from seeing your posts or messaging you.
          </Text>
        </View>
        <Pressable style={styles.softButton} onPress={() => setBlockedSheetVisible(false)}>
          <Text style={styles.softButtonText}>Close</Text>
        </Pressable>
      </Sheet>

      <Sheet visible={logoutSheetVisible} onClose={() => setLogoutSheetVisible(false)} title="Logout of Dang?">
        <Text style={styles.sheetHelper}>You&rsquo;ll need to sign back in to access your account.</Text>
        <Pressable style={styles.dangerSoftButton} onPress={handleLogout}>
          <Text style={styles.dangerSoftButtonText}>Logout</Text>
        </Pressable>
        <Pressable style={styles.sheetCancel} onPress={() => setLogoutSheetVisible(false)}>
          <Text style={styles.sheetCancelText}>Cancel</Text>
        </Pressable>
      </Sheet>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.light.bgAlt,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  headerTitle: {
    fontSize: 20,
  },
  headerSpacer: {
    width: 32,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
    gap: 4,
  },
  profileBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderRadius: 20,
    padding: 16,
    marginBottom: 20,
  },
  profileBannerText: {
    flex: 1,
    gap: 6,
  },
  profileBannerName: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.light.neutral.white,
  },
  profileBannerHandle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.75)',
  },
  tierBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.18)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    marginTop: 2,
  },
  tierBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.light.neutral.white,
  },
  editPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(0,0,0,0.25)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
  },
  editPillText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.light.neutral.white,
  },
  section: {
    marginBottom: 20,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    color: colors.light.textSoft,
    marginBottom: 8,
    marginLeft: 4,
  },
  sectionCard: {
    backgroundColor: colors.light.bg,
    borderRadius: 18,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  rowDivider: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.light.border,
  },
  rowIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowText: {
    flex: 1,
  },
  rowTitle: {
    fontSize: 15,
    fontWeight: '600',
  },
  rowSubtitle: {
    fontSize: 13,
    color: colors.light.textMuted,
    marginTop: 2,
  },
  footer: {
    textAlign: 'center',
    fontSize: 12,
    color: colors.light.textSoft,
    marginTop: 8,
  },
  sheetLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.light.textAlt,
    marginBottom: 8,
  },
  sheetInput: {
    borderWidth: 1.5,
    borderColor: colors.light.border,
    borderRadius: 16,
    backgroundColor: colors.light.surface,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: colors.light.text,
  },
  sheetHelper: {
    fontSize: 13,
    color: colors.light.textMuted,
    marginTop: 10,
    lineHeight: 18,
  },
  sheetButton: {
    borderRadius: 999,
    backgroundColor: colors.light.primary[500],
    marginTop: 18,
  },
  sheetCancel: {
    alignItems: 'center',
    paddingVertical: 14,
  },
  sheetCancelText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.light.textMuted,
  },
  phoneRow: {
    flexDirection: 'row',
    gap: 10,
  },
  phoneCode: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderWidth: 1.5,
    borderColor: colors.light.border,
    borderRadius: 16,
    backgroundColor: colors.light.surface,
    paddingHorizontal: 14,
  },
  phoneCodeText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.light.text,
  },
  phoneInput: {
    flex: 1,
  },
  sessionsList: {
    gap: 10,
    marginBottom: 16,
  },
  sessionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.light.primary[50],
    borderRadius: 16,
    padding: 12,
  },
  sessionIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: colors.light.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  currentBadge: {
    backgroundColor: colors.light.semantic.successBg,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  currentBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.light.semantic.success,
  },
  signOutText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.light.semantic.error,
  },
  signOutAllButton: {
    borderRadius: 999,
    borderColor: colors.light.semantic.error,
  },
  blockedEmpty: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  blockedIconWrap: {
    width: 72,
    height: 72,
    borderRadius: 20,
    backgroundColor: colors.light.primary[50],
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  blockedTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.light.text,
    marginBottom: 6,
  },
  blockedDescription: {
    fontSize: 13,
    color: colors.light.textMuted,
    textAlign: 'center',
    lineHeight: 19,
  },
  softButton: {
    backgroundColor: colors.light.primary[50],
    borderRadius: 999,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  softButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.light.primary[600],
  },
  dangerSoftButton: {
    backgroundColor: colors.light.semantic.errorBg,
    borderRadius: 999,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 16,
  },
  dangerSoftButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.light.semantic.error,
  },
})
