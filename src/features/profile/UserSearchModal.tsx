'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { profileService } from '@/services/profile'
import type { OtherUserProfileData } from '@/services/profile/profileService'

interface UserSearchModalProps {
  isOpen: boolean
  onClose: () => void
  currentUserId?: string
  onUserSelect: (userId: string) => void
  onFollow: (userId: string) => void
}

// 数字ボタンコンポーネント
const NumberButton: React.FC<{
  num: string
  onClick: () => void
  disabled?: boolean
}> = ({ num, onClick, disabled }) => (
  <motion.button
    whileHover={{ scale: disabled ? 1 : 1.1 }}
    whileTap={{ scale: disabled ? 1 : 0.95 }}
    onClick={onClick}
    disabled={disabled}
    style={{
      width: '56px',
      height: '56px',
      borderRadius: '50%',
      border: 'none',
      background: num === '⌫'
        ? 'linear-gradient(145deg, #FFE4EC, #FFC8D8)'
        : num === '✓'
        ? 'linear-gradient(145deg, #A7F3D0, #6EE7B7)'
        : 'linear-gradient(145deg, #FFFFFF, #FFF5F8)',
      boxShadow: '0 4px 12px rgba(255, 182, 217, 0.3), inset 0 2px 4px rgba(255,255,255,0.8)',
      fontSize: num === '⌫' || num === '✓' ? '20px' : '24px',
      fontWeight: 'bold',
      color: num === '✓' ? '#059669' : '#8B5A3C',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.5 : 1,
      fontFamily: "'M PLUS Rounded 1c', sans-serif",
      transition: 'all 0.2s ease',
    }}
  >
    {num}
  </motion.button>
)

// コード表示の1桁
const CodeDigit: React.FC<{ value: string; filled: boolean; active: boolean }> = ({ value, filled, active }) => (
  <motion.div
    animate={{
      scale: active ? [1, 1.1, 1] : 1,
      borderColor: active ? '#FF69B4' : filled ? '#FFB6D9' : '#E8D5DE',
    }}
    transition={{ duration: 0.2 }}
    style={{
      width: '42px',
      height: '52px',
      borderRadius: '12px',
      border: '3px solid',
      background: filled
        ? 'linear-gradient(145deg, #FFF0F5, #FFE4EC)'
        : 'linear-gradient(145deg, #FFFFFF, #FFF8FA)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '26px',
      fontWeight: 'bold',
      color: '#8B5A3C',
      boxShadow: filled
        ? 'inset 0 2px 8px rgba(255, 182, 217, 0.3)'
        : 'inset 0 2px 4px rgba(0,0,0,0.03)',
      fontFamily: "'M PLUS Rounded 1c', sans-serif",
    }}
  >
    {value || ''}
  </motion.div>
)

export const UserSearchModal: React.FC<UserSearchModalProps> = ({
  isOpen,
  onClose,
  currentUserId,
  onUserSelect,
  onFollow,
}) => {
  const [searchCode, setSearchCode] = useState('')
  const [searchResult, setSearchResult] = useState<OtherUserProfileData | null>(null)
  const [isSearching, setIsSearching] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // コード入力
  const handleNumberClick = (num: string) => {
    if (searchCode.length < 6) {
      const newCode = searchCode + num
      setSearchCode(newCode)
      setError(null)

      // 6桁揃ったら自動検索
      if (newCode.length === 6) {
        handleSearch(newCode)
      }
    }
  }

  // バックスペース
  const handleBackspace = () => {
    setSearchCode(prev => prev.slice(0, -1))
    setError(null)
    setSearchResult(null)
  }

  // 検索実行
  const handleSearch = async (code?: string) => {
    const targetCode = code || searchCode
    if (targetCode.length !== 6) return

    setIsSearching(true)
    setError(null)
    setSearchResult(null)

    try {
      const basicProfile = await profileService.searchByUserCode(targetCode)

      if (!basicProfile) {
        setError('みつからなかった...')
        setIsSearching(false)
        return
      }

      const fullProfile = await profileService.getOtherUserProfile(basicProfile.id, currentUserId)

      if (fullProfile) {
        setSearchResult(fullProfile)
      } else {
        setError('よみこめなかった...')
      }
    } catch (err) {
      console.error('[UserSearch] 検索エラー:', err)
      setError('エラーがおきた...')
    }

    setIsSearching(false)
  }

  // モーダルを閉じるときにリセット
  const handleClose = () => {
    setSearchCode('')
    setSearchResult(null)
    setError(null)
    onClose()
  }

  // ESCキーで閉じる
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose()
    }
    if (isOpen) window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen])

  const numbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '⌫', '0', '✓']

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
          }}
        >
          {/* バックドロップ - ぼかし効果 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(135deg, rgba(255,182,217,0.4), rgba(168,85,247,0.3))',
              backdropFilter: 'blur(8px)',
            }}
          />

          {/* モーダル本体 - 上部デコレーション用ラッパー */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: '340px',
              paddingTop: '36px', // デコレーション用スペース（marginではなくpadding）
              overflow: 'visible', // 外にはみ出すデコレーションを表示
            }}
          >
            {/* デコレーション - 上部の丸 */}
            <div style={{
              position: 'absolute',
              top: '6px', // paddingTop(36px) - 半分(30px) = 6px で中央揃え
              left: '50%',
              transform: 'translateX(-50%)',
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              background: 'linear-gradient(145deg, #FFB6D9, #FF8DC7)',
              boxShadow: '0 4px 16px rgba(255, 141, 199, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '28px',
              zIndex: 20,
            }}>
              🔍
            </div>

            {/* 実際のモーダルコンテンツ */}
            <div style={{
              position: 'relative',
              width: '100%',
              maxHeight: '80vh',
              overflowY: 'auto',
              overflowX: 'hidden',
              background: 'linear-gradient(180deg, #FFF8FA 0%, #FFF0F5 50%, #FFE4EC 100%)',
              borderRadius: '32px',
              boxShadow: '0 20px 60px rgba(139, 90, 60, 0.25), 0 0 0 1px rgba(255,255,255,0.5)',
              fontFamily: "'M PLUS Rounded 1c', sans-serif",
            }}>

            {/* 閉じるボタン */}
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleClose}
              style={{
                position: 'absolute',
                top: '12px',
                right: '12px',
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: 'linear-gradient(145deg, #FFF0F5, #FFE4EC)',
                border: 'none',
                boxShadow: '0 2px 8px rgba(255, 182, 217, 0.3)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '16px',
                color: '#C084A0',
                zIndex: 2,
              }}
            >
              ✕
            </motion.button>

            {/* コンテンツ */}
            <div style={{ padding: '48px 24px 24px' }}>
              {/* タイトル */}
              <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <h2 style={{
                  margin: 0,
                  fontSize: '20px',
                  fontWeight: 'bold',
                  color: '#8B5A3C',
                  letterSpacing: '2px',
                }}>
                  おともだちを さがそう
                </h2>
                <p style={{
                  margin: '8px 0 0',
                  fontSize: '12px',
                  color: '#A08090',
                }}>
                  6けたの コードを いれてね ♪
                </p>
              </div>

              {/* コード入力表示 */}
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '6px',
                marginBottom: '20px',
              }}>
                {[0, 1, 2, 3, 4, 5].map(i => (
                  <CodeDigit
                    key={i}
                    value={searchCode[i] || ''}
                    filled={!!searchCode[i]}
                    active={searchCode.length === i}
                  />
                ))}
              </div>

              {/* ローディング */}
              {isSearching && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  style={{
                    textAlign: 'center',
                    padding: '16px',
                    color: '#C084A0',
                  }}
                >
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                    style={{ display: 'inline-block', fontSize: '24px' }}
                  >
                    🌸
                  </motion.span>
                  <p style={{ margin: '8px 0 0', fontSize: '14px' }}>さがしてるよ...</p>
                </motion.div>
              )}

              {/* エラーメッセージ */}
              {error && !isSearching && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    textAlign: 'center',
                    padding: '12px',
                    background: 'linear-gradient(145deg, #FEE2E2, #FECACA)',
                    borderRadius: '16px',
                    marginBottom: '16px',
                  }}
                >
                  <span style={{ fontSize: '20px' }}>😢</span>
                  <p style={{ margin: '4px 0 0', fontSize: '14px', color: '#B45454' }}>
                    {error}
                  </p>
                </motion.div>
              )}

              {/* 検索結果 */}
              {searchResult && !isSearching && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    background: 'white',
                    borderRadius: '20px',
                    padding: '16px',
                    boxShadow: '0 4px 20px rgba(255, 182, 217, 0.2)',
                    border: '2px solid #FFD6E8',
                    marginBottom: '16px',
                  }}
                >
                  {/* みつかった！ */}
                  <div style={{
                    textAlign: 'center',
                    marginBottom: '12px',
                    fontSize: '13px',
                    color: '#10B981',
                    fontWeight: 'bold',
                  }}>
                    ✨ みつけたよ！ ✨
                  </div>

                  {/* ユーザー情報 */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    marginBottom: '12px',
                  }}>
                    {/* アバター */}
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      style={{
                        width: '64px',
                        height: '64px',
                        borderRadius: '20px',
                        background: 'linear-gradient(145deg, #FECDD3, #FBB6CE)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        overflow: 'hidden',
                        boxShadow: '0 4px 12px rgba(251, 182, 206, 0.4)',
                        flexShrink: 0,
                      }}
                    >
                      {searchResult.avatarUrl ? (
                        <img
                          src={searchResult.avatarUrl}
                          alt={searchResult.name}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      ) : (
                        <span style={{ fontSize: '32px' }}>🐱</span>
                      )}
                    </motion.div>

                    {/* 名前とレベル */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h3 style={{
                        margin: 0,
                        color: '#8B5A3C',
                        fontSize: '17px',
                        fontWeight: 'bold',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}>
                        {searchResult.name}
                      </h3>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        marginTop: '4px',
                        flexWrap: 'wrap',
                      }}>
                        <span style={{
                          fontSize: '11px',
                          background: 'linear-gradient(135deg, #C084FC, #F472B6)',
                          color: 'white',
                          padding: '2px 10px',
                          borderRadius: '20px',
                          fontWeight: 'bold',
                        }}>
                          Lv.{searchResult.level}
                        </span>
                        {searchResult.title && (
                          <span style={{
                            fontSize: '10px',
                            color: '#A08090',
                            background: '#FFF0F5',
                            padding: '2px 8px',
                            borderRadius: '10px',
                          }}>
                            {searchResult.title}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* ステータス */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-around',
                    padding: '10px',
                    background: 'linear-gradient(145deg, #FFF8FA, #FFF0F5)',
                    borderRadius: '14px',
                    marginBottom: '12px',
                  }}>
                    {[
                      { value: searchResult.stats.totalStickers, label: 'シール', emoji: '🎨' },
                      { value: searchResult.stats.followersCount, label: 'ファン', emoji: '💕' },
                      { value: searchResult.stats.followingCount, label: 'フォロー', emoji: '👀' },
                    ].map((stat, i) => (
                      <div key={i} style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '10px', marginBottom: '2px' }}>{stat.emoji}</div>
                        <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#8B5A3C' }}>
                          {stat.value}
                        </div>
                        <div style={{ fontSize: '9px', color: '#A08090' }}>{stat.label}</div>
                      </div>
                    ))}
                  </div>

                  {/* ボタン */}
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => onUserSelect(searchResult.id)}
                      style={{
                        flex: 1,
                        padding: '12px',
                        borderRadius: '14px',
                        border: '2px solid #E8D0D8',
                        background: 'white',
                        color: '#8B5A3C',
                        fontSize: '13px',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        fontFamily: "'M PLUS Rounded 1c', sans-serif",
                      }}
                    >
                      📖 シール帳
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => {
                        onFollow(searchResult.id)
                        setSearchResult({
                          ...searchResult,
                          isFollowing: !searchResult.isFollowing,
                        })
                      }}
                      style={{
                        flex: 1,
                        padding: '12px',
                        borderRadius: '14px',
                        border: 'none',
                        background: searchResult.isFollowing
                          ? 'linear-gradient(145deg, #D1D5DB, #E5E7EB)'
                          : 'linear-gradient(145deg, #FFB6D9, #FF8DC7)',
                        color: 'white',
                        fontSize: '13px',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        boxShadow: searchResult.isFollowing
                          ? 'none'
                          : '0 4px 12px rgba(255, 182, 217, 0.4)',
                        fontFamily: "'M PLUS Rounded 1c', sans-serif",
                      }}
                    >
                      {searchResult.isFollowing ? '✓ フォロー中' : '💕 フォロー'}
                    </motion.button>
                  </div>
                </motion.div>
              )}

              {/* テンキー（結果がない時のみ表示） */}
              {!searchResult && !isSearching && (
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '10px',
                  justifyItems: 'center',
                  padding: '8px',
                  background: 'linear-gradient(145deg, rgba(255,255,255,0.5), rgba(255,240,245,0.5))',
                  borderRadius: '20px',
                }}>
                  {numbers.map((num) => (
                    <NumberButton
                      key={num}
                      num={num}
                      onClick={() => {
                        if (num === '⌫') handleBackspace()
                        else if (num === '✓') handleSearch()
                        else handleNumberClick(num)
                      }}
                      disabled={
                        (num === '✓' && searchCode.length !== 6) ||
                        (num !== '⌫' && num !== '✓' && searchCode.length >= 6)
                      }
                    />
                  ))}
                </div>
              )}

              {/* リセットボタン（結果表示中） */}
              {searchResult && !isSearching && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setSearchCode('')
                    setSearchResult(null)
                    setError(null)
                  }}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '14px',
                    border: 'none',
                    background: 'linear-gradient(145deg, #F3F4F6, #E5E7EB)',
                    color: '#6B7280',
                    fontSize: '13px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    fontFamily: "'M PLUS Rounded 1c', sans-serif",
                  }}
                >
                  🔄 べつの人をさがす
                </motion.button>
              )}

              {/* ヒント */}
              <div style={{
                marginTop: '16px',
                textAlign: 'center',
                fontSize: '11px',
                color: '#A08090',
              }}>
                💡 コードは プロフィールで かくにんできるよ
              </div>
            </div>
            </div>{/* 実際のモーダルコンテンツの閉じタグ */}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default UserSearchModal
