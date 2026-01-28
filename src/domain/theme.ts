// シール帳テーマ・スキン関連のドメイン定義

// ページパターンの種類
export type PagePattern =
  | 'plain'
  | 'dots'
  | 'grid'
  | 'lines'
  | 'hearts'
  | 'stars'
  | 'flowers'
  | 'ribbon'
  // 新しいパターン
  | 'waves'        // 波模様
  | 'confetti'     // 紙吹雪
  | 'bubbles'      // 泡
  | 'clouds'       // 雲
  | 'sparkles'     // キラキラ
  | 'checkerboard' // チェック柄
  | 'zigzag'       // ジグザグ
  | 'diamonds'     // ひし形
  | 'leaves'       // 葉っぱ
  | 'snowflakes'   // 雪の結晶
  | 'hexagons'     // 六角形
  | 'triangles'    // 三角形
  | 'arcs'         // アーチ
  | 'crosshatch'   // クロスハッチ
  | 'scallops'     // スカラップ（貝殻模様）

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
  // カテゴリ
  category: 'basic' | 'cute' | 'cool' | 'seasonal'
  // 所持しているかどうか
  isOwned: boolean
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
    backgroundGradientTo?: string
    pattern: PagePattern
    patternColor?: string
    patternOpacity?: number
    frameColor?: string
    frameAccentColor?: string
    frameGlowColor?: string
  }
  // 装飾
  decoration: {
    cornerStyle: 'none' | 'round' | 'metal' | 'ribbon' | 'heart' | 'star' | 'flower' | 'image'
    cornerColor?: string
    cornerImage?: string  // カスタム画像パス（cornerStyle: 'image' の場合）
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
  // 実績ID（実績達成で解放するテーマ）
  unlockAchievementId?: string
  // すべての実績達成で解放するテーマ
  unlockAllAchievements?: boolean
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
  // =============================================
  // === ベーシック（初心者向け・シンプル） ===
  // =============================================
  {
    id: 'theme-basic-white',
    name: 'シンプルホワイト',
    description: 'まっしろで すっきり きほんのテーマ',
    category: 'basic',
    binder: {
      color: '#FAFAFA',
      gradientFrom: '#FFFFFF',
      gradientTo: '#F5F5F5',
      texture: 'plastic',
      borderColor: '#E8E8E8'
    },
    page: {
      backgroundColor: '#FFFFFF',
      backgroundGradientTo: '#FCFCFC',
      pattern: 'plain'
    },
    decoration: {
      cornerStyle: 'round',
      spineStyle: 'simple',
      spineColor: '#E0E0E0'
    },
    previewEmoji: '🤍',
    obtainMethod: 'default'
  },

  // =============================================
  // === キュート（可愛い・女の子向け） ===
  // =============================================
  {
    id: 'theme-yumekawa',
    name: 'ゆめかわユニコーン',
    description: 'ゆめ色グラデに ふわふわ雲がただよう',
    category: 'cute',
    binder: {
      color: '#E8B4D9',
      gradientFrom: '#F5C6EC',
      gradientTo: '#B8D4F1',
      texture: 'glitter',
      borderColor: '#FFFFFF'
    },
    page: {
      backgroundColor: '#FFF5FB',
      backgroundGradientTo: '#F0F7FF',
      pattern: 'clouds',
      patternColor: '#E8B4D9',
      patternOpacity: 0.25
    },
    decoration: {
      cornerStyle: 'heart',
      cornerColor: '#F5A6D9',
      spineStyle: 'rings',
      spineColor: '#B8D4F1'
    },
    previewEmoji: '🦄',
    obtainMethod: 'achievement',
    unlockCondition: 'シールを1まい てにいれる',
    unlockAchievementId: 'collection-first'
  },
  {
    id: 'theme-jirai',
    name: 'やみかわリボン',
    description: 'くろ×ピンクの あぶない かわいさ',
    category: 'cute',
    binder: {
      color: '#1A1018',
      gradientFrom: '#251520',
      gradientTo: '#0D080C',
      texture: 'leather',
      borderColor: '#FF3D8E'
    },
    page: {
      backgroundColor: '#1A1018',
      backgroundGradientTo: '#120B10',
      pattern: 'crosshatch',
      patternColor: '#FF3D8E',
      patternOpacity: 0.12
    },
    decoration: {
      cornerStyle: 'ribbon',
      cornerColor: '#FF3D8E',
      spineStyle: 'stitched',
      spineColor: '#FF3D8E'
    },
    previewEmoji: '🖤',
    obtainMethod: 'achievement',
    unlockCondition: '★5を 1まい てにいれる',
    unlockAchievementId: 'collection-legend'
  },
  {
    id: 'theme-korean-soft',
    name: 'カフェラテ',
    description: 'やわらかベージュの おしゃれカフェ',
    category: 'cute',
    binder: {
      color: '#E8DDD0',
      gradientFrom: '#F2EBE1',
      gradientTo: '#D9C9B6',
      texture: 'fabric',
      borderColor: '#C4B09A'
    },
    page: {
      backgroundColor: '#FBF8F3',
      backgroundGradientTo: '#F7F3ED',
      pattern: 'scallops',
      patternColor: '#D4C4B0',
      patternOpacity: 0.22
    },
    decoration: {
      cornerStyle: 'round',
      spineStyle: 'stitched',
      spineColor: '#C4B09A'
    },
    previewEmoji: '☕',
    obtainMethod: 'achievement',
    unlockCondition: 'シールを10まい あつめる',
    unlockAchievementId: 'collection-10'
  },

  // =============================================
  // === クール（かっこいい・スタイリッシュ） ===
  // =============================================
  {
    id: 'theme-neon',
    name: 'サイバーネオン',
    description: 'みらいの とかいで ひかる ネオン',
    category: 'cool',
    binder: {
      color: '#0A0A1A',
      gradientFrom: '#12122A',
      gradientTo: '#050510',
      texture: 'metallic',
      borderColor: '#00FFE5'
    },
    page: {
      backgroundColor: '#08081A',
      backgroundGradientTo: '#050510',
      pattern: 'hexagons',
      patternColor: '#00FFE5',
      patternOpacity: 0.18
    },
    decoration: {
      cornerStyle: 'metal',
      cornerColor: '#FF00AA',
      spineStyle: 'spiral',
      spineColor: '#00FFE5'
    },
    previewEmoji: '💠',
    obtainMethod: 'achievement',
    unlockCondition: 'シールを100まい あつめる',
    unlockAchievementId: 'collection-100'
  },
  {
    id: 'theme-galaxy',
    name: 'コズミックギャラクシー',
    description: 'うちゅうの ほしぞら きらめく よぞら',
    category: 'cool',
    binder: {
      color: '#0D0D2B',
      gradientFrom: '#1A1445',
      gradientTo: '#080818',
      texture: 'glitter',
      borderColor: '#8B5CF6'
    },
    page: {
      backgroundColor: '#0A0A20',
      backgroundGradientTo: '#050512',
      pattern: 'sparkles',
      patternColor: '#A78BFA',
      patternOpacity: 0.35
    },
    decoration: {
      cornerStyle: 'star',
      cornerColor: '#FFD700',
      spineStyle: 'rings',
      spineColor: '#8B5CF6'
    },
    previewEmoji: '🌌',
    obtainMethod: 'achievement',
    unlockCondition: '★4を 1まい てにいれる',
    unlockAchievementId: 'collection-rare'
  },

  // =============================================
  // === レトロ（懐かしい・ヴィンテージ） ===
  // =============================================
  {
    id: 'theme-heisei-gal',
    name: 'ギャルパラダイス',
    description: 'キラキラ パーティー ずっとおまつり',
    category: 'retro',
    binder: {
      color: '#FF1493',
      gradientFrom: '#FF69B4',
      gradientTo: '#FF1493',
      texture: 'glitter',
      borderColor: '#FFD700'
    },
    page: {
      backgroundColor: '#FFF0F8',
      backgroundGradientTo: '#FFE8F5',
      pattern: 'confetti',
      patternColor: '#FF1493',
      patternOpacity: 0.8
    },
    decoration: {
      cornerStyle: 'heart',
      cornerColor: '#FFD700',
      spineStyle: 'rings',
      spineColor: '#FF1493'
    },
    previewEmoji: '💖',
    obtainMethod: 'achievement',
    unlockCondition: 'ガチャを 50かい まわす',
    unlockAchievementId: 'gacha-50'
  },
  {
    id: 'theme-showa-retro',
    name: 'なつかしレトロ',
    description: 'おばあちゃんの おうちみたい',
    category: 'retro',
    binder: {
      color: '#8B4513',
      gradientFrom: '#A0522D',
      gradientTo: '#6B3810',
      texture: 'leather'
    },
    page: {
      backgroundColor: '#FFF5E6',
      backgroundGradientTo: '#FFECD2',
      pattern: 'checkerboard',
      patternColor: '#D4A574',
      patternOpacity: 0.12
    },
    decoration: {
      cornerStyle: 'metal',
      cornerColor: '#B8860B',
      spineStyle: 'spiral',
      spineColor: '#8B4513'
    },
    previewEmoji: '📺',
    obtainMethod: 'achievement',
    unlockCondition: 'シールを50まい あつめる',
    unlockAchievementId: 'collection-50'
  },

  // =============================================
  // === シーズン（季節・イベント） ===
  // =============================================
  {
    id: 'theme-sakura',
    name: 'さくらブーケ',
    description: 'はる満開 さくらが まう',
    category: 'seasonal',
    binder: {
      color: '#FFB7C5',
      gradientFrom: '#FFCAD4',
      gradientTo: '#FFA5B8',
      texture: 'fabric',
      borderColor: '#FF8FAB'
    },
    page: {
      backgroundColor: '#FFF5F7',
      backgroundGradientTo: '#FFEFF3',
      pattern: 'flowers',
      patternColor: '#FFB7C5',
      patternOpacity: 0.35
    },
    decoration: {
      cornerStyle: 'ribbon',
      cornerColor: '#FF8FAB',
      spineStyle: 'stitched',
      spineColor: '#7ECBAE'
    },
    previewEmoji: '🌸',
    obtainMethod: 'achievement',
    unlockCondition: '7にち ログイン',
    unlockAchievementId: 'special-login-7'
  },
  {
    id: 'theme-christmas',
    name: 'ホーリークリスマス',
    description: 'ゆきふる よる サンタが くる',
    category: 'seasonal',
    binder: {
      color: '#1B5E20',
      gradientFrom: '#2E7D32',
      gradientTo: '#1B5E20',
      texture: 'glitter',
      borderColor: '#FFD700'
    },
    page: {
      backgroundColor: '#F5FFF5',
      backgroundGradientTo: '#EFFFEF',
      pattern: 'snowflakes',
      patternColor: '#1B5E20',
      patternOpacity: 0.2
    },
    decoration: {
      cornerStyle: 'star',
      cornerColor: '#FFD700',
      spineStyle: 'rings',
      spineColor: '#C62828'
    },
    previewEmoji: '🎄',
    obtainMethod: 'achievement',
    unlockCondition: '30にち ログイン',
    unlockAchievementId: 'special-login-30'
  },
  // =============================================
  // === 実績テーマ（ゲームプレイで解放） ===
  // =============================================

  // --- コレクション系 ---
  {
    id: 'theme-achv-collection-first',
    name: 'はじめてピクニック',
    description: 'ギンガムチェックの ピクニックブランケット',
    category: 'cute',
    binder: {
      color: '#F5A962',
      gradientFrom: '#FFBE7D',
      gradientTo: '#E88B3A',
      texture: 'fabric'
    },
    page: {
      backgroundColor: '#FFF9F0',
      backgroundGradientTo: '#FFF3E3',
      pattern: 'checkerboard',
      patternColor: '#F5A962',
      patternOpacity: 0.15
    },
    decoration: {
      cornerStyle: 'ribbon',
      cornerColor: '#E88B3A',
      spineStyle: 'stitched',
      spineColor: '#F5A962'
    },
    previewEmoji: '🧺',
    obtainMethod: 'achievement',
    unlockCondition: 'シールを1まい てにいれる',
    unlockAchievementId: 'collection-first'
  },
  {
    id: 'theme-achv-collection-10',
    name: 'ベルギーショコラ',
    description: 'こうきゅうチョコの しっとりリッチ',
    category: 'retro',
    binder: {
      color: '#5D3A1A',
      gradientFrom: '#7B4A26',
      gradientTo: '#3D2510',
      texture: 'leather'
    },
    page: {
      backgroundColor: '#4A2C17',
      backgroundGradientTo: '#3D2510',
      pattern: 'diamonds',
      patternColor: '#8B6914',
      patternOpacity: 0.18
    },
    decoration: {
      cornerStyle: 'metal',
      cornerColor: '#C9A227',
      spineStyle: 'stitched',
      spineColor: '#C9A227'
    },
    previewEmoji: '🍫',
    obtainMethod: 'achievement',
    unlockCondition: 'シールを10まい あつめる',
    unlockAchievementId: 'collection-10'
  },
  {
    id: 'theme-achv-collection-50',
    name: 'タピオカミルクティー',
    description: 'もちもち タピオカが うかぶ',
    category: 'cute',
    binder: {
      color: '#D4A574',
      gradientFrom: '#E8C4A0',
      gradientTo: '#C49560',
      texture: 'plastic'
    },
    page: {
      backgroundColor: '#FFF8F0',
      backgroundGradientTo: '#FFF2E5',
      pattern: 'bubbles',
      patternColor: '#4A3728',
      patternOpacity: 0.22
    },
    decoration: {
      cornerStyle: 'round',
      spineStyle: 'simple',
      spineColor: '#4A3728'
    },
    previewEmoji: '🧋',
    obtainMethod: 'achievement',
    unlockCondition: 'シールを50まい あつめる',
    unlockAchievementId: 'collection-50'
  },
  {
    id: 'theme-achv-collection-100',
    name: 'トロフィーゴールド',
    description: 'チャンピオンの かがやき',
    category: 'cool',
    binder: {
      color: '#D4AF37',
      gradientFrom: '#F4D03F',
      gradientTo: '#B8860B',
      texture: 'metallic',
      borderColor: '#FFE55C'
    },
    page: {
      backgroundColor: '#FFFBEB',
      backgroundGradientTo: '#FFF5D1',
      pattern: 'sparkles',
      patternColor: '#D4AF37',
      patternOpacity: 0.28
    },
    decoration: {
      cornerStyle: 'star',
      cornerColor: '#FFE55C',
      spineStyle: 'rings',
      spineColor: '#D4AF37'
    },
    previewEmoji: '🏆',
    obtainMethod: 'achievement',
    unlockCondition: 'シールを100まい あつめる',
    unlockAchievementId: 'collection-100'
  },
  {
    id: 'theme-achv-collection-rare',
    name: 'ロイヤルサファイア',
    description: 'おうぞくの ほうせき',
    category: 'cool',
    binder: {
      color: '#1E3A8A',
      gradientFrom: '#2563EB',
      gradientTo: '#1E3A8A',
      texture: 'metallic',
      borderColor: '#60A5FA'
    },
    page: {
      backgroundColor: '#EFF6FF',
      backgroundGradientTo: '#DBEAFE',
      pattern: 'diamonds',
      patternColor: '#3B82F6',
      patternOpacity: 0.2
    },
    decoration: {
      cornerStyle: 'metal',
      cornerColor: '#60A5FA',
      spineStyle: 'rings',
      spineColor: '#1E3A8A'
    },
    previewEmoji: '💎',
    obtainMethod: 'achievement',
    unlockCondition: '★4を 1まい てにいれる',
    unlockAchievementId: 'collection-rare'
  },
  {
    id: 'theme-achv-collection-legend',
    name: 'ミッドナイトアーマー',
    description: 'くらやみの きし',
    category: 'cool',
    binder: {
      color: '#0F0F0F',
      gradientFrom: '#1F1F1F',
      gradientTo: '#000000',
      texture: 'metallic',
      borderColor: '#4A4A4A'
    },
    page: {
      backgroundColor: '#141414',
      backgroundGradientTo: '#0A0A0A',
      pattern: 'triangles',
      patternColor: '#3A3A3A',
      patternOpacity: 0.2
    },
    decoration: {
      cornerStyle: 'metal',
      cornerColor: '#5A5A5A',
      spineStyle: 'spiral',
      spineColor: '#3A3A3A'
    },
    previewEmoji: '⚔️',
    obtainMethod: 'achievement',
    unlockCondition: '★5を 1まい てにいれる',
    unlockAchievementId: 'collection-legend'
  },

  // --- シール帳系 ---
  {
    id: 'theme-achv-book-first',
    name: 'スケッチブック',
    description: 'えんぴつで かく じゆうちょう',
    category: 'basic',
    binder: {
      color: '#E8E0D5',
      gradientFrom: '#F5EDE3',
      gradientTo: '#DDD5C8',
      texture: 'fabric'
    },
    page: {
      backgroundColor: '#FFFEF8',
      backgroundGradientTo: '#FDFBF5',
      pattern: 'grid',
      patternColor: '#C5D6E8',
      patternOpacity: 0.18
    },
    decoration: {
      cornerStyle: 'round',
      spineStyle: 'spiral',
      spineColor: '#8B8B8B'
    },
    previewEmoji: '📝',
    obtainMethod: 'achievement',
    unlockCondition: 'シール帳に 1まい はる',
    unlockAchievementId: 'book-first'
  },
  {
    id: 'theme-achv-book-10',
    name: 'フリルレース',
    description: 'ひらひら かわいい レースもよう',
    category: 'cute',
    binder: {
      color: '#F9C6D9',
      gradientFrom: '#FFD6E7',
      gradientTo: '#F5B0C9',
      texture: 'fabric'
    },
    page: {
      backgroundColor: '#FFF5F9',
      backgroundGradientTo: '#FFECF3',
      pattern: 'scallops',
      patternColor: '#F472B6',
      patternOpacity: 0.25
    },
    decoration: {
      cornerStyle: 'ribbon',
      cornerColor: '#F472B6',
      spineStyle: 'stitched',
      spineColor: '#F472B6'
    },
    previewEmoji: '🎀',
    obtainMethod: 'achievement',
    unlockCondition: 'シール帳に 10まい はる',
    unlockAchievementId: 'book-10'
  },
  {
    id: 'theme-achv-book-30',
    name: 'スターダスト',
    description: 'ほしくずが ふりそそぐ',
    category: 'cute',
    binder: {
      color: '#9F7AEA',
      gradientFrom: '#B794F4',
      gradientTo: '#805AD5',
      texture: 'glitter',
      borderColor: '#E9D8FD'
    },
    page: {
      backgroundColor: '#FAF5FF',
      backgroundGradientTo: '#F3E8FF',
      pattern: 'sparkles',
      patternColor: '#9F7AEA',
      patternOpacity: 0.3
    },
    decoration: {
      cornerStyle: 'star',
      cornerColor: '#E9D8FD',
      spineStyle: 'rings',
      spineColor: '#9F7AEA'
    },
    previewEmoji: '✨',
    obtainMethod: 'achievement',
    unlockCondition: 'シール帳に 30まい はる',
    unlockAchievementId: 'book-30'
  },

  // --- ガチャ系 ---
  {
    id: 'theme-achv-gacha-first',
    name: 'トイカプセル',
    description: 'わくわく ガチャガチャ カプセル',
    category: 'cute',
    binder: {
      color: '#FF6B6B',
      gradientFrom: '#FF8E8E',
      gradientTo: '#E85555',
      texture: 'plastic',
      borderColor: '#FFFFFF'
    },
    page: {
      backgroundColor: '#FFF5F5',
      backgroundGradientTo: '#FFECEC',
      pattern: 'confetti',
      patternColor: '#FF6B6B',
      patternOpacity: 0.7
    },
    decoration: {
      cornerStyle: 'round',
      cornerColor: '#FF6B6B',
      spineStyle: 'simple',
      spineColor: '#FFFFFF'
    },
    previewEmoji: '🎉',
    obtainMethod: 'achievement',
    unlockCondition: 'ガチャを 1かい まわす',
    unlockAchievementId: 'gacha-first'
  },
  {
    id: 'theme-achv-gacha-10',
    name: 'クリームソーダ',
    description: 'しゅわしゅわ あわが はじける',
    category: 'cute',
    binder: {
      color: '#4DD4AC',
      gradientFrom: '#6EE7B7',
      gradientTo: '#34D399',
      texture: 'plastic'
    },
    page: {
      backgroundColor: '#ECFDF5',
      backgroundGradientTo: '#D1FAE5',
      pattern: 'bubbles',
      patternColor: '#34D399',
      patternOpacity: 0.28
    },
    decoration: {
      cornerStyle: 'round',
      spineStyle: 'simple',
      spineColor: '#10B981'
    },
    previewEmoji: '🫧',
    obtainMethod: 'achievement',
    unlockCondition: 'ガチャを 10かい まわす',
    unlockAchievementId: 'gacha-10'
  },
  {
    id: 'theme-achv-gacha-50',
    name: 'プリズムガーデン',
    description: 'にじいろの おはなばたけ',
    category: 'cute',
    binder: {
      color: '#A78BFA',
      gradientFrom: '#C4B5FD',
      gradientTo: '#8B5CF6',
      texture: 'glitter',
      borderColor: '#E9D5FF'
    },
    page: {
      backgroundColor: '#FAF5FF',
      backgroundGradientTo: '#F3E8FF',
      pattern: 'flowers',
      patternColor: '#A78BFA',
      patternOpacity: 0.35
    },
    decoration: {
      cornerStyle: 'heart',
      cornerColor: '#E9D5FF',
      spineStyle: 'rings',
      spineColor: '#A78BFA'
    },
    previewEmoji: '🌷',
    obtainMethod: 'achievement',
    unlockCondition: 'ガチャを 50かい まわす',
    unlockAchievementId: 'gacha-50'
  },

  // --- タイムライン系 ---
  {
    id: 'theme-achv-timeline-first',
    name: 'フォレストピクニック',
    description: 'もりの なかの ひだまり',
    category: 'basic',
    binder: {
      color: '#4ADE80',
      gradientFrom: '#86EFAC',
      gradientTo: '#22C55E',
      texture: 'fabric'
    },
    page: {
      backgroundColor: '#F0FDF4',
      backgroundGradientTo: '#DCFCE7',
      pattern: 'leaves',
      patternColor: '#22C55E',
      patternOpacity: 0.25
    },
    decoration: {
      cornerStyle: 'round',
      spineStyle: 'stitched',
      spineColor: '#16A34A'
    },
    previewEmoji: '🌿',
    obtainMethod: 'achievement',
    unlockCondition: 'タイムラインに 1かい とうこう',
    unlockAchievementId: 'timeline-first'
  },
  {
    id: 'theme-achv-timeline-5',
    name: 'バルーンパーティー',
    description: 'ふわふわ ふうせん おいわい',
    category: 'cute',
    binder: {
      color: '#C084FC',
      gradientFrom: '#D8B4FE',
      gradientTo: '#A855F7',
      texture: 'plastic'
    },
    page: {
      backgroundColor: '#FAF5FF',
      backgroundGradientTo: '#F3E8FF',
      pattern: 'confetti',
      patternColor: '#C084FC',
      patternOpacity: 0.6
    },
    decoration: {
      cornerStyle: 'heart',
      cornerColor: '#E879F9',
      spineStyle: 'rings',
      spineColor: '#A855F7'
    },
    previewEmoji: '🎈',
    obtainMethod: 'achievement',
    unlockCondition: 'タイムラインに 5かい とうこう',
    unlockAchievementId: 'timeline-5'
  },

  // --- スペシャル系 ---
  {
    id: 'theme-achv-login-7',
    name: 'あさやけスカイ',
    description: 'あたらしい いちにちの はじまり',
    category: 'basic',
    binder: {
      color: '#60A5FA',
      gradientFrom: '#93C5FD',
      gradientTo: '#3B82F6',
      texture: 'fabric'
    },
    page: {
      backgroundColor: '#EFF6FF',
      backgroundGradientTo: '#DBEAFE',
      pattern: 'clouds',
      patternColor: '#93C5FD',
      patternOpacity: 0.22
    },
    decoration: {
      cornerStyle: 'round',
      spineStyle: 'stitched',
      spineColor: '#3B82F6'
    },
    previewEmoji: '🌅',
    obtainMethod: 'achievement',
    unlockCondition: '7にち ログイン',
    unlockAchievementId: 'special-login-7'
  },
  {
    id: 'theme-achv-login-30',
    name: 'サンセットオーシャン',
    description: 'ゆうやけの うみべ',
    category: 'cool',
    binder: {
      color: '#F97316',
      gradientFrom: '#FB923C',
      gradientTo: '#C2410C',
      texture: 'fabric',
      borderColor: '#7C3AED'
    },
    page: {
      backgroundColor: '#FFF7ED',
      backgroundGradientTo: '#FFEDD5',
      pattern: 'waves',
      patternColor: '#F97316',
      patternOpacity: 0.22
    },
    decoration: {
      cornerStyle: 'round',
      cornerColor: '#7C3AED',
      spineStyle: 'stitched',
      spineColor: '#7C3AED'
    },
    previewEmoji: '🌇',
    obtainMethod: 'achievement',
    unlockCondition: '30にち ログイン',
    unlockAchievementId: 'special-login-30'
  },

  // --- 全実績達成の特別テーマ ---
  {
    id: 'theme-achv-all',
    name: 'ドリーミープリンセス',
    description: 'ゆめの せかいの おひめさま♡ すべての じっせきを コンプリートした あなただけの とくべつな シールちょう',
    category: 'cute',
    binder: {
      color: '#FF6B9D',
      gradientFrom: '#FFB6C1',
      gradientTo: '#FF69B4',
      texture: 'glitter',
      borderColor: '#FFD700'
    },
    page: {
      backgroundColor: '#FFF8FC',
      backgroundGradientTo: '#FFECF5',
      pattern: 'sparkles',
      patternColor: '#FFD700',
      patternOpacity: 0.45,
      frameColor: '#FFD700',
      frameAccentColor: '#FF69B4',
      frameGlowColor: 'rgba(255, 215, 0, 0.7)'
    },
    decoration: {
      cornerStyle: 'image',
      cornerColor: '#FFD700',
      cornerImage: '/images/deco/stamp/stamp/stamp_13.png',
      spineStyle: 'rings',
      spineColor: '#FF69B4'
    },
    previewEmoji: '👑',
    obtainMethod: 'achievement',
    unlockCondition: 'ぜんぶの じっせき',
    unlockAllAchievements: true
  }
]

// キャラクター表紙の名前一覧（public/covers/ 内の全キャラクター）
const CHARACTER_COVER_NAMES = [
  'いちごにゃん',
  'ウールン',
  'キノぼう',
  'きらきらシャボンうさぎ',
  'きらぼし',
  'くまグミ',
  'クリームソーダちゃん',
  'けいとにゃん',
  'コケボ',
  'ころりんご',
  'さくらんぼーず',
  'サニたん',
  'しゃぼんちゃん',
  'しゅわぴー',
  'スタラ',
  'チャックン',
  'トイラン',
  'とろりんプリンひよこ',
  'ドロル',
  'にじたま',
  'ねこマカロン',
  'ねりあめちゃん',
  'ビー玉にゃんこ',
  'ぷちぷちにゃん',
  'ぷにねこ',
  'ぷりんぬ',
  'ぷるるん',
  'ふわふわコットンキャンディねこ',
  'ふわもくん',
  'ふわもちパン',
  'ふわりぼん',
  'ポフン',
  'ぽよまる',
  'ポリ',
  'ほわほわん',
  'メルト・ヴィヴィ',
  'もこたんぽぽ',
  'もちぷに',
  'もっちも',
  'もふもふポップコーンぴよ',
  'ゆめくも',
  'ゆめくらげ',
  'ゆめひつじ',
  'リボンちゃん',
  'ルミナ・スターダスト',
] as const

// デフォルトの表紙デザイン一覧
export const defaultCoverDesigns: CoverDesign[] = [
  // デフォルト表紙（全員所持）
  {
    id: 'cover-default',
    name: 'デフォルト',
    description: 'はじめから持っているシール帳',
    previewEmoji: '📖',
    coverImage: '/covers/デフォルト/cover.png',
    backCoverImage: '/covers/デフォルト/back.png',
    spineColor: '#C4956A',
    spineGradientTo: '#D4A574',
    category: 'basic',
    isOwned: true,
    obtainMethod: 'default',
  },
  // キャラクター報酬表紙（Tier2: 20種コンプリートで解放）
  ...CHARACTER_COVER_NAMES.map((name): CoverDesign => ({
    id: `cover-${name}`,
    name,
    description: `${name}のシール帳デザイン`,
    previewEmoji: '🎨',
    coverImage: `/covers/${name}/cover.png`,
    backCoverImage: `/covers/${name}/back.png`,
    spineColor: '#D4A574',
    spineGradientTo: '#E8C9A0',
    category: 'cute',
    isOwned: false,
    obtainMethod: 'achievement',
    unlockCondition: `${name}シリーズ20種コンプリート`,
  })),
]

export const themeCategoryLabels: Record<ThemeCategory, { label: string; emoji: string }> = {
  basic: { label: 'ベーシック', emoji: '🧸' },
  cute: { label: 'キュート', emoji: '🎀' },
  cool: { label: 'クール', emoji: '🖤' },
  retro: { label: 'レトロ', emoji: '📼' },
  seasonal: { label: 'シーズン', emoji: '🎄' },
}

export const obtainMethodLabels: Record<StickerBookTheme['obtainMethod'], string> = {
  default: 'はじめから もってる',
  gacha: 'ガチャで てにいれる',
  event: 'イベントで てにいれる',
  achievement: 'じっせきで てにいれる',
  starpoints: 'スターこうかん',
}

// テーマを取得
export function getThemeById(id: string): StickerBookTheme | undefined {
  return defaultThemes.find(t => t.id === id)
}

// デフォルトのテーマID
export function getDefaultThemeId(): string {
  return 'theme-basic-white'
}

// 表紙デザインを取得
export function getCoverDesignById(id: string): CoverDesign | undefined {
  return defaultCoverDesigns.find(c => c.id === id)
}

// デフォルトの表紙デザインID
export function getDefaultCoverDesignId(): string {
  return 'cover-default'
}
