# Dang

Dang is a community app for women — daily faith content and streaks, community Spaces, live and in-person Events, a Learning Hub, Dang Lifestyle commerce, subscriptions/billing, chat, and a leaderboard — built with [Expo](https://expo.dev) and [expo-router](https://docs.expo.dev/router/introduction).

## Tech stack

- **Expo SDK 57** + React Native, TypeScript
- **expo-router** for file-based navigation (see [Project structure](#project-structure))
- **Zustand** for state (`src/store`)
- **EAS Build** for development/preview/production variants (see [Builds](#builds-eas))

## Getting started

```bash
npm install
npx expo start
```

From the Expo CLI output you can open the app in a development build, an Android emulator, an iOS simulator, or Expo Go.

You can start developing by editing files inside `src/app` — this project uses expo-router's file-based routing.

### Scripts

| Script | Description |
| --- | --- |
| `npm run start` | Start the Metro dev server |
| `npm run ios` | Build and run the native iOS app (`expo run:ios`) |
| `npm run android` | Build and run the native Android app (`expo run:android`) |
| `npm run web` | Start the app in a browser |
| `npm run lint` | Run `expo lint` |
| `npm run reset-project` | Move the starter code aside and start from a blank `app/` (see Expo's docs) |

## Project structure

```
src/
  app/            expo-router routes, grouped by feature
    (auth)/        sign in, sign up, phone verification
    (onboarding)/  plan selection, welcome flow
    (tabs)/        bottom-tab shell (Home, Spaces, Events, Chat)
    (account)/     profile, settings, subscription, billing, leaderboard
    (community)/   Spaces feed, channels, threads, posts, search
    (events)/      event discovery, detail, RSVP + payment, calendar, live rooms
    (learning)/    courses and live sessions
    (circles)/     private circles
    (lifestyle)/   Dang Lifestyle commerce (drops, tester program)
    (chat)/        direct messaging
    (founder)/     founder-exclusive content
  components/     feature-scoped UI, one folder per feature area, plus components/ui for the shared design-system primitives (Button, Card, Input, Sheet, Tabs, ...)
  store/          Zustand stores (auth, community, events, billing, learning, chat, members, support, UI)
  theme/          design tokens — colors, spacing, radii, shadows, typography
  types/          shared TypeScript types per domain
  services/       data-layer services
```

## Builds (EAS)

The app config is dynamic (`app.config.ts`), driven by an `APP_VARIANT` env var so development/preview/production can be installed side by side on one device, each with its own bundle ID and app name:

| Variant | App name | iOS bundle ID | Android package |
| --- | --- | --- | --- |
| `development` | dang (Dev) | `com.dang.dev` | `com.dang.dev` |
| `preview` | dang (Preview) | `com.dang.preview` | `com.dang.preview` |
| `production` | dang | `com.dang` | `com.dang` |

Build profiles live in `eas.json`:

```bash
eas build --profile development --platform ios     # dev client, simulator build
eas build --profile preview --platform all         # internal distribution
eas build --profile production --platform all       # store distribution
```

## Learn more

- [Expo documentation](https://docs.expo.dev/)
- [expo-router documentation](https://docs.expo.dev/router/introduction/)
- [EAS Build documentation](https://docs.expo.dev/build/introduction/)
