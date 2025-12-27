'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { authService, AuthUser } from '@/services/auth/authService'

interface AuthContextType {
  user: AuthUser | null
  isLoading: boolean
  isAuthenticated: boolean
  userCode: string | null
  isAccountLinked: boolean
  linkedProviders: string[]
  refreshUser: () => Promise<void>
  linkGoogle: () => Promise<boolean>
  linkApple: () => Promise<boolean>
  signInWithGoogle: () => Promise<boolean>
  signInWithApple: () => Promise<boolean>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [linkedProviders, setLinkedProviders] = useState<string[]>([])

  // 連携状態を更新
  const updateLinkedProviders = async () => {
    const providers = await authService.getLinkedProviders()
    setLinkedProviders(providers)
  }

  // 初期化：認証を保証（未認証なら匿名ログイン）
  useEffect(() => {
    const initAuth = async () => {
      try {
        const authenticatedUser = await authService.ensureAuthenticated()
        setUser(authenticatedUser)
        if (authenticatedUser) {
          // 連携状態を取得
          await updateLinkedProviders()
        }
      } catch (error) {
        console.error('[AuthProvider] Auth initialization error:', error)
      } finally {
        setIsLoading(false)
      }
    }

    initAuth()

    // 認証状態の変更を監視
    const unsubscribe = authService.onAuthStateChange(async (newUser) => {
      setUser(newUser)
      if (newUser) {
        await updateLinkedProviders()
      }
    })

    return () => {
      unsubscribe()
    }
  }, [])

  // ユーザー情報を再取得
  const refreshUser = async () => {
    const currentUser = await authService.getCurrentUser()
    setUser(currentUser)
    await updateLinkedProviders()
  }

  // Googleアカウント連携
  const linkGoogle = async (): Promise<boolean> => {
    const result = await authService.linkGoogleAccount()
    return result.success
  }

  // Appleアカウント連携
  const linkApple = async (): Promise<boolean> => {
    const result = await authService.linkAppleAccount()
    return result.success
  }

  // Googleでサインイン
  const signInWithGoogle = async (): Promise<boolean> => {
    const result = await authService.signInWithGoogle()
    return result.success
  }

  // Appleでサインイン
  const signInWithApple = async (): Promise<boolean> => {
    const result = await authService.signInWithApple()
    return result.success
  }

  // anonymous以外のプロバイダーがあれば連携済み
  const isAccountLinked = linkedProviders.some(p => p !== 'anonymous')

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    userCode: user?.userCode || null,
    isAccountLinked,
    linkedProviders,
    refreshUser,
    linkGoogle,
    linkApple,
    signInWithGoogle,
    signInWithApple
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

// useAuth フック
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export default AuthContext
