'use client'

import { ReactNode } from 'react'
import { TabBar, TabId } from '../ui/TabBar'
import { TopBar, HeaderCurrency } from '../ui/TopBar'

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
  currency?: HeaderCurrency // 通貨表示（右上）
  onOpenShop?: () => void // ショップを開くコールバック
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
  currency,
  onOpenShop,
}: AppLayoutProps) {
  const handleTabChange = (tabId: TabId) => {
    if (onTabChange) {
      onTabChange(tabId)
    }
  }

  // タブごとの背景画像を設定
  const getTabBackgroundImage = () => {
    if (backgroundImage) return backgroundImage
    if (activeTab === 'home') return '/images/Home_Button/Home_background.png'
    if (activeTab === 'profile') return '/images/bg_profile.png'
    if (activeTab === 'gacha') return '/images/Gacha_Tab/Gacha_background2.png'
    return null
  }
  const effectiveBackgroundImage = getTabBackgroundImage()


  // トップバーの高さ（表示時）
  const topBarHeight = showTopBar ? 52 : 0
  // タブバーの高さ（表示時）
  const tabBarHeight = showTabBar ? 90 : 0

  // コンテンツ領域の計算
  const getContentStyles = () => {
    // プロフィールタブは特殊（上部の余白が少ない、下部は少しだけ余白）
    if (activeTab === 'profile') {
      return {
        top: '10px',
        left: '0',
        right: '0',
        bottom: `${tabBarHeight - 10}px`, // タブバーと少し重なり、背景が自然に見える
      }
    }
    // ホームタブも特殊（余白なし）
    if (activeTab === 'home') {
      return {
        top: '38px',
        left: '0',
        right: '0',
        bottom: `${tabBarHeight + 30}px`,
      }
    }
    // ガチャタブ（ヘッダー下から開始、タブバーの後ろまで背景を伸ばす）
    if (activeTab === 'gacha') {
      return {
        top: '40px', // ヘッダー（36px）+ 少し余白
        left: '0',
        right: '0',
        bottom: '0',
      }
    }
    // その他のタブ
    return {
      top: `${topBarHeight}px`,
      left: '16px',
      right: '16px',
      bottom: `${tabBarHeight + 30}px`,
    }
  }

  const contentStyles = getContentStyles()

  return (
    <div
      className="app-screen"
      style={{
        backgroundImage: effectiveBackgroundImage
          ? `url(${effectiveBackgroundImage})`
          : 'linear-gradient(180deg, #FDF2F8 0%, #F5F3FF 50%, #FDF2F8 100%)',
        backgroundSize: effectiveBackgroundImage ? 'cover' : 'auto',
        backgroundPosition: effectiveBackgroundImage ? 'center' : 'initial',
        backgroundRepeat: effectiveBackgroundImage ? 'no-repeat' : 'initial',
        fontFamily: "'M PLUS Rounded 1c', sans-serif",
      }}
    >
      {/* トップバー - 絶対配置（上部固定） */}
      {showTopBar && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 40,
          }}
        >
          <TopBar
            title={topBarTitle}
            showBack={showBack}
            onBack={onBack}
            rightElement={topBarRightElement}
            decoration={topBarDecoration}
            currency={currency}
            onOpenShop={onOpenShop}
          />
        </div>
      )}

      {/* メインコンテンツエリア - 絶対配置 */}
      <main
        style={{
          position: 'absolute',
          ...contentStyles,
          overflowY: activeTab === 'home' ? 'hidden' : 'auto',
          overflowX: 'hidden',
          touchAction: activeTab === 'home' ? 'pan-x' : 'auto',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {children}
      </main>

      {/* タブバー - 絶対配置（下部固定） */}
      {showTabBar && (
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            height: `${tabBarHeight}px`,
            zIndex: 50,
          }}
        >
          <TabBar activeTab={activeTab} onTabChange={handleTabChange} />
        </div>
      )}
    </div>
  )
}
