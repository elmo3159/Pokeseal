/**
 * コンテンツフィルターシステム
 * タイムラインのコメントやシール交換のチャットで使用
 * 不適切な言葉をフィルタリング
 */

// 不適切な言葉のリスト（日本語）
const badWordsJa = [
  // 攻撃的な言葉
  'バカ', 'ばか', '馬鹿', 'アホ', 'あほ', '阿呆',
  'クソ', 'くそ', '糞', 'しね', '死ね', 'ころす', '殺す',
  'きもい', 'キモい', 'うざい', 'ウザい', 'きえろ', '消えろ',
  'ブス', 'ぶす', 'デブ', 'でぶ', 'ハゲ', 'はげ',

  // 差別的な言葉
  'ガイジ', 'がいじ', 'キチガイ', 'きちがい',

  // 詐欺・危険な言葉
  '詐欺', 'さぎ', '騙', 'だまし',

  // 個人情報誘導
  'LINE教えて', 'ライン教えて', '電話番号', 'でんわばんごう',
  '住所', 'じゅうしょ', '本名', 'ほんみょう', 'どこに住んでる', '学校どこ',

  // 出会い系・不適切な誘い
  '会おう', 'あおう', '会いたい', 'あいたい', 'デートしよ',

  // 金銭関連
  'お金ちょうだい', 'おかねちょうだい', '課金して', 'かきんして',
  'ギフトちょうだい',
]

// 不適切な言葉のリスト（英語）
const badWordsEn = [
  'fuck', 'shit', 'damn', 'ass', 'bitch',
  'idiot', 'stupid', 'dumb', 'kill', 'die',
  'hate', 'ugly', 'fat', 'loser',
]

// 全ての禁止ワード
const allBadWords = [...badWordsJa, ...badWordsEn]

// 正規表現パターンを作成（大文字小文字を区別しない）
const badWordPatterns = allBadWords.map(word =>
  new RegExp(word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi')
)

// URL検出用の正規表現
const urlPattern = /https?:\/\/[^\s]+|www\.[^\s]+/gi

// メールアドレス検出用の正規表現
const emailPattern = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/gi

// 電話番号検出用の正規表現（日本の形式）
const phonePattern = /0\d{1,4}[-\s]?\d{1,4}[-\s]?\d{4}|\d{3}[-\s]?\d{4}[-\s]?\d{4}/g

export interface FilterResult {
  isClean: boolean
  filteredText: string
  detectedIssues: string[]
}

/**
 * テキストをフィルタリングする
 * @param text フィルタリングするテキスト
 * @param options オプション
 * @returns フィルタリング結果
 */
export function filterContent(
  text: string,
  options: {
    maskCharacter?: string
    blockUrls?: boolean
    blockEmail?: boolean
    blockPhone?: boolean
    returnOriginalIfClean?: boolean
  } = {}
): FilterResult {
  const {
    maskCharacter = '＊',
    blockUrls = true,
    blockEmail = true,
    blockPhone = true,
    returnOriginalIfClean = true,
  } = options

  const detectedIssues: string[] = []
  let filteredText = text

  // URLのチェック
  if (blockUrls && urlPattern.test(filteredText)) {
    detectedIssues.push('URL')
    filteredText = filteredText.replace(urlPattern, '[リンク削除]')
  }

  // メールアドレスのチェック
  if (blockEmail && emailPattern.test(filteredText)) {
    detectedIssues.push('メールアドレス')
    filteredText = filteredText.replace(emailPattern, '[メール削除]')
  }

  // 電話番号のチェック
  if (blockPhone && phonePattern.test(filteredText)) {
    detectedIssues.push('電話番号')
    filteredText = filteredText.replace(phonePattern, '[番号削除]')
  }

  // 不適切な言葉のチェック
  for (let i = 0; i < allBadWords.length; i++) {
    const pattern = badWordPatterns[i]
    if (pattern.test(filteredText)) {
      detectedIssues.push('不適切な言葉')
      filteredText = filteredText.replace(pattern, match =>
        maskCharacter.repeat(match.length)
      )
    }
  }

  const isClean = detectedIssues.length === 0

  return {
    isClean,
    filteredText: returnOriginalIfClean && isClean ? text : filteredText,
    detectedIssues: [...new Set(detectedIssues)], // 重複を除去
  }
}

/**
 * テキストが安全かどうかをチェック（フィルタリングなし）
 * @param text チェックするテキスト
 * @returns 安全な場合はtrue
 */
export function isContentSafe(text: string): boolean {
  return filterContent(text).isClean
}

/**
 * テキストをフィルタリングして返す（シンプル版）
 * @param text フィルタリングするテキスト
 * @returns フィルタリング済みテキスト
 */
export function sanitizeContent(text: string): string {
  return filterContent(text).filteredText
}

/**
 * 子ども向けの安全なテキストかどうかをチェック
 * より厳格なチェック
 */
export function isKidSafe(text: string): boolean {
  const result = filterContent(text, {
    blockUrls: true,
    blockEmail: true,
    blockPhone: true,
  })

  // 追加のチェック：数字の連続（IDの可能性）
  const hasLongNumbers = /\d{8,}/.test(text)

  return result.isClean && !hasLongNumbers
}

/**
 * フィルタリング理由を日本語で取得
 */
export function getFilterReason(result: FilterResult): string {
  if (result.isClean) return ''

  const reasons = result.detectedIssues.join('、')
  return `このメッセージには${reasons}が含まれています`
}

export default {
  filterContent,
  isContentSafe,
  sanitizeContent,
  isKidSafe,
  getFilterReason,
}
