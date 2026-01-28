import { getSupabase } from '@/services/supabase/client'
import type { ContactCategory, ContactFormData } from '@/features/settings/ContactFormModal'

// デバイス情報を取得
function getDeviceInfo(): Record<string, string> {
  if (typeof window === 'undefined') {
    return {}
  }

  return {
    userAgent: navigator.userAgent,
    platform: navigator.platform,
    language: navigator.language,
    screenWidth: String(window.screen.width),
    screenHeight: String(window.screen.height),
    viewportWidth: String(window.innerWidth),
    viewportHeight: String(window.innerHeight),
  }
}

// カテゴリの日本語ラベル
const CATEGORY_LABELS: Record<ContactCategory, string> = {
  bug: 'バグ・不具合',
  feature: '機能のリクエスト',
  account: 'アカウント',
  other: 'その他',
}

export interface ContactSubmitResult {
  success: boolean
  inquiryId?: string
  error?: string
}

class ContactService {
  /**
   * お問い合わせを送信
   * 1. Supabaseに保存（バックアップ）
   * 2. Edge Functionでメール送信
   */
  async submitInquiry(
    data: ContactFormData,
    userId?: string,
    userCode?: string
  ): Promise<ContactSubmitResult> {
    try {
      const deviceInfo = getDeviceInfo()

      // 1. Supabaseに保存
      const supabase = getSupabase()
      const { data: inquiry, error: dbError } = await supabase
        .from('contact_inquiries')
        .insert({
          user_id: userId || null,
          user_code: userCode || null,
          user_email: data.email || null,
          category: data.category,
          message: data.message,
          device_info: deviceInfo,
          app_version: '1.0.0',
          status: 'pending',
        })
        .select('id')
        .single()

      if (dbError) {
        console.error('Failed to save inquiry to database:', dbError)
        // DBエラーでもメール送信を試みる
      }

      // 2. Edge Functionでメール送信
      try {
        const { error: fnError } = await supabase.functions.invoke('send-contact-email', {
          body: {
            category: data.category,
            categoryLabel: CATEGORY_LABELS[data.category],
            email: data.email,
            message: data.message,
            userCode: userCode || '未ログイン',
            userId: userId || null,
            deviceInfo,
            inquiryId: inquiry?.id || null,
          },
        })

        if (fnError) {
          console.error('Failed to send email via Edge Function:', fnError)
          // メール送信失敗でもDBに保存されていれば成功とする
        }
      } catch (emailError) {
        console.error('Edge Function call failed:', emailError)
        // Edge Functionがない場合やエラーでもDBに保存されていればOK
      }

      // DBに保存できていれば成功
      if (inquiry?.id) {
        return {
          success: true,
          inquiryId: inquiry.id,
        }
      }

      // DBにも保存できなかった場合
      return {
        success: false,
        error: 'お問い合わせの送信に失敗しました',
      }
    } catch (error) {
      console.error('Contact submission error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : '予期せぬエラーが発生しました',
      }
    }
  }

  /**
   * 自分のお問い合わせ履歴を取得
   */
  async getMyInquiries(userId: string) {
    const supabase = getSupabase()
    const { data, error } = await supabase
      .from('contact_inquiries')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Failed to fetch inquiries:', error)
      return []
    }

    return data
  }
}

export const contactService = new ContactService()
