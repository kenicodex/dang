import { useState } from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { Icon } from '@/components/ui/Icon'
import { StyleSheet, View } from 'react-native'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete'

import { Text } from '@/components/ui/Text'
import { FlowScreen } from '@/components/flow/FlowScreen'
import { StepHeader } from '@/components/flow/StepHeader'
import { NextFab } from '@/components/flow/NextFab'
import { FooterNote } from '@/components/flow/FooterNote'
import { colors } from '@/theme/colors'

const GOOGLE_PLACES_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY ?? ''

interface PlaceDetailAddressComponent {
  long_name: string
  short_name: string
  types: string[]
}

interface PlaceDetailLike {
  address_components?: PlaceDetailAddressComponent[]
}

function extractCityCountry(detail: PlaceDetailLike | null) {
  const components = detail?.address_components ?? []
  const find = (type: string) => components.find(c => c.types.includes(type))?.long_name
  const city = find('locality') ?? find('postal_town') ?? find('administrative_area_level_2')
  const country = find('country')
  return { city, country }
}

export default function LocationStepScreen() {
  const router = useRouter()
  const params = useLocalSearchParams<{ email?: string; password?: string; phone?: string; name?: string }>()
  const [city, setCity] = useState('')
  const [country, setCountry] = useState('')

  const canSubmit = !!city.trim()

  const goNext = () => router.push({ pathname: '/(onboarding)/field', params: { ...params, city, country } })

  return (
    <FlowScreen>
      <StepHeader onBack={() => router.back()} progress={3 / 5} />

      <View style={styles.container}>
        <Text style={styles.emoji}>📍</Text>
        <Text variant="h2">Where are you based?</Text>
        <Text style={styles.subtitle}>
          We&rsquo;ll connect you with sisters in your city. Your exact location is never shared.
        </Text>

        <GooglePlacesAutocomplete
          placeholder="search your city"
          fetchDetails
          minLength={2}
          debounce={300}
          enablePoweredByContainer={false}
          query={{ key: GOOGLE_PLACES_API_KEY, language: 'en', types: '(cities)' }}
          onPress={(_data, detail) => {
            const parsed = extractCityCountry(detail)
            if (parsed.city) setCity(parsed.city)
            if (parsed.country) setCountry(parsed.country)
          }}
          onFail={() => {}}
          textInputProps={{
            placeholderTextColor: colors.light.textSoft,
          }}
          renderLeftButton={() => (
            <View style={styles.searchIcon}>
              <Icon name="magnifyingglass" size={16} tintColor={colors.light.textSoft} />
            </View>
          )}
          styles={{
            container: styles.autocompleteContainer,
            textInputContainer: styles.searchField,
            textInput: styles.searchInput,
            listView: styles.listView,
            row: styles.resultRow,
            description: styles.resultText,
            separator: styles.resultSeparator,
          }}
        />

        {!!city && (
          <Text style={styles.selectedLocation}>
            Selected: {city}
            {country ? `, ${country}` : ''}
          </Text>
        )}
      </View>

      <View style={styles.footer}>
        <FooterNote icon="lock.shield.fill">Only your city is shown, never your address</FooterNote>
        <View style={styles.fabRow}>
          <NextFab onPress={goNext} disabled={!canSubmit} />
        </View>
      </View>
    </FlowScreen>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  emoji: {
    fontSize: 36,
    lineHeight: 44,
    marginBottom: 12,
  },
  subtitle: {
    color: colors.light.textMuted,
    marginTop: 8,
    marginBottom: 28,
  },
  autocompleteContainer: {
    flex: 0,
  },
  searchField: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 18,
    borderRadius: 999,
    backgroundColor: colors.light.surface,
    borderWidth: 1.5,
    borderColor: colors.light.border,
  },
  searchIcon: {
    justifyContent: 'center',
  },
  searchInput: {
    flex: 1,
    height: 50,
    fontSize: 15,
    color: colors.light.text,
    backgroundColor: 'transparent',
  },
  listView: {
    marginTop: 8,
    borderRadius: 16,
    backgroundColor: colors.light.surface,
    overflow: 'hidden',
  },
  resultRow: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.light.surface,
  },
  resultText: {
    fontSize: 14,
    color: colors.light.text,
  },
  resultSeparator: {
    height: 1,
    backgroundColor: colors.light.border,
  },
  selectedLocation: {
    marginTop: 14,
    fontSize: 13,
    color: colors.light.textMuted,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
  fabRow: {
    alignItems: 'flex-end',
    marginTop: 16,
  },
})
