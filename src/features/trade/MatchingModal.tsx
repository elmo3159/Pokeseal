'use client'

import React, { useState, useEffect } from 'react'
import {
  SearchIcon,
  SparkleIcon,
  StarIcon,
  UserIcon,
  CelebrationIcon,
} from '@/components/icons/TradeIcons'

// マッチング状態
export type MatchingStatus = 'idle' | 'searching' | 'found' | 'timeout' | 'cancelled'

// マッチした相手の情報
export interface MatchedUser {
  id: string
  name: string
  avatarUrl?: string
  level?: number
}

interface MatchingModalProps {
  isOpen: boolean
  status: MatchingStatus
  matchedUser?: MatchedUser
  onCancel: () => void
  onStartTrade: () => void
  onRetry: () => void
}

// 検索中アニメーション
const SearchingAnimation: React.FC = () => {
  return (
    <div style={{ position: 'relative', width: '160px', height: '160px', marginLeft: 'auto', marginRight: 'auto' }}>
      {/* 外側のリング */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, borderRadius: '50%', border: '4px solid #E9D5FF', animation: 'ping 1s cubic-bezier(0,0,0.2,1) infinite' }} />
      <div style={{ position: 'absolute', top: '8px', left: '8px', right: '8px', bottom: '8px', borderRadius: '50%', border: '4px solid #FBCFE8', animation: 'ping 1s cubic-bezier(0,0,0.2,1) infinite', animationDelay: '0.2s' }} />
      <div style={{ position: 'absolute', top: '16px', left: '16px', right: '16px', bottom: '16px', borderRadius: '50%', border: '4px solid #E9D5FF', animation: 'ping 1s cubic-bezier(0,0,0.2,1) infinite', animationDelay: '0.4s' }} />

      {/* 中央のアイコン */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'linear-gradient(to bottom right, #A78BFA, #F472B6)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)' }}>
          <div style={{ animation: 'bounce 1s infinite' }}><SearchIcon size={36} color="white" /></div>
        </div>
      </div>

      {/* 周囲を回る点 */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, animation: 'spin 3s linear infinite' }}>
        <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: '12px', height: '12px', background: '#8B5CF6', borderRadius: '50%' }} />
      </div>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, animation: 'spin 3s linear infinite', animationDelay: '1s' }}>
        <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: '12px', height: '12px', background: '#EC4899', borderRadius: '50%' }} />
      </div>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, animation: 'spin 3s linear infinite', animationDelay: '2s' }}>
        <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: '12px', height: '12px', background: '#A78BFA', borderRadius: '50%' }} />
      </div>
    </div>
  )
}

// マッチ成功アニメーション
const MatchFoundAnimation: React.FC<{ user: MatchedUser }> = ({ user }) => {
  return (
    <div style={{ position: 'relative' }}>
      {/* キラキラ背景 */}
      <div style={{ position: 'absolute', top: '-32px', left: '-32px', right: '-32px', bottom: '-32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ position: 'absolute', top: 0, left: '16px', animation: 'ping 1s cubic-bezier(0,0,0.2,1) infinite' }}><SparkleIcon size={36} color="#FBBF24" /></div>
        <div style={{ position: 'absolute', top: '16px', right: '8px', animation: 'ping 1s cubic-bezier(0,0,0.2,1) infinite', animationDelay: '0.2s' }}><StarIcon size={30} color="#FBBF24" /></div>
        <div style={{ position: 'absolute', bottom: '16px', left: '8px', animation: 'ping 1s cubic-bezier(0,0,0.2,1) infinite', animationDelay: '0.4s' }}><SparkleIcon size={24} color="#F9A8D4" /></div>
        <div style={{ position: 'absolute', bottom: 0, right: '16px', animation: 'ping 1s cubic-bezier(0,0,0.2,1) infinite', animationDelay: '0.6s' }}><StarIcon size={30} color="#F9A8D4" /></div>
      </div>

      {/* ユーザーカード */}
      <div style={{
        position: 'relative',
        background: 'white',
        borderRadius: '24px',
        padding: '24px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        animation: 'scaleIn 0.5s ease-out',
      }}>
        {/* アバター */}
        <div style={{
          width: '96px',
          height: '96px',
          marginLeft: 'auto',
          marginRight: 'auto',
          borderRadius: '50%',
          background: 'linear-gradient(to bottom right, #C4B5FD, #F9A8D4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
          marginBottom: '16px',
        }}>
          {user.avatarUrl ? (
            <img src={user.avatarUrl} alt={user.name} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
          ) : (
            <UserIcon size={48} color="#A855F7" />
          )}
        </div>

        {/* 名前 */}
        <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#7C3AED', textAlign: 'center', marginBottom: '4px' }}>
          {user.name}
        </h3>

        {/* レベル */}
        {user.level && (
          <p style={{ fontSize: '14px', color: '#A78BFA', textAlign: 'center' }}>
            Lv.{user.level}
          </p>
        )}
      </div>
    </div>
  )
}

// タイムアウト表示
const TimeoutDisplay: React.FC = () => {
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: '60px', marginBottom: '16px' }}>😢</div>
      <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#7C3AED', marginBottom: '8px' }}>
        みつかりませんでした
      </h3>
      <p style={{ fontSize: '14px', color: '#A78BFA' }}>
        もういちどためしてみてね
      </p>
    </div>
  )
}

// メインのMatchingModal
export const MatchingModal: React.FC<MatchingModalProps> = ({
  isOpen,
  status,
  matchedUser,
  onCancel,
  onStartTrade,
  onRetry
}) => {
  const [searchTime, setSearchTime] = useState(0)
  const [dots, setDots] = useState('')

  // 検索時間カウンター
  useEffect(() => {
    if (!isOpen || status !== 'searching') {
      setSearchTime(0)
      return
    }

    const timer = setInterval(() => {
      setSearchTime(prev => prev + 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [isOpen, status])

  // ドットアニメーション
  useEffect(() => {
    if (status !== 'searching') return

    const timer = setInterval(() => {
      setDots(prev => {
        if (prev.length >= 3) return ''
        return prev + '.'
      })
    }, 500)

    return () => clearInterval(timer)
  }, [status])

  if (!isOpen) return null

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: "'M PLUS Rounded 1c', sans-serif",
      }}
    >
      {/* 背景 */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(to bottom, rgba(88, 28, 135, 0.9), rgba(131, 24, 67, 0.9), rgba(88, 28, 135, 0.9))',
        }}
      />

      {/* コンテンツ */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '384px',
          paddingLeft: '24px',
          paddingRight: '24px',
          paddingTop: '32px',
          paddingBottom: '32px',
        }}
      >
        {/* 検索中 */}
        {status === 'searching' && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <SearchingAnimation />

            <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: 'white', marginTop: '32px', marginBottom: '8px' }}>
              さがしています{dots}
            </h2>

            <p style={{ color: '#E9D5FF', marginBottom: '16px' }}>
              {formatTime(searchTime)}
            </p>

            <p style={{ fontSize: '14px', color: '#D8B4FE', textAlign: 'center', marginBottom: '32px' }}>
              せかいちゅうのともだちを<br />さがしています...
            </p>

            <button
              onClick={onCancel}
              style={{
                paddingLeft: '32px',
                paddingRight: '32px',
                paddingTop: '12px',
                paddingBottom: '12px',
                borderRadius: '9999px',
                background: 'rgba(255, 255, 255, 0.2)',
                color: 'white',
                fontWeight: 'bold',
                transition: 'background 0.2s',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              キャンセル
            </button>
          </div>
        )}

        {/* マッチ成功 */}
        {status === 'found' && matchedUser && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ fontSize: '30px', color: 'white', fontWeight: 'bold', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CelebrationIcon size={30} /> マッチ！ <CelebrationIcon size={30} />
            </div>

            <MatchFoundAnimation user={matchedUser} />

            <p style={{ color: '#E9D5FF', marginTop: '24px', marginBottom: '16px', textAlign: 'center' }}>
              こうかんあいてがみつかりました！
            </p>

            <button
              onClick={onStartTrade}
              style={{
                width: '100%',
                paddingTop: '16px',
                paddingBottom: '16px',
                borderRadius: '16px',
                background: 'linear-gradient(to right, #8B5CF6, #EC4899)',
                color: 'white',
                fontWeight: 'bold',
                fontSize: '18px',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                transition: 'all 0.2s',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              こうかんをはじめる！
            </button>
          </div>
        )}

        {/* タイムアウト */}
        {status === 'timeout' && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <TimeoutDisplay />

            <div style={{ display: 'flex', gap: '16px', marginTop: '32px' }}>
              <button
                onClick={onCancel}
                style={{
                  flex: 1,
                  paddingTop: '12px',
                  paddingBottom: '12px',
                  paddingLeft: '16px',
                  paddingRight: '16px',
                  borderRadius: '12px',
                  background: 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  fontWeight: 'bold',
                  transition: 'background 0.2s',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                もどる
              </button>
              <button
                onClick={onRetry}
                style={{
                  flex: 1,
                  paddingTop: '12px',
                  paddingBottom: '12px',
                  paddingLeft: '16px',
                  paddingRight: '16px',
                  borderRadius: '12px',
                  background: 'linear-gradient(to right, #8B5CF6, #EC4899)',
                  color: 'white',
                  fontWeight: 'bold',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                  transition: 'all 0.2s',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                もういちど
              </button>
            </div>
          </div>
        )}

        {/* キャンセル済み */}
        {status === 'cancelled' && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ fontSize: '60px', marginBottom: '16px' }}>👋</div>
            <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: 'white', marginBottom: '8px' }}>
              キャンセルしました
            </h3>
            <p style={{ color: '#E9D5FF', fontSize: '14px' }}>
              またいつでもあそびにきてね
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default MatchingModal
