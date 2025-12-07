// シール帳テーマ・スキン関連のドメイン定義

// ページパターンの種類
export type PagePattern = 'plain' | 'dots' | 'grid' | 'hearts' | 'stars' | 'flowers' | 'ribbon'

// テーマのカテゴリ
export type ThemeCategory = 'basic' | 'cute' | 'cool' | 'retro' | 'seasonal'

// 表紙デザイン（カスタム画像）
export interface CoverDesign {
  id: string
  name: string
  description: string
  previewEmoji: string
  // 表紙画像パス
  coverImage: string
  // 裏表紙画像パス
  backCoverImage: string
  // 背表紙の色（画像がないため色で表現）
  spineColor: string
  spineGradientTo?: string
  // 入手方法
  obtainMethod: 'default' | 'gacha' | 'event' | 'achievement' | 'starpoints'
  starPointCost?: number
  unlockCondition?: string
}

// テーマ定義
export interface StickerBookTheme {
  id: string
  name: string
  description: string
  category: ThemeCategory
  // バインダーのスタイル
  binder: {
    color: string
    gradientFrom?: string
    gradientTo?: string
    texture?: 'leather' | 'fabric' | 'plastic' | 'glitter' | 'metallic'
    borderColor?: string
  }
  // ページのスタイル
  page: {
    backgroundColor: string
    pattern: PagePattern
    patternColor?: string
    patternOpacity?: number
  }
  // 装飾
  decoration: {
    cornerStyle: 'none' | 'round' | 'metal' | 'ribbon' | 'heart' | 'star'
    cornerColor?: string
    spineStyle: 'simple' | 'rings' | 'spiral' | 'stitched'
    spineColor?: string
  }
  // プレビュー用アイコン
  previewEmoji: string
  // 入手方法
  obtainMethod: 'default' | 'gacha' | 'event' | 'achievement' | 'starpoints'
  // スターポイントコスト（スターポイント交換の場合）
  starPointCost?: number
  // 解放条件（実績解放の場合）
  unlockCondition?: string
  // カスタム表紙デザインID（設定されていればこちらを優先）
  coverDesignId?: string
}

// ユーザーのテーマ所持情報
export interface UserTheme {
  themeId: string
  ownedAt: string
  isEquipped: boolean
}

// デフォルトテーマ一覧
export const defaultThemes: StickerBookTheme[] = [
  // === ベーシック ===
  {
    id: 'theme-basic-pink',
    name: 'ピンクベーシック',
    description: 'みんなにいちばん人気！かわいいピンクのシール帳',
    category: 'basic',
    binder: {
      color: '#FFB6C1',
      gradientFrom: '#FFB6C1',
      gradientTo: '#FFC0CB',
      texture: 'plastic'
    },
    page: {
      backgroundColor: '#FFF5F8',
      pattern: 'plain'
    },
    decoration: {
      cornerStyle: 'round',
      spineStyle: 'simple'
    },
    previewEmoji: '🩷',
    obtainMethod: 'default'
  },
  {
    id: 'theme-basic-purple',
    name: 'パープルベーシック',
    description: 'おちついた紫色でシールが映える！',
    category: 'basic',
    binder: {
      color: '#9B6FD0',
      gradientFrom: '#9B6FD0',
      gradientTo: '#B088E0',
      texture: 'plastic'
    },
    page: {
      backgroundColor: '#F8F5FF',
      pattern: 'plain'
    },
    decoration: {
      cornerStyle: 'round',
      spineStyle: 'simple'
    },
    previewEmoji: '💜',
    obtainMethod: 'default'
  },
  {
    id: 'theme-basic-blue',
    name: 'ブルーベーシック',
    description: 'さわやかなブルーでクールに決める！',
    category: 'basic',
    binder: {
      color: '#87CEEB',
      gradientFrom: '#87CEEB',
      gradientTo: '#ADD8E6',
      texture: 'plastic'
    },
    page: {
      backgroundColor: '#F0F8FF',
      pattern: 'plain'
    },
    decoration: {
      cornerStyle: 'round',
      spineStyle: 'simple'
    },
    previewEmoji: '💙',
    obtainMethod: 'default'
  },

  // === キュート ===
  {
    id: 'theme-yumekawa',
    name: 'ゆめかわパステル',
    description: 'パステルカラーでゆめかわいい世界へ✨',
    category: 'cute',
    binder: {
      color: '#E6E6FA',
      gradientFrom: '#FFB6C1',
      gradientTo: '#E6E6FA',
      texture: 'glitter'
    },
    page: {
      backgroundColor: '#FFFAF0',
      pattern: 'stars',
      patternColor: '#FFB6C1',
      patternOpacity: 0.15
    },
    decoration: {
      cornerStyle: 'heart',
      cornerColor: '#FFB6C1',
      spineStyle: 'rings',
      spineColor: '#E6E6FA'
    },
    previewEmoji: '🦄',
    obtainMethod: 'starpoints',
    starPointCost: 500
  },
  {
    id: 'theme-jirai',
    name: 'じらいピンク',
    description: 'ダークでかわいい、じらい系デザイン🖤',
    category: 'cute',
    binder: {
      color: '#2D2D2D',
      gradientFrom: '#2D2D2D',
      gradientTo: '#1A1A1A',
      texture: 'leather',
      borderColor: '#FF69B4'
    },
    page: {
      backgroundColor: '#1F1F1F',
      pattern: 'hearts',
      patternColor: '#FF69B4',
      patternOpacity: 0.1
    },
    decoration: {
      cornerStyle: 'ribbon',
      cornerColor: '#FF69B4',
      spineStyle: 'stitched',
      spineColor: '#FF69B4'
    },
    previewEmoji: '🖤',
    obtainMethod: 'starpoints',
    starPointCost: 800
  },
  {
    id: 'theme-korean-soft',
    name: 'かんこくふう',
    description: 'シンプルおしゃれな韓国スタイル',
    category: 'cute',
    binder: {
      color: '#F5F5DC',
      gradientFrom: '#F5F5DC',
      gradientTo: '#FFFACD',
      texture: 'fabric'
    },
    page: {
      backgroundColor: '#FFFEF7',
      pattern: 'grid',
      patternColor: '#E0E0E0',
      patternOpacity: 0.3
    },
    decoration: {
      cornerStyle: 'none',
      spineStyle: 'stitched',
      spineColor: '#D4AF37'
    },
    previewEmoji: '🇰🇷',
    obtainMethod: 'starpoints',
    starPointCost: 600
  },

  // === クール ===
  {
    id: 'theme-neon',
    name: 'ネオンシティ',
    description: 'サイバーパンク風のかっこいいデザイン',
    category: 'cool',
    binder: {
      color: '#0D0D0D',
      gradientFrom: '#1A0033',
      gradientTo: '#000033',
      texture: 'metallic',
      borderColor: '#00FFFF'
    },
    page: {
      backgroundColor: '#0A0A0A',
      pattern: 'grid',
      patternColor: '#00FFFF',
      patternOpacity: 0.1
    },
    decoration: {
      cornerStyle: 'metal',
      cornerColor: '#FF00FF',
      spineStyle: 'spiral',
      spineColor: '#00FFFF'
    },
    previewEmoji: '🌃',
    obtainMethod: 'achievement',
    unlockCondition: 'シールを100種類あつめる'
  },
  {
    id: 'theme-galaxy',
    name: 'ギャラクシー',
    description: '宇宙をイメージしたミステリアスなデザイン',
    category: 'cool',
    binder: {
      color: '#1A1A2E',
      gradientFrom: '#16213E',
      gradientTo: '#0F3460',
      texture: 'glitter'
    },
    page: {
      backgroundColor: '#0D1117',
      pattern: 'stars',
      patternColor: '#FFFFFF',
      patternOpacity: 0.2
    },
    decoration: {
      cornerStyle: 'star',
      cornerColor: '#E94560',
      spineStyle: 'rings',
      spineColor: '#7B68EE'
    },
    previewEmoji: '🌌',
    obtainMethod: 'gacha'
  },

  // === レトロ ===
  {
    id: 'theme-heisei-gal',
    name: 'へいせいギャル',
    description: '2000年代のギャルっぽいキラキラデザイン✨',
    category: 'retro',
    binder: {
      color: '#FF69B4',
      gradientFrom: '#FF1493',
      gradientTo: '#FF69B4',
      texture: 'glitter',
      borderColor: '#FFD700'
    },
    page: {
      backgroundColor: '#FFF0F5',
      pattern: 'hearts',
      patternColor: '#FF69B4',
      patternOpacity: 0.2
    },
    decoration: {
      cornerStyle: 'heart',
      cornerColor: '#FFD700',
      spineStyle: 'rings',
      spineColor: '#FF1493'
    },
    previewEmoji: '💅',
    obtainMethod: 'event'
  },
  {
    id: 'theme-showa-retro',
    name: 'しょうわレトロ',
    description: 'なつかしい昭和のシール帳風デザイン',
    category: 'retro',
    binder: {
      color: '#8B4513',
      gradientFrom: '#A0522D',
      gradientTo: '#8B4513',
      texture: 'leather'
    },
    page: {
      backgroundColor: '#FAEBD7',
      pattern: 'dots',
      patternColor: '#8B4513',
      patternOpacity: 0.1
    },
    decoration: {
      cornerStyle: 'metal',
      cornerColor: '#B8860B',
      spineStyle: 'spiral',
      spineColor: '#8B4513'
    },
    previewEmoji: '📺',
    obtainMethod: 'starpoints',
    starPointCost: 400
  },

  // === 季節・イベント ===
  {
    id: 'theme-sakura',
    name: 'さくらもち',
    description: '春らしいさくら色のかわいいデザイン🌸',
    category: 'seasonal',
    binder: {
      color: '#FFB7C5',
      gradientFrom: '#FFB7C5',
      gradientTo: '#FFDAB9',
      texture: 'fabric'
    },
    page: {
      backgroundColor: '#FFF5EE',
      pattern: 'flowers',
      patternColor: '#FFB7C5',
      patternOpacity: 0.15
    },
    decoration: {
      cornerStyle: 'ribbon',
      cornerColor: '#FFB7C5',
      spineStyle: 'stitched',
      spineColor: '#98D8C8'
    },
    previewEmoji: '🌸',
    obtainMethod: 'event'
  },
  {
    id: 'theme-christmas',
    name: 'クリスマス',
    description: 'キラキラのクリスマスデザイン🎄',
    category: 'seasonal',
    binder: {
      color: '#228B22',
      gradientFrom: '#228B22',
      gradientTo: '#006400',
      texture: 'glitter',
      borderColor: '#FFD700'
    },
    page: {
      backgroundColor: '#FFFAF0',
      pattern: 'stars',
      patternColor: '#FFD700',
      patternOpacity: 0.15
    },
    decoration: {
      cornerStyle: 'star',
      cornerColor: '#FFD700',
      spineStyle: 'rings',
      spineColor: '#DC143C'
    },
    previewEmoji: '🎄',
    obtainMethod: 'event'
  }
]

// カテゴリ表示名
export const themeCategoryLabels: Record<ThemeCategory, { label: string; emoji: string }> = {
  basic: { label: 'ベーシック', emoji: '📚' },
  cute: { label: 'キュート', emoji: '💕' },
  cool: { label: 'クール', emoji: '✨' },
  retro: { label: 'レトロ', emoji: '📺' },
  seasonal: { label: 'きせつ', emoji: '🌸' }
}

// 入手方法の表示名
export const obtainMethodLabels: Record<StickerBookTheme['obtainMethod'], string> = {
  default: 'さいしょから持ってる',
  gacha: 'ガチャでゲット',
  event: 'イベントげんてい',
  achievement: 'じっせきかいほう',
  starpoints: 'スターポイントでこうかん'
}

// テーマを取得
export function getThemeById(themeId: string): StickerBookTheme | undefined {
  return defaultThemes.find(t => t.id === themeId)
}

// カテゴリでテーマをフィルタリング
export function getThemesByCategory(category: ThemeCategory): StickerBookTheme[] {
  return defaultThemes.filter(t => t.category === category)
}

// デフォルトテーマのIDを取得
export function getDefaultThemeId(): string {
  return 'theme-basic-pink'
}

// ========== 表紙デザイン（カスタム画像） ==========

// デフォルトの表紙デザイン一覧
export const defaultCoverDesigns: CoverDesign[] = [
  {
    id: 'cover-default',
    name: 'デフォルト',
    description: 'テーマカラーを使用したシンプルな表紙',
    previewEmoji: '📕',
    coverImage: '', // 空 = テーマカラーを使用
    backCoverImage: '',
    spineColor: '#8B5CF6',
    obtainMethod: 'default',
  },
  {
    id: 'cover-mochimo',
    name: 'もっちもシール帳',
    description: 'もっちもの可愛いシール帳デザイン',
    previewEmoji: '🍞',
    coverImage: '/covers/もっちも/cover.png',
    backCoverImage: '/covers/もっちも/back.png',
    spineColor: '#E8D5B7',
    spineGradientTo: '#F5E6D3',
    obtainMethod: 'default',
  },
]

// 表紙デザインを取得
export function getCoverDesignById(id: string): CoverDesign | undefined {
  return defaultCoverDesigns.find(c => c.id === id)
}

// デフォルトの表紙デザインID
export function getDefaultCoverDesignId(): string {
  return 'cover-default'
}
