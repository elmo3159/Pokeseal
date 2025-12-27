import json
import os

base_path = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Load generated stickers
with open(os.path.join(base_path, 'generated_stickers.json'), 'r', encoding='utf-8') as f:
    stickers = json.load(f)

# Generate TypeScript file
ts_lines = []

ts_lines.append('''// シールマスターデータ（自動生成）
// 全45キャラクター × 合計1,156枚

export interface StickerMaster {
  id: string
  name: string
  character: string
  variant: number
  rarity: 1 | 2 | 3 | 4 | 5
  type: 'normal' | 'puffy' | 'sparkle'
  stickerType: 'classic' | 'bondro' | 'marshmallow'
  series: string
  imageUrl: string
  baseRate: number
  gachaWeight: number
}

// シールタイプの説明
// classic: 旧フォーマット（直接フォルダ内）
// bondro: ボンボンドロップ型シール
// marshmallow: マシュマロ型シール

// レアリティ設定
// ★★★★★ (R5): レジェンド - 約3.3%
// ★★★★ (R4): スーパーレア - 約10%
// ★★★ (R3): レア - 約20%
// ★★ (R2): アンコモン - 約33%
// ★ (R1): コモン - 約33%

function encodeImageUrl(folder: string, subfolder: string | null, fileName: string): string {
  const encodedFolder = encodeURIComponent(folder)
  const encodedFileName = encodeURIComponent(fileName)

  if (subfolder) {
    const encodedSubfolder = encodeURIComponent(subfolder)
    return `/stickers/${encodedFolder}/${encodedSubfolder}/${encodedFileName}`
  }
  return `/stickers/${encodedFolder}/${encodedFileName}`
}

// 全シールマスターデータ
export const ALL_STICKERS: StickerMaster[] = [
''')

for s in stickers:
    subfolder_value = f"'{s['subfolder']}'" if s.get('subfolder') else 'null'
    ts_lines.append(f'''  {{
    id: '{s["id"]}',
    name: '{s["name"]}',
    character: '{s["character"]}',
    variant: {s["variant"]},
    rarity: {s["rarity"]},
    type: '{s["type"]}',
    stickerType: '{s["stickerType"]}',
    series: '{s["series"]}',
    imageUrl: encodeImageUrl('{s["folder"]}', {subfolder_value}, '{s["fileName"]}'),
    baseRate: {s["baseRate"]},
    gachaWeight: {s["gachaWeight"]},
  }},
''')

ts_lines.append(''']

// ユーティリティ関数

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

// シールタイプ別取得
export function getStickersByStickerType(stickerType: 'classic' | 'bondro' | 'marshmallow'): StickerMaster[] {
  return ALL_STICKERS.filter((s) => s.stickerType === stickerType)
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

// ID でシール取得
export function getStickerById(id: string): StickerMaster | undefined {
  return ALL_STICKERS.find((s) => s.id === id)
}

export default ALL_STICKERS
''')

# Write TypeScript file
ts_content = ''.join(ts_lines)
output_path = os.path.join(base_path, 'src', 'data', 'stickerMasterData.ts')
with open(output_path, 'w', encoding='utf-8') as f:
    f.write(ts_content)

print(f'TypeScript file generated: {output_path}')
print(f'Total stickers: {len(stickers)}')
