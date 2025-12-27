'use client'

// タイトルのデコレーションタイプ
type TitleDecoration = 'none' | 'gacha' | 'collection' | 'trade' | 'timeline' | 'profile'

// 通貨データ（シルチケ、プレシル、どろっぷ）
export interface HeaderCurrency {
  tickets: number   // シルチケ
  gems: number      // プレシル（プレミアムシルチケ）
  stars: number     // どろっぷ
}

interface TopBarProps {
  title?: string
  showBack?: boolean
  onBack?: () => void
  rightElement?: React.ReactNode
  decoration?: TitleDecoration
  currency?: HeaderCurrency // 通貨表示（右側）
  onOpenShop?: () => void // ショップを開くコールバック
}

// デコレーション付きタイトルコンポーネント
const DecoratedTitle: React.FC<{ title: string; decoration: TitleDecoration }> = ({ title, decoration }) => {
  // 共通のタイトルスタイル（ニット背景に映える白文字ベース）
  const baseTitleStyle = {
    fontFamily: "'M PLUS Rounded 1c', sans-serif",
    letterSpacing: '0.05em',
    color: '#FFFFFF',
    textShadow: '0 1px 3px rgba(157, 76, 108, 0.6), 0 0 8px rgba(255, 255, 255, 0.3)',
  }

  if (decoration === 'gacha') {
    return (
      <div className="flex items-center justify-center gap-1.5">
        <span className="text-base" style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.2))' }}>🎰</span>
        <h1 className="text-lg font-black" style={baseTitleStyle}>
          {title}
        </h1>
        <span className="text-base" style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.2))' }}>✨</span>
      </div>
    )
  }

  if (decoration === 'collection') {
    return (
      <div className="flex items-center justify-center gap-1.5">
        <span className="text-base" style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.2))' }}>📚</span>
        <h1 className="text-lg font-bold" style={baseTitleStyle}>
          {title}
        </h1>
        <span className="text-base" style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.2))' }}>✨</span>
      </div>
    )
  }

  if (decoration === 'trade') {
    return (
      <div className="flex items-center justify-center gap-1.5">
        <span className="text-base" style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.2))' }}>🤝</span>
        <h1 className="text-lg font-bold" style={baseTitleStyle}>
          {title}
        </h1>
        <span className="text-base" style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.2))' }}>💫</span>
      </div>
    )
  }

  if (decoration === 'timeline') {
    return (
      <div className="flex items-center justify-center gap-1.5">
        <span className="text-base" style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.2))' }}>🕒</span>
        <h1 className="text-lg font-bold" style={baseTitleStyle}>
          {title}
        </h1>
        <span className="text-base" style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.2))' }}>📱</span>
      </div>
    )
  }

  if (decoration === 'profile') {
    return (
      <div className="flex items-center justify-center gap-1.5">
        <span className="text-base" style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.2))' }}>👤</span>
        <h1 className="text-lg font-bold" style={baseTitleStyle}>
          {title}
        </h1>
        <span className="text-base" style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.2))' }}>⭐</span>
      </div>
    )
  }

  // デフォルト（none または指定なし）
  return (
    <h1 className="text-lg font-bold text-center" style={baseTitleStyle}>
      {title}
    </h1>
  )
}

// ヘッダー用コンパクト通貨表示（タップでショップを開く）
const HeaderCurrencyDisplay: React.FC<{
  currency: HeaderCurrency
  onOpenShop?: () => void
}> = ({ currency, onOpenShop }) => {
  return (
    <button
      onClick={onOpenShop}
      className="flex items-center gap-0.5 active:scale-95 transition-transform"
      style={{
        background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(236, 72, 153, 0.1) 100%)',
        borderRadius: '16px',
        padding: '2px 4px',
        border: '1px solid rgba(139, 92, 246, 0.2)',
      }}
    >
      {/* シルチケ */}
      <div
        className="flex items-center gap-0.5 px-1 py-0.5 rounded-full"
        style={{
          background: 'linear-gradient(135deg, #A855F7 0%, #EC4899 100%)',
          boxShadow: '0 1px 2px rgba(168, 85, 247, 0.3)',
        }}
      >
        <span className="text-[8px]">🎫</span>
        <span className="text-[9px] font-bold text-white">{currency.tickets}</span>
      </div>

      {/* プレシル */}
      <div
        className="flex items-center gap-0.5 px-1 py-0.5 rounded-full"
        style={{
          background: 'linear-gradient(135deg, #60A5FA 0%, #3B82F6 100%)',
          boxShadow: '0 1px 2px rgba(96, 165, 250, 0.3)',
        }}
      >
        <span className="text-[8px]">💎</span>
        <span className="text-[9px] font-bold text-white">{currency.gems}</span>
      </div>

      {/* どろっぷ */}
      <div
        className="flex items-center gap-0.5 px-1 py-0.5 rounded-full"
        style={{
          background: 'linear-gradient(135deg, #FBBF24 0%, #F59E0B 100%)',
          boxShadow: '0 1px 2px rgba(251, 191, 36, 0.3)',
        }}
      >
        <span className="text-[8px]">💧</span>
        <span className="text-[9px] font-bold text-white">{currency.stars}</span>
      </div>

      {/* ショップへのインジケーター */}
      <div
        className="flex items-center justify-center w-3.5 h-3.5 rounded-full"
        style={{
          background: 'linear-gradient(135deg, #10B981 0%, #34D399 100%)',
          boxShadow: '0 1px 2px rgba(16, 185, 129, 0.3)',
        }}
      >
        <span className="text-[7px] font-bold text-white">+</span>
      </div>
    </button>
  )
}

export function TopBar({
  title,
  showBack = false,
  onBack,
  rightElement,
  decoration = 'none',
  currency,
  onOpenShop,
}: TopBarProps) {
  return (
    <header
      className="fixed top-0 left-0 right-0 flex items-center justify-between px-3"
      style={{
        height: '52px',
        backgroundImage: 'url(/images/Header_UI.png)',
        backgroundSize: '100% 100%',
        backgroundPosition: 'center top',
        backgroundRepeat: 'no-repeat',
        paddingTop: 'env(safe-area-inset-top)',
        paddingBottom: '8px', // 波状の下端部分に余白
        zIndex: 100,
      }}
    >
      {/* 左側：戻るボタンまたは空白 */}
      <div className="w-8 flex items-center justify-start shrink-0">
        {showBack && (
          <button
            onClick={onBack}
            className="w-7 h-7 flex items-center justify-center rounded-full transition-all duration-200 active:scale-90"
            style={{
              background: 'rgba(255, 255, 255, 0.8)',
              color: '#9D4C6C',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            }}
          >
            <span className="text-sm font-bold">←</span>
          </button>
        )}
      </div>

      {/* 中央：タイトル */}
      <div className="flex-1 flex items-center justify-center">
        {title && <DecoratedTitle title={title} decoration={decoration} />}
      </div>

      {/* 右側：通貨表示（タップでショップ）またはカスタム要素 */}
      <div className="flex items-center justify-end shrink-0">
        {currency ? (
          <HeaderCurrencyDisplay currency={currency} onOpenShop={onOpenShop} />
        ) : (
          rightElement
        )}
      </div>
    </header>
  )
}
