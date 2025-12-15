/**
 * デコアイテム（シール帳を飾る素材）の型定義
 * マスキングテープ、レースペーパー、スタンプ、グリッターなど
 */

// デコアイテムの種類
export type DecoItemType = 'tape' | 'lace' | 'stamp' | 'glitter' | 'frame'

// デコアイテムのマスターデータ
export interface DecoItemData {
  id: string
  name: string
  type: DecoItemType
  imageUrl: string
  // サイズの基準値（実際の配置時にスケール可能）
  baseWidth: number
  baseHeight: number
  // 回転可能かどうか
  rotatable: boolean
  // レアリティ（入手難易度）
  rarity: 1 | 2 | 3 | 4 | 5
  // 入手条件（'default' = 最初から持っている, 'gacha' = ガチャ, 'event' = イベント）
  obtainMethod: 'default' | 'gacha' | 'event' | 'purchase'
}

// 配置されたデコアイテム
export interface PlacedDecoItem {
  id: string
  decoItemId: string
  decoItem: DecoItemData
  pageId: string
  x: number // 相対座標 (0-1)
  y: number // 相対座標 (0-1)
  rotation: number // 回転角度
  scale: number // スケール（後方互換用）
  width: number // 表示幅（px）
  height: number // 表示高さ（px）
  zIndex: number // レイヤー順
  placedAt: string // ISO日時
}

// デコアイテムの日本語カテゴリ名
export const DECO_CATEGORY_NAMES: Record<DecoItemType, string> = {
  tape: 'マステ',
  lace: 'レース',
  stamp: 'スタンプ',
  glitter: 'キラキラ',
  frame: 'フレーム',
}

// デコアイテムのカテゴリ説明（小学生向け）
export const DECO_CATEGORY_DESCRIPTIONS: Record<DecoItemType, string> = {
  tape: 'かわいいテープでページをデコろう！',
  lace: 'レースペーパーでおしゃれに！',
  stamp: '手書きふうのスタンプだよ',
  glitter: 'キラキラをちりばめよう！',
  frame: 'シールをかわいく囲もう',
}

// デフォルトのデコアイテムマスターデータ
export const DEFAULT_DECO_ITEMS: DecoItemData[] = [
  // ========================================
  // レース - 姫系 (hime)
  // ========================================
  {
    id: 'lace-hime-1',
    name: '姫レース1',
    type: 'lace',
    imageUrl: '/images/deco/lace/hime/hime_1.png',
    baseWidth: 150,
    baseHeight: 40,
    rotatable: true,
    rarity: 2,
    obtainMethod: 'default',
  },
  {
    id: 'lace-hime-2',
    name: '姫レース2',
    type: 'lace',
    imageUrl: '/images/deco/lace/hime/hime_2.png',
    baseWidth: 150,
    baseHeight: 40,
    rotatable: true,
    rarity: 2,
    obtainMethod: 'default',
  },
  {
    id: 'lace-hime-3',
    name: '姫レース3',
    type: 'lace',
    imageUrl: '/images/deco/lace/hime/hime_3.png',
    baseWidth: 150,
    baseHeight: 40,
    rotatable: true,
    rarity: 2,
    obtainMethod: 'default',
  },
  {
    id: 'lace-hime-4',
    name: '姫レース4',
    type: 'lace',
    imageUrl: '/images/deco/lace/hime/hime_4.png',
    baseWidth: 150,
    baseHeight: 40,
    rotatable: true,
    rarity: 3,
    obtainMethod: 'default',
  },
  {
    id: 'lace-hime-5',
    name: '姫レース5',
    type: 'lace',
    imageUrl: '/images/deco/lace/hime/hime_5.png',
    baseWidth: 150,
    baseHeight: 40,
    rotatable: true,
    rarity: 3,
    obtainMethod: 'default',
  },
  {
    id: 'lace-hime-6',
    name: '姫レース6',
    type: 'lace',
    imageUrl: '/images/deco/lace/hime/hime_6.png',
    baseWidth: 150,
    baseHeight: 40,
    rotatable: true,
    rarity: 3,
    obtainMethod: 'default',
  },
  // ========================================
  // レース - 姫系2 (hime2)
  // ========================================
  {
    id: 'lace-hime2-1',
    name: 'プリンセス1',
    type: 'lace',
    imageUrl: '/images/deco/lace/hime2/hime2_1.png',
    baseWidth: 150,
    baseHeight: 40,
    rotatable: true,
    rarity: 2,
    obtainMethod: 'default',
  },
  {
    id: 'lace-hime2-2',
    name: 'プリンセス2',
    type: 'lace',
    imageUrl: '/images/deco/lace/hime2/hime2_2.png',
    baseWidth: 150,
    baseHeight: 40,
    rotatable: true,
    rarity: 2,
    obtainMethod: 'default',
  },
  {
    id: 'lace-hime2-3',
    name: 'プリンセス3',
    type: 'lace',
    imageUrl: '/images/deco/lace/hime2/hime2_3.png',
    baseWidth: 150,
    baseHeight: 40,
    rotatable: true,
    rarity: 2,
    obtainMethod: 'default',
  },
  {
    id: 'lace-hime2-4',
    name: 'プリンセス4',
    type: 'lace',
    imageUrl: '/images/deco/lace/hime2/hime2_4.png',
    baseWidth: 150,
    baseHeight: 40,
    rotatable: true,
    rarity: 3,
    obtainMethod: 'default',
  },
  {
    id: 'lace-hime2-5',
    name: 'プリンセス5',
    type: 'lace',
    imageUrl: '/images/deco/lace/hime2/hime2_5.png',
    baseWidth: 150,
    baseHeight: 40,
    rotatable: true,
    rarity: 3,
    obtainMethod: 'default',
  },
  {
    id: 'lace-hime2-6',
    name: 'プリンセス6',
    type: 'lace',
    imageUrl: '/images/deco/lace/hime2/hime2_6.png',
    baseWidth: 150,
    baseHeight: 40,
    rotatable: true,
    rarity: 3,
    obtainMethod: 'default',
  },
  // ========================================
  // レース - 地雷系 (jirai)
  // ========================================
  {
    id: 'lace-jirai-1',
    name: '地雷レース1',
    type: 'lace',
    imageUrl: '/images/deco/lace/jirai/jirai_1.png',
    baseWidth: 150,
    baseHeight: 40,
    rotatable: true,
    rarity: 2,
    obtainMethod: 'default',
  },
  {
    id: 'lace-jirai-2',
    name: '地雷レース2',
    type: 'lace',
    imageUrl: '/images/deco/lace/jirai/jirai_2.png',
    baseWidth: 150,
    baseHeight: 40,
    rotatable: true,
    rarity: 2,
    obtainMethod: 'default',
  },
  {
    id: 'lace-jirai-3',
    name: '地雷レース3',
    type: 'lace',
    imageUrl: '/images/deco/lace/jirai/jirai_3.png',
    baseWidth: 150,
    baseHeight: 40,
    rotatable: true,
    rarity: 2,
    obtainMethod: 'default',
  },
  {
    id: 'lace-jirai-4',
    name: '地雷レース4',
    type: 'lace',
    imageUrl: '/images/deco/lace/jirai/jirai_4.png',
    baseWidth: 150,
    baseHeight: 40,
    rotatable: true,
    rarity: 3,
    obtainMethod: 'default',
  },
  {
    id: 'lace-jirai-5',
    name: '地雷レース5',
    type: 'lace',
    imageUrl: '/images/deco/lace/jirai/jirai_5.png',
    baseWidth: 150,
    baseHeight: 40,
    rotatable: true,
    rarity: 3,
    obtainMethod: 'default',
  },
  {
    id: 'lace-jirai-6',
    name: '地雷レース6',
    type: 'lace',
    imageUrl: '/images/deco/lace/jirai/jirai_6.png',
    baseWidth: 150,
    baseHeight: 40,
    rotatable: true,
    rarity: 3,
    obtainMethod: 'default',
  },
  // ========================================
  // レース - キッズ (kids)
  // ========================================
  {
    id: 'lace-kids-1',
    name: 'ポップレース1',
    type: 'lace',
    imageUrl: '/images/deco/lace/kids/kids_1.png',
    baseWidth: 150,
    baseHeight: 40,
    rotatable: true,
    rarity: 1,
    obtainMethod: 'default',
  },
  {
    id: 'lace-kids-2',
    name: 'ポップレース2',
    type: 'lace',
    imageUrl: '/images/deco/lace/kids/kids_2.png',
    baseWidth: 150,
    baseHeight: 40,
    rotatable: true,
    rarity: 1,
    obtainMethod: 'default',
  },
  {
    id: 'lace-kids-3',
    name: 'ポップレース3',
    type: 'lace',
    imageUrl: '/images/deco/lace/kids/kids_3.png',
    baseWidth: 150,
    baseHeight: 40,
    rotatable: true,
    rarity: 1,
    obtainMethod: 'default',
  },
  {
    id: 'lace-kids-4',
    name: 'ポップレース4',
    type: 'lace',
    imageUrl: '/images/deco/lace/kids/kids_4.png',
    baseWidth: 150,
    baseHeight: 40,
    rotatable: true,
    rarity: 2,
    obtainMethod: 'default',
  },
  {
    id: 'lace-kids-5',
    name: 'ポップレース5',
    type: 'lace',
    imageUrl: '/images/deco/lace/kids/kids_5.png',
    baseWidth: 150,
    baseHeight: 40,
    rotatable: true,
    rarity: 2,
    obtainMethod: 'default',
  },
  {
    id: 'lace-kids-6',
    name: 'ポップレース6',
    type: 'lace',
    imageUrl: '/images/deco/lace/kids/kids_6.png',
    baseWidth: 150,
    baseHeight: 40,
    rotatable: true,
    rarity: 2,
    obtainMethod: 'default',
  },
  // ========================================
  // レース - キッズ2 (kids2)
  // ========================================
  {
    id: 'lace-kids2-1',
    name: 'にじレース1',
    type: 'lace',
    imageUrl: '/images/deco/lace/kids2/kids2_1.png',
    baseWidth: 150,
    baseHeight: 40,
    rotatable: true,
    rarity: 1,
    obtainMethod: 'default',
  },
  {
    id: 'lace-kids2-2',
    name: 'にじレース2',
    type: 'lace',
    imageUrl: '/images/deco/lace/kids2/kids2_2.png',
    baseWidth: 150,
    baseHeight: 40,
    rotatable: true,
    rarity: 1,
    obtainMethod: 'default',
  },
  {
    id: 'lace-kids2-3',
    name: 'にじレース3',
    type: 'lace',
    imageUrl: '/images/deco/lace/kids2/kids2_3.png',
    baseWidth: 150,
    baseHeight: 40,
    rotatable: true,
    rarity: 1,
    obtainMethod: 'default',
  },
  {
    id: 'lace-kids2-4',
    name: 'にじレース4',
    type: 'lace',
    imageUrl: '/images/deco/lace/kids2/kids2_4.png',
    baseWidth: 150,
    baseHeight: 40,
    rotatable: true,
    rarity: 2,
    obtainMethod: 'default',
  },
  {
    id: 'lace-kids2-5',
    name: 'にじレース5',
    type: 'lace',
    imageUrl: '/images/deco/lace/kids2/kids2_5.png',
    baseWidth: 150,
    baseHeight: 40,
    rotatable: true,
    rarity: 2,
    obtainMethod: 'default',
  },
  {
    id: 'lace-kids2-6',
    name: 'にじレース6',
    type: 'lace',
    imageUrl: '/images/deco/lace/kids2/kids2_6.png',
    baseWidth: 150,
    baseHeight: 40,
    rotatable: true,
    rarity: 2,
    obtainMethod: 'default',
  },
  // ========================================
  // スタンプ (stamp)
  // ========================================
  {
    id: 'stamp-1',
    name: 'スタンプ1',
    type: 'stamp',
    imageUrl: '/images/deco/stamp/stamp/stamp_1.png',
    baseWidth: 50,
    baseHeight: 50,
    rotatable: true,
    rarity: 1,
    obtainMethod: 'default',
  },
  {
    id: 'stamp-2',
    name: 'スタンプ2',
    type: 'stamp',
    imageUrl: '/images/deco/stamp/stamp/stamp_2.png',
    baseWidth: 50,
    baseHeight: 50,
    rotatable: true,
    rarity: 1,
    obtainMethod: 'default',
  },
  {
    id: 'stamp-3',
    name: 'スタンプ3',
    type: 'stamp',
    imageUrl: '/images/deco/stamp/stamp/stamp_3.png',
    baseWidth: 50,
    baseHeight: 50,
    rotatable: true,
    rarity: 1,
    obtainMethod: 'default',
  },
  {
    id: 'stamp-4',
    name: 'スタンプ4',
    type: 'stamp',
    imageUrl: '/images/deco/stamp/stamp/stamp_4.png',
    baseWidth: 50,
    baseHeight: 50,
    rotatable: true,
    rarity: 1,
    obtainMethod: 'default',
  },
  {
    id: 'stamp-5',
    name: 'スタンプ5',
    type: 'stamp',
    imageUrl: '/images/deco/stamp/stamp/stamp_5.png',
    baseWidth: 50,
    baseHeight: 50,
    rotatable: true,
    rarity: 2,
    obtainMethod: 'default',
  },
  {
    id: 'stamp-6',
    name: 'スタンプ6',
    type: 'stamp',
    imageUrl: '/images/deco/stamp/stamp/stamp_6.png',
    baseWidth: 50,
    baseHeight: 50,
    rotatable: true,
    rarity: 2,
    obtainMethod: 'default',
  },
  {
    id: 'stamp-7',
    name: 'スタンプ7',
    type: 'stamp',
    imageUrl: '/images/deco/stamp/stamp/stamp_7.png',
    baseWidth: 50,
    baseHeight: 50,
    rotatable: true,
    rarity: 2,
    obtainMethod: 'default',
  },
  {
    id: 'stamp-8',
    name: 'スタンプ8',
    type: 'stamp',
    imageUrl: '/images/deco/stamp/stamp/stamp_8.png',
    baseWidth: 50,
    baseHeight: 50,
    rotatable: true,
    rarity: 2,
    obtainMethod: 'default',
  },
  {
    id: 'stamp-9',
    name: 'スタンプ9',
    type: 'stamp',
    imageUrl: '/images/deco/stamp/stamp/stamp_9.png',
    baseWidth: 50,
    baseHeight: 50,
    rotatable: true,
    rarity: 2,
    obtainMethod: 'default',
  },
  {
    id: 'stamp-10',
    name: 'スタンプ10',
    type: 'stamp',
    imageUrl: '/images/deco/stamp/stamp/stamp_10.png',
    baseWidth: 50,
    baseHeight: 50,
    rotatable: true,
    rarity: 2,
    obtainMethod: 'default',
  },
  {
    id: 'stamp-11',
    name: 'スタンプ11',
    type: 'stamp',
    imageUrl: '/images/deco/stamp/stamp/stamp_11.png',
    baseWidth: 50,
    baseHeight: 50,
    rotatable: true,
    rarity: 3,
    obtainMethod: 'default',
  },
  {
    id: 'stamp-12',
    name: 'スタンプ12',
    type: 'stamp',
    imageUrl: '/images/deco/stamp/stamp/stamp_12.png',
    baseWidth: 50,
    baseHeight: 50,
    rotatable: true,
    rarity: 3,
    obtainMethod: 'default',
  },
  {
    id: 'stamp-13',
    name: 'スタンプ13',
    type: 'stamp',
    imageUrl: '/images/deco/stamp/stamp/stamp_13.png',
    baseWidth: 50,
    baseHeight: 50,
    rotatable: true,
    rarity: 3,
    obtainMethod: 'default',
  },
  {
    id: 'stamp-14',
    name: 'スタンプ14',
    type: 'stamp',
    imageUrl: '/images/deco/stamp/stamp/stamp_14.png',
    baseWidth: 50,
    baseHeight: 50,
    rotatable: true,
    rarity: 3,
    obtainMethod: 'default',
  },
  {
    id: 'stamp-15',
    name: 'スタンプ15',
    type: 'stamp',
    imageUrl: '/images/deco/stamp/stamp/stamp_15.png',
    baseWidth: 50,
    baseHeight: 50,
    rotatable: true,
    rarity: 3,
    obtainMethod: 'default',
  },
  {
    id: 'stamp-16',
    name: 'スタンプ16',
    type: 'stamp',
    imageUrl: '/images/deco/stamp/stamp/stamp_16.png',
    baseWidth: 50,
    baseHeight: 50,
    rotatable: true,
    rarity: 3,
    obtainMethod: 'default',
  },
  // ========================================
  // マスキングテープ（後で3分割対応）
  // ========================================
  // 現在はプレースホルダー - 3分割画像ができたら更新
  // ========================================
  // グリッター（プレースホルダー）
  // ========================================
  // ========================================
  // フレーム（プレースホルダー）
  // ========================================
]

// ユーザーが所持しているデコアイテムを取得
export function getOwnedDecoItems(
  ownedIds: string[],
  includeDefault: boolean = true
): DecoItemData[] {
  return DEFAULT_DECO_ITEMS.filter(item => {
    if (includeDefault && item.obtainMethod === 'default') return true
    return ownedIds.includes(item.id)
  })
}

// タイプ別にグループ化
export function groupDecoItemsByType(
  items: DecoItemData[]
): Record<DecoItemType, DecoItemData[]> {
  const grouped: Record<DecoItemType, DecoItemData[]> = {
    tape: [],
    lace: [],
    stamp: [],
    glitter: [],
    frame: [],
  }

  items.forEach(item => {
    grouped[item.type].push(item)
  })

  return grouped
}
