// 認証サービス - Supabase Auth連携（匿名認証対応）
import { getSupabase } from '@/services/supabase'
import type { Profile } from '@/types/database'

export interface AuthUser {
  id: string
  email: string | undefined
  userCode: string | null // 6桁ユーザーコード
  isAnonymous: boolean
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

// ユーザー検索結果
export interface UserSearchResult {
  id: string
  userCode: string
  displayName: string | null
  avatarUrl: string | null
  totalStickers: number
  totalTrades: number
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
  // getSession() を使用してローカルストレージから高速に取得
  async getCurrentUser(): Promise<AuthUser | null> {
    const supabase = getSupabase()

    try {
      // タイムアウトなしでgetSessionを実行（Supabaseの内部処理を信頼）
      const result = await supabase.auth.getSession()

      const session = result.data.session
      const sessionError = result.error

      if (sessionError || !session?.user) {
        return null
      }

      // セッションが見つかった場合、プロフィール取得
      const user = session.user

      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      const isAnonymous = user.app_metadata?.provider === 'anonymous' ||
                          user.is_anonymous === true

      return {
        id: user.id,
        email: user.email,
        userCode: profile?.user_code || null,
        isAnonymous,
        profile
      }
    } catch (err) {
      console.error('[Auth] getSession threw an error:', err)
      return null
    }
  },

  // 現在のユーザー取得（セッションから）- 内部用
  async _getCurrentUserFromSession(): Promise<AuthUser | null> {
    const supabase = getSupabase()

    const { data: { session } } = await supabase.auth.getSession()
    if (!session?.user) return null

    const user = session.user

    // プロフィール取得
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    // 匿名ユーザーかどうかを判定
    const isAnonymous = user.app_metadata?.provider === 'anonymous' ||
                        user.is_anonymous === true

    return {
      id: user.id,
      email: user.email,
      userCode: profile?.user_code || null,
      isAnonymous,
      profile
    }
  },

  // 古いgetCurrentUser（参考用・削除予定）
  async getCurrentUserOld(): Promise<AuthUser | null> {
    console.log('[Auth] getCurrentUser called')
    const supabase = getSupabase()

    // getSession() はローカルストレージから取得するため高速
    console.log('[Auth] Calling supabase.auth.getSession()...')
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()

    console.log('[Auth] getSession result - session:', session ? 'exists' : 'null', 'error:', sessionError)

    if (sessionError || !session?.user) {
      console.log('[Auth] No session found')
      return null
    }

    const user = session.user

    // プロフィール取得
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    // 匿名ユーザーかどうかを判定
    const isAnonymous = user.app_metadata?.provider === 'anonymous' ||
                        user.is_anonymous === true

    return {
      id: user.id,
      email: user.email,
      userCode: profile?.user_code || null,
      isAnonymous,
      profile
    }
  },

  // 匿名サインイン（新規ユーザー作成）
  async signInAnonymously(): Promise<AuthResult<AuthUser>> {
    console.log('[Auth] signInAnonymously called')
    const supabase = getSupabase()

    console.log('[Auth] Calling supabase.auth.signInAnonymously()...')

    const startTime = Date.now()
    const { data: authData, error: authError } = await supabase.auth.signInAnonymously()
    const endTime = Date.now()

    console.log('[Auth] signInAnonymously completed in', endTime - startTime, 'ms')
    console.log('[Auth] signInAnonymously user:', authData?.user ? 'created' : 'null')
    console.log('[Auth] error from response:', authError)

    if (authError) {
      console.error('[Auth] Anonymous sign in error:', authError)
      return {
        success: false,
        error: '匿名ログインに失敗しました'
      }
    }

    if (!authData.user) {
      return {
        success: false,
        error: 'ユーザー作成に失敗しました'
      }
    }

    // プロフィール作成（user_codeはトリガーで自動生成）
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: authData.user.id,
        display_name: 'ゲスト',
        tutorial_completed: false
      })
      .select()
      .single()

    if (profileError) {
      console.error('Profile creation error:', profileError)
      // プロフィール作成失敗の場合は既存プロフィールを取得
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authData.user.id)
        .single()

      return {
        success: true,
        data: {
          id: authData.user.id,
          email: undefined,
          userCode: existingProfile?.user_code || null,
          isAnonymous: true,
          profile: existingProfile
        }
      }
    }

    console.log('[Auth] Anonymous user created with code:', profile.user_code)

    return {
      success: true,
      data: {
        id: authData.user.id,
        email: undefined,
        userCode: profile.user_code,
        isAnonymous: true,
        profile
      }
    }
  },

  // 認証を保証（未認証なら匿名ログイン）
  async ensureAuthenticated(): Promise<AuthUser | null> {
    // まず既存のセッションを確認
    const currentUser = await this.getCurrentUser()
    if (currentUser) {
      return currentUser
    }

    // 未認証なら匿名ログイン
    const result = await this.signInAnonymously()
    if (result.success && result.data) {
      return result.data
    }

    console.error('[Auth] Failed to ensure authentication')
    return null
  },

  // ユーザーコードで検索
  async searchUserByCode(userCode: string): Promise<UserSearchResult | null> {
    const supabase = getSupabase()

    // 6桁の数字かどうかチェック
    if (!/^\d{6}$/.test(userCode)) {
      return null
    }

    const { data, error } = await supabase
      .rpc('search_user_by_code', { p_user_code: userCode })

    if (error || !data || data.length === 0) {
      return null
    }

    const user = data[0]
    return {
      id: user.id,
      userCode: user.user_code,
      displayName: user.display_name,
      avatarUrl: user.avatar_url,
      totalStickers: user.total_stickers || 0,
      totalTrades: user.total_trades || 0
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
        userCode: profile?.user_code || null,
        isAnonymous: false,
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
        userCode: profile?.user_code || null,
        isAnonymous: false,
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
      (_event: string, session: { user: { id: string; email?: string; is_anonymous?: boolean; app_metadata?: { provider?: string } } } | null) => {
        if (session?.user) {
          const isAnonymous = session.user.app_metadata?.provider === 'anonymous' ||
                              session.user.is_anonymous === true

          // プロフィール情報を非同期で取得（コールバックをブロックしない）
          ;(async () => {
            try {
              const { data: profile } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', session.user.id)
                .single()

              callback({
                id: session.user.id,
                email: session.user.email,
                userCode: profile?.user_code || null,
                isAnonymous,
                profile
              })
            } catch (error) {
              console.error('[Auth] Failed to fetch profile:', error)
              // プロフィール取得失敗時もコールバックを呼ぶ（プロフィールなし）
              callback({
                id: session.user.id,
                email: session.user.email,
                userCode: null,
                isAnonymous,
                profile: null
              })
            }
          })()
        } else {
          callback(null)
        }
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  },

  // ============================================
  // アカウント連携（データ引き継ぎ用）
  // ============================================

  // Googleアカウントを連携（匿名→永続ユーザーへ変換）
  async linkGoogleAccount(): Promise<AuthResult> {
    const supabase = getSupabase()

    const { error } = await supabase.auth.linkIdentity({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    })

    if (error) {
      console.error('Link Google account error:', error)
      return {
        success: false,
        error: 'Googleアカウント連携に失敗しました'
      }
    }

    return { success: true }
  },

  // Appleアカウントを連携（iOS向け）
  async linkAppleAccount(): Promise<AuthResult> {
    const supabase = getSupabase()

    const { error } = await supabase.auth.linkIdentity({
      provider: 'apple',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    })

    if (error) {
      console.error('Link Apple account error:', error)
      return {
        success: false,
        error: 'Appleアカウント連携に失敗しました'
      }
    }

    return { success: true }
  },

  // Googleでサインイン（データ復元用）
  async signInWithGoogle(): Promise<AuthResult> {
    const supabase = getSupabase()

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    })

    if (error) {
      console.error('Sign in with Google error:', error)
      return {
        success: false,
        error: 'Googleログインに失敗しました'
      }
    }

    return { success: true }
  },

  // Appleでサインイン（データ復元用）
  async signInWithApple(): Promise<AuthResult> {
    const supabase = getSupabase()

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'apple',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    })

    if (error) {
      console.error('Sign in with Apple error:', error)
      return {
        success: false,
        error: 'Appleログインに失敗しました'
      }
    }

    return { success: true }
  },

  // 連携済みプロバイダーを取得
  async getLinkedProviders(): Promise<string[]> {
    const supabase = getSupabase()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return []

    // identitiesから連携済みプロバイダーを抽出
    const providers = user.identities?.map(identity => identity.provider) || []
    return providers
  },

  // アカウント連携済みかどうか
  async isAccountLinked(): Promise<boolean> {
    const providers = await this.getLinkedProviders()
    // anonymous以外のプロバイダーがあれば連携済み
    return providers.some(p => p !== 'anonymous')
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
