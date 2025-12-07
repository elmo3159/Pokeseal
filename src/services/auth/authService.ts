// 認証サービス - Supabase Auth連携
import { getSupabase } from '@/services/supabase'
import type { Profile } from '@/types/database'

export interface AuthUser {
  id: string
  email: string | undefined
  profile: Profile | null
}

export interface SignUpData {
  email: string
  password: string
  username: string
  displayName?: string
}

export interface SignInData {
  email: string
  password: string
}

// 認証結果の型
export interface AuthResult<T = void> {
  success: boolean
  data?: T
  error?: string
}

// 認証サービス
export const authService = {
  // 現在のセッション取得
  async getSession() {
    const supabase = getSupabase()
    const { data, error } = await supabase.auth.getSession()

    if (error) {
      console.error('Session error:', error)
      return null
    }

    return data.session
  },

  // 現在のユーザー取得（プロフィール付き）
  async getCurrentUser(): Promise<AuthUser | null> {
    const supabase = getSupabase()
    const { data: { user }, error } = await supabase.auth.getUser()

    if (error || !user) {
      return null
    }

    // プロフィール取得
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    return {
      id: user.id,
      email: user.email,
      profile
    }
  },

  // ユーザー登録
  async signUp(data: SignUpData): Promise<AuthResult<AuthUser>> {
    const supabase = getSupabase()

    // ユーザー名の重複チェック
    const { data: existingUser } = await supabase
      .from('profiles')
      .select('id')
      .eq('username', data.username)
      .single()

    if (existingUser) {
      return {
        success: false,
        error: 'このユーザー名は既に使用されています'
      }
    }

    // Supabase Authでユーザー作成
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          username: data.username,
          display_name: data.displayName || data.username
        }
      }
    })

    if (authError) {
      return {
        success: false,
        error: getAuthErrorMessage(authError.message)
      }
    }

    if (!authData.user) {
      return {
        success: false,
        error: 'ユーザー作成に失敗しました'
      }
    }

    // プロフィール作成
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: authData.user.id,
        username: data.username,
        display_name: data.displayName || data.username,
        tutorial_completed: false
      })
      .select()
      .single()

    if (profileError) {
      console.error('Profile creation error:', profileError)
      // プロフィール作成失敗でもユーザーは作成されている
    }

    return {
      success: true,
      data: {
        id: authData.user.id,
        email: authData.user.email,
        profile
      }
    }
  },

  // ログイン
  async signIn(data: SignInData): Promise<AuthResult<AuthUser>> {
    const supabase = getSupabase()

    const { data: authData, error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password
    })

    if (error) {
      return {
        success: false,
        error: getAuthErrorMessage(error.message)
      }
    }

    if (!authData.user) {
      return {
        success: false,
        error: 'ログインに失敗しました'
      }
    }

    // プロフィール取得
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authData.user.id)
      .single()

    return {
      success: true,
      data: {
        id: authData.user.id,
        email: authData.user.email,
        profile
      }
    }
  },

  // ログアウト
  async signOut(): Promise<AuthResult> {
    const supabase = getSupabase()
    const { error } = await supabase.auth.signOut()

    if (error) {
      return {
        success: false,
        error: 'ログアウトに失敗しました'
      }
    }

    return { success: true }
  },

  // パスワードリセットメール送信
  async sendPasswordResetEmail(email: string): Promise<AuthResult> {
    const supabase = getSupabase()

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`
    })

    if (error) {
      return {
        success: false,
        error: getAuthErrorMessage(error.message)
      }
    }

    return { success: true }
  },

  // パスワード更新
  async updatePassword(newPassword: string): Promise<AuthResult> {
    const supabase = getSupabase()

    const { error } = await supabase.auth.updateUser({
      password: newPassword
    })

    if (error) {
      return {
        success: false,
        error: getAuthErrorMessage(error.message)
      }
    }

    return { success: true }
  },

  // プロフィール更新
  async updateProfile(updates: Partial<Profile>): Promise<AuthResult<Profile>> {
    const supabase = getSupabase()
    const user = await this.getCurrentUser()

    if (!user) {
      return {
        success: false,
        error: 'ログインが必要です'
      }
    }

    const { data, error } = await supabase
      .from('profiles')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', user.id)
      .select()
      .single()

    if (error) {
      return {
        success: false,
        error: 'プロフィールの更新に失敗しました'
      }
    }

    return {
      success: true,
      data
    }
  },

  // チュートリアル完了フラグ更新
  async completeTutorial(): Promise<AuthResult<Profile>> {
    return this.updateProfile({ tutorial_completed: true })
  },

  // 認証状態の変更を監視
  onAuthStateChange(callback: (user: AuthUser | null) => void) {
    const supabase = getSupabase()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event: string, session: { user: { id: string; email?: string } } | null) => {
        if (session?.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single()

          callback({
            id: session.user.id,
            email: session.user.email,
            profile
          })
        } else {
          callback(null)
        }
      }
    )

    return () => subscription.unsubscribe()
  }
}

// エラーメッセージの日本語変換
function getAuthErrorMessage(message: string): string {
  const errorMessages: Record<string, string> = {
    'Invalid login credentials': 'メールアドレスまたはパスワードが正しくありません',
    'Email not confirmed': 'メールアドレスが確認されていません',
    'User already registered': 'このメールアドレスは既に登録されています',
    'Password should be at least 6 characters': 'パスワードは6文字以上である必要があります',
    'Invalid email': 'メールアドレスの形式が正しくありません',
    'Signup requires a valid password': '有効なパスワードが必要です',
    'Email rate limit exceeded': '送信制限に達しました。しばらくお待ちください',
  }

  return errorMessages[message] || message
}

export default authService
