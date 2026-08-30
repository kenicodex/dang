import { useState } from 'react'
import { Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native'
import { router } from 'expo-router'
import { Icon } from '@/components/ui/Icon'
import { SafeAreaView } from 'react-native-safe-area-context'

import { Text } from '@/components/ui/Text'
import { Button } from '@/components/ui/Button'
import { Checkbox } from '@/components/ui/Checkbox'
import { colors } from '@/theme/colors'

interface LanguageOption {
  code: string
  name: string
  flag: string
}

const LANGUAGES: LanguageOption[] = [
  { code: 'BR', name: 'Italian', flag: '🇮🇹' },
  { code: 'CN', name: 'Chinese', flag: '🇨🇳' },
  { code: 'FR', name: 'French', flag: '🇫🇷' },
  { code: 'DE', name: 'German', flag: '🇩🇪' },
  { code: 'JP', name: 'Japanese', flag: '🇯🇵' },
  { code: 'SP', name: 'Spanish', flag: '🇪🇸' },
  { code: 'UK', name: 'English', flag: '🇬🇧' },
  { code: 'US', name: 'English', flag: '🇺🇸' },
]

export default function LanguageScreen() {
  const [selectedCode, setSelectedCode] = useState('UK')
  const [query, setQuery] = useState('')

  const selectedLanguage = LANGUAGES.find(lang => lang.code === selectedCode)

  const visibleLanguages = LANGUAGES.filter(lang => lang.name.toLowerCase().includes(query.trim().toLowerCase()))

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.back()} hitSlop={8}>
          <Icon name="chevron.left" size={18} tintColor={colors.light.text} />
        </Pressable>
        <Text variant="h3" style={styles.headerTitle}>
          Language
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.body}>
        <Text style={styles.label}>Choose Language</Text>
        <View style={styles.selectedField}>
          <Text style={styles.selectedText}>{selectedLanguage?.name}</Text>
          <Icon name="chevron.down" size={14} tintColor={colors.light.textSoft} />
        </View>

        <View style={styles.searchField}>
          <Icon name="magnifyingglass" size={15} tintColor={colors.light.textSoft} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search"
            placeholderTextColor={colors.light.textSoft}
            style={styles.searchInput}
          />
        </View>

        <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
          {visibleLanguages.map(lang => (
            <Pressable
              key={lang.code}
              style={styles.langRow}
              onPress={() => setSelectedCode(lang.code)}
            >
              <Checkbox checked={selectedCode === lang.code} onChange={() => setSelectedCode(lang.code)} />
              <Text style={styles.langFlag}>{lang.flag}</Text>
              <Text style={styles.langName}>{lang.name}</Text>
              <Text style={styles.langCode}>{lang.code}</Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      <View style={styles.footer}>
        <Button title="Save" style={styles.saveButton} onPress={() => router.back()} />
        <Pressable style={styles.cancel} onPress={() => router.back()}>
          <Text style={styles.cancelText}>Cancel</Text>
        </Pressable>
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
  headerTitle: {
    fontSize: 18,
  },
  headerSpacer: {
    width: 40,
  },
  body: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.light.textAlt,
    marginBottom: 8,
  },
  selectedField: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1.5,
    borderColor: colors.light.border,
    borderRadius: 999,
    backgroundColor: colors.light.bg,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 16,
  },
  selectedText: {
    fontSize: 15,
    color: colors.light.text,
  },
  searchField: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: colors.light.bg,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: colors.light.text,
  },
  list: {
    flex: 1,
  },
  langRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.light.border,
  },
  langFlag: {
    fontSize: 20,
  },
  langName: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: colors.light.text,
  },
  langCode: {
    fontSize: 13,
    color: colors.light.textSoft,
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  saveButton: {
    borderRadius: 999,
    backgroundColor: colors.light.primary[500],
  },
  cancel: {
    alignItems: 'center',
    paddingVertical: 14,
  },
  cancelText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.light.textMuted,
  },
})
