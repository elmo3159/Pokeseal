import { Capacitor } from '@capacitor/core'
import { Preferences } from '@capacitor/preferences'
import { SecureStoragePlugin } from 'capacitor-secure-storage-plugin'

const REFRESH_TOKEN_KEY = 'pokeseal_refresh_token_v1'

type SecureStorageApi = {
  get: (options: { key: string }) => Promise<{ value?: string | null }>
  set: (options: { key: string; value: string }) => Promise<{ value: boolean }>
  remove: (options: { key: string }) => Promise<{ value: boolean }>
}

function getSecureStorage(): SecureStorageApi | null {
  if (!SecureStoragePlugin) return null
  return SecureStoragePlugin as unknown as SecureStorageApi
}

export function isIosNative(): boolean {
  return Capacitor.isNativePlatform() && Capacitor.getPlatform() === 'ios'
}

export function isAutoRestoreSupported(): boolean {
  return isIosNative() && !!getSecureStorage()
}

export async function readRefreshToken(): Promise<string | null> {
  if (isIosNative()) {
    const secure = getSecureStorage()
    if (!secure) {
      return null
    }
    try {
      const result = await secure.get({ key: REFRESH_TOKEN_KEY })
      return result?.value ?? null
    } catch (error) {
      console.error('[DeviceRestore] Failed to read token from secure storage:', error)
      return null
    }
  }

  // Web/その他はPreferencesに保存（アンインストールで消える）
  try {
    const result = await Preferences.get({ key: REFRESH_TOKEN_KEY })
    return result.value ?? null
  } catch (error) {
    console.error('[DeviceRestore] Failed to read token from preferences:', error)
    return null
  }
}

export async function writeRefreshToken(token: string | null): Promise<void> {
  if (isIosNative()) {
    const secure = getSecureStorage()
    if (!secure) return
    try {
      if (token) {
        await secure.set({ key: REFRESH_TOKEN_KEY, value: token })
      } else {
        await secure.remove({ key: REFRESH_TOKEN_KEY })
      }
    } catch (error) {
      console.error('[DeviceRestore] Failed to write token to secure storage:', error)
    }
    return
  }

  try {
    if (token) {
      await Preferences.set({ key: REFRESH_TOKEN_KEY, value: token })
    } else {
      await Preferences.remove({ key: REFRESH_TOKEN_KEY })
    }
  } catch (error) {
    console.error('[DeviceRestore] Failed to write token to preferences:', error)
  }
}
