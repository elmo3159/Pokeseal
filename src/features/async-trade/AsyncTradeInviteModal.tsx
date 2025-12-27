'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { asyncTradeService } from '@/services/asyncTrade'
import { profileService } from '@/services/profile'
import type { OtherUserProfileData } from '@/services/profile/profileService'
import { UserIcon } from '@/components/icons/TradeIcons'

interface AsyncTradeInviteModalProps {
  isOpen: boolean
  onClose: () => void
  currentUserId: string
  onInviteSent: (sessionId: string) => void
}

// フォローしているユーザー
interface FollowingUser {
  id: string
  username: string
  displayName?: string
  avatarUrl?: string
  level: number
}

// 数字ボタン
const NumberButton: React.FC<{
  num: string
  onClick: () => void
  disabled?: boolean
}> = ({ num, onClick, disabled }) => (
  <motion.button
    whileTap={{ scale: disabled ? 1 : 0.95 }}
    onClick={onClick}
    disabled={disabled}
    style={{
      width: '48px',
      height: '48px',
      borderRadius: '50%',
      border: 'none',
      background:
        num === '⌫'
          ? 'linear-gradient(145deg, #FFE4EC, #FFC8D8)'
          : 'linear-gradient(145deg, #FFFFFF, #F8F4F0)',
      boxShadow: '0 2px 8px rgba(184, 149, 107, 0.2)',
      fontSize: num === '⌫' ? '18px' : '20px',
      fontWeight: 'bold',
      color: '#8B5A2B',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.5 : 1,
      fontFamily: "'M PLUS Rounded 1c', sans-serif",
    }}
  >
    {num}
  </motion.button>
)

// コード表示
const CodeDigit: React.FC<{ value: string; filled: boolean }> = ({ value, filled }) => (
  <div
    style={{
      width: '36px',
      height: '44px',
      borderRadius: '10px',
      border: filled ? '2px solid #C4956A' : '2px solid #D4C4B0',
      background: filled ? 'rgba(196, 149, 106, 0.1)' : 'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '22px',
      fontWeight: 'bold',
      color: '#8B5A2B',
      fontFamily: "'M PLUS Rounded 1c', sans-serif",
    }}
  >
    {value || ''}
  </div>
)

// ユーザーカード
const UserCard: React.FC<{
  user: FollowingUser
  onInvite: () => void
  isInviting: boolean
}> = ({ user, onInvite, isInviting }) => (
  <div
    className="flex items-center gap-3 p-3 rounded-xl"
    style={{
      background: 'rgba(255, 255, 255, 0.9)',
      border: '1px solid #D4C4B0',
    }}
  >
    {/* アバター */}
    <div
      className="w-12 h-12 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0"
      style={{ background: 'linear-gradient(135deg, #E8D5C4 0%, #D4C4B0 100%)' }}
    >
      {user.avatarUrl ? (
        <img src={user.avatarUrl} alt="" className="w-full h-full object-cover" />
      ) : (
        <UserIcon size={24} color="#8B5A2B" />
      )}
    </div>

    {/* 情報 */}
    <div className="flex-1 min-w-0">
      <h4
        className="font-bold text-sm truncate"
        style={{ color: '#8B5A2B', fontFamily: "'M PLUS Rounded 1c', sans-serif" }}
      >
        {user.displayName || user.username}
      </h4>
      <p className="text-xs" style={{ color: '#A67C52' }}>
        Lv.{user.level}
      </p>
    </div>

    {/* 招待ボタン */}
    <button
      onClick={onInvite}
      disabled={isInviting}
      className="px-3 py-1.5 rounded-lg text-sm font-bold text-white transition-all active:scale-95 disabled:opacity-50"
      style={{
        background: 'linear-gradient(135deg, #C4956A 0%, #B8956B 100%)',
        boxShadow: '0 2px 6px rgba(184, 149, 107, 0.3)',
        fontFamily: "'M PLUS Rounded 1c', sans-serif",
      }}
    >
      {isInviting ? '...' : 'さそう'}
    </button>
  </div>
)

export const AsyncTradeInviteModal: React.FC<AsyncTradeInviteModalProps> = ({
  isOpen,
  onClose,
  currentUserId,
  onInviteSent,
}) => {
  const [activeTab, setActiveTab] = useState<'following' | 'code'>('following')
  const [followingUsers, setFollowingUsers] = useState<FollowingUser[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [invitingUserId, setInvitingUserId] = useState<string | null>(null)

  // コード検索
  const [searchCode, setSearchCode] = useState('')
  const [searchResult, setSearchResult] = useState<OtherUserProfileData | null>(null)
  const [isSearching, setIsSearching] = useState(false)
  const [searchError, setSearchError] = useState<string | null>(null)

  // フォロー中ユーザーを取得
  useEffect(() => {
    if (!isOpen || !currentUserId) return

    const fetchFollowing = async () => {
      setIsLoading(true)
      try {
        const following = await profileService.getFollowing(currentUserId)
        setFollowingUsers(
          following.map((u) => ({
            id: u.id,
            username: u.name,
            displayName: u.name,
            avatarUrl: u.avatarUrl || undefined,
            level: u.level,
          }))
        )
      } catch (error) {
        console.error('[AsyncTradeInvite] Fetch following error:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchFollowing()
  }, [isOpen, currentUserId])

  // 数字入力
  const handleNumberClick = (num: string) => {
    if (searchCode.length < 6) {
      const newCode = searchCode + num
      setSearchCode(newCode)
      setSearchError(null)

      // 6桁で自動検索
      if (newCode.length === 6) {
        handleSearch(newCode)
      }
    }
  }

  // バックスペース
  const handleBackspace = () => {
    setSearchCode((prev) => prev.slice(0, -1))
    setSearchError(null)
    setSearchResult(null)
  }

  // 検索実行
  const handleSearch = async (code: string) => {
    setIsSearching(true)
    setSearchError(null)
    setSearchResult(null)

    try {
      const basicProfile = await profileService.searchByUserCode(code)

      if (!basicProfile) {
        setSearchError('みつからなかった...')
        setIsSearching(false)
        return
      }

      // 自分自身は除外
      if (basicProfile.id === currentUserId) {
        setSearchError('じぶんはさそえないよ')
        setIsSearching(false)
        return
      }

      const fullProfile = await profileService.getOtherUserProfile(basicProfile.id, currentUserId)
      if (fullProfile) {
        setSearchResult(fullProfile)
      } else {
        setSearchError('よみこめなかった...')
      }
    } catch (err) {
      console.error('[AsyncTradeInvite] Search error:', err)
      setSearchError('エラーがおきた...')
    }

    setIsSearching(false)
  }

  // 招待を送る
  const handleInvite = async (targetUserId: string) => {
    setInvitingUserId(targetUserId)

    try {
      const session = await asyncTradeService.inviteToTrade(currentUserId, targetUserId)
      if (session) {
        onInviteSent(session.id)
        onClose()
      } else {
        alert('すでに進行中のこうかんがあります')
      }
    } catch (error) {
      console.error('[AsyncTradeInvite] Invite error:', error)
      alert('招待に失敗しました')
    }

    setInvitingUserId(null)
  }

  // モーダルを閉じるときにリセット
  const handleClose = () => {
    setSearchCode('')
    setSearchResult(null)
    setSearchError(null)
    onClose()
  }

  const numbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '⌫', '0']

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          {/* バックドロップ */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0"
            style={{ background: 'rgba(139, 90, 43, 0.4)', backdropFilter: 'blur(4px)' }}
          />

          {/* モーダル */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-sm max-h-[80vh] flex flex-col rounded-3xl overflow-hidden"
            style={{
              background: 'linear-gradient(180deg, #FFF8F5 0%, #F8F4F0 100%)',
              boxShadow: '0 20px 60px rgba(139, 90, 43, 0.25)',
              fontFamily: "'M PLUS Rounded 1c', sans-serif",
            }}
          >
            {/* ヘッダー */}
            <div
              className="flex items-center justify-between px-4 py-3 border-b"
              style={{ borderColor: '#D4C4B0' }}
            >
              <button onClick={handleClose} className="text-xl" style={{ color: '#A67C52' }}>
                ✕
              </button>
              <h2 className="font-bold" style={{ color: '#8B5A2B' }}>
                こうかんにさそう
              </h2>
              <div className="w-6" />
            </div>

            {/* タブ */}
            <div
              className="flex gap-1 mx-4 mt-3 p-1 rounded-xl"
              style={{ background: 'rgba(212, 196, 176, 0.3)' }}
            >
              {[
                { id: 'following' as const, label: 'フォロー中' },
                { id: 'code' as const, label: 'コードで' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className="flex-1 py-2 rounded-lg font-bold text-sm transition-all"
                  style={{
                    background: activeTab === tab.id ? 'white' : 'transparent',
                    color: activeTab === tab.id ? '#8B5A2B' : '#A67C52',
                    boxShadow: activeTab === tab.id ? '0 2px 8px rgba(184, 149, 107, 0.2)' : 'none',
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* コンテンツ */}
            <div className="flex-1 overflow-y-auto p-4">
              {activeTab === 'following' ? (
                // フォロー中リスト
                isLoading ? (
                  <div className="flex justify-center py-8">
                    <div
                      className="w-8 h-8 border-4 border-t-transparent rounded-full animate-spin"
                      style={{ borderColor: '#C4956A', borderTopColor: 'transparent' }}
                    />
                  </div>
                ) : followingUsers.length > 0 ? (
                  <div className="space-y-2">
                    {followingUsers.map((user) => (
                      <UserCard
                        key={user.id}
                        user={user}
                        onInvite={() => handleInvite(user.id)}
                        isInviting={invitingUserId === user.id}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-2">👀</div>
                    <p className="text-sm" style={{ color: '#A67C52' }}>
                      フォロー中のユーザーがいません
                    </p>
                    <p className="text-xs mt-1" style={{ color: '#C4A484' }}>
                      「コードで」タブから検索できます
                    </p>
                  </div>
                )
              ) : (
                // コード検索
                <div>
                  {/* コード入力 */}
                  <div className="flex justify-center gap-2 mb-4">
                    {[0, 1, 2, 3, 4, 5].map((i) => (
                      <CodeDigit key={i} value={searchCode[i] || ''} filled={!!searchCode[i]} />
                    ))}
                  </div>

                  {/* ローディング/エラー */}
                  {isSearching && (
                    <div className="text-center py-4">
                      <div
                        className="w-6 h-6 border-3 border-t-transparent rounded-full animate-spin mx-auto mb-2"
                        style={{ borderColor: '#C4956A', borderTopColor: 'transparent' }}
                      />
                      <p className="text-sm" style={{ color: '#A67C52' }}>
                        さがしてるよ...
                      </p>
                    </div>
                  )}

                  {searchError && !isSearching && (
                    <div
                      className="text-center py-3 px-4 rounded-xl mb-4"
                      style={{ background: 'rgba(231, 76, 60, 0.1)' }}
                    >
                      <p className="text-sm" style={{ color: '#E74C3C' }}>
                        😢 {searchError}
                      </p>
                    </div>
                  )}

                  {/* 検索結果 */}
                  {searchResult && !isSearching && (
                    <div
                      className="p-4 rounded-xl mb-4"
                      style={{ background: 'white', border: '2px solid #D4C4B0' }}
                    >
                      <div className="text-center text-sm font-bold mb-3" style={{ color: '#4CAF50' }}>
                        ✨ みつけたよ！ ✨
                      </div>

                      <div className="flex items-center gap-3 mb-3">
                        <div
                          className="w-14 h-14 rounded-full flex items-center justify-center overflow-hidden"
                          style={{ background: 'linear-gradient(135deg, #E8D5C4 0%, #D4C4B0 100%)' }}
                        >
                          {searchResult.avatarUrl ? (
                            <img
                              src={searchResult.avatarUrl}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <UserIcon size={28} color="#8B5A2B" />
                          )}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold" style={{ color: '#8B5A2B' }}>
                            {searchResult.name}
                          </h4>
                          <p className="text-xs" style={{ color: '#A67C52' }}>
                            Lv.{searchResult.level}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => handleInvite(searchResult.id)}
                        disabled={invitingUserId === searchResult.id}
                        className="w-full py-2.5 rounded-xl font-bold text-white transition-all active:scale-95 disabled:opacity-50"
                        style={{
                          background: 'linear-gradient(135deg, #C4956A 0%, #B8956B 100%)',
                          boxShadow: '0 2px 8px rgba(184, 149, 107, 0.4)',
                        }}
                      >
                        {invitingUserId === searchResult.id ? '...' : 'こうかんにさそう！'}
                      </button>
                    </div>
                  )}

                  {/* テンキー */}
                  {!searchResult && !isSearching && (
                    <div
                      className="grid gap-2 p-3 rounded-xl"
                      style={{
                        gridTemplateColumns: 'repeat(3, 1fr)',
                        justifyItems: 'center',
                        background: 'rgba(212, 196, 176, 0.2)',
                      }}
                    >
                      {numbers.map((num) => (
                        <NumberButton
                          key={num}
                          num={num}
                          onClick={() => {
                            if (num === '⌫') handleBackspace()
                            else handleNumberClick(num)
                          }}
                          disabled={num !== '⌫' && searchCode.length >= 6}
                        />
                      ))}
                    </div>
                  )}

                  {/* リセットボタン */}
                  {searchResult && !isSearching && (
                    <button
                      onClick={() => {
                        setSearchCode('')
                        setSearchResult(null)
                        setSearchError(null)
                      }}
                      className="w-full py-2 rounded-xl text-sm font-medium"
                      style={{ background: 'rgba(212, 196, 176, 0.3)', color: '#8B5A2B' }}
                    >
                      🔄 べつの人をさがす
                    </button>
                  )}

                  {/* ヒント */}
                  <p className="text-center text-xs mt-4" style={{ color: '#A67C52' }}>
                    💡 コードはプロフィールでかくにんできるよ
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default AsyncTradeInviteModal
