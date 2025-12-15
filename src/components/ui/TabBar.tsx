'use client'

export type TabId = 'home' | 'collection' | 'gacha' | 'trade' | 'timeline' | 'profile'

interface Tab {
  id: TabId
  label: string
  bgColor: string
  glossyColor: string
}

const tabs: Tab[] = [
  { id: 'home', label: 'シール帳', bgColor: '#2DD4A8', glossyColor: '#6EECD0' },
  { id: 'collection', label: 'コレクション', bgColor: '#B0B0B0', glossyColor: '#D8D8D8' },
  { id: 'gacha', label: 'ガチャ', bgColor: '#A78BDB', glossyColor: '#C9B8EC' },
  { id: 'trade', label: 'こうかん', bgColor: '#FFD54F', glossyColor: '#FFEB99' },
  { id: 'timeline', label: 'タイムライン', bgColor: '#FF7BA8', glossyColor: '#FFB3CD' },
  { id: 'profile', label: 'プロフィール', bgColor: '#5DBBEF', glossyColor: '#9DD9F9' },
]

// SVGアイコンコンポーネント
function TabIcon({ tabId, size }: { tabId: TabId; size: string }) {
  const iconStyle = {
    width: size,
    height: size,
    filter: 'drop-shadow(0 1px 1px rgba(0,0,0,0.2))',
  }

  switch (tabId) {
    case 'home':
      return (
        <svg viewBox="0 0 24 24" fill="none" style={iconStyle}>
          <path d="M3 12L12 3L21 12V21H15V15H9V21H3V12Z" fill="#fff" stroke="#333" strokeWidth="1.5" strokeLinejoin="round"/>
          <path d="M9 21V15H15V21" stroke="#333" strokeWidth="1.5"/>
        </svg>
      )
    case 'collection':
      return (
        <svg viewBox="0 0 24 24" fill="none" style={iconStyle}>
          <rect x="4" y="3" width="16" height="18" rx="2" fill="#fff" stroke="#333" strokeWidth="1.5"/>
          <line x1="7" y1="8" x2="17" y2="8" stroke="#333" strokeWidth="1.5"/>
          <line x1="7" y1="12" x2="17" y2="12" stroke="#333" strokeWidth="1.5"/>
          <line x1="7" y1="16" x2="13" y2="16" stroke="#333" strokeWidth="1.5"/>
        </svg>
      )
    case 'gacha':
      return (
        <svg viewBox="0 0 24 24" fill="none" style={iconStyle}>
          <circle cx="12" cy="12" r="9" fill="#fff" stroke="#333" strokeWidth="1.5"/>
          <circle cx="12" cy="12" r="4" fill="#FFD700" stroke="#333" strokeWidth="1"/>
          <path d="M12 3V6M12 18V21M3 12H6M18 12H21" stroke="#333" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      )
    case 'trade':
      return (
        <svg viewBox="0 0 24 24" fill="none" style={iconStyle}>
          <path d="M7 17L3 13L7 9" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M3 13H16" stroke="#333" strokeWidth="2" strokeLinecap="round"/>
          <path d="M17 7L21 11L17 15" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M21 11H8" stroke="#333" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      )
    case 'timeline':
      return (
        <svg viewBox="0 0 24 24" fill="none" style={iconStyle}>
          <circle cx="12" cy="12" r="9" fill="#fff" stroke="#333" strokeWidth="1.5"/>
          <path d="M12 7V12L15 15" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    case 'profile':
      return (
        <svg viewBox="0 0 24 24" fill="none" style={iconStyle}>
          <circle cx="12" cy="8" r="4" fill="#fff" stroke="#333" strokeWidth="1.5"/>
          <path d="M4 20C4 16.6863 7.58172 14 12 14C16.4183 14 20 16.6863 20 20" stroke="#333" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      )
    default:
      return null
  }
}

interface TabBarProps {
  activeTab: TabId
  onTabChange: (tabId: TabId) => void
  transparent?: boolean // 背景を透過させるかどうか（現在は使用しない）
}

export function TabBar({ activeTab, onTabChange }: TabBarProps) {
  // ボタンサイズを画面幅に応じて計算
  // iPhone 12: 390px幅、タブ幅=52px、円=40px (iPhone 12基準)
  // スケール係数: clamp(最小, 理想, 最大)
  const buttonWidth = 'clamp(42px, 13.3vw, 58px)'  // 52/390 ≈ 13.3%
  const circleSize = 'clamp(32px, 10.3vw, 44px)'   // 40/390 ≈ 10.3%
  const paddingX = 'clamp(12px, 4.6vw, 22px)'      // 18/390 ≈ 4.6%
  const paddingTop = 'clamp(12px, 4.1vw, 18px)'    // 16/390 ≈ 4.1%

  return (
    <nav
      style={{
        position: 'relative',
        width: '100%',
        height: 'clamp(75px, 23vw, 100px)', // 90/390 ≈ 23%
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
    >
      {/* レイヤー1: リボン背景画像（最背面） */}
      <img
        src="/images/tabbar_ribbon.png"
        alt=""
        className="absolute inset-0 w-full h-full"
        style={{
          objectFit: 'fill', // 画像を引き伸ばしてコンテナに合わせる
          zIndex: 0,
        }}
      />

      {/* レイヤー2: 色付き円背景（リボンの穴に配置） */}
      <div
        className="absolute inset-0 flex items-start justify-evenly w-full"
        style={{
          zIndex: 1,
          paddingTop,
          paddingLeft: paddingX,
          paddingRight: paddingX,
        }}
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id
          return (
            <div
              key={`bg-${tab.id}`}
              className="flex flex-col items-center justify-start transition-all duration-300"
              style={{
                width: buttonWidth,
                transform: isActive ? 'scale(1.1)' : 'scale(1)',
              }}
            >
              {/* 光沢のある色付き円 */}
              <div
                className="rounded-full transition-all duration-300"
                style={{
                  width: circleSize,
                  height: circleSize,
                  background: `linear-gradient(145deg, ${tab.glossyColor} 0%, ${tab.bgColor} 50%, ${tab.bgColor} 100%)`,
                  boxShadow: `inset 0 2px 4px rgba(255,255,255,0.4), inset 0 -2px 4px rgba(0,0,0,0.1)`,
                }}
              />
            </div>
          )
        })}
      </div>

      {/* レイヤー3: アイコン＋テキスト（最前面） */}
      <div
        className="absolute inset-0 flex items-start justify-evenly w-full"
        style={{
          zIndex: 10,
          paddingTop,
          paddingLeft: paddingX,
          paddingRight: paddingX,
        }}
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className="flex flex-col items-center justify-start transition-all duration-300"
              style={{
                width: buttonWidth,
                transform: isActive ? 'scale(1.1)' : 'scale(1)',
              }}
            >
              {/* アイコン */}
              <div
                className="flex items-center justify-center transition-all duration-300"
                style={{
                  width: circleSize,
                  height: circleSize,
                  marginBottom: '2px',
                }}
              >
                <TabIcon tabId={tab.id} size="clamp(18px, 5.6vw, 26px)" />
              </div>
              {/* ラベル - 白い縁取り付き */}
              <span
                className="transition-all duration-300 text-center"
                style={{
                  fontSize: 'clamp(8px, 2.6vw, 11px)', // 10/390 ≈ 2.6%
                  fontWeight: 700,
                  fontFamily: "'M PLUS Rounded 1c', sans-serif",
                  color: isActive ? '#6B3FA0' : '#7A5090',
                  letterSpacing: '0.01em',
                  lineHeight: 1.1,
                  whiteSpace: 'nowrap',
                  textShadow: '1px 1px 0 #fff, -1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff, 0 1px 0 #fff, 0 -1px 0 #fff, 1px 0 0 #fff, -1px 0 0 #fff',
                }}
              >
                {tab.label}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
