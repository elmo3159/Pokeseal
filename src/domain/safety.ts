/**
 * セーフティ機能（通報・ブロック）のドメイン型
 * 子ども向けアプリのため、安全性を最優先に設計
 */

// 通報カテゴリ
export type ReportCategory =
  | 'spam'           // スパム
  | 'inappropriate'  // ふてきせつな行動
  | 'harassment'     // いやがらせ
  | 'other'          // その他

// 通報カテゴリの表示名（子ども向け）
export const reportCategoryLabels: Record<ReportCategory, { label: string; emoji: string; description: string }> = {
  spam: {
    label: 'めいわくな投稿',
    emoji: '📢',
    description: 'おなじものをなんども投稿している'
  },
  inappropriate: {
    label: 'よくない内容',
    emoji: '⚠️',
    description: 'みんなが嫌な気持ちになる内容'
  },
  harassment: {
    label: 'いやがらせ',
    emoji: '😢',
    description: 'わるぐちやいじめ'
  },
  other: {
    label: 'そのほか',
    emoji: '📝',
    description: 'ほかにきになること'
  }
}

// 通報対象タイプ
export type ReportTargetType =
  | 'user'      // ユーザー
  | 'post'      // 投稿
  | 'comment'   // コメント
  | 'trade'     // 交換

// 通報データ
export interface Report {
  id: string
  reporterId: string           // 通報者のユーザーID
  targetType: ReportTargetType // 通報対象の種類
  targetId: string             // 通報対象のID
  targetUserId: string         // 通報対象ユーザーのID
  category: ReportCategory     // 通報カテゴリ
  comment?: string             // 追加コメント（任意）
  status: 'pending' | 'reviewed' | 'resolved' | 'dismissed'
  createdAt: string
  reviewedAt?: string
}

// ブロックデータ
export interface Block {
  id: string
  blockerId: string   // ブロックした人のID
  blockedId: string   // ブロックされた人のID
  reason?: string     // ブロック理由（任意）
  createdAt: string
}

// ブロック状態
export interface BlockStatus {
  isBlocked: boolean      // 相手をブロックしているか
  isBlockedBy: boolean    // 相手にブロックされているか
}

// 公開範囲
export type Visibility = 'public' | 'friends' | 'private'

// 公開範囲の表示名
export const visibilityLabels: Record<Visibility, { label: string; emoji: string; description: string }> = {
  public: {
    label: 'みんなに公開',
    emoji: '🌍',
    description: 'だれでもみられます'
  },
  friends: {
    label: 'フレンドだけ',
    emoji: '👫',
    description: 'フレンドだけがみられます'
  },
  private: {
    label: '自分だけ',
    emoji: '🔒',
    description: '自分だけがみられます'
  }
}

// 通報作成用の入力データ
export interface CreateReportInput {
  targetType: ReportTargetType
  targetId: string
  targetUserId: string
  category: ReportCategory
  comment?: string
}

// ブロック作成用の入力データ
export interface CreateBlockInput {
  blockedId: string
  reason?: string
}

/**
 * 通報が有効かどうかチェック
 */
export function validateReport(input: CreateReportInput): { isValid: boolean; error?: string } {
  if (!input.targetId) {
    return { isValid: false, error: '対象が選択されていません' }
  }
  if (!input.category) {
    return { isValid: false, error: 'カテゴリを選んでください' }
  }
  if (input.comment && input.comment.length > 200) {
    return { isValid: false, error: 'コメントは200文字以内にしてください' }
  }
  return { isValid: true }
}

/**
 * ブロック理由の最大文字数
 */
export const MAX_BLOCK_REASON_LENGTH = 100

/**
 * 通報コメントの最大文字数
 */
export const MAX_REPORT_COMMENT_LENGTH = 200
