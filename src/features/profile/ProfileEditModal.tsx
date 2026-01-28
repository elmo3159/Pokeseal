'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { UserProfile } from './ProfileView'
import { ALL_STICKERS, StickerMaster } from '@/data/stickerMasterData'
import { characterRewardService, type UnlockedFrame } from '@/services/characterRewards'
import {
  CHARACTER_THEME_COLORS,
  FRAME_METADATA,
  getFrameId,
  getFrameImagePath,
  type CharacterName,
} from '@/constants/characterRewards'
import { useAuth } from '@/hooks'
import { Avatar } from '@/components/ui/Avatar'

// キャラクター情報を取得（各キャラクターの代表シール）
interface CharacterAvatar {
  id: string
  name: string
  imageUrl: string
  rarity: 1 | 2 | 3 | 4 | 5
}

function getCharacterAvatars(): CharacterAvatar[] {
  // 各キャラクターの1番目のシールを取得
  const charactersMap = new Map<string, CharacterAvatar>()

  for (const sticker of ALL_STICKERS) {
    if (!charactersMap.has(sticker.character)) {
      charactersMap.set(sticker.character, {
        id: sticker.id,
        name: sticker.character,
        imageUrl: sticker.imageUrl,
        rarity: sticker.rarity,
      })
    }
  }

  // レアリティでソート（高い順）
  return Array.from(charactersMap.values()).sort((a, b) => b.rarity - a.rarity)
}

// 全シールを取得（キャラクターごとにグループ化）
function getAllStickersByCharacter(): Map<string, StickerMaster[]> {
  const grouped = new Map<string, StickerMaster[]>()

  for (const sticker of ALL_STICKERS) {
    const existing = grouped.get(sticker.character)
    if (existing) {
      existing.push(sticker)
    } else {
      grouped.set(sticker.character, [sticker])
    }
  }

  return grouped
}

interface ProfileEditModalProps {
  isOpen: boolean
  onClose: () => void
  profile: UserProfile
  onSave: (updates: { name: string; bio: string; avatarUrl?: string; frameId?: string | null }) => void
}

export const ProfileEditModal: React.FC<ProfileEditModalProps> = ({
  isOpen,
  onClose,
  profile,
  onSave,
}) => {
  const { user } = useAuth()
  const [name, setName] = useState(profile.name)
  const [bio, setBio] = useState(profile.bio || '')
  const [selectedAvatarUrl, setSelectedAvatarUrl] = useState<string | undefined>(profile.avatarUrl)
  const [selectedFrameId, setSelectedFrameId] = useState<string | null>(profile.frameId || null)
  const [nameError, setNameError] = useState('')
  const [showStickerPicker, setShowStickerPicker] = useState(false)
  const [showFramePicker, setShowFramePicker] = useState(false)
  const [selectedCharacter, setSelectedCharacter] = useState<string | null>(null)
  const [unlockedFrames, setUnlockedFrames] = useState<UnlockedFrame[]>([])

  const characterAvatars = getCharacterAvatars()
  const stickersByCharacter = getAllStickersByCharacter()

  // 解放済みフレームを取得
  // TODO: テスト用に全フレームを表示（本番では characterRewardService.getUnlockedFrames を使用）
  const loadUnlockedFrames = useCallback(async () => {
    if (!user) return
    try {
      // テスト用: FRAME_METADATA に登録されている全フレームを表示
      const testFrames: UnlockedFrame[] = Object.entries(FRAME_METADATA).map(([charName, _metadata]) => ({
        frameId: getFrameId(charName as CharacterName),
        characterName: charName as CharacterName,
        frameImageUrl: getFrameImagePath(charName as CharacterName) || '',
        unlockedAt: new Date().toISOString(),
      }))
      // フレームなしオプションも追加
      setUnlockedFrames(testFrames)

      // 本番用コード（コメントアウト）:
      // const frames = await characterRewardService.getUnlockedFrames(user.id)
      // setUnlockedFrames(frames)
    } catch (error) {
      console.error('Failed to load frames:', error)
    }
  }, [user])

  // プロフィールが変わったらリセット
  useEffect(() => {
    setName(profile.name)
    setBio(profile.bio || '')
    setSelectedAvatarUrl(profile.avatarUrl)
    setSelectedFrameId(profile.frameId || null)
    setNameError('')
    setShowStickerPicker(false)
    setShowFramePicker(false)
    setSelectedCharacter(null)
  }, [profile, isOpen])

  // モーダル開時にフレーム読み込み
  useEffect(() => {
    if (isOpen) {
      loadUnlockedFrames()
    }
  }, [isOpen, loadUnlockedFrames])

  const handleSave = () => {
    // バリデーション
    if (!name.trim()) {
      setNameError('なまえを入れてね')
      return
    }
    if (name.length > 12) {
      setNameError('12もじまでだよ')
      return
    }

    onSave({
      name: name.trim(),
      bio: bio.trim(),
      avatarUrl: selectedAvatarUrl,
      frameId: selectedFrameId,
    })
    onClose()
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
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
            padding: '16px',
            backgroundColor: 'rgba(0,0,0,0.5)',
            fontFamily: "'M PLUS Rounded 1c', sans-serif",
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose()
          }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            style={{
              width: '100%',
              maxWidth: '448px',
              maxHeight: '90vh',
              background: 'white',
              borderRadius: '24px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              fontFamily: "'M PLUS Rounded 1c', sans-serif",
            }}
          >
            {/* ヘッダー */}
            <div
              style={{
                paddingLeft: '24px',
                paddingRight: '24px',
                paddingTop: '16px',
                paddingBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundImage: 'url(/images/Header_UI.png)',
                backgroundSize: '100% 100%',
                backgroundPosition: 'center top',
                backgroundRepeat: 'no-repeat',
                flexShrink: 0,
              }}
            >
              <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: 'white', textShadow: '0 1px 3px rgba(157, 76, 108, 0.6), 0 0 8px rgba(255, 255, 255, 0.3)' }}>
                {showStickerPicker ? 'アイコンをえらぼう' : 'プロフィールへんしゅう'}
              </h2>
              <button
                onClick={() => {
                  if (showStickerPicker) {
                    setShowStickerPicker(false)
                    setSelectedCharacter(null)
                  } else {
                    onClose()
                  }
                }}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.8)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#9D4C6C',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                }}
              >
                {showStickerPicker ? '←' : '✕'}
              </button>
            </div>

            {/* コンテンツ */}
            <div style={{ flex: 1, overflowY: 'auto' }}>
              {showStickerPicker ? (
                // シール選択画面
                <div style={{ padding: '16px' }}>
                  {selectedCharacter ? (
                    // 特定キャラクターのシール一覧
                    <>
                      <button
                        onClick={() => setSelectedCharacter(null)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          marginBottom: '16px',
                          padding: '8px 16px',
                          borderRadius: '9999px',
                          background: '#F3E8FF',
                          border: 'none',
                          cursor: 'pointer',
                          color: '#7C3AED',
                          fontWeight: 'bold',
                          fontSize: '14px',
                        }}
                      >
                        ← {selectedCharacter}のシール
                      </button>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
                        {stickersByCharacter.get(selectedCharacter)?.map((sticker) => (
                          <button
                            key={sticker.id}
                            onClick={() => {
                              setSelectedAvatarUrl(sticker.imageUrl)
                              setShowStickerPicker(false)
                              setSelectedCharacter(null)
                            }}
                            style={{
                              aspectRatio: '1/1',
                              borderRadius: '16px',
                              overflow: 'hidden',
                              padding: '4px',
                              transition: 'all 0.2s',
                              background: selectedAvatarUrl === sticker.imageUrl ? '#FCE7F3' : '#F9FAFB',
                              border: selectedAvatarUrl === sticker.imageUrl ? '3px solid #F9A8D4' : '2px solid #E5E7EB',
                              cursor: 'pointer',
                            }}
                          >
                            <img
                              src={sticker.imageUrl}
                              alt={sticker.name}
                              style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'contain',
                              }}
                            />
                          </button>
                        ))}
                      </div>
                    </>
                  ) : (
                    // キャラクター一覧
                    <>
                      <p style={{ marginBottom: '16px', fontSize: '14px', color: '#6B7280', textAlign: 'center' }}>
                        すきなキャラクターをえらんでね ✨
                      </p>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                        {characterAvatars.map((char) => (
                          <button
                            key={char.id}
                            onClick={() => setSelectedCharacter(char.name)}
                            style={{
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              gap: '8px',
                              padding: '12px',
                              borderRadius: '16px',
                              background: '#FAFAFA',
                              border: '2px solid #E5E7EB',
                              cursor: 'pointer',
                              transition: 'all 0.2s',
                            }}
                          >
                            <div
                              style={{
                                width: '64px',
                                height: '64px',
                                borderRadius: '12px',
                                overflow: 'hidden',
                                background: 'white',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                              }}
                            >
                              <img
                                src={char.imageUrl}
                                alt={char.name}
                                style={{
                                  width: '100%',
                                  height: '100%',
                                  objectFit: 'contain',
                                }}
                              />
                            </div>
                            <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#4A2068' }}>
                              {char.name}
                            </span>
                            <span style={{ fontSize: '10px', color: '#EAB308' }}>
                              {'★'.repeat(char.rarity)}
                            </span>
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              ) : (
                // メイン編集画面
                <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {/* アバター選択 */}
                  <div>
                    <label
                      style={{
                        display: 'block',
                        fontSize: '14px',
                        fontWeight: 'bold',
                        marginBottom: '12px',
                        color: '#6B3FA0',
                      }}
                    >
                      🎨 アイコンをえらぼう
                    </label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      {/* 現在のアバター */}
                      <div
                        style={{
                          width: '80px',
                          height: '80px',
                          borderRadius: '50%',
                          overflow: 'hidden',
                          background: 'linear-gradient(135deg, #E9D5FF 0%, #FBCFE8 100%)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: '0 4px 12px rgba(167, 139, 250, 0.3)',
                          border: '3px solid white',
                        }}
                      >
                        {selectedAvatarUrl ? (
                          <img
                            src={selectedAvatarUrl}
                            alt="アバター"
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'contain',
                              padding: '4px',
                            }}
                          />
                        ) : (
                          <span style={{ fontSize: '40px', color: '#C084FC' }}>👤</span>
                        )}
                      </div>
                      {/* 変更ボタン */}
                      <button
                        onClick={() => setShowStickerPicker(true)}
                        style={{
                          flex: 1,
                          padding: '12px 16px',
                          borderRadius: '12px',
                          background: 'linear-gradient(135deg, #A78BFA 0%, #EC4899 100%)',
                          color: 'white',
                          fontWeight: 'bold',
                          fontSize: '14px',
                          border: 'none',
                          cursor: 'pointer',
                          boxShadow: '0 4px 12px rgba(167, 139, 250, 0.3)',
                        }}
                      >
                        🌟 シールからえらぶ
                      </button>
                    </div>
                  </div>

                  {/* フレーム選択 */}
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                      <label
                        style={{
                          fontSize: '14px',
                          fontWeight: 'bold',
                          color: '#6B3FA0',
                        }}
                      >
                        ✨ アイコンフレーム
                      </label>
                      <button
                        onClick={() => setShowFramePicker(!showFramePicker)}
                        style={{
                          padding: '6px 12px',
                          borderRadius: '9999px',
                          background: showFramePicker ? '#FCE7F3' : 'linear-gradient(135deg, #A78BFA 0%, #EC4899 100%)',
                          color: showFramePicker ? '#9D4C6C' : 'white',
                          fontWeight: 'bold',
                          fontSize: '12px',
                          border: 'none',
                          cursor: 'pointer',
                          boxShadow: showFramePicker ? 'none' : '0 2px 8px rgba(167, 139, 250, 0.3)',
                        }}
                      >
                        {showFramePicker ? 'とじる ▲' : 'えらぶ ▼'}
                      </button>
                    </div>

                    {/* 現在選択中のフレーム表示 */}
                    {!showFramePicker && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '8px', background: '#FAFAFA', borderRadius: '12px' }}>
                        {selectedFrameId ? (
                          <>
                            <div style={{ width: '48px', height: '48px', flexShrink: 0 }}>
                              <img
                                src={unlockedFrames.find(f => f.frameId === selectedFrameId)?.frameImageUrl || ''}
                                alt=""
                                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                              />
                            </div>
                            <span style={{ fontSize: '14px', color: '#6B3FA0', fontWeight: 'bold' }}>
                              {unlockedFrames.find(f => f.frameId === selectedFrameId)?.characterName || 'フレーム'}
                            </span>
                          </>
                        ) : (
                          <span style={{ fontSize: '14px', color: '#9CA3AF' }}>フレームなし</span>
                        )}
                      </div>
                    )}

                    {/* フレーム一覧（展開時） */}
                    {showFramePicker && (
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(4, 1fr)',
                        gap: '8px',
                        padding: '12px',
                        background: '#FAFAFA',
                        borderRadius: '12px',
                        maxHeight: '320px',
                        overflowY: 'auto',
                      }}>
                        {/* フレームなし */}
                        <button
                          onClick={() => setSelectedFrameId(null)}
                          style={{
                            height: '90px',
                            borderRadius: '12px',
                            background: selectedFrameId === null ? '#FCE7F3' : '#F3F4F6',
                            border: selectedFrameId === null ? '3px solid #F9A8D4' : '2px solid #E5E7EB',
                            boxShadow: selectedFrameId === null ? '0 0 12px rgba(249, 168, 212, 0.6)' : 'none',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            padding: '4px',
                          }}
                        >
                          <span style={{ fontSize: '12px', color: '#6B7280', fontWeight: 'bold' }}>なし</span>
                        </button>

                        {/* 解放済みフレーム */}
                        {unlockedFrames.map((frame) => {
                          const isSelected = selectedFrameId === frame.frameId
                          return (
                            <button
                              key={frame.frameId}
                              onClick={() => setSelectedFrameId(frame.frameId)}
                              style={{
                                height: '90px',
                                padding: '6px 4px 4px',
                                borderRadius: '12px',
                                background: isSelected ? '#FCE7F3' : '#FFFFFF',
                                border: isSelected ? '3px solid #F9A8D4' : '2px solid #E5E7EB',
                                boxShadow: isSelected
                                  ? '0 0 12px rgba(249, 168, 212, 0.6)'
                                  : '0 1px 3px rgba(0,0,0,0.05)',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'flex-start',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                overflow: 'hidden',
                              }}
                              title={frame.characterName}
                            >
                              {/* フレーム画像プレビュー */}
                              <img
                                src={frame.frameImageUrl}
                                alt={frame.characterName}
                                style={{
                                  width: '56px',
                                  height: '56px',
                                  objectFit: 'contain',
                                  flexShrink: 0,
                                }}
                              />
                              {/* キャラ名 */}
                              <span style={{
                                fontSize: '9px',
                                color: isSelected ? '#9D4C6C' : '#6B7280',
                                fontWeight: isSelected ? 'bold' : 'normal',
                                marginTop: '4px',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                width: '100%',
                                textAlign: 'center',
                                padding: '0 2px',
                                lineHeight: '1.2',
                              }}>
                                {frame.characterName}
                              </span>
                            </button>
                          )
                        })}

                        {unlockedFrames.length === 0 && (
                          <div style={{ gridColumn: 'span 4', textAlign: 'center', padding: '16px' }}>
                            <span style={{ fontSize: '12px', color: '#9CA3AF' }}>
                              キャラクター報酬で解放できるよ！
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* 名前入力 */}
                  <div>
                    <label
                      style={{
                        display: 'block',
                        fontSize: '14px',
                        fontWeight: 'bold',
                        marginBottom: '8px',
                        color: '#6B3FA0',
                      }}
                    >
                      ✏️ なまえ（12もじまで）
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value)
                        setNameError('')
                      }}
                      maxLength={12}
                      placeholder="なまえを入れてね"
                      style={{
                        width: '100%',
                        paddingLeft: '16px',
                        paddingRight: '16px',
                        paddingTop: '12px',
                        paddingBottom: '12px',
                        borderRadius: '12px',
                        border: nameError ? '2px solid #F87171' : '2px solid #E9D5FF',
                        fontSize: '18px',
                        background: nameError ? '#FEF2F2' : 'rgba(243, 232, 255, 0.5)',
                        color: '#4A2068',
                        outline: 'none',
                        boxSizing: 'border-box',
                      }}
                    />
                    {nameError && (
                      <p style={{ marginTop: '4px', fontSize: '14px', color: '#EF4444' }}>{nameError}</p>
                    )}
                    <p style={{ marginTop: '4px', fontSize: '12px', color: '#9CA3AF', textAlign: 'right' }}>
                      {name.length}/12
                    </p>
                  </div>

                  {/* 自己紹介入力 */}
                  <div>
                    <label
                      style={{
                        display: 'block',
                        fontSize: '14px',
                        fontWeight: 'bold',
                        marginBottom: '8px',
                        color: '#6B3FA0',
                      }}
                    >
                      💬 じこしょうかい（50もじまで）
                    </label>
                    <textarea
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      maxLength={50}
                      placeholder="すきなことを書いてね！"
                      rows={3}
                      style={{
                        width: '100%',
                        paddingLeft: '16px',
                        paddingRight: '16px',
                        paddingTop: '12px',
                        paddingBottom: '12px',
                        borderRadius: '12px',
                        border: '2px solid #E9D5FF',
                        fontSize: '16px',
                        resize: 'none',
                        background: 'rgba(243, 232, 255, 0.5)',
                        color: '#4A2068',
                        outline: 'none',
                        boxSizing: 'border-box',
                      }}
                    />
                    <p style={{ marginTop: '4px', fontSize: '12px', color: '#9CA3AF', textAlign: 'right' }}>
                      {bio.length}/50
                    </p>
                  </div>

                  {/* プレビュー */}
                  <div
                    style={{
                      padding: '16px',
                      borderRadius: '16px',
                      background: 'linear-gradient(135deg, #FCE7F3 0%, #FDF2F8 100%)',
                    }}
                  >
                    <p style={{ fontSize: '12px', fontWeight: 'bold', color: '#A78BFA', marginBottom: '8px' }}>👀 プレビュー</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ flexShrink: 0 }}>
                        <Avatar
                          src={selectedAvatarUrl}
                          alt="プレビュー"
                          size="md"
                          frameId={selectedFrameId}
                        />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontWeight: 'bold', fontSize: '18px', color: '#4A2068' }}>
                          {name || 'なまえ'}
                        </p>
                        <p style={{ fontSize: '14px', color: '#7A5090', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {bio || 'じこしょうかいがここに出るよ'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* フッターボタン */}
            {!showStickerPicker && (
              <div style={{ padding: '16px 24px 24px', display: 'flex', gap: '12px', flexShrink: 0 }}>
                <button
                  onClick={onClose}
                  style={{
                    flex: 1,
                    paddingTop: '12px',
                    paddingBottom: '12px',
                    borderRadius: '9999px',
                    fontWeight: 'bold',
                    fontSize: '18px',
                    background: '#E5E7EB',
                    color: '#4B5563',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  やめる
                </button>
                <button
                  onClick={handleSave}
                  style={{
                    flex: 1,
                    paddingTop: '12px',
                    paddingBottom: '12px',
                    borderRadius: '9999px',
                    fontWeight: 'bold',
                    fontSize: '18px',
                    color: 'white',
                    background: 'linear-gradient(135deg, #A78BFA 0%, #EC4899 100%)',
                    boxShadow: '0 4px 12px rgba(167, 139, 250, 0.4)',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  ほぞんする
                </button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default ProfileEditModal
