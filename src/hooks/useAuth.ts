'use client'

import { useState, useEffect, useCallback } from 'react'
import { authService, type AuthUser, type SignUpData, type SignInData } from '@/services/auth'

interface UseAuthReturn {
  user: AuthUser | null
  loading: boolean
  error: string | null
  signUp: (data: SignUpData) => Promise<boolean>
  signIn: (data: SignInData) => Promise<boolean>
  signOut: () => Promise<void>
  updateProfile: (updates: Partial<NonNullable<AuthUser['profile']>>) => Promise<boolean>
  completeTutorial: () => Promise<boolean>
  clearError: () => void
}

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // 初期ロード時にセッション確認
  useEffect(() => {
    const checkSession = async () => {
      try {
        const currentUser = await authService.getCurrentUser()
        setUser(currentUser)
      } catch (err) {
        console.error('Session check error:', err)
      } finally {
        setLoading(false)
      }
    }

    checkSession()

    // 認証状態の変更を監視
    const unsubscribe = authService.onAuthStateChange((authUser) => {
      setUser(authUser)
      setLoading(false)
    })

    return unsubscribe
  }, [])

  // ユーザー登録
  const signUp = useCallback(async (data: SignUpData): Promise<boolean> => {
    setLoading(true)
    setError(null)

    const result = await authService.signUp(data)

    if (result.success && result.data) {
      setUser(result.data)
    } else {
      setError(result.error || '登録に失敗しました')
    }

    setLoading(false)
    return result.success
  }, [])

  // ログイン
  const signIn = useCallback(async (data: SignInData): Promise<boolean> => {
    setLoading(true)
    setError(null)

    const result = await authService.signIn(data)

    if (result.success && result.data) {
      setUser(result.data)
    } else {
      setError(result.error || 'ログインに失敗しました')
    }

    setLoading(false)
    return result.success
  }, [])

  // ログアウト
  const signOut = useCallback(async (): Promise<void> => {
    setLoading(true)
    setError(null)

    const result = await authService.signOut()

    if (result.success) {
      setUser(null)
    } else {
      setError(result.error || 'ログアウトに失敗しました')
    }

    setLoading(false)
  }, [])

  // プロフィール更新
  const updateProfile = useCallback(async (
    updates: Partial<NonNullable<AuthUser['profile']>>
  ): Promise<boolean> => {
    setError(null)

    const result = await authService.updateProfile(updates as Parameters<typeof authService.updateProfile>[0])

    if (result.success && result.data && user) {
      setUser({
        ...user,
        profile: result.data
      })
    } else {
      setError(result.error || 'プロフィールの更新に失敗しました')
    }

    return result.success
  }, [user])

  // チュートリアル完了
  const completeTutorial = useCallback(async (): Promise<boolean> => {
    const result = await authService.completeTutorial()

    if (result.success && user?.profile) {
      setUser({
        ...user,
        profile: {
          ...user.profile,
          tutorial_completed: true
        }
      })
    }

    return result.success
  }, [user])

  // エラークリア
  const clearError = useCallback(() => {
    setError(null)
  }, [])

  return {
    user,
    loading,
    error,
    signUp,
    signIn,
    signOut,
    updateProfile,
    completeTutorial,
    clearError
  }
}

export default useAuth
