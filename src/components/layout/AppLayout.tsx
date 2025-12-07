'use client'

import { ReactNode } from 'react'
import { TabBar, TabId } from '../ui/TabBar'
import { TopBar } from '../ui/TopBar'

// タイトルデコレーションタイプ
type TitleDecoration = 'none' | 'gacha' | 'collection' | 'trade' | 'timeline' | 'profile'

interface AppLayoutProps {
  children: ReactNode
  showTopBar?: boolean
  topBarTitle?: string
  topBarDecoration?: TitleDecoration
  showBack?: boolean
  onBack?: () => void
  topBarRightElement?: ReactNode
  showTabBar?: boolean
  activeTab?: TabId
  onTabChange?: (tabId: TabId) => void
  backgroundImage?: string // カスタム背景画像（ホームタブ用）
}

export function AppLayout({
  children,
  showTopBar = true,
  topBarTitle,
  topBarDecoration = 'none',
  showBack = false,
  onBack,
  topBarRightElement,
  showTabBar = true,
  activeTab = 'home',
  onTabChange,
  backgroundImage,
}: AppLayoutProps) {
  const handleTabChange = (tabId: TabId) => {
    if (onTabChange) {
      onTabChange(tabId)
    }
  }

  // ホームタブの場合は背景画像を使用
  const homeBackgroundImage = activeTab === 'home' ? '/images/Home_Button/Home_background.png' : null
  const effectiveBackgroundImage = backgroundImage || homeBackgroundImage

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        backgroundImage: effectiveBackgroundImage
          ? `url(${effectiveBackgroundImage})`
          : 'linear-gradient(180deg, #FDF2F8 0%, #F5F3FF 50%, #FDF2F8 100%)',
        backgroundSize: effectiveBackgroundImage ? 'cover' : 'auto',
        backgroundPosition: effectiveBackgroundImage ? 'center' : 'initial',
        backgroundRepeat: effectiveBackgroundImage ? 'no-repeat' : 'initial',
        backgroundAttachment: 'fixed',
        fontFamily: "'M PLUS Rounded 1c', sans-serif",
        overflow: activeTab === 'home' ? 'hidden' : undefined,
        height: activeTab === 'home' ? '100vh' : undefined,
        maxHeight: activeTab === 'home' ? '100vh' : undefined,
      }}
    >
      {/* トップバー */}
      {showTopBar && (
        <TopBar
          title={topBarTitle}
          showBack={showBack}
          onBack={onBack}
          rightElement={topBarRightElement}
          decoration={topBarDecoration}
        />
      )}

      {/* メインコンテンツエリア */}
      <main
        className="flex-1"
        style={{
          paddingTop: activeTab === 'profile' ? '10px' : (activeTab === 'home' ? '38px' : (showTopBar ? '52px' : '16px')),
          paddingBottom: activeTab === 'profile' ? '0' : (activeTab === 'home' ? '120px' : (showTabBar ? '120px' : '32px')),
          paddingLeft: activeTab === 'profile' ? '0' : (activeTab === 'home' ? '0px' : '16px'),
          paddingRight: activeTab === 'profile' ? '0' : (activeTab === 'home' ? '0px' : '16px'),
          overflowY: activeTab === 'home' ? 'hidden' : 'auto',
          overflowX: 'hidden',
          touchAction: activeTab === 'home' ? 'pan-x' : 'auto',
        }}
      >
        {children}
      </main>

      {/* タブバー - フローティングデザイン */}
      {showTabBar && (
        <TabBar activeTab={activeTab} onTabChange={handleTabChange} />
      )}
    </div>
  )
}
