'use client'

import React, { useState, useRef, useEffect } from 'react'

interface SafetyMenuProps {
  userName: string
  isBlocked: boolean
  onReport: () => void
  onBlock: () => void
}

export const SafetyMenu: React.FC<SafetyMenuProps> = ({
  userName: _userName,
  isBlocked,
  onReport,
  onBlock
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // 外側クリックで閉じる
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  return (
    <div className="relative" ref={menuRef}>
      {/* メニューボタン */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
        aria-label="メニュー"
      >
        <span className="text-gray-500">⋯</span>
      </button>

      {/* ドロップダウンメニュー */}
      {isOpen && (
        <div className="absolute right-0 top-10 z-[2000] bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden min-w-[160px] animate-[scaleIn_0.1s_ease-out]">
          <div className="py-1">
            {/* 通報ボタン */}
            <button
              onClick={() => {
                setIsOpen(false)
                onReport()
              }}
              className="w-full px-4 py-3 text-left flex items-center gap-3 hover:bg-gray-50 transition-colors"
            >
              <span className="text-lg">⚠️</span>
              <span className="text-sm font-medium text-gray-700">つうほうする</span>
            </button>

            {/* ブロックボタン */}
            <button
              onClick={() => {
                setIsOpen(false)
                onBlock()
              }}
              className="w-full px-4 py-3 text-left flex items-center gap-3 hover:bg-gray-50 transition-colors"
            >
              <span className="text-lg">🚫</span>
              <span className="text-sm font-medium text-gray-700">
                {isBlocked ? 'ブロック中' : 'ブロックする'}
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default SafetyMenu
