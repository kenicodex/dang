import * as SecureStore from 'expo-secure-store'

const ACCESS_TOKEN_KEY = 'dang.auth.accessToken'
const REFRESH_TOKEN_KEY = 'dang.auth.refreshToken'

export const authStorage = {
  async getAccessToken(): Promise<string | undefined> {
    return (await SecureStore.getItemAsync(ACCESS_TOKEN_KEY)) ?? undefined
  },
  async getRefreshToken(): Promise<string | undefined> {
    return (await SecureStore.getItemAsync(REFRESH_TOKEN_KEY)) ?? undefined
  },
  async setSession(accessToken: string, refreshToken: string): Promise<void> {
    await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, accessToken)
    await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refreshToken)
  },
  async clearSession(): Promise<void> {
    await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY)
    await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY)
  },
}
