// シールのタグ・検索関連のドメイン定義

// テーマタグの種類
export type ThemeTag =
  | 'ネオン'
  | 'ポップ'
  | 'ゆめかわ'
  | '地雷'
  | 'レトロ'
  | 'クール'
  | 'かわいい'
  | 'シンプル'
  | 'キラキラ'
  | 'ふわふわ'
  | 'どうぶつ'
  | 'おはな'
  | 'ほし'
  | 'ハート'
  | 'リボン'

// タグの表示情報
export interface TagInfo {
  id: ThemeTag
  label: string
  emoji: string
  color: string // 背景色
  textColor: string // テキスト色
}

// すべてのタグ情報
export const allThemeTags: TagInfo[] = [
  { id: 'ネオン', label: 'ネオン', emoji: '💜', color: '#9B6FD0', textColor: '#FFFFFF' },
  { id: 'ポップ', label: 'ポップ', emoji: '🎨', color: '#FF69B4', textColor: '#FFFFFF' },
  { id: 'ゆめかわ', label: 'ゆめかわ', emoji: '🦄', color: '#FFB6C1', textColor: '#6B3FA0' },
  { id: '地雷', label: '地雷', emoji: '🖤', color: '#2D2D2D', textColor: '#FF69B4' },
  { id: 'レトロ', label: 'レトロ', emoji: '📺', color: '#8B4513', textColor: '#FFFFFF' },
  { id: 'クール', label: 'クール', emoji: '❄️', color: '#4A90D9', textColor: '#FFFFFF' },
  { id: 'かわいい', label: 'かわいい', emoji: '🩷', color: '#FFB6C1', textColor: '#6B3FA0' },
  { id: 'シンプル', label: 'シンプル', emoji: '✨', color: '#E8E8E8', textColor: '#666666' },
  { id: 'キラキラ', label: 'キラキラ', emoji: '✨', color: '#FFD700', textColor: '#8B4513' },
  { id: 'ふわふわ', label: 'ふわふわ', emoji: '☁️', color: '#F0F0FF', textColor: '#9B6FD0' },
  { id: 'どうぶつ', label: 'どうぶつ', emoji: '🐰', color: '#FFF0F5', textColor: '#FF69B4' },
  { id: 'おはな', label: 'おはな', emoji: '🌸', color: '#FFE4E1', textColor: '#FF69B4' },
  { id: 'ほし', label: 'ほし', emoji: '⭐', color: '#FFF8DC', textColor: '#DAA520' },
  { id: 'ハート', label: 'ハート', emoji: '❤️', color: '#FFE4E1', textColor: '#FF1493' },
  { id: 'リボン', label: 'リボン', emoji: '🎀', color: '#FFF0F5', textColor: '#FF69B4' },
]

// タグ情報を取得
export function getTagInfo(tag: ThemeTag): TagInfo | undefined {
  return allThemeTags.find(t => t.id === tag)
}

// シール検索フィルター
export interface StickerSearchFilter {
  query: string // 名前検索
  series: string | null // シリーズフィルター
  rarities: number[] // レア度フィルター（複数選択可）
  tags: ThemeTag[] // テーマタグフィルター（複数選択可）
  types: ('normal' | 'puffy' | 'sparkle')[] // シールタイプフィルター
  ownedOnly: boolean // 所持のみ表示
  upgradeRanks: number[] // アップグレードランクフィルター（0=ノーマル, 1=シルバー, 2=ゴールド, 3=プリズム）
}

// デフォルトのフィルター（持っているシールのみ表示がデフォルト）
export const defaultSearchFilter: StickerSearchFilter = {
  query: '',
  series: null,
  rarities: [],
  tags: [],
  types: [],
  ownedOnly: true, // デフォルトで所持シールのみ表示
  upgradeRanks: [],
}

// シリーズ一覧（仮）
export const allSeries = [
  'きらきらコレクション',
  'どうぶつシリーズ',
  'ベーシック',
  'ゆめかわシリーズ',
]

// シールにタグを紐付けるマッピング（仮データ）
export const stickerTagMapping: Record<string, ThemeTag[]> = {
  'ハートスター': ['キラキラ', 'ほし', 'ハート'],
  'ふわふわうさぎ': ['ふわふわ', 'どうぶつ', 'かわいい'],
  'にじいろリボン': ['ポップ', 'リボン', 'かわいい'],
  'キラキラほし': ['キラキラ', 'ほし', 'ゆめかわ'],
  'おはなちゃん': ['おはな', 'かわいい', 'シンプル'],
  'ぷくぷくねこ': ['ふわふわ', 'どうぶつ', 'かわいい'],
  'レインボーハート': ['キラキラ', 'ハート', 'ゆめかわ', 'ポップ'],
  'ちいさなくま': ['ふわふわ', 'どうぶつ', 'かわいい'],
  'シンプルスター': ['シンプル', 'ほし'],
  'ゆめかわムーン': ['ゆめかわ', 'キラキラ'],
  'オーロラリボン': ['キラキラ', 'リボン', 'ゆめかわ'],
  'パールダイヤ': ['キラキラ', 'クール'],
  'もこもこひつじ': ['ふわふわ', 'どうぶつ'],
  'にこにこいぬ': ['どうぶつ', 'かわいい'],
  'ぴょんぴょんカエル': ['どうぶつ', 'ポップ'],
  'まるいハート': ['ハート', 'シンプル'],
  'きらめくしずく': ['キラキラ', 'クール'],
  'ゆらゆらくも': ['ふわふわ', 'シンプル'],
  'ユニコーンスター': ['ゆめかわ', 'キラキラ', 'ほし'],
  'パステルキャンディ': ['ゆめかわ', 'ポップ', 'かわいい'],
  'ふわふわくも': ['ふわふわ', 'ゆめかわ'],
  'にじいろドロップ': ['ポップ', 'キラキラ'],
  'きらきらティアラ': ['キラキラ', 'ゆめかわ', 'かわいい'],
  'ゆめいろフラワー': ['ゆめかわ', 'おはな'],
}

// シールの名前からタグを取得
export function getTagsForSticker(stickerName: string): ThemeTag[] {
  return stickerTagMapping[stickerName] || []
}

// シールをフィルタリングする関数
export interface FilterableSticker {
  name: string
  series: string
  rarity: number
  type: 'normal' | 'puffy' | 'sparkle'
  owned?: boolean
  character?: string // キャラクター名（フィルタリング用）
  upgradeRank?: number // アップグレードランク（0=ノーマル, 1=シルバー, 2=ゴールド, 3=プリズム）
  effectiveRarity?: number // 実効レアリティ（rarity + アップグレードボーナス）フィルタリング用
}

export function filterStickers<T extends FilterableSticker>(
  stickers: T[],
  filter: StickerSearchFilter
): T[] {
  return stickers.filter(sticker => {
    // 名前検索
    if (filter.query) {
      const query = filter.query.toLowerCase()
      if (!sticker.name.toLowerCase().includes(query)) {
        return false
      }
    }

    // キャラクターフィルター（seriesフィールドにキャラクター名が入っている場合）
    // characterフィールドがあればそれを使用、なければnameからキャラクター名を抽出
    if (filter.series) {
      const stickerCharacter = sticker.character || sticker.name.split(' ')[0].split('#')[0]
      if (stickerCharacter !== filter.series) {
        return false
      }
    }

    // レア度フィルター（effectiveRarityを優先、なければrarityを使用）
    if (filter.rarities.length > 0) {
      const stickerRarity = sticker.effectiveRarity ?? sticker.rarity
      if (!filter.rarities.includes(stickerRarity)) {
        return false
      }
    }

    // 所持フィルター
    if (filter.ownedOnly && sticker.owned === false) {
      return false
    }

    // アップグレードランクフィルター
    if (filter.upgradeRanks.length > 0) {
      const stickerRank = sticker.upgradeRank ?? 0
      if (!filter.upgradeRanks.includes(stickerRank)) {
        return false
      }
    }

    return true
  })
}
