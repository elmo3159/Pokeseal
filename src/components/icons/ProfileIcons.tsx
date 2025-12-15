'use client'

import React from 'react'

// トロフィーアイコン
export const TrophyIcon: React.FC<{ size?: number; color?: string }> = ({ size = 24, color = '#FBBF24' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M6 3H18V5C18 8.31371 15.3137 11 12 11C8.68629 11 6 8.31371 6 5V3Z" fill={color} fillOpacity="0.3" stroke={color} strokeWidth="1.5"/>
    <path d="M18 5H21V7C21 8.65685 19.6569 10 18 10V5Z" fill={color} fillOpacity="0.2" stroke={color} strokeWidth="1"/>
    <path d="M6 5H3V7C3 8.65685 4.34315 10 6 10V5Z" fill={color} fillOpacity="0.2" stroke={color} strokeWidth="1"/>
    <rect x="9" y="11" width="6" height="4" fill={color} fillOpacity="0.4"/>
    <rect x="7" y="15" width="10" height="3" rx="1" fill={color} stroke={color} strokeWidth="1"/>
    <circle cx="12" cy="6" r="1.5" fill={color}/>
  </svg>
)

// パレット・アートアイコン
export const PaletteIcon: React.FC<{ size?: number; color?: string }> = ({ size = 24, color = '#EC4899' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C12.83 22 13.5 21.33 13.5 20.5C13.5 20.11 13.35 19.76 13.11 19.49C12.88 19.23 12.73 18.88 12.73 18.5C12.73 17.67 13.4 17 14.23 17H16C19.31 17 22 14.31 22 11C22 6.03 17.52 2 12 2Z" fill={color} fillOpacity="0.2" stroke={color} strokeWidth="1.5"/>
    <circle cx="6.5" cy="11.5" r="1.5" fill="#F87171"/>
    <circle cx="9.5" cy="7.5" r="1.5" fill="#FBBF24"/>
    <circle cx="14.5" cy="7.5" r="1.5" fill="#4ADE80"/>
    <circle cx="17.5" cy="11.5" r="1.5" fill="#60A5FA"/>
  </svg>
)

// グラフ・統計アイコン
export const StatsGraphIcon: React.FC<{ size?: number; color?: string }> = ({ size = 24, color = '#8B5CF6' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <rect x="3" y="14" width="4" height="7" rx="1" fill={color} fillOpacity="0.3" stroke={color} strokeWidth="1.5"/>
    <rect x="10" y="8" width="4" height="13" rx="1" fill={color} fillOpacity="0.5" stroke={color} strokeWidth="1.5"/>
    <rect x="17" y="3" width="4" height="18" rx="1" fill={color} stroke={color} strokeWidth="1.5"/>
    <path d="M3 4L8 8L14 5L21 2" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="2 2"/>
  </svg>
)

// ハートアイコン
export const HeartIcon: React.FC<{ size?: number; color?: string; filled?: boolean }> = ({ size = 24, color = '#EC4899', filled = true }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path
      d="M12 21.35L10.55 20.03C5.4 15.36 2 12.28 2 8.5C2 5.42 4.42 3 7.5 3C9.24 3 10.91 3.81 12 5.09C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.42 22 8.5C22 12.28 18.6 15.36 13.45 20.04L12 21.35Z"
      fill={filled ? color : 'none'}
      stroke={color}
      strokeWidth="1.5"
    />
  </svg>
)

// ノート・メモアイコン
export const NoteIcon: React.FC<{ size?: number; color?: string }> = ({ size = 24, color = '#F472B6' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <rect x="4" y="2" width="16" height="20" rx="2" fill={color} fillOpacity="0.2" stroke={color} strokeWidth="1.5"/>
    <line x1="8" y1="7" x2="16" y2="7" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    <line x1="8" y1="11" x2="16" y2="11" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    <line x1="8" y1="15" x2="12" y2="15" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
)

// ユーザーグループアイコン
export const UsersGroupIcon: React.FC<{ size?: number; color?: string }> = ({ size = 24, color = '#A855F7' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <circle cx="9" cy="7" r="3" fill={color} fillOpacity="0.3" stroke={color} strokeWidth="1.5"/>
    <path d="M2 20C2 16.6863 5.13401 14 9 14C12.866 14 16 16.6863 16 20" stroke={color} strokeWidth="1.5" strokeLinecap="round" fill={color} fillOpacity="0.2"/>
    <circle cx="17" cy="8" r="2.5" fill={color} fillOpacity="0.2" stroke={color} strokeWidth="1"/>
    <path d="M16 20C16 17.5 17.5 15.5 20 14.5" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
)

// 本・図鑑アイコン
export const BookIcon: React.FC<{ size?: number; color?: string }> = ({ size = 24, color = '#22C55E' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M4 19.5V4.5C4 3.67157 4.67157 3 5.5 3H18.5C19.3284 3 20 3.67157 20 4.5V19.5C20 20.3284 19.3284 21 18.5 21H5.5C4.67157 21 4 20.3284 4 19.5Z" fill={color} fillOpacity="0.2" stroke={color} strokeWidth="1.5"/>
    <path d="M4 17H20" stroke={color} strokeWidth="1.5"/>
    <line x1="8" y1="7" x2="16" y2="7" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    <line x1="8" y1="11" x2="14" y2="11" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
)

// 矢印アイコン（フォロー中）
export const ArrowRightIcon: React.FC<{ size?: number; color?: string }> = ({ size = 24, color = '#3B82F6' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M5 12H19M19 12L13 6M19 12L13 18" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

// ターゲット・目標アイコン（再エクスポート用）
export const TargetIcon: React.FC<{ size?: number; color?: string }> = ({ size = 24, color = '#F59E0B' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="1.5" fill={color} fillOpacity="0.1"/>
    <circle cx="12" cy="12" r="6" stroke={color} strokeWidth="1.5" fill={color} fillOpacity="0.2"/>
    <circle cx="12" cy="12" r="2" fill={color}/>
  </svg>
)

// 握手アイコン（再エクスポート）
export const HandshakeIcon: React.FC<{ size?: number; color?: string }> = ({ size = 24, color = '#22C55E' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M12 8L9 5H5L2 8V13L5 16H9L12 13" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill={color} fillOpacity="0.2"/>
    <path d="M12 8L15 5H19L22 8V13L19 16H15L12 13" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill={color} fillOpacity="0.2"/>
    <path d="M12 8V13" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    <circle cx="12" cy="10.5" r="2" fill={color}/>
  </svg>
)

// 星アイコン（再エクスポート）
export const StarIcon: React.FC<{ size?: number; color?: string; filled?: boolean }> = ({ size = 20, color = '#FBBF24', filled = true }) => (
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

// キラキラアイコン（再エクスポート）
export const SparkleIcon: React.FC<{ size?: number; color?: string }> = ({ size = 24, color = '#FBBF24' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M12 2L13.5 8.5L20 10L13.5 11.5L12 18L10.5 11.5L4 10L10.5 8.5L12 2Z" fill={color} stroke={color} strokeWidth="1"/>
    <path d="M19 2L19.5 4.5L22 5L19.5 5.5L19 8L18.5 5.5L16 5L18.5 4.5L19 2Z" fill={color} stroke={color} strokeWidth="0.5"/>
  </svg>
)

// スマホアイコン（タイムライン用）
export const PhoneIcon: React.FC<{ size?: number; color?: string }> = ({ size = 24, color = '#EC4899' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <rect x="5" y="2" width="14" height="20" rx="3" fill={color} fillOpacity="0.2" stroke={color} strokeWidth="1.5"/>
    <line x1="9" y1="5" x2="15" y2="5" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    <circle cx="12" cy="18" r="1.5" fill={color}/>
  </svg>
)

// 複数ユーザーアイコン（フォロワー用）
export const FollowersIcon: React.FC<{ size?: number; color?: string }> = ({ size = 24, color = '#EC4899' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <circle cx="8" cy="8" r="3" fill={color} fillOpacity="0.3" stroke={color} strokeWidth="1.5"/>
    <path d="M1 20C1 16.686 4.134 14 8 14C11.866 14 15 16.686 15 20" stroke={color} strokeWidth="1.5" strokeLinecap="round" fill={color} fillOpacity="0.2"/>
    <circle cx="16" cy="8" r="3" fill={color} fillOpacity="0.2" stroke={color} strokeWidth="1"/>
    <path d="M15 20C15 17.5 17 15.5 20 14.5" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
)

// お祝いアイコン（再エクスポート）
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
