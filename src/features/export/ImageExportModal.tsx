'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useImageExport, AspectRatio, ExportResult } from './useImageExport'
import { BookPage, PlacedSticker } from '@/domain/stickerBook'
import { StickerBookTheme, getDefaultThemeId, getThemeById } from '@/domain/theme'

interface ImageExportModalProps {
  isOpen: boolean
  page: BookPage | null
  pageNumber: number
  theme?: StickerBookTheme
  onClose: () => void
}

// シール帳ページのプレビュー用コンポーネント
const PagePreviewContent: React.FC<{
  page: BookPage
  theme?: StickerBookTheme
}> = ({ page, theme }) => {
  const defaultTheme = getThemeById(getDefaultThemeId())
  const activeTheme = theme || defaultTheme

  const pageStyle: React.CSSProperties = {
    backgroundColor: activeTheme?.page.backgroundColor || '#FFF5F8',
    position: 'relative',
    width: '100%',
    height: '100%'
  }

  // パターン背景
  const getPatternStyle = (): React.CSSProperties => {
    if (!activeTheme?.page.pattern || activeTheme.page.pattern === 'plain') {
      return {}
    }

    const patternColor = activeTheme.page.patternColor || '#ccc'
    const opacity = activeTheme.page.patternOpacity || 0.15

    switch (activeTheme.page.pattern) {
      case 'dots':
        return {
          backgroundImage: `radial-gradient(${patternColor} 2px, transparent 2px)`,
          backgroundSize: '20px 20px',
          opacity
        }
      case 'grid':
        return {
          backgroundImage: `linear-gradient(${patternColor} 1px, transparent 1px), linear-gradient(90deg, ${patternColor} 1px, transparent 1px)`,
          backgroundSize: '20px 20px',
          opacity
        }
      case 'hearts':
        return {
          background: `repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,182,193,${opacity}) 10px, rgba(255,182,193,${opacity}) 12px)`,
        }
      case 'stars':
        return {
          backgroundImage: `radial-gradient(${patternColor} 1px, transparent 1px), radial-gradient(${patternColor} 1px, transparent 1px)`,
          backgroundSize: '30px 30px, 20px 20px',
          backgroundPosition: '0 0, 15px 15px',
          opacity
        }
      default:
        return {}
    }
  }

  return (
    <div style={pageStyle}>
      {/* パターンオーバーレイ */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={getPatternStyle()}
      />

      {/* 配置されたシール */}
      {page.stickers.map((sticker: PlacedSticker, index: number) => (
        <div
          key={sticker.id || index}
          className="absolute"
          style={{
            left: `${sticker.position.x * 100}%`,
            top: `${sticker.position.y * 100}%`,
            transform: `translate(-50%, -50%) rotate(${sticker.rotation}deg) scale(${sticker.scale})`,
            width: '80px',
            height: '80px'
          }}
        >
          <div className="w-full h-full bg-gradient-to-br from-pink-200 to-purple-200 rounded-lg flex items-center justify-center text-3xl shadow-md">
            {sticker.stickerId.includes('pikachu') ? '⚡' :
             sticker.stickerId.includes('star') ? '⭐' :
             sticker.stickerId.includes('heart') ? '❤️' :
             sticker.stickerId.includes('flower') ? '🌸' :
             sticker.stickerId.includes('rainbow') ? '🌈' : '✨'}
          </div>
        </div>
      ))}

      {/* ページが空の場合 */}
      {page.stickers.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center text-purple-300">
          <div className="text-center">
            <span className="text-5xl">📖</span>
            <p className="text-sm mt-2">シールをはってね</p>
          </div>
        </div>
      )}
    </div>
  )
}

export const ImageExportModal: React.FC<ImageExportModalProps> = ({
  isOpen,
  page,
  pageNumber,
  theme,
  onClose
}) => {
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('1:1')
  const [includeWatermark, setIncludeWatermark] = useState(true)
  const [exportResult, setExportResult] = useState<ExportResult | null>(null)
  const [showSuccess, setShowSuccess] = useState(false)
  const previewRef = useRef<HTMLDivElement>(null)

  const { isExporting, progress, error, captureElement, downloadImage, shareImage } = useImageExport()

  // モーダルが閉じたらリセット
  useEffect(() => {
    if (!isOpen) {
      setExportResult(null)
      setShowSuccess(false)
    }
  }, [isOpen])

  if (!isOpen || !page) return null

  const handleExport = async () => {
    if (!previewRef.current) return

    const result = await captureElement(previewRef.current, {
      aspectRatio,
      quality: 0.95,
      includeWatermark
    })

    if (result) {
      setExportResult(result)
    }
  }

  const handleDownload = () => {
    if (exportResult) {
      const timestamp = new Date().toISOString().slice(0, 10)
      downloadImage(exportResult.dataUrl, `pokeseal_page${pageNumber}_${timestamp}.png`)
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 2000)
    }
  }

  const handleShare = async () => {
    if (exportResult) {
      const shared = await shareImage(exportResult.blob, `pokeseal_page${pageNumber}`)
      if (shared) {
        setShowSuccess(true)
        setTimeout(() => setShowSuccess(false), 2000)
      } else {
        // シェアできなかった場合はダウンロードにフォールバック
        handleDownload()
      }
    }
  }

  const handleReset = () => {
    setExportResult(null)
  }

  // プレビューのサイズ計算
  const getPreviewSize = () => {
    const maxWidth = 280
    if (aspectRatio === '1:1') {
      return { width: maxWidth, height: maxWidth }
    } else {
      // 9:16
      return { width: maxWidth, height: maxWidth * (16 / 9) }
    }
  }

  const previewSize = getPreviewSize()

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* オーバーレイ */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* モーダル本体 */}
      <div className="relative bg-gradient-to-b from-purple-50 to-pink-50 w-full max-w-sm mx-4 rounded-3xl overflow-hidden animate-[scaleIn_0.2s_ease-out] max-h-[90vh] overflow-y-auto">
        {/* ヘッダー */}
        <div className="sticky top-0 z-10 bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-white font-bold text-lg">📸 がぞうにほぞん</h2>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/20 text-white flex items-center justify-center"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="p-4">
          {/* ステップ1: アスペクト比選択 */}
          {!exportResult && (
            <>
              <div className="mb-4">
                <h3 className="text-purple-700 font-bold text-sm mb-2">
                  📐 サイズをえらんでね
                </h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => setAspectRatio('1:1')}
                    className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold transition-all ${
                      aspectRatio === '1:1'
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                        : 'bg-white text-purple-600 border-2 border-purple-200'
                    }`}
                  >
                    <span className="text-xl block mb-1">⬜</span>
                    しかく (1:1)
                    <span className="text-xs block text-purple-300 mt-0.5">Instagram</span>
                  </button>
                  <button
                    onClick={() => setAspectRatio('9:16')}
                    className={`flex-1 py-3 px-4 rounded-xl text-sm font-bold transition-all ${
                      aspectRatio === '9:16'
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                        : 'bg-white text-purple-600 border-2 border-purple-200'
                    }`}
                  >
                    <span className="text-xl block mb-1">📱</span>
                    たてなが (9:16)
                    <span className="text-xs block text-purple-300 mt-0.5">ストーリーズ</span>
                  </button>
                </div>
              </div>

              {/* ウォーターマークオプション */}
              <div className="mb-4">
                <label className="flex items-center gap-3 bg-white rounded-xl p-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeWatermark}
                    onChange={(e) => setIncludeWatermark(e.target.checked)}
                    className="w-5 h-5 rounded accent-purple-500"
                  />
                  <div>
                    <span className="text-purple-700 font-bold text-sm">ロゴをいれる</span>
                    <span className="text-xs text-purple-400 block">「Made with ポケシル」</span>
                  </div>
                </label>
              </div>

              {/* プレビュー */}
              <div className="mb-4">
                <h3 className="text-purple-700 font-bold text-sm mb-2">
                  👀 プレビュー
                </h3>
                <div
                  className="mx-auto bg-white rounded-2xl shadow-lg overflow-hidden"
                  style={{ width: previewSize.width, height: Math.min(previewSize.height, 350) }}
                >
                  <div
                    ref={previewRef}
                    className="relative"
                    style={{ width: previewSize.width, height: previewSize.height }}
                  >
                    {/* フレーム */}
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-100 to-pink-100 p-4">
                      {/* シール帳風フレーム */}
                      <div className="absolute inset-3 rounded-xl overflow-hidden shadow-inner border-4 border-purple-200">
                        <PagePreviewContent page={page} theme={theme} />
                      </div>
                    </div>

                    {/* ウォーターマークプレビュー */}
                    {includeWatermark && (
                      <div className="absolute bottom-2 right-2 text-xs text-purple-400 font-bold">
                        Made with ポケシル 🩷
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* エラー表示 */}
              {error && (
                <div className="mb-4 p-3 bg-red-100 rounded-xl text-red-600 text-sm">
                  ⚠️ {error}
                </div>
              )}

              {/* エクスポートボタン */}
              <button
                onClick={handleExport}
                disabled={isExporting}
                className={`w-full py-4 rounded-2xl text-white font-bold text-lg transition-all ${
                  isExporting
                    ? 'bg-gray-400'
                    : 'bg-gradient-to-r from-purple-500 to-pink-500 active:scale-95'
                }`}
              >
                {isExporting ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>つくってるよ... {progress}%</span>
                  </div>
                ) : (
                  '📸 がぞうをつくる！'
                )}
              </button>
            </>
          )}

          {/* ステップ2: 結果表示 */}
          {exportResult && (
            <>
              <div className="mb-4 text-center">
                <div className="inline-block text-5xl mb-2 animate-bounce">🎉</div>
                <h3 className="text-purple-700 font-bold text-lg">できたよ！</h3>
              </div>

              {/* 生成された画像プレビュー */}
              <div className="mb-4 flex justify-center">
                <img
                  src={exportResult.dataUrl}
                  alt="エクスポート画像"
                  className="max-w-full max-h-64 rounded-xl shadow-lg object-contain"
                />
              </div>

              {/* 成功メッセージ */}
              {showSuccess && (
                <div className="mb-4 p-3 bg-green-100 rounded-xl text-green-600 text-sm text-center animate-pulse">
                  ✅ ほぞんしたよ！
                </div>
              )}

              {/* アクションボタン */}
              <div className="space-y-2">
                <button
                  onClick={handleShare}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold text-lg active:scale-95 transition-all"
                >
                  📤 シェアする
                </button>
                <button
                  onClick={handleDownload}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold text-lg active:scale-95 transition-all"
                >
                  💾 ほぞんする
                </button>
                <button
                  onClick={handleReset}
                  className="w-full py-3 rounded-xl bg-white text-purple-600 font-bold border-2 border-purple-200"
                >
                  ← サイズをかえる
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default ImageExportModal
