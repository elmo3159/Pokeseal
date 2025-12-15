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
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          pointerEvents: 'none',
          ...getPatternStyle(),
        }}
      />

      {/* 配置されたシール */}
      {page.stickers.map((sticker: PlacedSticker, index: number) => (
        <div
          key={sticker.id || index}
          style={{
            position: 'absolute',
            left: `${sticker.position.x * 100}%`,
            top: `${sticker.position.y * 100}%`,
            transform: `translate(-50%, -50%) rotate(${sticker.rotation}deg) scale(${sticker.scale})`,
            width: '80px',
            height: '80px',
          }}
        >
          <div style={{
            width: '100%',
            height: '100%',
            background: 'linear-gradient(to bottom right, #FBCFE8, #E9D5FF)',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '30px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          }}>
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
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#D8B4FE',
        }}>
          <div style={{ textAlign: 'center' }}>
            <span style={{ fontSize: '60px' }}>📖</span>
            <p style={{ fontSize: '14px', marginTop: '8px' }}>シールをはってね</p>
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
    <div style={{
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
    }}>
      {/* オーバーレイ */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          backdropFilter: 'blur(4px)',
        }}
        onClick={onClose}
      />

      {/* モーダル本体 */}
      <div style={{
        position: 'relative',
        background: 'linear-gradient(to bottom, #FAF5FF, #FDF2F8)',
        width: '100%',
        maxWidth: '384px',
        marginLeft: '16px',
        marginRight: '16px',
        borderRadius: '24px',
        overflow: 'hidden',
        maxHeight: '90vh',
        overflowY: 'auto',
      }}>
        {/* ヘッダー */}
        <div style={{
          position: 'sticky',
          top: 0,
          zIndex: 10,
          background: 'linear-gradient(to right, #8B5CF6, #EC4899)',
          paddingLeft: '16px',
          paddingRight: '16px',
          paddingTop: '16px',
          paddingBottom: '16px',
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <h2 style={{ color: 'white', fontWeight: 'bold', fontSize: '18px' }}>📸 がぞうにほぞん</h2>
            <button
              onClick={onClose}
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.2)',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              ✕
            </button>
          </div>
        </div>

        <div style={{ padding: '16px' }}>
          {/* ステップ1: アスペクト比選択 */}
          {!exportResult && (
            <>
              <div style={{ marginBottom: '16px' }}>
                <h3 style={{ color: '#7C3AED', fontWeight: 'bold', fontSize: '14px', marginBottom: '8px' }}>
                  📐 サイズをえらんでね
                </h3>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => setAspectRatio('1:1')}
                    style={{
                      flex: 1,
                      paddingTop: '12px',
                      paddingBottom: '12px',
                      paddingLeft: '16px',
                      paddingRight: '16px',
                      borderRadius: '12px',
                      fontSize: '14px',
                      fontWeight: 'bold',
                      transition: 'all 0.2s',
                      background: aspectRatio === '1:1' ? 'linear-gradient(to right, #8B5CF6, #EC4899)' : 'white',
                      color: aspectRatio === '1:1' ? 'white' : '#7C3AED',
                      border: aspectRatio === '1:1' ? 'none' : '2px solid #E9D5FF',
                      cursor: 'pointer',
                    }}
                  >
                    <span style={{ fontSize: '24px', display: 'block', marginBottom: '4px' }}>⬜</span>
                    しかく (1:1)
                    <span style={{ fontSize: '12px', display: 'block', color: aspectRatio === '1:1' ? 'rgba(255,255,255,0.8)' : '#D8B4FE', marginTop: '2px' }}>Instagram</span>
                  </button>
                  <button
                    onClick={() => setAspectRatio('9:16')}
                    style={{
                      flex: 1,
                      paddingTop: '12px',
                      paddingBottom: '12px',
                      paddingLeft: '16px',
                      paddingRight: '16px',
                      borderRadius: '12px',
                      fontSize: '14px',
                      fontWeight: 'bold',
                      transition: 'all 0.2s',
                      background: aspectRatio === '9:16' ? 'linear-gradient(to right, #8B5CF6, #EC4899)' : 'white',
                      color: aspectRatio === '9:16' ? 'white' : '#7C3AED',
                      border: aspectRatio === '9:16' ? 'none' : '2px solid #E9D5FF',
                      cursor: 'pointer',
                    }}
                  >
                    <span style={{ fontSize: '24px', display: 'block', marginBottom: '4px' }}>📱</span>
                    たてなが (9:16)
                    <span style={{ fontSize: '12px', display: 'block', color: aspectRatio === '9:16' ? 'rgba(255,255,255,0.8)' : '#D8B4FE', marginTop: '2px' }}>ストーリーズ</span>
                  </button>
                </div>
              </div>

              {/* ウォーターマークオプション */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  background: 'white',
                  borderRadius: '12px',
                  padding: '12px',
                  cursor: 'pointer',
                }}>
                  <input
                    type="checkbox"
                    checked={includeWatermark}
                    onChange={(e) => setIncludeWatermark(e.target.checked)}
                    style={{ width: '20px', height: '20px', accentColor: '#8B5CF6' }}
                  />
                  <div>
                    <span style={{ color: '#7C3AED', fontWeight: 'bold', fontSize: '14px' }}>ロゴをいれる</span>
                    <span style={{ fontSize: '12px', color: '#A78BFA', display: 'block' }}>「Made with ポケシル」</span>
                  </div>
                </label>
              </div>

              {/* プレビュー */}
              <div style={{ marginBottom: '16px' }}>
                <h3 style={{ color: '#7C3AED', fontWeight: 'bold', fontSize: '14px', marginBottom: '8px' }}>
                  👀 プレビュー
                </h3>
                <div
                  style={{
                    marginLeft: 'auto',
                    marginRight: 'auto',
                    background: 'white',
                    borderRadius: '16px',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                    overflow: 'hidden',
                    width: previewSize.width,
                    height: Math.min(previewSize.height, 350),
                  }}
                >
                  <div
                    ref={previewRef}
                    style={{
                      position: 'relative',
                      width: previewSize.width,
                      height: previewSize.height,
                    }}
                  >
                    {/* フレーム */}
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: 'linear-gradient(to bottom right, #F3E8FF, #FCE7F3)',
                      padding: '16px',
                    }}>
                      {/* シール帳風フレーム */}
                      <div style={{
                        position: 'absolute',
                        top: '12px',
                        left: '12px',
                        right: '12px',
                        bottom: '12px',
                        borderRadius: '12px',
                        overflow: 'hidden',
                        boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)',
                        border: '4px solid #E9D5FF',
                      }}>
                        <PagePreviewContent page={page} theme={theme} />
                      </div>
                    </div>

                    {/* ウォーターマークプレビュー */}
                    {includeWatermark && (
                      <div style={{
                        position: 'absolute',
                        bottom: '8px',
                        right: '8px',
                        fontSize: '12px',
                        color: '#A78BFA',
                        fontWeight: 'bold',
                      }}>
                        Made with ポケシル 🩷
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* エラー表示 */}
              {error && (
                <div style={{
                  marginBottom: '16px',
                  padding: '12px',
                  background: '#FEE2E2',
                  borderRadius: '12px',
                  color: '#DC2626',
                  fontSize: '14px',
                }}>
                  ⚠️ {error}
                </div>
              )}

              {/* エクスポートボタン */}
              <button
                onClick={handleExport}
                disabled={isExporting}
                style={{
                  width: '100%',
                  paddingTop: '16px',
                  paddingBottom: '16px',
                  borderRadius: '16px',
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '18px',
                  transition: 'all 0.2s',
                  background: isExporting ? '#9CA3AF' : 'linear-gradient(to right, #8B5CF6, #EC4899)',
                  border: 'none',
                  cursor: isExporting ? 'not-allowed' : 'pointer',
                }}
              >
                {isExporting ? (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                    <div style={{
                      width: '20px',
                      height: '20px',
                      border: '2px solid white',
                      borderTopColor: 'transparent',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite',
                    }} />
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
              <div style={{ marginBottom: '16px', textAlign: 'center' }}>
                <div style={{ display: 'inline-block', fontSize: '60px', marginBottom: '8px' }}>🎉</div>
                <h3 style={{ color: '#7C3AED', fontWeight: 'bold', fontSize: '18px' }}>できたよ！</h3>
              </div>

              {/* 生成された画像プレビュー */}
              <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'center' }}>
                <img
                  src={exportResult.dataUrl}
                  alt="エクスポート画像"
                  style={{
                    maxWidth: '100%',
                    maxHeight: '256px',
                    borderRadius: '12px',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                    objectFit: 'contain',
                  }}
                />
              </div>

              {/* 成功メッセージ */}
              {showSuccess && (
                <div style={{
                  marginBottom: '16px',
                  padding: '12px',
                  background: '#DCFCE7',
                  borderRadius: '12px',
                  color: '#16A34A',
                  fontSize: '14px',
                  textAlign: 'center',
                }}>
                  ✅ ほぞんしたよ！
                </div>
              )}

              {/* アクションボタン */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <button
                  onClick={handleShare}
                  style={{
                    width: '100%',
                    paddingTop: '16px',
                    paddingBottom: '16px',
                    borderRadius: '16px',
                    background: 'linear-gradient(to right, #3B82F6, #8B5CF6)',
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: '18px',
                    transition: 'all 0.2s',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  📤 シェアする
                </button>
                <button
                  onClick={handleDownload}
                  style={{
                    width: '100%',
                    paddingTop: '16px',
                    paddingBottom: '16px',
                    borderRadius: '16px',
                    background: 'linear-gradient(to right, #8B5CF6, #EC4899)',
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: '18px',
                    transition: 'all 0.2s',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  💾 ほぞんする
                </button>
                <button
                  onClick={handleReset}
                  style={{
                    width: '100%',
                    paddingTop: '12px',
                    paddingBottom: '12px',
                    borderRadius: '12px',
                    background: 'white',
                    color: '#7C3AED',
                    fontWeight: 'bold',
                    border: '2px solid #E9D5FF',
                    cursor: 'pointer',
                  }}
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
