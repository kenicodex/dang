import type { ExpoConfig } from 'expo/config'

type Variant = 'development' | 'preview' | 'production'

const VARIANT = (process.env.APP_VARIANT as Variant | undefined) ?? 'production'

const VARIANT_CONFIG: Record<Variant, { name: string; iosBundleId: string; androidPackage: string; scheme: string }> = {
  development: {
    name: 'dang (Dev)',
    iosBundleId: 'com.dang.dev',
    androidPackage: 'com.dang.dev',
    scheme: 'dang-dev',
  },
  preview: {
    name: 'dang (Preview)',
    iosBundleId: 'com.dang.preview',
    androidPackage: 'com.dang.preview',
    scheme: 'dang-preview',
  },
  production: {
    name: 'dang',
    iosBundleId: 'com.dang',
    androidPackage: 'com.dang',
    scheme: 'dang',
  },
}

const variant = VARIANT_CONFIG[VARIANT]

const config: ExpoConfig = {
  name: variant.name,
  slug: 'dang',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/images/icon.png',
  scheme: variant.scheme,
  userInterfaceStyle: 'automatic',
  ios: {
    icon: './assets/images/icon.png',
    bundleIdentifier: variant.iosBundleId,
  },
  android: {
    adaptiveIcon: {
      backgroundColor: '#2D25C0',
      foregroundImage: './assets/images/android-icon-foreground.png',
      backgroundImage: './assets/images/android-icon-background.png',
      monochromeImage: './assets/images/android-icon-monochrome.png',
    },
    predictiveBackGestureEnabled: false,
    package: variant.androidPackage,
  },
  web: {
    output: 'static',
    favicon: './assets/images/favicon.png',
  },
  plugins: [
    'expo-router',
    [
      'expo-splash-screen',
      {
        backgroundColor: '#F5F4F0',
        image: './assets/images/dang-logo-black.png',
        imageWidth: 180,
        dark: {
          backgroundColor: '#1A1A1A',
          image: './assets/images/dang-logo-white.png',
        },
      },
    ],
  ],
  experiments: {
    typedRoutes: true,
    reactCompiler: true,
  },
  updates: {
    url: 'https://u.expo.dev/998bd57e-854b-4dac-bd7d-a7d3a19b0b75',
  },
  runtimeVersion: {
    policy: 'appVersion',
  },
  extra: {
    eas: {
      projectId: '998bd57e-854b-4dac-bd7d-a7d3a19b0b75',
    },
  },
}

export default config
