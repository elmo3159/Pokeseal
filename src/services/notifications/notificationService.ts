// 通知サービス - Capacitor Push/Local Notifications を管理
import { Capacitor } from '@capacitor/core'
import { PushNotifications, Token, ActionPerformed, PushNotificationSchema } from '@capacitor/push-notifications'
import { LocalNotifications, ScheduleResult } from '@capacitor/local-notifications'
import { getSupabase } from '@/services/supabase'

// 通知タイプ
export type NotificationType =
  | 'trade_request'      // 交換リクエスト
  | 'trade_accepted'     // 交換承認
  | 'trade_rejected'     // 交換拒否
  | 'friend_request'     // フレンドリクエスト
  | 'new_sticker'        // 新シール追加
  | 'contest'            // コンテスト
  | 'level_up'           // レベルアップ
  | 'achievement'        // 実績解除
  | 'daily_bonus'        // デイリーボーナス

// 通知データ型
export interface NotificationData {
  type: NotificationType
  title: string
  body: string
  data?: Record<string, unknown>
}

// デバイストークン保存用
interface DeviceToken {
  userId: string
  token: string
  platform: 'ios' | 'android' | 'web'
}

// デイリーボーナス通知のID（固定値で管理）
const DAILY_BONUS_NOTIFICATION_ID = 70000

class NotificationService {
  private initialized = false
  private currentUserId: string | null = null
  private notificationSettings: {
    tradeRequests: boolean
    friendRequests: boolean
    newStickers: boolean
    contests: boolean
    dailyBonus: boolean
  } = {
    tradeRequests: true,
    friendRequests: true,
    newStickers: true,
    contests: true,
    dailyBonus: true,
  }

  /**
   * 通知サービスを初期化
   */
  async initialize(userId: string): Promise<void> {
    if (this.initialized && this.currentUserId === userId) return

    this.currentUserId = userId

    // ネイティブ環境でのみプッシュ通知を初期化
    if (Capacitor.isNativePlatform()) {
      await this.initializePushNotifications()
    }

    // ローカル通知は常に初期化
    await this.initializeLocalNotifications()

    // デイリーボーナス通知をスケジュール
    await this.scheduleDailyBonusNotification()

    this.initialized = true
  }

  /**
   * プッシュ通知の初期化
   */
  private async initializePushNotifications(): Promise<void> {
    try {
      // 権限をリクエスト
      const permissionStatus = await PushNotifications.requestPermissions()

      if (permissionStatus.receive === 'granted') {
        // 登録
        await PushNotifications.register()

        // トークン受信リスナー
        PushNotifications.addListener('registration', async (token: Token) => {
          await this.saveDeviceToken(token.value)
        })

        // 登録エラーリスナー
        PushNotifications.addListener('registrationError', (error) => {
          console.error('[Push] 登録エラー:', error)
        })

        // 通知受信リスナー（フォアグラウンド）
        PushNotifications.addListener('pushNotificationReceived',
          (notification: PushNotificationSchema) => {
            // フォアグラウンドではローカル通知で表示
            this.showLocalNotification({
              type: notification.data?.type as NotificationType || 'trade_request',
              title: notification.title || 'ポケシル',
              body: notification.body || '',
              data: notification.data,
            })
          }
        )

        // 通知タップリスナー
        PushNotifications.addListener('pushNotificationActionPerformed',
          (notification: ActionPerformed) => {
            this.handleNotificationTap(notification.notification.data)
          }
        )
      }
    } catch (error) {
      console.error('[Push] 初期化エラー:', error)
    }
  }

  /**
   * ローカル通知の初期化
   */
  private async initializeLocalNotifications(): Promise<void> {
    try {
      const permission = await LocalNotifications.requestPermissions()

      if (permission.display === 'granted') {
        // 通知タップリスナー
        LocalNotifications.addListener('localNotificationActionPerformed',
          (notification) => {
            this.handleNotificationTap(notification.notification.extra)
          }
        )
      }
    } catch (error) {
      console.error('[Local] 初期化エラー:', error)
    }
  }

  /**
   * デイリーボーナス通知をスケジュール（毎日朝7時JST）
   */
  async scheduleDailyBonusNotification(): Promise<void> {
    if (!this.notificationSettings.dailyBonus) {
      return
    }

    try {
      // 既存の通知をキャンセル
      await this.cancelDailyBonusNotification()

      // 次の7時を計算（JST = UTC+9）
      const now = new Date()
      const jstOffset = 9 * 60 * 60 * 1000
      const jstNow = new Date(now.getTime() + jstOffset)

      const next7AM = new Date(jstNow)
      next7AM.setUTCHours(7, 0, 0, 0)

      // 既に7時を過ぎていたら翌日
      if (jstNow.getUTCHours() >= 7) {
        next7AM.setUTCDate(next7AM.getUTCDate() + 1)
      }

      // JSTからローカル時間に変換
      const scheduledTime = new Date(next7AM.getTime() - jstOffset)

      await LocalNotifications.schedule({
        notifications: [
          {
            id: DAILY_BONUS_NOTIFICATION_ID,
            title: '今日のシルチケが届いたよ！',
            body: 'シルチケ3枚をプレゼント🎁 ガチャを回しにきてね！',
            schedule: {
              at: scheduledTime,
              repeats: true,
              every: 'day',
            },
            smallIcon: 'ic_notification',
            largeIcon: 'ic_launcher',
            extra: { type: 'daily_bonus' },
          },
        ],
      })
    } catch (error) {
      console.error('[NotificationService] デイリーボーナス通知スケジュールエラー:', error)
    }
  }

  /**
   * デイリーボーナス通知をキャンセル
   */
  async cancelDailyBonusNotification(): Promise<void> {
    try {
      await LocalNotifications.cancel({
        notifications: [{ id: DAILY_BONUS_NOTIFICATION_ID }],
      })
    } catch {
      // 通知が存在しない場合のエラーは無視
    }
  }

  /**
   * デバイストークンをSupabaseに保存
   */
  private async saveDeviceToken(token: string): Promise<void> {
    if (!this.currentUserId) return

    const supabase = getSupabase()
    const platform = Capacitor.getPlatform() as 'ios' | 'android' | 'web'

    // 既存のトークンを更新または新規作成
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase as any)
      .from('device_tokens')
      .upsert({
        user_id: this.currentUserId,
        token,
        platform,
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'user_id,platform',
      })

    if (error) {
      console.error('[NotificationService] トークン保存エラー:', error)
    }
  }

  /**
   * ローカル通知を表示
   */
  async showLocalNotification(notification: NotificationData): Promise<ScheduleResult | null> {
    // 設定に基づいて通知を制御
    if (!this.shouldShowNotification(notification.type)) {
      return null
    }

    try {
      const result = await LocalNotifications.schedule({
        notifications: [
          {
            id: Date.now(),
            title: notification.title,
            body: notification.body,
            extra: notification.data,
            smallIcon: 'ic_notification',
            largeIcon: 'ic_launcher',
          },
        ],
      })

      return result
    } catch (error) {
      console.error('[Local] 通知表示エラー:', error)
      return null
    }
  }

  /**
   * 通知設定に基づいて表示するか判定
   */
  private shouldShowNotification(type: NotificationType): boolean {
    switch (type) {
      case 'trade_request':
      case 'trade_accepted':
      case 'trade_rejected':
        return this.notificationSettings.tradeRequests
      case 'friend_request':
        return this.notificationSettings.friendRequests
      case 'new_sticker':
        return this.notificationSettings.newStickers
      case 'contest':
        return this.notificationSettings.contests
      case 'daily_bonus':
        return this.notificationSettings.dailyBonus
      default:
        return true // レベルアップ・実績は常に通知
    }
  }

  /**
   * 通知タップ時の処理
   */
  private handleNotificationTap(data?: Record<string, unknown>): void {
    if (!data) return

    // タイプに応じてナビゲーション（将来的に実装）
    // TODO: 適切な画面へナビゲーション
    // 例: 交換リクエストならトレード画面を開く
  }

  /**
   * 通知設定を更新
   */
  updateSettings(settings: {
    tradeRequests: boolean
    friendRequests: boolean
    newStickers: boolean
    contests: boolean
    dailyBonus: boolean
  }): void {
    this.notificationSettings = settings

    // デイリーボーナス通知の有効/無効を切り替え
    if (settings.dailyBonus) {
      this.scheduleDailyBonusNotification()
    } else {
      this.cancelDailyBonusNotification()
    }
  }

  /**
   * 交換リクエスト通知を送信
   */
  async sendTradeRequestNotification(
    targetUserId: string,
    senderName: string,
    tradeId: string
  ): Promise<void> {
    // 自分宛の通知はSupabase Edge Functionで送信
    // ここではローカル通知のみ（開発用）
    if (targetUserId === this.currentUserId) {
      await this.showLocalNotification({
        type: 'trade_request',
        title: '交換リクエストが届いたよ！',
        body: `${senderName}さんからシール交換のお誘いが来ました`,
        data: { type: 'trade_request', tradeId, senderId: targetUserId },
      })
    }

    // Supabase Edge Functionへリクエスト（本番環境用）
    await this.sendPushToUser(targetUserId, {
      type: 'trade_request',
      title: '交換リクエストが届いたよ！',
      body: `${senderName}さんからシール交換のお誘いが来ました`,
      data: { tradeId },
    })
  }

  /**
   * 交換承認通知を送信
   */
  async sendTradeAcceptedNotification(
    targetUserId: string,
    accepterName: string,
    tradeId: string
  ): Promise<void> {
    await this.sendPushToUser(targetUserId, {
      type: 'trade_accepted',
      title: '交換が成立しました！',
      body: `${accepterName}さんとの交換が完了しました`,
      data: { tradeId },
    })
  }

  /**
   * 特定ユーザーにプッシュ通知を送信（Supabase Edge Function経由）
   */
  private async sendPushToUser(
    userId: string,
    notification: NotificationData
  ): Promise<void> {
    try {
      const supabase = getSupabase()

      // 通知レコードをSupabaseに挿入
      // Edge Functionがこれを検知してプッシュ通知を送信
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await (supabase as any)
        .from('notifications')
        .insert({
          user_id: userId,
          type: notification.type,
          title: notification.title,
          body: notification.body,
          data: notification.data,
          read: false,
        })

      if (error) {
        console.error('[NotificationService] 通知挿入エラー:', error)
      }
    } catch (error) {
      console.error('[NotificationService] プッシュ送信エラー:', error)
    }
  }

  /**
   * クリーンアップ
   */
  async cleanup(): Promise<void> {
    if (Capacitor.isNativePlatform()) {
      await PushNotifications.removeAllListeners()
    }
    await LocalNotifications.removeAllListeners()
    this.initialized = false
    this.currentUserId = null
  }
}

// シングルトンインスタンス
export const notificationService = new NotificationService()
export default notificationService
