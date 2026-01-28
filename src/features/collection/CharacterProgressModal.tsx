'use client'

import React from 'react'
import { CharacterProgressView } from './CharacterProgressView'

interface CharacterProgressModalProps {
  isOpen: boolean
  onClose: () => void
}

export const CharacterProgressModal: React.FC<CharacterProgressModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 100,
        display: 'flex',
        flexDirection: 'column',
        fontFamily: "'M PLUS Rounded 1c', sans-serif",
      }}
    >
      {/* 背景オーバーレイ */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          backdropFilter: 'blur(4px)',
        }}
        onClick={onClose}
      />

      {/* モーダル本体 */}
      <div
        style={{
          position: 'relative',
          marginTop: 'auto',
          background: 'linear-gradient(to bottom, #FAF5FF, #FFFFFF)',
          borderTopLeftRadius: '24px',
          borderTopRightRadius: '24px',
          maxHeight: '85vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.15)',
        }}
      >
        {/* ヘッダー */}
        <div
          style={{
            padding: '16px 20px',
            borderBottom: '1px solid rgba(139, 92, 246, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'linear-gradient(to right, #FAF5FF, #FCE7F3)',
            borderTopLeftRadius: '24px',
            borderTopRightRadius: '24px',
          }}
        >
          <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#7C3AED' }}>
            🏆 キャラクター報酬
          </h3>
          <button
            onClick={onClose}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: 'rgba(0, 0, 0, 0.1)',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#6B7280',
              fontSize: '16px',
            }}
          >
            ✕
          </button>
        </div>

        {/* コンテンツ */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '16px',
            paddingBottom: '100px',
          }}
        >
          <CharacterProgressView />
        </div>
      </div>
    </div>
  )
}

export default CharacterProgressModal
