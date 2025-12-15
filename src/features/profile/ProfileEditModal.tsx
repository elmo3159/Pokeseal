'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { UserProfile } from './ProfileView'
import { ALL_STICKERS, StickerMaster } from '@/data/stickerMasterData'

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
    if (!grouped.has(sticker.character)) {
      grouped.set(sticker.character, [])
    }
    grouped.get(sticker.character)!.push(sticker)
  }

  return grouped
}

interface ProfileEditModalProps {
  isOpen: boolean
  onClose: () => void
  profile: UserProfile
  onSave: (updates: { name: string; bio: string; avatarUrl?: string }) => void
}

export const ProfileEditModal: React.FC<ProfileEditModalProps> = ({
  isOpen,
  onClose,
  profile,
  onSave,
}) => {
  const [name, setName] = useState(profile.name)
  const [bio, setBio] = useState(profile.bio || '')
  const [selectedAvatarUrl, setSelectedAvatarUrl] = useState<string | undefined>(profile.avatarUrl)
  const [nameError, setNameError] = useState('')
  const [showStickerPicker, setShowStickerPicker] = useState(false)
  const [selectedCharacter, setSelectedCharacter] = useState<string | null>(null)

  const characterAvatars = getCharacterAvatars()
  const stickersByCharacter = getAllStickersByCharacter()

  // プロフィールが変わったらリセット
  useEffect(() => {
    setName(profile.name)
    setBio(profile.bio || '')
    setSelectedAvatarUrl(profile.avatarUrl)
    setNameError('')
    setShowStickerPicker(false)
    setSelectedCharacter(null)
  }, [profile, isOpen])

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
                background: 'linear-gradient(135deg, #A78BFA 0%, #EC4899 100%)',
                flexShrink: 0,
              }}
            >
              <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: 'white' }}>
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
                  background: 'rgba(255, 255, 255, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  border: 'none',
                  cursor: 'pointer',
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
                              background: selectedAvatarUrl === sticker.imageUrl ? '#F3E8FF' : '#F9FAFB',
                              border: selectedAvatarUrl === sticker.imageUrl ? '3px solid #A78BFA' : '2px solid #E5E7EB',
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
                      background: 'linear-gradient(135deg, #FEF3C7 0%, #FCE7F3 100%)',
                    }}
                  >
                    <p style={{ fontSize: '12px', fontWeight: 'bold', color: '#A78BFA', marginBottom: '8px' }}>👀 プレビュー</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div
                        style={{
                          width: '56px',
                          height: '56px',
                          borderRadius: '50%',
                          overflow: 'hidden',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          background: 'linear-gradient(135deg, #E9D5FF 0%, #FBCFE8 100%)',
                          flexShrink: 0,
                        }}
                      >
                        {selectedAvatarUrl ? (
                          <img
                            src={selectedAvatarUrl}
                            alt="プレビュー"
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'contain',
                              padding: '4px',
                            }}
                          />
                        ) : (
                          <span style={{ fontSize: '30px', color: '#C084FC' }}>👤</span>
                        )}
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
