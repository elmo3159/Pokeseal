'use client'

import React from 'react'

// ユーザーアイコン
export const UserIcon: React.FC<{ size?: number; color?: string }> = ({ size = 24, color = '#A855F7' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="8" r="4" fill={color} fillOpacity="0.3" stroke={color} strokeWidth="1.5"/>
    <path d="M4 20C4 16.6863 7.58172 14 12 14C16.4183 14 20 16.6863 20 20" stroke={color} strokeWidth="1.5" strokeLinecap="round" fill={color} fillOpacity="0.2"/>
  </svg>
)

// 星アイコン（レア度表示用）
export const StarIcon: React.FC<{ size?: number; filled?: boolean; color?: string }> = ({ size = 20, filled = true, color = '#FBBF24' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path
      d="M12 2L14.5 9H22L16 13.5L18.5 21L12 16.5L5.5 21L8 13.5L2 9H9.5L12 2Z"
      fill={filled ? color : 'none'}
      stroke={color}
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
  </svg>
)

// キラキラアイコン
export const SparkleIcon: React.FC<{ size?: number; color?: string }> = ({ size = 24, color = '#FBBF24' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M12 2L13.5 8.5L20 10L13.5 11.5L12 18L10.5 11.5L4 10L10.5 8.5L12 2Z" fill={color} stroke={color} strokeWidth="1"/>
    <path d="M19 2L19.5 4.5L22 5L19.5 5.5L19 8L18.5 5.5L16 5L18.5 4.5L19 2Z" fill={color} stroke={color} strokeWidth="0.5"/>
    <path d="M5 16L5.5 18.5L8 19L5.5 19.5L5 22L4.5 19.5L2 19L4.5 18.5L5 16Z" fill={color} stroke={color} strokeWidth="0.5"/>
  </svg>
)

// お祝い・成功アイコン
export const CelebrationIcon: React.FC<{ size?: number; color?: string }> = ({ size = 24, color = '#EC4899' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M12 2L13 6H17L14 9L15 13L12 10.5L9 13L10 9L7 6H11L12 2Z" fill="#FBBF24" stroke="#F59E0B" strokeWidth="1"/>
    <circle cx="5" cy="5" r="2" fill={color}/>
    <circle cx="19" cy="5" r="2" fill="#60A5FA"/>
    <circle cx="3" cy="12" r="1.5" fill="#22C55E"/>
    <circle cx="21" cy="12" r="1.5" fill="#8B5CF6"/>
    <path d="M6 18L8 22" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <path d="M12 17V22" stroke="#FBBF24" strokeWidth="2" strokeLinecap="round"/>
    <path d="M18 18L16 22" stroke="#60A5FA" strokeWidth="2" strokeLinecap="round"/>
  </svg>
)

// チャット・メッセージアイコン
export const ChatIcon: React.FC<{ size?: number; color?: string }> = ({ size = 24, color = '#8B5CF6' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M4 4H20C21.1 4 22 4.9 22 6V16C22 17.1 21.1 18 20 18H8L4 22V6C4 4.9 4.9 4 6 4H4Z" fill={color} fillOpacity="0.2" stroke={color} strokeWidth="1.5" strokeLinejoin="round"/>
    <circle cx="8" cy="11" r="1.5" fill={color}/>
    <circle cx="12" cy="11" r="1.5" fill={color}/>
    <circle cx="16" cy="11" r="1.5" fill={color}/>
  </svg>
)

// 握手・交換アイコン
export const HandshakeIcon: React.FC<{ size?: number; color?: string }> = ({ size = 24, color = '#22C55E' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M2 10L6 6L10 10L14 6L18 10" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M6 14L2 10V18H6V14Z" fill={color} fillOpacity="0.3" stroke={color} strokeWidth="1.5"/>
    <path d="M18 14L22 10V18H18V14Z" fill={color} fillOpacity="0.3" stroke={color} strokeWidth="1.5"/>
    <path d="M10 14H14" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <path d="M8 18H16" stroke={color} strokeWidth="2" strokeLinecap="round"/>
  </svg>
)

// ギフト・あげるアイコン
export const GiftIcon: React.FC<{ size?: number; color?: string }> = ({ size = 24, color = '#EC4899' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <rect x="3" y="10" width="18" height="11" rx="2" fill={color} fillOpacity="0.2" stroke={color} strokeWidth="1.5"/>
    <rect x="2" y="7" width="20" height="4" rx="1" fill={color} fillOpacity="0.3" stroke={color} strokeWidth="1.5"/>
    <path d="M12 7V21" stroke={color} strokeWidth="1.5"/>
    <path d="M12 7C12 7 8 7 8 4C8 2 10 1 12 3C14 1 16 2 16 4C16 7 12 7 12 7Z" fill={color} fillOpacity="0.4" stroke={color} strokeWidth="1.5"/>
  </svg>
)

// ターゲット・ほしいアイコン
export const TargetIcon: React.FC<{ size?: number; color?: string }> = ({ size = 24, color = '#3B82F6' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="1.5"/>
    <circle cx="12" cy="12" r="6" stroke={color} strokeWidth="1.5"/>
    <circle cx="12" cy="12" r="3" fill={color} stroke={color} strokeWidth="1.5"/>
  </svg>
)

// 警告アイコン
export const WarningIcon: React.FC<{ size?: number; color?: string }> = ({ size = 24, color = '#F59E0B' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M12 2L22 20H2L12 2Z" fill={color} fillOpacity="0.2" stroke={color} strokeWidth="1.5" strokeLinejoin="round"/>
    <path d="M12 9V13" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <circle cx="12" cy="17" r="1" fill={color}/>
  </svg>
)

// バランス・天秤アイコン
export const BalanceIcon: React.FC<{ size?: number; color?: string }> = ({ size = 24, color = '#22C55E' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M12 3V5" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <path d="M12 5L4 8L6 14H10L12 5L14 14H18L20 8L12 5Z" fill={color} fillOpacity="0.2" stroke={color} strokeWidth="1.5" strokeLinejoin="round"/>
    <path d="M12 5V20" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <path d="M8 20H16" stroke={color} strokeWidth="2" strokeLinecap="round"/>
  </svg>
)

// 考え中アイコン
export const ThinkingIcon: React.FC<{ size?: number; color?: string }> = ({ size = 24, color = '#8B5CF6' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="9" fill={color} fillOpacity="0.1" stroke={color} strokeWidth="1.5"/>
    <circle cx="8" cy="10" r="1.5" fill={color}/>
    <circle cx="16" cy="10" r="1.5" fill={color}/>
    <path d="M9 15C9.5 15.5 10.5 16 12 16C12.5 16 13 15.9 13.5 15.7" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    <circle cx="18" cy="4" r="1" fill={color} fillOpacity="0.5"/>
    <circle cx="20" cy="6" r="1.5" fill={color} fillOpacity="0.7"/>
    <circle cx="21" cy="9" r="1" fill={color} fillOpacity="0.5"/>
  </svg>
)

// お願いアイコン
export const PleaseIcon: React.FC<{ size?: number; color?: string }> = ({ size = 24, color = '#EC4899' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M12 21C12 21 6 16 6 10C6 6 9 4 12 4C15 4 18 6 18 10C18 16 12 21 12 21Z" fill={color} fillOpacity="0.2" stroke={color} strokeWidth="1.5"/>
    <path d="M10 10L12 12L14 10" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 12V15" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M18 3L20 5" stroke="#FBBF24" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M20 3L18 5" stroke="#FBBF24" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M5 5L7 7" stroke="#FBBF24" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M7 5L5 7" stroke="#FBBF24" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
)

// プラスアイコン（もっと追加）
export const PlusIcon: React.FC<{ size?: number; color?: string }> = ({ size = 24, color = '#22C55E' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="9" fill={color} fillOpacity="0.2" stroke={color} strokeWidth="1.5"/>
    <path d="M12 8V16" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <path d="M8 12H16" stroke={color} strokeWidth="2" strokeLinecap="round"/>
  </svg>
)

// OKアイコン
export const OkIcon: React.FC<{ size?: number; color?: string }> = ({ size = 24, color = '#22C55E' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="9" fill={color} fillOpacity="0.2" stroke={color} strokeWidth="1.5"/>
    <path d="M8 12L11 15L16 9" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

// 目・見るアイコン
export const EyeIcon: React.FC<{ size?: number; color?: string }> = ({ size = 24, color = '#3B82F6' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M2 12C2 12 5 5 12 5C19 5 22 12 22 12C22 12 19 19 12 19C5 19 2 12 2 12Z" fill={color} fillOpacity="0.1" stroke={color} strokeWidth="1.5"/>
    <circle cx="12" cy="12" r="3" fill={color} stroke={color} strokeWidth="1"/>
  </svg>
)

// 交換アイコン
export const SwapIcon: React.FC<{ size?: number; color?: string }> = ({ size = 24, color = '#8B5CF6' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M7 16L3 12L7 8" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M3 12H16" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <path d="M17 8L21 12L17 16" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M21 12H8" stroke={color} strokeWidth="2" strokeLinecap="round"/>
  </svg>
)

// 良いね・サムズアップアイコン
export const ThumbsUpIcon: React.FC<{ size?: number; color?: string }> = ({ size = 24, color = '#22C55E' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M7 22V10M2 13V19C2 20.1 2.9 21 4 21H15.5C16.8 21 17.9 20 18 18.7L18.8 11.7C18.9 10.6 18 9.5 16.9 9.5H13V5C13 3.3 11.7 2 10 2L7 10"
          fill={color} fillOpacity="0.2" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

// 笑顔アイコン
export const SmileIcon: React.FC<{ size?: number; color?: string }> = ({ size = 24, color = '#FBBF24' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="9" fill={color} fillOpacity="0.3" stroke={color} strokeWidth="1.5"/>
    <circle cx="9" cy="10" r="1.5" fill={color}/>
    <circle cx="15" cy="10" r="1.5" fill={color}/>
    <path d="M8 15C8 15 9.5 17 12 17C14.5 17 16 15 16 15" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
)

// レアアイコン
export const RareIcon: React.FC<{ size?: number; color?: string }> = ({ size = 24, color = '#FBBF24' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M12 2L14.5 9H22L16 13.5L18.5 21L12 16.5L5.5 21L8 13.5L2 9H9.5L12 2Z" fill={color} stroke={color} strokeWidth="1"/>
    <path d="M12 6L13 9H16L13.5 11L14.5 14L12 12L9.5 14L10.5 11L8 9H11L12 6Z" fill="white"/>
  </svg>
)

// 矢印アイコン（スクロール案内）
export const ArrowIcon: React.FC<{ size?: number; color?: string; direction?: 'up' | 'down' | 'left' | 'right' }> = ({
  size = 24,
  color = '#8B5CF6',
  direction = 'right'
}) => {
  const rotations = { up: -90, down: 90, left: 180, right: 0 }
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ transform: `rotate(${rotations[direction]}deg)` }}>
      <path d="M5 12H19" stroke={color} strokeWidth="2" strokeLinecap="round"/>
      <path d="M14 7L19 12L14 17" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

// 矢印両方向アイコン
export const ArrowBothIcon: React.FC<{ size?: number; color?: string; vertical?: boolean }> = ({
  size = 24,
  color = '#8B5CF6',
  vertical = false
}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ transform: vertical ? 'rotate(90deg)' : undefined }}>
    <path d="M8 12H16" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    <path d="M5 12L8 9M5 12L8 15" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M19 12L16 9M19 12L16 15" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

// 検索アイコン（虫眼鏡）
export const SearchIcon: React.FC<{ size?: number; color?: string }> = ({ size = 24, color = '#8B5CF6' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <circle cx="10" cy="10" r="6" stroke={color} strokeWidth="2"/>
    <path d="M14.5 14.5L20 20" stroke={color} strokeWidth="2" strokeLinecap="round"/>
  </svg>
)

// 本アイコン（閉じた本）
export const BookClosedIcon: React.FC<{ size?: number; color?: string }> = ({ size = 24, color = '#8B5CF6' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M4 4.5C4 3.67 4.67 3 5.5 3H9C10.5 3 12 4 12 4C12 4 13.5 3 15 3H18.5C19.33 3 20 3.67 20 4.5V18.5C20 19.33 19.33 20 18.5 20H15C13.5 20 12 21 12 21C12 21 10.5 20 9 20H5.5C4.67 20 4 19.33 4 18.5V4.5Z" fill={color} fillOpacity="0.2" stroke={color} strokeWidth="1.5"/>
    <path d="M12 4V21" stroke={color} strokeWidth="1.5"/>
  </svg>
)

// 本アイコン（開いた本・紫）
export const BookOpenPurpleIcon: React.FC<{ size?: number }> = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M2 4C2 4 5 2 8 2C11 2 12 4 12 4V20C12 20 11 18 8 18C5 18 2 20 2 20V4Z" fill="#A78BFA" stroke="#7C3AED" strokeWidth="1.5"/>
    <path d="M22 4C22 4 19 2 16 2C13 2 12 4 12 4V20C12 20 13 18 16 18C19 18 22 20 22 20V4Z" fill="#C4B5FD" stroke="#7C3AED" strokeWidth="1.5"/>
  </svg>
)

// 本アイコン（開いた本・ピンク）
export const BookOpenPinkIcon: React.FC<{ size?: number }> = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M2 4C2 4 5 2 8 2C11 2 12 4 12 4V20C12 20 11 18 8 18C5 18 2 20 2 20V4Z" fill="#F9A8D4" stroke="#EC4899" strokeWidth="1.5"/>
    <path d="M22 4C22 4 19 2 16 2C13 2 12 4 12 4V20C12 20 13 18 16 18C19 18 22 20 22 20V4Z" fill="#FBCFE8" stroke="#EC4899" strokeWidth="1.5"/>
  </svg>
)

// シール帳アイコン（表紙デザイン）
export const StickerBookIcon: React.FC<{ size?: number; color?: string }> = ({ size = 24, color = '#7C3AED' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <rect x="4" y="2" width="16" height="20" rx="2" fill={color} fillOpacity="0.2" stroke={color} strokeWidth="1.5"/>
    <path d="M7 2V22" stroke={color} strokeWidth="1.5"/>
    <circle cx="14" cy="9" r="2" fill="#FBBF24" stroke="#F59E0B" strokeWidth="1"/>
    <circle cx="11" cy="13" r="1.5" fill="#EC4899" stroke="#DB2777" strokeWidth="0.75"/>
    <circle cx="16" cy="14" r="1.5" fill="#22C55E" stroke="#16A34A" strokeWidth="0.75"/>
  </svg>
)
