'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { UserStats } from './ProfileView'
import {
  StatsGraphIcon,
  PaletteIcon,
  SparkleIcon,
  BookIcon,
  HandshakeIcon,
  UsersGroupIcon,
  FollowersIcon,
  ArrowRightIcon,
  PhoneIcon,
  NoteIcon,
  HeartIcon,
  StarIcon,
} from '@/components/icons/ProfileIcons'

interface StatsModalProps {
  isOpen: boolean
  onClose: () => void
  stats: UserStats
}

// 統計アイテムの表示コンポーネント
const StatItem: React.FC<{
  icon: React.ReactNode
  label: string
  value: number
  description: string
  color: string
}> = ({ icon, label, value, description, color }) => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '12px 16px',
        background: 'rgba(255, 255, 255, 0.8)',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
      }}
    >
      {/* アイコン */}
      <div
        style={{
          width: '48px',
          height: '48px',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: color,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          flexShrink: 0,
        }}
      >
        {icon}
      </div>

      {/* 情報 */}
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
          <span
            style={{
              fontSize: '24px',
              fontWeight: 'bold',
              color: '#4A2068',
              fontFamily: "'M PLUS Rounded 1c', sans-serif",
            }}
          >
            {value.toLocaleString()}
          </span>
          <span
            style={{
              fontSize: '14px',
              fontWeight: 'bold',
              color: '#7A5090',
              fontFamily: "'M PLUS Rounded 1c', sans-serif",
            }}
          >
            {label}
          </span>
        </div>
        <p
          style={{
            fontSize: '12px',
            color: '#9B6FD0',
            marginTop: '2px',
            fontFamily: "'M PLUS Rounded 1c', sans-serif",
          }}
        >
          {description}
        </p>
      </div>
    </div>
  )
}

// セクションヘッダー
const SectionHeader: React.FC<{ icon: React.ReactNode; title: string }> = ({ icon, title }) => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        marginBottom: '12px',
        paddingLeft: '4px',
      }}
    >
      {icon}
      <h3
        style={{
          fontSize: '16px',
          fontWeight: 'bold',
          color: '#4A2068',
          fontFamily: "'M PLUS Rounded 1c', sans-serif",
        }}
      >
        {title}
      </h3>
    </div>
  )
}

export const StatsModal: React.FC<StatsModalProps> = ({
  isOpen,
  onClose,
  stats,
}) => {
  // コレクション率を計算（仮: uniqueStickers / 165 * 100）
  const collectionRate = Math.round((stats.uniqueStickers / 165) * 100)

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* バックドロップ */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0, 0, 0, 0.5)',
              zIndex: 1000,
            }}
          />

          {/* モーダルコンテナ（中央配置用） */}
          <div
            style={{
              position: 'fixed',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1001,
              pointerEvents: 'none',
              padding: '20px',
            }}
          >
            {/* モーダル */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              style={{
                width: '100%',
                maxWidth: '400px',
                maxHeight: '80vh',
                background: 'linear-gradient(135deg, #FFF5F8 0%, #F3E8FF 100%)',
                borderRadius: '24px',
                boxShadow: '0 8px 32px rgba(124, 58, 237, 0.3)',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                pointerEvents: 'auto',
              }}
            >
            {/* ヘッダー */}
            <div
              style={{
                padding: '20px 24px 16px',
                backgroundImage: 'url(/images/Header_UI.png)',
                backgroundSize: '100% 100%',
                backgroundPosition: 'center top',
                backgroundRepeat: 'no-repeat',
                position: 'relative',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <StatsGraphIcon size={32} color="#FFFFFF" />
                <div>
                  <h2
                    style={{
                      fontSize: '20px',
                      fontWeight: 'bold',
                      color: 'white',
                      fontFamily: "'M PLUS Rounded 1c', sans-serif",
                      textShadow: '0 1px 3px rgba(157, 76, 108, 0.6), 0 0 8px rgba(255, 255, 255, 0.3)',
                    }}
                  >
                    とうけい
                  </h2>
                  <p
                    style={{
                      fontSize: '12px',
                      color: 'rgba(255,255,255,0.9)',
                      fontFamily: "'M PLUS Rounded 1c', sans-serif",
                      textShadow: '0 1px 2px rgba(157, 76, 108, 0.4)',
                    }}
                  >
                    あなたのかつどうをチェック！
                  </p>
                </div>
              </div>

              {/* 閉じるボタン */}
              <button
                onClick={onClose}
                style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.8)',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                }}
              >
                <span style={{ color: '#9D4C6C', fontSize: '18px' }}>✕</span>
              </button>
            </div>

            {/* コンテンツ */}
            <div
              style={{
                flex: 1,
                overflowY: 'auto',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '20px',
              }}
            >
              {/* コレクション率サマリー */}
              <div
                style={{
                  padding: '16px',
                  background: 'linear-gradient(135deg, rgba(167, 139, 250, 0.2) 0%, rgba(236, 72, 153, 0.2) 100%)',
                  borderRadius: '16px',
                  textAlign: 'center',
                }}
              >
                <p
                  style={{
                    fontSize: '14px',
                    color: '#7A5090',
                    marginBottom: '8px',
                    fontFamily: "'M PLUS Rounded 1c', sans-serif",
                  }}
                >
                  コレクションりつ
                </p>
                <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: '4px' }}>
                  <span
                    style={{
                      fontSize: '48px',
                      fontWeight: 'bold',
                      color: '#7C3AED',
                      fontFamily: "'M PLUS Rounded 1c', sans-serif",
                    }}
                  >
                    {collectionRate}
                  </span>
                  <span
                    style={{
                      fontSize: '24px',
                      fontWeight: 'bold',
                      color: '#A78BFA',
                      fontFamily: "'M PLUS Rounded 1c', sans-serif",
                    }}
                  >
                    %
                  </span>
                </div>
                <div
                  style={{
                    height: '8px',
                    background: 'rgba(255,255,255,0.5)',
                    borderRadius: '4px',
                    overflow: 'hidden',
                    marginTop: '8px',
                  }}
                >
                  <div
                    style={{
                      width: `${collectionRate}%`,
                      height: '100%',
                      background: 'linear-gradient(90deg, #A78BFA 0%, #EC4899 100%)',
                      borderRadius: '4px',
                      transition: 'width 0.5s ease-out',
                    }}
                  />
                </div>
                <p
                  style={{
                    fontSize: '12px',
                    color: '#9B6FD0',
                    marginTop: '8px',
                    fontFamily: "'M PLUS Rounded 1c', sans-serif",
                  }}
                >
                  {stats.uniqueStickers} / 165 しゅるい
                </p>
              </div>

              {/* シールセクション */}
              <div>
                <SectionHeader icon={<StarIcon size={20} />} title="シール" />
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <StatItem
                    icon={<PaletteIcon size={24} color="#FFFFFF" />}
                    label="まい"
                    value={stats.totalStickers}
                    description="もっているシールのそうすう"
                    color="linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%)"
                  />
                  <StatItem
                    icon={<SparkleIcon size={24} color="#FFFFFF" />}
                    label="しゅるい"
                    value={stats.uniqueStickers}
                    description="ちがうしゅるいのシール"
                    color="linear-gradient(135deg, #FFB347 0%, #FFCC33 100%)"
                  />
                  <StatItem
                    icon={<BookIcon size={24} color="#FFFFFF" />}
                    label="コンプリート"
                    value={stats.completedSeries}
                    description="あつめおわったシリーズ"
                    color="linear-gradient(135deg, #4ADE80 0%, #22C55E 100%)"
                  />
                </div>
              </div>

              {/* 交流セクション */}
              <div>
                <SectionHeader icon={<SparkleIcon size={20} />} title="こうりゅう" />
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <StatItem
                    icon={<HandshakeIcon size={24} color="#FFFFFF" />}
                    label="かい"
                    value={stats.totalTrades}
                    description="シールをこうかんしたかいすう"
                    color="linear-gradient(135deg, #60A5FA 0%, #3B82F6 100%)"
                  />
                  <StatItem
                    icon={<UsersGroupIcon size={24} color="#FFFFFF" />}
                    label="にん"
                    value={stats.friendsCount}
                    description="なかよしのフレンド"
                    color="linear-gradient(135deg, #A78BFA 0%, #8B5CF6 100%)"
                  />
                  <StatItem
                    icon={<FollowersIcon size={24} color="#FFFFFF" />}
                    label="フォロワー"
                    value={stats.followersCount}
                    description="あなたをフォローしているひと"
                    color="linear-gradient(135deg, #EC4899 0%, #DB2777 100%)"
                  />
                  <StatItem
                    icon={<ArrowRightIcon size={24} color="#FFFFFF" />}
                    label="フォロー中"
                    value={stats.followingCount}
                    description="あなたがフォローしているひと"
                    color="linear-gradient(135deg, #60A5FA 0%, #2563EB 100%)"
                  />
                </div>
              </div>

              {/* SNSセクション */}
              <div>
                <SectionHeader icon={<PhoneIcon size={20} />} title="タイムライン" />
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <StatItem
                    icon={<NoteIcon size={24} color="#FFFFFF" />}
                    label="けん"
                    value={stats.postsCount}
                    description="とうこうしたかいすう"
                    color="linear-gradient(135deg, #F472B6 0%, #EC4899 100%)"
                  />
                  <StatItem
                    icon={<HeartIcon size={24} color="#FFFFFF" />}
                    label="こ"
                    value={stats.reactionsReceived}
                    description="もらったリアクション"
                    color="linear-gradient(135deg, #FB7185 0%, #F43F5E 100%)"
                  />
                </div>
              </div>
            </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}

export default StatsModal
