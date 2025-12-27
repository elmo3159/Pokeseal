/**
 * 招待システムサービス
 * - 招待コードの生成・管理
 * - 招待の適用
 * - 招待報酬の管理
 */

import { getSupabase } from '@/services/supabase/client'

// Supabaseクライアントを取得
const getClient = () => getSupabase()

// =====================================================
// 型定義
// =====================================================

export interface InvitationStats {
  invitationCode: string
  totalInvites: number
  monthlyInvites: number
  monthlyLimit: number
  remainingInvites: number
  unclaimedRewards: number
  wasInvited: boolean
  inviteeRewardClaimed: boolean
}

export interface InvitationRecord {
  id: string
  inviteeId: string
  inviteeName: string | null
  rewardClaimed: boolean
  createdAt: string
}

export interface InvitationReward {
  tickets: number
  gems: number
}

export interface ApplyInvitationResult {
  success: boolean
  error?: 'invalid_code' | 'self_invite' | 'already_invited' | 'monthly_limit_reached'
  inviterId?: string
}

export interface ClaimRewardResult {
  success: boolean
  error?: string
  rewards?: InvitationReward
}

// =====================================================
// 報酬設定（定数）
// =====================================================

export const INVITATION_REWARDS = {
  // 招待した人への報酬
  INVITER: {
    tickets: 10,
    gems: 1,
  },
  // 招待された人への報酬
  INVITEE: {
    tickets: 15,
    gems: 1,
  },
  // 月間招待上限
  MONTHLY_LIMIT: 50,
} as const

// =====================================================
// サービス関数
// =====================================================

/**
 * ユーザーの招待統計を取得
 */
export async function getInvitationStats(userId: string): Promise<InvitationStats | null> {
  // 空のuserIdの場合は即座にnullを返す
  if (!userId || userId.trim() === '') {
    return null
  }

  try {
    const { data, error } = await getClient().rpc('get_invitation_stats', {
      p_user_id: userId,
    })

    if (error || !data) {
      // RLSポリシー違反やテーブル未作成はサイレントに処理（機能未実装時の正常なケース）
      return null
    }

    const result = data as any
    return {
      invitationCode: result.invitation_code,
      totalInvites: result.total_invites,
      monthlyInvites: result.monthly_invites,
      monthlyLimit: result.monthly_limit,
      remainingInvites: result.remaining_invites,
      unclaimedRewards: result.unclaimed_rewards,
      wasInvited: result.was_invited,
      inviteeRewardClaimed: result.invitee_reward_claimed,
    }
  } catch (err) {
    console.error('[InvitationService] Exception getting stats:', err)
    return null
  }
}

/**
 * 招待コードを取得（存在しなければ生成）
 */
export async function getOrCreateInvitationCode(userId: string): Promise<string | null> {
  try {
    const { data, error } = await getClient().rpc('get_or_create_invitation_code', {
      p_user_id: userId,
    })

    if (error) {
      console.error('[InvitationService] Error getting/creating code:', error)
      return null
    }

    return data
  } catch (err) {
    console.error('[InvitationService] Exception getting/creating code:', err)
    return null
  }
}

/**
 * 招待コードを適用（新規ユーザーが招待コードを入力した時）
 */
export async function applyInvitationCode(
  inviteeId: string,
  invitationCode: string
): Promise<ApplyInvitationResult> {
  try {
    const { data, error } = await getClient().rpc('apply_invitation', {
      p_invitee_id: inviteeId,
      p_invitation_code: invitationCode.toUpperCase(),
    })

    if (error || !data) {
      console.error('[InvitationService] Error applying invitation:', error)
      return { success: false, error: 'invalid_code' }
    }

    const result = data as any
    if (!result.success) {
      return { success: false, error: result.error }
    }

    return {
      success: true,
      inviterId: result.inviter_id,
    }
  } catch (err) {
    console.error('[InvitationService] Exception applying invitation:', err)
    return { success: false, error: 'invalid_code' }
  }
}

/**
 * 招待した人の報酬を受け取る
 */
export async function claimInviterReward(
  userId: string,
  invitationId: string
): Promise<ClaimRewardResult> {
  try {
    const { data, error } = await getClient().rpc('claim_inviter_reward', {
      p_user_id: userId,
      p_invitation_id: invitationId,
    })

    if (error || !data) {
      console.error('[InvitationService] Error claiming inviter reward:', error)
      return { success: false, error: 'database_error' }
    }

    const result = data as any
    if (!result.success) {
      return { success: false, error: result.error }
    }

    return {
      success: true,
      rewards: {
        tickets: result.rewards.tickets,
        gems: result.rewards.gems,
      },
    }
  } catch (err) {
    console.error('[InvitationService] Exception claiming inviter reward:', err)
    return { success: false, error: 'unknown_error' }
  }
}

/**
 * 招待された人の報酬を受け取る
 */
export async function claimInviteeReward(userId: string): Promise<ClaimRewardResult> {
  try {
    const { data, error } = await getClient().rpc('claim_invitee_reward', {
      p_user_id: userId,
    })

    if (error || !data) {
      console.error('[InvitationService] Error claiming invitee reward:', error)
      return { success: false, error: 'database_error' }
    }

    const result = data as any
    if (!result.success) {
      return { success: false, error: result.error }
    }

    return {
      success: true,
      rewards: {
        tickets: result.rewards.tickets,
        gems: result.rewards.gems,
      },
    }
  } catch (err) {
    console.error('[InvitationService] Exception claiming invitee reward:', err)
    return { success: false, error: 'unknown_error' }
  }
}

/**
 * 招待リストを取得
 */
export async function getInvitationList(userId: string): Promise<InvitationRecord[]> {
  try {
    const { data, error } = await getClient().rpc('get_invitation_list', {
      p_user_id: userId,
    })

    if (error || !data) {
      console.error('[InvitationService] Error getting invitation list:', error)
      return []
    }

    const items = (Array.isArray(data) ? data : []) as any[]
    return items.map((item) => ({
      id: item.id,
      inviteeId: item.invitee_id,
      inviteeName: item.invitee_name,
      rewardClaimed: item.reward_claimed,
      createdAt: item.created_at,
    }))
  } catch (err) {
    console.error('[InvitationService] Exception getting invitation list:', err)
    return []
  }
}

/**
 * 招待リンクを生成
 */
export function generateInvitationLink(invitationCode: string): string {
  // アプリのディープリンク形式
  // Capacitorでの実装時は pokeseal://invite?code=XXXX 形式
  // Webの場合は https://pokeseal.app/invite?code=XXXX 形式
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://pokeseal.app'
  return `${baseUrl}/invite?code=${invitationCode}`
}

/**
 * 招待メッセージを生成（シェア用）
 */
export function generateInvitationMessage(invitationCode: string, userName: string): string {
  return `${userName}さんからポケシルへの招待だよ！🎉

かわいいシールを集めて、自分だけのシール帳を作ろう！

📱 招待コード: ${invitationCode}
🎁 特典: シルチケ15枚 + プレシル1枚がもらえるよ！

${generateInvitationLink(invitationCode)}`
}

/**
 * 招待コードをクリップボードにコピー
 */
export async function copyInvitationCode(invitationCode: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(invitationCode)
    return true
  } catch {
    // フォールバック
    const textarea = document.createElement('textarea')
    textarea.value = invitationCode
    document.body.appendChild(textarea)
    textarea.select()
    try {
      document.execCommand('copy')
      document.body.removeChild(textarea)
      return true
    } catch {
      document.body.removeChild(textarea)
      return false
    }
  }
}

/**
 * 招待メッセージをシェア
 */
export async function shareInvitation(
  invitationCode: string,
  userName: string
): Promise<boolean> {
  const message = generateInvitationMessage(invitationCode, userName)

  if (navigator.share) {
    try {
      await navigator.share({
        title: 'ポケシルへの招待',
        text: message,
      })
      return true
    } catch (err) {
      // ユーザーがキャンセルした場合など
      console.log('[InvitationService] Share cancelled or failed:', err)
      return false
    }
  } else {
    // Web Share APIが使えない場合はクリップボードにコピー
    return copyInvitationCode(message)
  }
}
