`CLAUDE.md` は、AIに対する「常に覚えておいてほしいルールブック」ですので、\*\*開発のルール、技術スタック、デザインシステム、そして特殊な実装ロジック（シール帳の座標計算など）\*\*に絞るのが最適です。

画面ごとの細かい仕様（セクション9や19）は、その画面を作る時にだけプロンプトで渡せば良いため、コンテキストファイルからは削除して軽量化します。

以下に、重要度が高い情報を残しつつ、トークン数を大幅に削減した**最適化版 `CLAUDE.md`** を提案します。これをそのまま上書きしてください。

-----

# ポケシル（Pokeseal）- 実装ガイド (Lightweight Ver.)

## 1\. プロジェクト概要 & 技術スタック

  * **概要:** モバイル向け3D風シール帳アプリ（Web技術ベース + ラッパーでストア配信）
  * **Front:** Next.js (App Router), TypeScript, React, Tailwind CSS
  * **Back:** Supabase (PostgreSQL, Auth, Realtime, Storage)
  * **Lib:** `react-page-flip` (シール帳), `st-page-flip`
  * **UI方針:** ゲーム特有の「画像ベースUI」と「絶対配置」を多用する。
  * **モバイルラッパー:** Capacitor（iOS/Android両対応）
    - Webでは公開せず、App Store / Google Play のみで配信
    - 開発中はブラウザで完成させ、最終段階でCapacitorを導入する
    - 静的エクスポート（`output: 'export'`）が必要

## 2\. 開発ルール (ClaudeCode Action Rules)

1.  **完了主義:** タスクは型エラー・Lintエラー・ビルドエラーがない「動く状態」まで完了させる。
2.  **自己修正:** エラー発生時はログを読み、自律的に修正を試みる。
3.  **確認:** UI変更後は必ずブラウザで表示確認（スクショ取得）を行う。
4.  **Git:** 機能単位でこまめにコミットを行う（GitHub MCP使用）。
5.  **Secret:** APIキー等は環境変数で管理し、コードに直書きしない。

## 3\. UI/デザインシステム & 配置実装標準（重要）

\*\*Unityライクな「絶対配置」と「アスペクト比固定」\*\*を Web 標準技術で再現する。

### 3.1 座標・サイズ指定の絶対ルール（Container Query Units）

従来の `%` や `px` ではなく、**Container Query Units (`cqw`, `cqh`)** を全面的に採用し、Figma 上の配置を完璧に再現する。

  * **ルートコンテナ設定:**
    ゲーム画面のルート要素（`GameScreen`等）には必ず以下を設定する。
    ```css
    .game-screen {
      container-type: size; /* 基準コンテナ化 */
      width: 100%;
      aspect-ratio: 9 / 16; /* モバイル比率固定 */
    }
    ```
  * **配置・サイズ指定:**
    子要素（ボタン、キャラ、シール）は **すべて `cqw` (幅の%) / `cqh` (高さの%)** で指定する。
      * *Figmaからの変換式:* `left: (X / DesignWidth * 100)cqw`
      * これにより、親要素のサイズが変わってもレイアウト崩れが**物理的に発生しない**状態にする。

### 3.2 動的追従 UI（Anchor Positioning）

HPバー、吹き出し、ステータス詳細など、特定の要素に吸着するUIには **Anchor Positioning** の概念を用いる。

  * **実装ライブラリ:** ブラウザ互換性（特に Safari）を考慮し、ネイティブ CSS ではなく **`@floating-ui/react`** を使用して実装すること。

### 3.3 デザインアセット

  * ボタンや枠は CSS シェイプではなく、**PNG画像（9スライス等）** を使用してリッチさを出す。
  * カラーパレット: Primary `#6B3FA0`, Bg `#FFF5F8` 等は維持。

## 4\. コア機能実装仕様

### 4.1 シール帳 (BookView)

  * **ライブラリ:** `react-page-flip` を使用。
  * **座標系:**
      * `BookView` コンテナは見開き(`600px`)または単ページ(`300px`)固定幅で計算。
      * 画面幅が足りない場合は `overflow-x: auto` で横スクロールさせる。
  * **ドラッグ&ドロップ:**
      * シール座標はページ内の相対座標（0.0〜1.0）で保存・復元する。
      * ドロップ時に `getBoundingClientRect` で正確な書籍領域を計算し、ページ判定（左/右）を行う。

### 4.2 交換システム (Trade)

  * **リアルタイム:** Supabase Realtimeで `trade_messages`, `trades` を監視。
  * **画面構成:** 上半分に相手のシール帳（操作不可）、下半分に自分のシール帳（操作可）。
  * **整合性:** 交換成立（双方がOK）時は、サーバーサイド（Postgres Transaction）で所有権を入れ替える。

## 5\. 既存の実装パターン（維持すること）

### 5.1 シール配置のバウンド計算 (重要ロジック)

```typescript
const getActualBookBounds = useCallback(() => {
  if (!bookRef.current) return null
  const containerRect = bookRef.current.getBoundingClientRect()
  // 見開き時は2ページ分、単ページ時は1ページ分の幅
  const actualBookWidth = isSpreadView ? bookWidth * 2 : bookWidth
  // コンテナ中央配置のオフセット計算
  const horizontalOffset = (containerRect.width - actualBookWidth) / 2
  
  return {
    left: containerRect.left + horizontalOffset,
    right: containerRect.left + horizontalOffset + actualBookWidth,
    top: containerRect.top + 8, // topOffset
    bottom: containerRect.top + 8 + bookHeight,
    width: actualBookWidth,
    height: bookHeight,
  }
}, [bookRef, bookHeight, bookWidth, isSpreadView])
```

### 5.2 画像ベースコンポーネント例

Web標準のButtonではなく、画像をラップしたコンポーネントを使用する。

```tsx
function PillButton({ label, color, onClick }: Props) {
  const src = color === 'blue' ? '/images/pill_button_blue.png' : '...'
  return (
    <button onClick={onClick} className="relative w-[30cqw] h-[10cqh]">
      <img src={src} className="absolute inset-0 w-full h-full object-contain" />
      <span className="absolute inset-0 flex items-center justify-center text-white font-bold">
        {label}
      </span>
    </button>
  )
}
```

## 6\. MCP ツールセット

  * **Supabase:** DB操作・SQL実行
  * **Filesystem:** ファイル作成・編集
  * **Desktop Commander:** ブラウザ確認・スクショ
  * **GitHub:** コミット・プッシュ
  * **Stability.ai:** 画像素材生成

## 7\. 通貨システム

アプリ内通貨は以下の3種類：

| 名称 | アイコン | 用途 | 獲得方法 |
|------|---------|------|----------|
| シルチケ | 🎫 | 通常ガチャ（1枚=1回） | デイリーボーナス、ミッション、広告視聴 |
| プレシルチケ | 💎 | プレミアムガチャ（1枚=1回） | サブスク特典、イベント報酬 |
| どろっぷ | 💧 | 課金通貨（シルチケ・プレシルチケ・アイテム購入） | 課金購入 |

**消費優先度:** シルチケ/プレシルチケ → どろっぷ（チケット不足時にどろっぷ使用を案内）

## 8\. 関連ドキュメント

  * **課金プラン概要:** `docs/monetization-plan.md` を参照
    - シルチケ・プレシルチケ・どろっぷの詳細仕様
    - サブスクリプションプラン（ライト/プラス/デラックス）
    - 広告リワードシステム
    - デイリーミッション

-----

**Note for Claude:**
新しい画面を作成する際は、ユーザーから詳細な要件（配置や機能）を聞き出してから実装すること。このファイルは「設計思想と既存のコアロジック」を守るために参照せよ。

日本語で回答してください。

## 9. Supabase マイグレーション手順

ClaudeCodeがマイグレーションを適用する手順：

```bash
# 1. ログイン（初回のみ、または期限切れ時）
npx supabase login --token sbp_9c93904e9468015d9688582be59d3d629b7b3647

# 2. プロジェクトリンク（初回のみ）
npx supabase link --project-ref pwdrmbjcrwzhqtajfivk

# 3. マイグレーション適用
npx supabase db push --include-all
```

**プロジェクト情報:**
- Project Ref: `pwdrmbjcrwzhqtajfivk`
- Access Token: `sbp_9c93904e9468015d9688582be59d3d629b7b3647`

**マイグレーションファイル配置:** `supabase/migrations/XXX_name.sql`

**確認コマンド:**
```bash
npx supabase migration list  # 適用済みマイグレーション一覧
```

## 10. シールアップグレードシステム

ダブりシールを集めてアップグレードできるシステム。同じシールを最大20枚集めることで最高ランク「プリズム」に到達できる。

### 10.1 ランク構造

| ランク | 値 | 必要条件 | 累計必要枚数 | 星の追加 | 累計星追加 |
|--------|-----|----------|--------------|----------|------------|
| ノーマル | 0 | 1枚 | 1枚 | +0 | 0 |
| シルバー | 1 | ノーマル×5 | 5枚 | +1 | +1 |
| ゴールド | 2 | シルバー×2 | 10枚 | +2 | +3 |
| プリズム | 3 | ゴールド×2 | 20枚 | +2 | +5 |

**アップグレードフロー:**
```
[ノーマル×5] → [シルバー×1]
      ↓
[シルバー×2] → [ゴールド×1]
      ↓
[ゴールド×2] → [プリズム×1] ← 最高ランク
```

### 10.2 データベース設計

**user_stickers テーブル変更:**
- `upgrade_rank` INTEGER DEFAULT 0 (0:ノーマル, 1:シルバー, 2:ゴールド, 3:プリズム)
- `upgraded_at` TIMESTAMP (アップグレード実行日時)
- 同じ `sticker_id` で異なる `upgrade_rank` のレコードを複数持てる（案B）

**user_sticker_achievements テーブル（新規）:**
- 各シールの最高到達ランクを記録
- `max_upgrade_rank` INTEGER
- `first_prism_at` TIMESTAMP (初めてプリズムになった日時)

### 10.3 名前装飾（絵文字不使用）

CSSでゴージャスなマークを実装する。iPhone絵文字は使用禁止。

| ランク | 装飾 | スタイル |
|--------|------|----------|
| ノーマル | なし | - |
| シルバー | ◆ シール名 | 銀色グラデーション、光沢 |
| ゴールド | ◆◆ シール名 | 金色グラデーション、輝き |
| プリズム | ◆◆◆ シール名 | 虹色グラデーション、アニメーション |

**実装例（CSS）:**
```css
.rank-silver {
  background: linear-gradient(135deg, #C0C0C0, #E8E8E8, #C0C0C0);
  -webkit-background-clip: text;
  text-shadow: 0 1px 2px rgba(192,192,192,0.5);
}
.rank-gold {
  background: linear-gradient(135deg, #FFD700, #FFF8DC, #FFD700);
  -webkit-background-clip: text;
  text-shadow: 0 2px 4px rgba(255,215,0,0.6);
}
.rank-prism {
  background: linear-gradient(90deg, #ff0000, #ff7f00, #ffff00, #00ff00, #0000ff, #4b0082, #9400d3);
  background-size: 200% 100%;
  animation: rainbow 3s linear infinite;
  -webkit-background-clip: text;
}
```

### 10.4 星の表示

- **表示数:** 元のrarity + ランクボーナス
- **色:** ランクに応じて変化
  - ノーマル: ゴールド（通常）
  - シルバー: シルバー（銀色）
  - ゴールド: ゴールド（より輝く金色）
  - プリズム: 虹色アニメーション

**例:** rarity=3 のシールをプリズムにすると → 3+5=8個の虹色の星

### 10.5 エフェクト（シール形状に沿うオーラ）

シールの輪郭に沿って漂うオーラエフェクト。`filter: drop-shadow()` を使用してシール形状を保持。

| ランク | エフェクト | 色 | アニメーション |
|--------|------------|-----|----------------|
| ノーマル | なし | - | - |
| シルバー | 薄いオーラ | 白〜淡いブルー | ゆっくり明滅（2s） |
| ゴールド | 輝くオーラ | 金〜オレンジ | パルス + 回転（1.5s） |
| プリズム | 虹色オーラ + キラキラ | 虹色グラデーション | 常時パーティクル + 回転 |

**実装例:**
```css
.sticker-silver {
  filter: drop-shadow(0 0 8px rgba(192, 192, 192, 0.8));
  animation: pulse-silver 2s ease-in-out infinite;
}
.sticker-gold {
  filter: drop-shadow(0 0 12px rgba(255, 215, 0, 0.9));
  animation: pulse-gold 1.5s ease-in-out infinite;
}
.sticker-prism {
  filter: drop-shadow(0 0 16px rgba(255, 0, 255, 0.8))
          drop-shadow(0 0 24px rgba(0, 255, 255, 0.6));
  animation: prism-glow 3s linear infinite;
}
```

### 10.6 機能一覧

1. **アップグレード実行**
   - コレクション画面でシールタップ → アップグレードボタン
   - 条件を満たしている場合のみボタン表示
   - 確認モーダルで実行

2. **アップグレード履歴**
   - `upgraded_at` で記録
   - シール詳細画面で「プリズム到達日」等を表示

3. **図鑑進捗表示**
   - `user_sticker_achievements` で最高ランクを記録
   - 図鑑画面でプリズム到達数などを表示

4. **ランク別フィルター**
   - コレクション画面で「プリズムのみ表示」等のフィルター

5. **交換時のランク選択**
   - 交換画面でシール選択時にランクも選択可能
   - 高ランクシールは交換価値が高い

### 10.7 定数定義

```typescript
// src/constants/upgradeRanks.ts
export const UPGRADE_RANKS = {
  NORMAL: 0,
  SILVER: 1,
  GOLD: 2,
  PRISM: 3,
} as const

export const UPGRADE_REQUIREMENTS = {
  [UPGRADE_RANKS.SILVER]: { fromRank: UPGRADE_RANKS.NORMAL, count: 5 },
  [UPGRADE_RANKS.GOLD]: { fromRank: UPGRADE_RANKS.SILVER, count: 2 },
  [UPGRADE_RANKS.PRISM]: { fromRank: UPGRADE_RANKS.GOLD, count: 2 },
} as const

export const STAR_BONUS = {
  [UPGRADE_RANKS.NORMAL]: 0,
  [UPGRADE_RANKS.SILVER]: 1,
  [UPGRADE_RANKS.GOLD]: 3,  // 累計
  [UPGRADE_RANKS.PRISM]: 5, // 累計
} as const

export const RANK_NAMES = {
  [UPGRADE_RANKS.NORMAL]: 'ノーマル',
  [UPGRADE_RANKS.SILVER]: 'シルバー',
  [UPGRADE_RANKS.GOLD]: 'ゴールド',
  [UPGRADE_RANKS.PRISM]: 'プリズム',
} as const
```

## 11. キャラクター表紙システム

シリーズコンプリート報酬としてアンロックされるキャラクター別シール帳表紙。

### 11.1 ファイル配置

```
public/covers/
├── もっちも/          # デフォルト表紙（全員所持）
│   ├── cover.png     # 表紙画像
│   └── back.png      # 裏表紙画像
├── サニたん/
│   ├── cover.png
│   └── back.png
├── チャックン/
│   ├── cover.png
│   └── back.png
├── ポリ/
│   ├── cover.png
│   └── back.png
└── [新キャラ名]/      # 新規追加時
    ├── cover.png
    └── back.png
```

### 11.2 画像仕様

| 項目 | 仕様 |
|------|------|
| 表紙サイズ | 320 × 480 px（3:4比率） |
| 裏表紙サイズ | 320 × 480 px（3:4比率） |
| 形式 | PNG（透過可）または JPEG |
| 背表紙 | 自動生成（`spineColor`で指定） |

### 11.3 新キャラ表紙の追加手順

**Step 1: 画像を配置**
```
public/covers/[キャラ名]/cover.png
public/covers/[キャラ名]/back.png
```

**Step 2: `src/domain/theme.ts` の `defaultCoverDesigns` 配列に追加**

```typescript
{
  id: 'cover-[英語ID]',           // 例: 'cover-sunny'
  name: '[キャラ名]',              // 例: 'サニたん'
  description: '[説明文]',         // 例: 'サニたんの元気いっぱいシール帳'
  previewEmoji: '[絵文字]',        // 例: '☀️'
  coverImage: '/covers/[キャラ名]/cover.png',
  backCoverImage: '/covers/[キャラ名]/back.png',
  spineColor: '#[色コード]',       // 背表紙の色
  spineGradientTo: '#[色コード]',  // 背表紙グラデーション終点（任意）
  category: 'cute' | 'cool' | 'basic' | 'seasonal',
  isOwned: false,                  // デフォルトは未所持
  obtainMethod: 'achievement',     // 'default' | 'achievement' | 'gacha' | 'event' | 'starpoints'
  unlockCondition: '[キャラ]シリーズ20種コンプリート',
}
```

### 11.4 CoverDesign インターフェース

```typescript
// src/domain/theme.ts
interface CoverDesign {
  id: string                    // 一意のID
  name: string                  // 表示名
  description: string           // 説明
  previewEmoji: string          // プレビュー用絵文字
  coverImage: string            // 表紙画像パス（空=テーマカラー使用）
  backCoverImage: string        // 裏表紙画像パス
  spineColor: string            // 背表紙の色
  spineGradientTo?: string      // 背表紙グラデーション終点
  category: 'basic' | 'cute' | 'cool' | 'seasonal'
  isOwned: boolean              // 所持フラグ
  obtainMethod: 'default' | 'gacha' | 'event' | 'achievement' | 'starpoints'
  starPointCost?: number        // スターポイント交換時のコスト
  unlockCondition?: string      // アンロック条件の説明
}
```

### 11.5 表紙選択UI

- **場所:** シール帳タブ → ページ編集モーダル（📝ボタン）→「ひょうし」タブ
- **ファイル:** `src/features/sticker-book/PageEditModal.tsx`
- **未所持表紙:** カラー表示 + 🔒マーク（現在はテスト用に全選択可能）

### 11.6 関連ファイル

| ファイル | 役割 |
|---------|------|
| `src/domain/theme.ts` | 表紙デザイン定義・取得関数 |
| `src/features/sticker-book/PageEditModal.tsx` | 表紙選択UI |
| `src/features/sticker-book/BookView.tsx` | 表紙表示 |
| `src/utils/persistence.ts` | `coverDesignId` の保存・読込 |

### 11.7 デフォルト表紙

- **ID:** `cover-mochimo`（もっちも）
- **全ユーザーが初期状態で所持**
- 初回起動時に自動適用

新しいフレームを追加する手順

  1. public/icon_frame/[キャラ名]/icon_frame.png に画像を配置
  2. characterRewards.ts の FRAME_METADATA にメタデータを追加

  'キャラクター名': {
    frameWidth: 画像幅,
    frameHeight: 画像高さ,
    iconCenterX: アイコン中心X,
    iconCenterY: アイコン中心Y,
    iconDiameter: アイコン直径,
    },


    テスト用に設定しました。プロフィール編集画面 → フレーム選択 で以下の4つのフレームが選択できるようになっています：

  - チャックン
  - トイラン
  - ねこマカロン
  - ルミナ・スターダスト

  http://localhost:3000 でプロフィール編集（✏️アイコン）からフレームを選択して確認できます。   

  ---
  本番に戻す方法：
  src/features/profile/ProfileEditModal.tsx の loadUnlockedFrames 関数で、コメントを元に戻すだ けです：

  // テスト用コードを削除して:
  const frames = await characterRewardService.getUnlockedFrames(user.id)
  setUnlockedFrames(frames)