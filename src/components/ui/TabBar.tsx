'use client'

export type TabId = 'home' | 'collection' | 'gacha' | 'trade' | 'timeline' | 'profile'

interface Tab {
  id: TabId
  label: string
  icon: string
  bgColor: string
  glossyColor: string
}

const tabs: Tab[] = [
  { id: 'home', label: 'ホーム', icon: '🏠', bgColor: '#2DD4A8', glossyColor: '#6EECD0' },
  { id: 'collection', label: 'コレクション', icon: '🧾', bgColor: '#B0B0B0', glossyColor: '#D8D8D8' },
  { id: 'gacha', label: 'ガチャ', icon: '🎰', bgColor: '#A78BDB', glossyColor: '#C9B8EC' },
  { id: 'trade', label: 'こうかん', icon: '🤝', bgColor: '#FFD54F', glossyColor: '#FFEB99' },
  { id: 'timeline', label: 'タイムライン', icon: '🕒', bgColor: '#FF7BA8', glossyColor: '#FFB3CD' },
  { id: 'profile', label: 'プロフィール', icon: '👤', bgColor: '#5DBBEF', glossyColor: '#9DD9F9' },
]

interface TabBarProps {
  activeTab: TabId
  onTabChange: (tabId: TabId) => void
}

export function TabBar({ activeTab, onTabChange }: TabBarProps) {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0"
      style={{
        height: '90px',
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
    >
      {/* レイヤー1: 色付き円背景（最背面） */}
      <div
        className="absolute inset-0 flex items-start justify-evenly w-full"
        style={{
          zIndex: 0,
          paddingTop: '16px',
          paddingLeft: '18px',
          paddingRight: '18px',
        }}
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id
          return (
            <div
              key={`bg-${tab.id}`}
              className="flex flex-col items-center justify-start transition-all duration-300"
              style={{
                width: '52px',
                transform: isActive ? 'scale(1.1)' : 'scale(1)',
              }}
            >
              {/* 光沢のある色付き円 */}
              <div
                className="rounded-full transition-all duration-300"
                style={{
                  width: '40px',
                  height: '40px',
                  background: `linear-gradient(145deg, ${tab.glossyColor} 0%, ${tab.bgColor} 50%, ${tab.bgColor} 100%)`,
                  boxShadow: `inset 0 2px 4px rgba(255,255,255,0.4), inset 0 -2px 4px rgba(0,0,0,0.1)`,
                }}
              />
            </div>
          )
        })}
      </div>

      {/* レイヤー2: リボン背景画像（中間） */}
      <img
        src="/images/tabbar_ribbon.png"
        alt=""
        className="absolute inset-0 w-full h-full"
        style={{
          objectFit: 'fill',
          zIndex: 5,
        }}
      />

      {/* レイヤー3: アイコン＋テキスト（最前面） */}
      <div
        className="absolute inset-0 flex items-start justify-evenly w-full"
        style={{
          zIndex: 10,
          paddingTop: '16px',
          paddingLeft: '18px',
          paddingRight: '18px',
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
                width: '52px',
                transform: isActive ? 'scale(1.1)' : 'scale(1)',
              }}
            >
              {/* アイコン */}
              <div
                className="flex items-center justify-center transition-all duration-300"
                style={{
                  width: '40px',
                  height: '40px',
                  marginBottom: '2px',
                }}
              >
                <span
                  className="text-xl"
                  style={{
                    filter: isActive
                      ? 'drop-shadow(0 1px 2px rgba(0,0,0,0.3))'
                      : 'drop-shadow(0 1px 1px rgba(0,0,0,0.2))',
                  }}
                >
                  {tab.icon}
                </span>
              </div>
              {/* ラベル - 白い縁取り付き */}
              <span
                className="transition-all duration-300 text-center"
                style={{
                  fontSize: '10px',
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
