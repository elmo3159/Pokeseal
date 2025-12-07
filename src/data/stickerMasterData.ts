// シールマスターデータ
// 10キャラクター × 15バリエーション = 150枚

export interface StickerMaster {
  id: string
  name: string
  character: string
  variant: number
  rarity: 1 | 2 | 3 | 4 | 5
  type: 'normal' | 'puffy' | 'sparkle'
  series: string
  imageUrl: string
  baseRate: number // 交換レート基準値
  gachaWeight: number // ガチャ排出重み（低いほどレア）
}

// キャラクター設定
// もっちも, ウールン, スタラ: レート最高（レアリティ5）
// ドロル, チャックン: レアリティ4
// コケボ, サニたん: レアリティ3
// キノぼう, ポリ: レアリティ2
// ポフン: レアリティ1

interface CharacterConfig {
  name: string
  folder: string
  rarity: 1 | 2 | 3 | 4 | 5
  type: 'normal' | 'puffy' | 'sparkle'
  series: string
  baseRate: number
  gachaWeight: number
  filePrefix: string
}

const characterConfigs: CharacterConfig[] = [
  // レアリティ5（最高レート）- もっちも, ウールン, スタラ
  {
    name: 'もっちも',
    folder: 'もっちも',
    rarity: 5,
    type: 'sparkle',
    series: 'レジェンドコレクション',
    baseRate: 500,
    gachaWeight: 1,
    filePrefix: 'もっちも',
  },
  {
    name: 'ウールン',
    folder: 'ウールン',
    rarity: 5,
    type: 'sparkle',
    series: 'レジェンドコレクション',
    baseRate: 500,
    gachaWeight: 1,
    filePrefix: 'ウールン',
  },
  {
    name: 'スタラ',
    folder: 'スタラ',
    rarity: 5,
    type: 'sparkle',
    series: 'レジェンドコレクション',
    baseRate: 500,
    gachaWeight: 1,
    filePrefix: 'スタラ',
  },
  // レアリティ4 - ドロル, チャックン
  {
    name: 'ドロル',
    folder: 'ドロル',
    rarity: 4,
    type: 'puffy',
    series: 'スーパーレアコレクション',
    baseRate: 200,
    gachaWeight: 5,
    filePrefix: 'ドロル',
  },
  {
    name: 'チャックン',
    folder: 'チャックン',
    rarity: 4,
    type: 'puffy',
    series: 'スーパーレアコレクション',
    baseRate: 200,
    gachaWeight: 5,
    filePrefix: 'チャックン',
  },
  // レアリティ3 - コケボ, サニたん
  {
    name: 'コケボ',
    folder: 'コケボ',
    rarity: 3,
    type: 'normal',
    series: 'レアコレクション',
    baseRate: 100,
    gachaWeight: 15,
    filePrefix: 'コケボ',
  },
  {
    name: 'サニたん',
    folder: 'サニたん',
    rarity: 3,
    type: 'normal',
    series: 'レアコレクション',
    baseRate: 100,
    gachaWeight: 15,
    filePrefix: 'サニたん',
  },
  // レアリティ2 - キノぼう, ポリ
  {
    name: 'キノぼう',
    folder: 'キノぼう',
    rarity: 2,
    type: 'normal',
    series: 'アンコモンコレクション',
    baseRate: 50,
    gachaWeight: 30,
    filePrefix: 'キノぼう',
  },
  {
    name: 'ポリ',
    folder: 'ポリ',
    rarity: 2,
    type: 'normal',
    series: 'アンコモンコレクション',
    baseRate: 50,
    gachaWeight: 30,
    filePrefix: 'ポリ',
  },
  // レアリティ1 - ポフン
  {
    name: 'ポフン',
    folder: 'ポフン',
    rarity: 1,
    type: 'normal',
    series: 'コモンコレクション',
    baseRate: 20,
    gachaWeight: 50,
    filePrefix: 'sticker', // ポフンはファイル名が「sticker_X.png」
  },
]

// 全シールを生成
function generateAllStickers(): StickerMaster[] {
  const stickers: StickerMaster[] = []

  for (const config of characterConfigs) {
    for (let i = 1; i <= 15; i++) {
      const id = `${config.folder.toLowerCase()}-${i}`
      const fileName = `${config.filePrefix}_${i}.png`
      // URLエンコードして日本語パスを正しく処理
      const encodedFolder = encodeURIComponent(config.folder)
      const encodedFileName = encodeURIComponent(fileName)
      const imageUrl = `/stickers/${encodedFolder}/${encodedFileName}`

      stickers.push({
        id,
        name: `${config.name} #${i}`,
        character: config.name,
        variant: i,
        rarity: config.rarity,
        type: config.type,
        series: config.series,
        imageUrl,
        baseRate: config.baseRate,
        gachaWeight: config.gachaWeight,
      })
    }
  }

  return stickers
}

// 全シールマスターデータ（150枚）
export const ALL_STICKERS: StickerMaster[] = generateAllStickers()

// キャラクター別シール取得
export function getStickersByCharacter(character: string): StickerMaster[] {
  return ALL_STICKERS.filter((s) => s.character === character)
}

// レアリティ別シール取得
export function getStickersByRarity(rarity: number): StickerMaster[] {
  return ALL_STICKERS.filter((s) => s.rarity === rarity)
}

// シリーズ別シール取得
export function getStickersBySeries(series: string): StickerMaster[] {
  return ALL_STICKERS.filter((s) => s.series === series)
}

// ガチャプール取得（重み付き）
export function getGachaPool(): StickerMaster[] {
  return ALL_STICKERS.filter((s) => s.gachaWeight > 0)
}

// 重み付きランダム抽選
export function weightedRandomPull(pool: StickerMaster[] = getGachaPool()): StickerMaster {
  const totalWeight = pool.reduce((sum, s) => sum + s.gachaWeight, 0)
  let random = Math.random() * totalWeight

  for (const sticker of pool) {
    random -= sticker.gachaWeight
    if (random <= 0) {
      return sticker
    }
  }

  // フォールバック
  return pool[pool.length - 1]
}

// シリーズ一覧取得
export function getAllSeries(): string[] {
  const series = new Set(ALL_STICKERS.map((s) => s.series))
  return Array.from(series)
}

// キャラクター一覧取得
export function getAllCharacters(): string[] {
  const characters = new Set(ALL_STICKERS.map((s) => s.character))
  return Array.from(characters)
}

// レアリティ別の排出確率を計算
export function getGachaRates(): { rarity: number; rate: number; count: number }[] {
  const pool = getGachaPool()
  const totalWeight = pool.reduce((sum, s) => sum + s.gachaWeight, 0)

  const rarityGroups = new Map<number, { weight: number; count: number }>()

  for (const sticker of pool) {
    const existing = rarityGroups.get(sticker.rarity) || { weight: 0, count: 0 }
    rarityGroups.set(sticker.rarity, {
      weight: existing.weight + sticker.gachaWeight,
      count: existing.count + 1,
    })
  }

  return Array.from(rarityGroups.entries())
    .map(([rarity, data]) => ({
      rarity,
      rate: Math.round((data.weight / totalWeight) * 10000) / 100,
      count: data.count,
    }))
    .sort((a, b) => b.rarity - a.rarity)
}

export default ALL_STICKERS
