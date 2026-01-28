/**
 * 入力バリデーションユーティリティ
 * ユーザー入力のサニタイズと検証を行う
 */

// バリデーション結果の型
export interface ValidationResult {
  isValid: boolean
  error?: string
  sanitizedValue?: string
}

// ===================================
// 文字列バリデーション
// ===================================

/**
 * ユーザー名のバリデーション
 * - 1〜20文字
 * - 使用可能: ひらがな、カタカナ、漢字、英数字、アンダースコア
 * - 禁止: 特殊文字、絵文字（ただしユニコード文字は許可）
 */
export function validateUsername(input: string): ValidationResult {
  if (!input || typeof input !== 'string') {
    return { isValid: false, error: '名前を入力してください' }
  }

  const trimmed = input.trim()

  if (trimmed.length === 0) {
    return { isValid: false, error: '名前を入力してください' }
  }

  if (trimmed.length > 20) {
    return { isValid: false, error: '名前は20文字以内で入力してください' }
  }

  // 制御文字を除去
  const sanitized = trimmed.replace(/[\x00-\x1F\x7F]/g, '')

  // HTMLタグを除去
  const noHtml = sanitized.replace(/<[^>]*>/g, '')

  return { isValid: true, sanitizedValue: noHtml }
}

/**
 * 表示名のバリデーション（ユーザー名より緩い）
 * - 1〜30文字
 * - 絵文字OK
 */
export function validateDisplayName(input: string): ValidationResult {
  if (!input || typeof input !== 'string') {
    return { isValid: false, error: '表示名を入力してください' }
  }

  const trimmed = input.trim()

  if (trimmed.length === 0) {
    return { isValid: false, error: '表示名を入力してください' }
  }

  if (trimmed.length > 30) {
    return { isValid: false, error: '表示名は30文字以内で入力してください' }
  }

  // 制御文字を除去
  const sanitized = trimmed.replace(/[\x00-\x1F\x7F]/g, '')

  // HTMLタグを除去
  const noHtml = sanitized.replace(/<[^>]*>/g, '')

  return { isValid: true, sanitizedValue: noHtml }
}

/**
 * 自己紹介文のバリデーション
 * - 0〜200文字
 * - 改行は許可
 */
export function validateBio(input: string): ValidationResult {
  if (input === null || input === undefined) {
    return { isValid: true, sanitizedValue: '' }
  }

  if (typeof input !== 'string') {
    return { isValid: false, error: '無効な入力です' }
  }

  const trimmed = input.trim()

  if (trimmed.length > 200) {
    return { isValid: false, error: '自己紹介は200文字以内で入力してください' }
  }

  // 制御文字を除去（改行は許可）
  const sanitized = trimmed.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')

  // HTMLタグを除去
  const noHtml = sanitized.replace(/<[^>]*>/g, '')

  return { isValid: true, sanitizedValue: noHtml }
}

/**
 * 投稿キャプションのバリデーション
 * - 0〜500文字
 * - 改行許可
 */
export function validateCaption(input: string): ValidationResult {
  if (input === null || input === undefined) {
    return { isValid: true, sanitizedValue: '' }
  }

  if (typeof input !== 'string') {
    return { isValid: false, error: '無効な入力です' }
  }

  const trimmed = input.trim()

  if (trimmed.length > 500) {
    return { isValid: false, error: 'キャプションは500文字以内で入力してください' }
  }

  // 制御文字を除去（改行は許可）
  const sanitized = trimmed.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')

  // HTMLタグを除去
  const noHtml = sanitized.replace(/<[^>]*>/g, '')

  return { isValid: true, sanitizedValue: noHtml }
}

/**
 * コメントのバリデーション
 * - 1〜300文字
 */
export function validateComment(input: string): ValidationResult {
  if (!input || typeof input !== 'string') {
    return { isValid: false, error: 'コメントを入力してください' }
  }

  const trimmed = input.trim()

  if (trimmed.length === 0) {
    return { isValid: false, error: 'コメントを入力してください' }
  }

  if (trimmed.length > 300) {
    return { isValid: false, error: 'コメントは300文字以内で入力してください' }
  }

  // 制御文字を除去（改行は許可）
  const sanitized = trimmed.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')

  // HTMLタグを除去
  const noHtml = sanitized.replace(/<[^>]*>/g, '')

  return { isValid: true, sanitizedValue: noHtml }
}

// ===================================
// 数値バリデーション
// ===================================

/**
 * 正の整数のバリデーション
 */
export function validatePositiveInteger(
  input: unknown,
  options: { min?: number; max?: number; fieldName?: string } = {}
): ValidationResult {
  const { min = 1, max = Number.MAX_SAFE_INTEGER, fieldName = '値' } = options

  if (input === null || input === undefined) {
    return { isValid: false, error: `${fieldName}を入力してください` }
  }

  const num = typeof input === 'string' ? parseInt(input, 10) : input

  if (typeof num !== 'number' || isNaN(num)) {
    return { isValid: false, error: `${fieldName}は数値で入力してください` }
  }

  if (!Number.isInteger(num)) {
    return { isValid: false, error: `${fieldName}は整数で入力してください` }
  }

  if (num < min) {
    return { isValid: false, error: `${fieldName}は${min}以上で入力してください` }
  }

  if (num > max) {
    return { isValid: false, error: `${fieldName}は${max}以下で入力してください` }
  }

  return { isValid: true, sanitizedValue: String(num) }
}

/**
 * 数量のバリデーション（ガチャ回数など）
 */
export function validateQuantity(input: unknown): ValidationResult {
  return validatePositiveInteger(input, {
    min: 1,
    max: 100,
    fieldName: '数量',
  })
}

// ===================================
// ID バリデーション
// ===================================

/**
 * UUID形式のバリデーション
 */
export function validateUUID(input: string): ValidationResult {
  if (!input || typeof input !== 'string') {
    return { isValid: false, error: '無効なIDです' }
  }

  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

  if (!uuidRegex.test(input)) {
    return { isValid: false, error: '無効なIDフォーマットです' }
  }

  return { isValid: true, sanitizedValue: input.toLowerCase() }
}

/**
 * シールIDのバリデーション（UUID or 数値ID）
 */
export function validateStickerId(input: string): ValidationResult {
  if (!input || typeof input !== 'string') {
    return { isValid: false, error: '無効なシールIDです' }
  }

  // UUIDかどうかチェック
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
  if (uuidRegex.test(input)) {
    return { isValid: true, sanitizedValue: input.toLowerCase() }
  }

  // 数値IDかどうかチェック
  const numId = parseInt(input, 10)
  if (!isNaN(numId) && numId > 0) {
    return { isValid: true, sanitizedValue: String(numId) }
  }

  return { isValid: false, error: '無効なシールIDフォーマットです' }
}

// ===================================
// 招待コードバリデーション
// ===================================

/**
 * 招待コードのバリデーション
 * - 8文字の英数字
 */
export function validateInvitationCode(input: string): ValidationResult {
  if (!input || typeof input !== 'string') {
    return { isValid: false, error: '招待コードを入力してください' }
  }

  const trimmed = input.trim().toUpperCase()

  if (trimmed.length !== 8) {
    return { isValid: false, error: '招待コードは8文字です' }
  }

  const codeRegex = /^[A-Z0-9]{8}$/
  if (!codeRegex.test(trimmed)) {
    return { isValid: false, error: '招待コードは英数字のみです' }
  }

  return { isValid: true, sanitizedValue: trimmed }
}

// ===================================
// ユーザーコードバリデーション
// ===================================

/**
 * ユーザーコード（友達追加用）のバリデーション
 * - #で始まる8桁の数字
 */
export function validateUserCode(input: string): ValidationResult {
  if (!input || typeof input !== 'string') {
    return { isValid: false, error: 'ユーザーコードを入力してください' }
  }

  let trimmed = input.trim()

  // #を追加（入力が数字のみの場合）
  if (/^\d{8}$/.test(trimmed)) {
    trimmed = '#' + trimmed
  }

  // フォーマットチェック
  const codeRegex = /^#\d{8}$/
  if (!codeRegex.test(trimmed)) {
    return { isValid: false, error: 'ユーザーコードは#から始まる8桁の数字です' }
  }

  return { isValid: true, sanitizedValue: trimmed }
}

// ===================================
// サニタイズ関数
// ===================================

/**
 * HTML特殊文字をエスケープ
 */
export function escapeHtml(input: string): string {
  if (!input || typeof input !== 'string') return ''

  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

/**
 * XSS防止のためのテキストサニタイズ
 */
export function sanitizeText(input: string): string {
  if (!input || typeof input !== 'string') return ''

  return input
    // 制御文字を除去
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
    // HTMLタグを除去
    .replace(/<[^>]*>/g, '')
    // 連続した空白を単一に
    .replace(/\s+/g, ' ')
    .trim()
}

/**
 * URLのサニタイズ（javascript:などを防止）
 */
export function sanitizeUrl(input: string): string | null {
  if (!input || typeof input !== 'string') return null

  const trimmed = input.trim()

  // 許可するプロトコルのみ
  const allowedProtocols = ['http:', 'https:', 'data:']

  try {
    const url = new URL(trimmed)

    if (!allowedProtocols.includes(url.protocol)) {
      return null
    }

    return url.href
  } catch {
    // 相対URLの場合
    if (trimmed.startsWith('/') && !trimmed.startsWith('//')) {
      return trimmed
    }
    return null
  }
}
