// キャラクターベース報酬システムの定数定義
// 各キャラクター約30種のシールを集めることで段階的に報酬を解放

// 報酬タイプ
export const CHARACTER_REWARD_TYPES = {
  CHARACTER_ICON: 'character_icon',  // キャラクターアイコン（シール画像をプロフィールアイコンに設定可能）
  BOOK_COVER: 'book_cover',          // シール帳の表紙
  ICON_FRAME: 'icon_frame',          // アイコンフレーム
} as const

export type CharacterRewardType = typeof CHARACTER_REWARD_TYPES[keyof typeof CHARACTER_REWARD_TYPES]

// 報酬ティア
export const CHARACTER_REWARD_TIERS = {
  TIER_1: 1, // 10種達成 → キャラアイコン解放
  TIER_2: 2, // 20種達成 → シール帳表紙解放
  TIER_3: 3, // 30種達成（コンプリート）→ アイコンフレーム解放
} as const

export type CharacterRewardTier = typeof CHARACTER_REWARD_TIERS[keyof typeof CHARACTER_REWARD_TIERS]

// 各ティアの必要種類数
export const CHARACTER_TIER_REQUIREMENTS = {
  [CHARACTER_REWARD_TIERS.TIER_1]: 10,
  [CHARACTER_REWARD_TIERS.TIER_2]: 20,
  [CHARACTER_REWARD_TIERS.TIER_3]: 30,
} as const

// ティアごとの報酬タイプマッピング
export const TIER_REWARD_TYPE_MAP = {
  [CHARACTER_REWARD_TIERS.TIER_1]: CHARACTER_REWARD_TYPES.CHARACTER_ICON,
  [CHARACTER_REWARD_TIERS.TIER_2]: CHARACTER_REWARD_TYPES.BOOK_COVER,
  [CHARACTER_REWARD_TIERS.TIER_3]: CHARACTER_REWARD_TYPES.ICON_FRAME,
} as const

// ティアごとの報酬内容の説明
export const CHARACTER_TIER_DESCRIPTIONS = {
  [CHARACTER_REWARD_TIERS.TIER_1]: 'キャラアイコン解放',
  [CHARACTER_REWARD_TIERS.TIER_2]: 'シール帳表紙解放',
  [CHARACTER_REWARD_TIERS.TIER_3]: 'アイコンフレーム解放',
} as const

// 全キャラクターリスト（46キャラ）
export const CHARACTER_LIST = [
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

export type CharacterName = typeof CHARACTER_LIST[number]

// キャラクターIDマッピング（データベース用プレフィックス）
export const CHARACTER_ID_MAP: Record<CharacterName, string> = {
  'いちごにゃん': 'ichigonyan',
  'ウールン': 'woolun',
  'キノぼう': 'kinobou',
  'きらきらシャボンうさぎ': 'kirakirashabonusagi',
  'きらぼし': 'kiraboshi',
  'くまグミ': 'kumagumi',
  'クリームソーダちゃん': 'creamsodachan',
  'けいとにゃん': 'keitonyan',
  'コケボ': 'kokebo',
  'ころりんご': 'kororingo',
  'さくらんぼーず': 'sakuranboz',
  'サニたん': 'sanitan',
  'しゃぼんちゃん': 'shabonchan',
  'しゅわぴー': 'shuwapi',
  'スタラ': 'sutara',
  'チャックン': 'chakkun',
  'トイラン': 'toiran',
  'とろりんプリンひよこ': 'tororinpurinhiyoko',
  'ドロル': 'dororu',
  'にじたま': 'nijitama',
  'ねこマカロン': 'nekomacaron',
  'ねりあめちゃん': 'neriamechan',
  'ビー玉にゃんこ': 'bidamanyanko',
  'ぷちぷちにゃん': 'puchipuchinyan',
  'ぷにねこ': 'punineko',
  'ぷりんぬ': 'purinnu',
  'ぷるるん': 'pururun',
  'ふわふわコットンキャンディねこ': 'fuwafuwacottoncandyneko',
  'ふわもくん': 'fuwamokun',
  'ふわもちパン': 'fuwamochipan',
  'ふわりぼん': 'fuwaribon',
  'ポフン': 'pofun',
  'ぽよまる': 'poyomaru',
  'ポリ': 'pori',
  'ほわほわん': 'howahawan',
  'メルト・ヴィヴィ': 'meltvivi',
  'もこたんぽぽ': 'mokotanpopo',
  'もちぷに': 'mochipuni',
  'もっちも': 'mocchimo',
  'もふもふポップコーンぴよ': 'mofumofupopcornpiyo',
  'ゆめくも': 'yumekumo',
  'ゆめくらげ': 'yumekurage',
  'ゆめひつじ': 'yumehitsuji',
  'リボンちゃん': 'ribonchan',
  'ルミナ・スターダスト': 'luminastardust',
}

// キャラクターのテーマカラー（フレームのプレースホルダー用）
export const CHARACTER_THEME_COLORS: Record<CharacterName, { primary: string; secondary: string; accent: string }> = {
  'いちごにゃん': { primary: '#FF6B6B', secondary: '#FFE0E0', accent: '#FF4757' },
  'ウールン': { primary: '#FFF5E6', secondary: '#F5DEB3', accent: '#DEB887' },
  'キノぼう': { primary: '#8B4513', secondary: '#DEB887', accent: '#D2691E' },
  'きらきらシャボンうさぎ': { primary: '#E6E6FA', secondary: '#FFFFFF', accent: '#DDA0DD' },
  'きらぼし': { primary: '#FFD700', secondary: '#FFF8DC', accent: '#FFA500' },
  'くまグミ': { primary: '#FF69B4', secondary: '#FFE4E1', accent: '#FF1493' },
  'クリームソーダちゃん': { primary: '#7FFFD4', secondary: '#E0FFFF', accent: '#40E0D0' },
  'けいとにゃん': { primary: '#FF7F50', secondary: '#FFEFD5', accent: '#FF6347' },
  'コケボ': { primary: '#90EE90', secondary: '#F0FFF0', accent: '#32CD32' },
  'ころりんご': { primary: '#FF4500', secondary: '#FFE4B5', accent: '#DC143C' },
  'さくらんぼーず': { primary: '#DC143C', secondary: '#FFB6C1', accent: '#B22222' },
  'サニたん': { primary: '#FFD700', secondary: '#FFFACD', accent: '#FFA500' },
  'しゃぼんちゃん': { primary: '#87CEEB', secondary: '#E0FFFF', accent: '#00BFFF' },
  'しゅわぴー': { primary: '#00CED1', secondary: '#E0FFFF', accent: '#20B2AA' },
  'スタラ': { primary: '#9370DB', secondary: '#E6E6FA', accent: '#8A2BE2' },
  'チャックン': { primary: '#FFD700', secondary: '#FFF8DC', accent: '#DAA520' },
  'トイラン': { primary: '#FF6347', secondary: '#FFDAB9', accent: '#FF4500' },
  'とろりんプリンひよこ': { primary: '#FFD700', secondary: '#FFFACD', accent: '#FFA500' },
  'ドロル': { primary: '#9370DB', secondary: '#E6E6FA', accent: '#8B008B' },
  'にじたま': { primary: '#FF69B4', secondary: '#FFE4E1', accent: '#DA70D6' },
  'ねこマカロン': { primary: '#FFB6C1', secondary: '#FFF0F5', accent: '#FF69B4' },
  'ねりあめちゃん': { primary: '#FF69B4', secondary: '#FFE4E1', accent: '#FF1493' },
  'ビー玉にゃんこ': { primary: '#4169E1', secondary: '#E6E6FA', accent: '#1E90FF' },
  'ぷちぷちにゃん': { primary: '#87CEEB', secondary: '#F0F8FF', accent: '#00BFFF' },
  'ぷにねこ': { primary: '#FFB6C1', secondary: '#FFF0F5', accent: '#FF69B4' },
  'ぷりんぬ': { primary: '#FFD700', secondary: '#FFFACD', accent: '#DAA520' },
  'ぷるるん': { primary: '#87CEEB', secondary: '#E0FFFF', accent: '#00CED1' },
  'ふわふわコットンキャンディねこ': { primary: '#FFB6C1', secondary: '#FFF0F5', accent: '#FF69B4' },
  'ふわもくん': { primary: '#F5F5DC', secondary: '#FFFAF0', accent: '#DEB887' },
  'ふわもちパン': { primary: '#F5DEB3', secondary: '#FFF8DC', accent: '#DEB887' },
  'ふわりぼん': { primary: '#FF69B4', secondary: '#FFE4E1', accent: '#FF1493' },
  'ポフン': { primary: '#F5F5DC', secondary: '#FFFAF0', accent: '#FFE4B5' },
  'ぽよまる': { primary: '#98FB98', secondary: '#F0FFF0', accent: '#00FA9A' },
  'ポリ': { primary: '#87CEEB', secondary: '#F0F8FF', accent: '#4169E1' },
  'ほわほわん': { primary: '#FFFAF0', secondary: '#FFF5EE', accent: '#FFE4B5' },
  'メルト・ヴィヴィ': { primary: '#FF6B9D', secondary: '#FFE4EE', accent: '#FF3D8E' },
  'もこたんぽぽ': { primary: '#FFFF00', secondary: '#FFFACD', accent: '#FFD700' },
  'もちぷに': { primary: '#FFF8DC', secondary: '#FFFAF0', accent: '#F5DEB3' },
  'もっちも': { primary: '#F5F5DC', secondary: '#FFFAF0', accent: '#DEB887' },
  'もふもふポップコーンぴよ': { primary: '#FFD700', secondary: '#FFF8DC', accent: '#FFA500' },
  'ゆめくも': { primary: '#E6E6FA', secondary: '#FFF0F5', accent: '#DDA0DD' },
  'ゆめくらげ': { primary: '#9370DB', secondary: '#E6E6FA', accent: '#8A2BE2' },
  'ゆめひつじ': { primary: '#E6E6FA', secondary: '#FFF0F5', accent: '#DDA0DD' },
  'リボンちゃん': { primary: '#FF69B4', secondary: '#FFE4E1', accent: '#FF1493' },
  'ルミナ・スターダスト': { primary: '#9370DB', secondary: '#E6E6FA', accent: '#8A2BE2' },
}

// 報酬受取時のメッセージ
export const CHARACTER_REWARD_MESSAGES: Record<CharacterRewardType, string> = {
  [CHARACTER_REWARD_TYPES.CHARACTER_ICON]: 'キャラアイコンが解放されました！',
  [CHARACTER_REWARD_TYPES.BOOK_COVER]: 'シール帳の表紙が解放されました！',
  [CHARACTER_REWARD_TYPES.ICON_FRAME]: 'アイコンフレームが解放されました！',
}

// アイコンフレームのメタデータ（画像ごとのアイコン配置位置）
// フレームデザインによってアイコン位置が異なるため、各フレームに対して配置情報を定義
export interface FrameMetadata {
  frameWidth: number      // フレーム画像の幅
  frameHeight: number     // フレーム画像の高さ
  iconCenterX: number     // アイコン中心のX座標（px）
  iconCenterY: number     // アイコン中心のY座標（px）
  iconDiameter: number    // アイコンの直径（px）
  iconOffsetX?: number    // アイコン位置の微調整（px, 描画後）
  iconOffsetY?: number    // アイコン位置の微調整（px, 描画後）
}

// キャラクターごとのフレームメタデータ
// 画像がないキャラクターはnullとし、プレースホルダーフレーム（中央配置）を使用
export const FRAME_METADATA: Partial<Record<CharacterName, FrameMetadata>> = {
  // === 調整済みキャラクター ===
  // チャックン: 紫モンスター、開口部は中央 ※調整済み
  'チャックン': {
    frameWidth: 423,
    frameHeight: 452,
    iconCenterX: 211,
    iconCenterY: 228,
    iconDiameter: 283,
  },
  // トイラン: 犬耳+翼、開口部は上部中央 ※調整済み
  'トイラン': {
    frameWidth: 500,
    frameHeight: 409,
    iconCenterX: 250,
    iconCenterY: 182,
    iconDiameter: 240,
    iconOffsetX: 0,
    iconOffsetY: 5,
  },
  // ねこマカロン: ピンク猫マカロン、開口部は中央 ※調整済み
  'ねこマカロン': {
    frameWidth: 405,
    frameHeight: 408,
    iconCenterX: 202,
    iconCenterY: 214,
    iconDiameter: 240,
  },
  // ルミナ・スターダスト: 月+翼+角、開口部はやや右上 ※調整済み
  'ルミナ・スターダスト': {
    frameWidth: 512,
    frameHeight: 399,
    iconCenterX: 288,
    iconCenterY: 210,
    iconDiameter: 250,
  },
  // === デフォルト値（要調整） ===
  'いちごにゃん': {
    frameWidth: 400,
    frameHeight: 400,
    iconCenterX: 200,
    iconCenterY: 200,
    iconDiameter: 240,
  },
  'ウールン': {
    frameWidth: 400,
    frameHeight: 400,
    iconCenterX: 200,
    iconCenterY: 200,
    iconDiameter: 240,
  },
  'キノぼう': {
    frameWidth: 400,
    frameHeight: 400,
    iconCenterX: 200,
    iconCenterY: 200,
    iconDiameter: 240,
  },
  'きらきらシャボンうさぎ': {
    frameWidth: 400,
    frameHeight: 400,
    iconCenterX: 200,
    iconCenterY: 200,
    iconDiameter: 178,
    iconOffsetX: 1.5,
    iconOffsetY: 5,
  },
  'きらぼし': {
    frameWidth: 400,
    frameHeight: 400,
    iconCenterX: 200,
    iconCenterY: 200,
    iconDiameter: 197,
    iconOffsetX: 2,
    iconOffsetY: 2,
  },
  'くまグミ': {
    frameWidth: 400,
    frameHeight: 400,
    iconCenterX: 200,
    iconCenterY: 200,
    iconDiameter: 240,
  },
  'クリームソーダちゃん': {
    frameWidth: 400,
    frameHeight: 400,
    iconCenterX: 200,
    iconCenterY: 200,
    iconDiameter: 240,
  },
  'けいとにゃん': {
    frameWidth: 400,
    frameHeight: 400,
    iconCenterX: 200,
    iconCenterY: 200,
    iconDiameter: 240,
  },
  'コケボ': {
    frameWidth: 400,
    frameHeight: 400,
    iconCenterX: 200,
    iconCenterY: 200,
    iconDiameter: 202,
    iconOffsetX: 0,
    iconOffsetY: 4.7,
  },
  'ころりんご': {
    frameWidth: 400,
    frameHeight: 400,
    iconCenterX: 200,
    iconCenterY: 200,
    iconDiameter: 240,
    iconOffsetX: 1.9,
    iconOffsetY: 10.6,
  },
  'さくらんぼーず': {
    frameWidth: 400,
    frameHeight: 400,
    iconCenterX: 200,
    iconCenterY: 200,
    iconDiameter: 209,
  },
  'サニたん': {
    frameWidth: 400,
    frameHeight: 400,
    iconCenterX: 200,
    iconCenterY: 200,
    iconDiameter: 240,
  },
  'しゃぼんちゃん': {
    frameWidth: 400,
    frameHeight: 400,
    iconCenterX: 200,
    iconCenterY: 200,
    iconDiameter: 240,
  },
  'しゅわぴー': {
    frameWidth: 400,
    frameHeight: 400,
    iconCenterX: 200,
    iconCenterY: 200,
    iconDiameter: 182,
    iconOffsetY: 2.8,
  },
  'スタラ': {
    frameWidth: 400,
    frameHeight: 400,
    iconCenterX: 200,
    iconCenterY: 200,
    iconDiameter: 194,
    iconOffsetY: 5,
  },
  'とろりんプリンひよこ': {
    frameWidth: 400,
    frameHeight: 400,
    iconCenterX: 200,
    iconCenterY: 200,
    iconDiameter: 240,
  },
  'ドロル': {
    frameWidth: 400,
    frameHeight: 400,
    iconCenterX: 200,
    iconCenterY: 200,
    iconDiameter: 186,
    iconOffsetY: 2.4,
  },
  'にじたま': {
    frameWidth: 400,
    frameHeight: 400,
    iconCenterX: 200,
    iconCenterY: 200,
    iconDiameter: 240,
  },
  'ねりあめちゃん': {
    frameWidth: 400,
    frameHeight: 400,
    iconCenterX: 200,
    iconCenterY: 200,
    iconDiameter: 240,
    iconOffsetY: 4.4,
  },
  'ビー玉にゃんこ': {
    frameWidth: 400,
    frameHeight: 400,
    iconCenterX: 200,
    iconCenterY: 200,
    iconDiameter: 240,
  },
  'ぷちぷちにゃん': {
    frameWidth: 400,
    frameHeight: 400,
    iconCenterX: 200,
    iconCenterY: 200,
    iconDiameter: 240,
    iconOffsetX: -8.1,
  },
  'ぷにねこ': {
    frameWidth: 400,
    frameHeight: 400,
    iconCenterX: 200,
    iconCenterY: 200,
    iconDiameter: 240,
  },
  'ぷりんぬ': {
    frameWidth: 400,
    frameHeight: 400,
    iconCenterX: 200,
    iconCenterY: 200,
    iconDiameter: 205,
    iconOffsetY: 12.3,
  },
  'ぷるるん': {
    frameWidth: 400,
    frameHeight: 400,
    iconCenterX: 200,
    iconCenterY: 200,
    iconDiameter: 202,
    iconOffsetY: 8.9,
  },
  'ふわふわコットンキャンディねこ': {
    frameWidth: 400,
    frameHeight: 400,
    iconCenterX: 200,
    iconCenterY: 200,
    iconDiameter: 240,
  },
  'ふわもくん': {
    frameWidth: 400,
    frameHeight: 400,
    iconCenterX: 200,
    iconCenterY: 200,
    iconDiameter: 240,
    iconOffsetY: -3.7,
  },
  'ふわもちパン': {
    frameWidth: 400,
    frameHeight: 400,
    iconCenterX: 200,
    iconCenterY: 200,
    iconDiameter: 240,
  },
  'ふわりぼん': {
    frameWidth: 400,
    frameHeight: 400,
    iconCenterX: 200,
    iconCenterY: 200,
    iconDiameter: 209,
    iconOffsetY: 8.2,
  },
  'ポフン': {
    frameWidth: 400,
    frameHeight: 400,
    iconCenterX: 200,
    iconCenterY: 200,
    iconDiameter: 240,
  },
  'ぽよまる': {
    frameWidth: 400,
    frameHeight: 400,
    iconCenterX: 200,
    iconCenterY: 200,
    iconDiameter: 198,
    iconOffsetY: 7.7,
  },
  'ポリ': {
    frameWidth: 400,
    frameHeight: 400,
    iconCenterX: 200,
    iconCenterY: 200,
    iconDiameter: 240,
  },
  'ほわほわん': {
    frameWidth: 400,
    frameHeight: 400,
    iconCenterX: 200,
    iconCenterY: 200,
    iconDiameter: 198,
    iconOffsetY: 7.7,
  },
  'メルト・ヴィヴィ': {
    frameWidth: 400,
    frameHeight: 400,
    iconCenterX: 200,
    iconCenterY: 200,
    iconDiameter: 202,
    iconOffsetY: 2.1,
  },
  'もこたんぽぽ': {
    frameWidth: 400,
    frameHeight: 400,
    iconCenterX: 200,
    iconCenterY: 200,
    iconDiameter: 240,
  },
  'もちぷに': {
    frameWidth: 400,
    frameHeight: 400,
    iconCenterX: 200,
    iconCenterY: 200,
    iconDiameter: 240,
  },
  'もっちも': {
    frameWidth: 400,
    frameHeight: 400,
    iconCenterX: 200,
    iconCenterY: 200,
    iconDiameter: 240,
  },
  'もふもふポップコーンぴよ': {
    frameWidth: 400,
    frameHeight: 400,
    iconCenterX: 200,
    iconCenterY: 200,
    iconDiameter: 240,
  },
  'ゆめくも': {
    frameWidth: 400,
    frameHeight: 400,
    iconCenterX: 200,
    iconCenterY: 200,
    iconDiameter: 240,
  },
  'ゆめくらげ': {
    frameWidth: 400,
    frameHeight: 400,
    iconCenterX: 200,
    iconCenterY: 200,
    iconDiameter: 240,
  },
  'ゆめひつじ': {
    frameWidth: 400,
    frameHeight: 400,
    iconCenterX: 200,
    iconCenterY: 200,
    iconDiameter: 240,
  },
  'リボンちゃん': {
    frameWidth: 400,
    frameHeight: 400,
    iconCenterX: 200,
    iconCenterY: 200,
    iconDiameter: 240,
  },
}

/**
 * フレーム画像のパスを取得
 */
export function getFrameImagePath(characterName: CharacterName): string | null {
  if (FRAME_METADATA[characterName]) {
    return `/icon_frame/${characterName}/icon_frame.png`
  }
  return null
}

/**
 * フレームメタデータを取得
 */
export function getFrameMetadata(characterName: CharacterName): FrameMetadata | null {
  return FRAME_METADATA[characterName] || null
}

// ヘルパー関数

/**
 * キャラクター名からIDを取得
 */
export function getCharacterId(characterName: CharacterName): string {
  return CHARACTER_ID_MAP[characterName]
}

/**
 * ティアごとの報酬IDを生成
 */
export function getRewardId(characterName: CharacterName, tier: CharacterRewardTier): string {
  const characterId = getCharacterId(characterName)
  return `${characterId}_t${tier}`
}

/**
 * フレームIDを生成
 */
export function getFrameId(characterName: CharacterName): string {
  return `frame_${getCharacterId(characterName)}`
}

/**
 * 収集数から達成済みティアを取得
 */
export function getAchievedTiers(collectedCount: number): CharacterRewardTier[] {
  const tiers: CharacterRewardTier[] = []
  if (collectedCount >= CHARACTER_TIER_REQUIREMENTS[CHARACTER_REWARD_TIERS.TIER_1]) {
    tiers.push(CHARACTER_REWARD_TIERS.TIER_1)
  }
  if (collectedCount >= CHARACTER_TIER_REQUIREMENTS[CHARACTER_REWARD_TIERS.TIER_2]) {
    tiers.push(CHARACTER_REWARD_TIERS.TIER_2)
  }
  if (collectedCount >= CHARACTER_TIER_REQUIREMENTS[CHARACTER_REWARD_TIERS.TIER_3]) {
    tiers.push(CHARACTER_REWARD_TIERS.TIER_3)
  }
  return tiers
}

/**
 * 次のティアまでの進捗を取得
 */
export function getProgressToNextTier(collectedCount: number): {
  currentTier: CharacterRewardTier | null
  nextTier: CharacterRewardTier | null
  progress: number
  remaining: number
} {
  if (collectedCount >= CHARACTER_TIER_REQUIREMENTS[CHARACTER_REWARD_TIERS.TIER_3]) {
    return {
      currentTier: CHARACTER_REWARD_TIERS.TIER_3,
      nextTier: null,
      progress: 100,
      remaining: 0,
    }
  }

  if (collectedCount >= CHARACTER_TIER_REQUIREMENTS[CHARACTER_REWARD_TIERS.TIER_2]) {
    const required = CHARACTER_TIER_REQUIREMENTS[CHARACTER_REWARD_TIERS.TIER_3]
    const prev = CHARACTER_TIER_REQUIREMENTS[CHARACTER_REWARD_TIERS.TIER_2]
    return {
      currentTier: CHARACTER_REWARD_TIERS.TIER_2,
      nextTier: CHARACTER_REWARD_TIERS.TIER_3,
      progress: Math.round(((collectedCount - prev) / (required - prev)) * 100),
      remaining: required - collectedCount,
    }
  }

  if (collectedCount >= CHARACTER_TIER_REQUIREMENTS[CHARACTER_REWARD_TIERS.TIER_1]) {
    const required = CHARACTER_TIER_REQUIREMENTS[CHARACTER_REWARD_TIERS.TIER_2]
    const prev = CHARACTER_TIER_REQUIREMENTS[CHARACTER_REWARD_TIERS.TIER_1]
    return {
      currentTier: CHARACTER_REWARD_TIERS.TIER_1,
      nextTier: CHARACTER_REWARD_TIERS.TIER_2,
      progress: Math.round(((collectedCount - prev) / (required - prev)) * 100),
      remaining: required - collectedCount,
    }
  }

  const required = CHARACTER_TIER_REQUIREMENTS[CHARACTER_REWARD_TIERS.TIER_1]
  return {
    currentTier: null,
    nextTier: CHARACTER_REWARD_TIERS.TIER_1,
    progress: Math.round((collectedCount / required) * 100),
    remaining: required - collectedCount,
  }
}

/**
 * キャラクター名が有効かチェック
 */
export function isValidCharacter(name: string): name is CharacterName {
  return CHARACTER_LIST.includes(name as CharacterName)
}
