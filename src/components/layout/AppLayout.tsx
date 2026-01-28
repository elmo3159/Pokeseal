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
  tabBadgeCounts?: Partial<Record<TabId, number>>
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
  tabBadgeCounts,
}: AppLayoutProps) {
  const handleTabChange = (tabId: TabId) => {
    if (onTabChange) {
      onTabChange(tabId)
    }
  }

  // タブごとの背景画像を設定
  const getTabBackgroundImage = (): { url: string | null; repeat: boolean } => {
    if (backgroundImage) return { url: backgroundImage, repeat: false }
    if (activeTab === 'home') return { url: '/images/Home_Button/Home_background.png', repeat: false }
    if (activeTab === 'profile') return { url: '/images/bg_profile.png', repeat: false }
    if (activeTab === 'gacha') return { url: '/images/Gacha_Tab/Gacha_background2.png', repeat: false }
    // コレクションタブ - パターン背景（タイル状に繰り返し）
    if (activeTab === 'collection') return {
      url: '/images/bg_collection_pattern.gif',
      repeat: true
    }
    // 交換タブ - パターン背景（タイル状に繰り返し）
    if (activeTab === 'trade') return {
      url: '/images/bg_trade_pattern.gif',
      repeat: true
    }
    // タイムラインタブ - パターン背景（タイル状に繰り返し）
    if (activeTab === 'timeline') return {
      url: '/images/bg_timeline_pattern.gif',
      repeat: true
    }
    return { url: null, repeat: false }
  }
  const backgroundConfig = getTabBackgroundImage()
  const effectiveBackgroundImage = backgroundConfig.url
  const isRepeatingPattern = backgroundConfig.repeat


  // トップバーの高さ（表示時）- Header_UI.png対応
  const topBarHeight = showTopBar ? 56 : 0
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
        // タブバー非表示時は下部余白を削除
        bottom: showTabBar ? `${tabBarHeight - 10}px` : '0',
      }
    }
    // ホームタブも特殊（余白なし）
    if (activeTab === 'home') {
      return {
        top: '38px',
        left: '0',
        right: '0',
        // タブバー非表示時は下部余白を削除（編集モード等）
        bottom: showTabBar ? `${tabBarHeight + 30}px` : '0',
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
    // コレクションタブ（タブバーの近くまで表示を広げる）
    if (activeTab === 'collection') {
      return {
        top: `${topBarHeight}px`,
        left: '16px',
        right: '16px',
        // タブバー非表示時は下部余白を削除
        bottom: showTabBar ? `${tabBarHeight + 5}px` : '0',
      }
    }
    // タイムラインタブ（タブバーのぎりぎり上まで表示を広げる）
    if (activeTab === 'timeline') {
      return {
        top: `${topBarHeight}px`,
        left: '0',
        right: '0',
        bottom: showTabBar ? `${tabBarHeight}px` : '0',
      }
    }
    // 交換タブ（タブバーのぎりぎり上まで表示を広げる）
    if (activeTab === 'trade') {
      return {
        top: `${topBarHeight}px`,
        left: '16px',
        right: '16px',
        bottom: showTabBar ? `${tabBarHeight}px` : '0',
      }
    }
    // その他のタブ
    return {
      top: `${topBarHeight}px`,
      left: '16px',
      right: '16px',
      bottom: showTabBar ? `${tabBarHeight + 30}px` : '0',
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
        backgroundSize: effectiveBackgroundImage
          ? (isRepeatingPattern ? 'auto' : 'cover')
          : 'auto',
        backgroundPosition: effectiveBackgroundImage ? 'center' : 'initial',
        backgroundRepeat: effectiveBackgroundImage
          ? (isRepeatingPattern ? 'repeat' : 'no-repeat')
          : 'initial',
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
          overflowY: activeTab === 'home' || activeTab === 'collection' ? 'hidden' : 'auto',
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
          <TabBar activeTab={activeTab} onTabChange={handleTabChange} badgeCounts={tabBadgeCounts} />
        </div>
      )}
    </div>
  )
}
