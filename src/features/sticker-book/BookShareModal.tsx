'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toPng } from 'html-to-image'

interface BookShareModalProps {
  isOpen: boolean
  onClose: () => void
  bookContainerRef: React.RefObject<HTMLDivElement | null>
}

export const BookShareModal: React.FC<BookShareModalProps> = ({
  isOpen,
  onClose,
  bookContainerRef,
}) => {
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [isCapturing, setIsCapturing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // モーダルが開いたときにスクリーンショットを撮る
  useEffect(() => {
    if (isOpen && bookContainerRef.current && !capturedImage) {
      captureBookImage()
    }
  }, [isOpen, bookContainerRef, capturedImage])

  // モーダルが閉じたときにリセット
  useEffect(() => {
    if (!isOpen) {
      setCapturedImage(null)
      setSaveSuccess(false)
    }
  }, [isOpen])

  const captureBookImage = async () => {
    if (!bookContainerRef.current) return

    setIsCapturing(true)
    try {
      // 少し待ってからキャプチャ（レンダリング完了を待つ）
      await new Promise(resolve => setTimeout(resolve, 100))

      const container = bookContainerRef.current

      // html-to-imageでキャプチャ（CSS filterをサポート）
      const capturedDataUrl = await toPng(container, {
        pixelRatio: 2, // 高解像度
        cacheBust: true,
        skipFonts: true, // 外部フォントのCORSエラーを回避
        // フィルターを正しくキャプチャするための設定
        filter: (node) => {
          // linkタグ（外部CSS）をスキップしてCORSエラーを回避
          if (node instanceof HTMLLinkElement && node.rel === 'stylesheet') {
            return false
          }
          return true
        },
      })

      // キャプチャした画像を読み込み
      const img = new Image()
      img.crossOrigin = 'anonymous'

      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve()
        img.onerror = reject
        img.src = capturedDataUrl
      })

      // ロゴを追加した新しいキャンバスを作成
      const finalCanvas = document.createElement('canvas')
      const ctx = finalCanvas.getContext('2d')
      if (!ctx) return

      const logoHeight = 60
      const padding = 20
      finalCanvas.width = img.width
      finalCanvas.height = img.height + logoHeight + padding

      // 背景を描画（グラデーション）
      const gradient = ctx.createLinearGradient(0, 0, finalCanvas.width, finalCanvas.height)
      gradient.addColorStop(0, '#FFF5F8')
      gradient.addColorStop(1, '#F3E8FF')
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, finalCanvas.width, finalCanvas.height)

      // シール帳の画像を描画
      ctx.drawImage(img, 0, 0)

      // ロゴエリアの背景
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)'
      ctx.fillRect(0, img.height, finalCanvas.width, logoHeight + padding)

      // ポケシルロゴ（テキスト）を描画
      ctx.font = 'bold 32px "M PLUS Rounded 1c", sans-serif'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'

      // グラデーションテキスト
      const textGradient = ctx.createLinearGradient(
        finalCanvas.width / 2 - 100,
        img.height + logoHeight / 2 + padding / 2,
        finalCanvas.width / 2 + 100,
        img.height + logoHeight / 2 + padding / 2
      )
      textGradient.addColorStop(0, '#A78BFA')
      textGradient.addColorStop(1, '#EC4899')
      ctx.fillStyle = textGradient
      ctx.fillText('ポケシル', finalCanvas.width / 2, img.height + logoHeight / 2 + padding / 2)

      // 小さいタグライン
      ctx.font = '16px "M PLUS Rounded 1c", sans-serif'
      ctx.fillStyle = '#9B6FD0'
      ctx.fillText('- シール帳アプリ -', finalCanvas.width / 2, img.height + logoHeight / 2 + padding / 2 + 25)

      // 最終画像をData URLに変換
      const dataUrl = finalCanvas.toDataURL('image/png')
      setCapturedImage(dataUrl)
    } catch (error) {
      console.error('[BookShare] キャプチャエラー:', error)
    } finally {
      setIsCapturing(false)
    }
  }

  // 画像を保存（ダウンロード）
  const handleSave = async () => {
    if (!capturedImage) return

    setIsSaving(true)
    try {
      // ダウンロードリンクを作成
      const link = document.createElement('a')
      link.href = capturedImage
      link.download = `pokeseal-${Date.now()}.png`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 2000)
    } catch (error) {
      console.error('[BookShare] 保存エラー:', error)
    } finally {
      setIsSaving(false)
    }
  }

  // Xでシェア
  const handleShareX = () => {
    const text = encodeURIComponent('わたしのシール帳だよ！ #ポケシル')
    const url = `https://twitter.com/intent/tweet?text=${text}`
    window.open(url, '_blank', 'width=600,height=400')
  }

  // Instagramでシェア（クリップボードにコピー + 案内）
  const handleShareInstagram = async () => {
    if (!capturedImage) return

    try {
      // Data URLからBlobに変換
      const response = await fetch(capturedImage)
      const blob = await response.blob()

      // クリップボードに画像をコピー（対応ブラウザのみ）
      if (navigator.clipboard && 'write' in navigator.clipboard) {
        await navigator.clipboard.write([
          new ClipboardItem({
            'image/png': blob
          })
        ])
        alert('画像をクリップボードにコピーしました！\nInstagramを開いて貼り付けてください。')
      } else {
        // クリップボード非対応の場合はダウンロードを促す
        alert('画像を保存してからInstagramで共有してください。')
        handleSave()
      }
    } catch (error) {
      console.error('[BookShare] Instagramシェアエラー:', error)
      alert('画像を保存してからInstagramで共有してください。')
      handleSave()
    }
  }

  // LINEでシェア
  const handleShareLINE = () => {
    const text = encodeURIComponent('わたしのシール帳だよ！')
    const url = `https://social-plugins.line.me/lineit/share?text=${text}`
    window.open(url, '_blank', 'width=600,height=400')
  }

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
            className="fixed inset-0 bg-black/60 z-[2000]"
          />

          {/* モーダル */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-4 flex items-center justify-center z-[2001] pointer-events-none"
          >
            <div
              className="bg-gradient-to-br from-[#FFF5F8] to-[#F3E8FF] rounded-3xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-hidden pointer-events-auto flex flex-col"
            >
              {/* ヘッダー */}
              <div className="px-6 py-4 bg-gradient-to-r from-purple-500 to-pink-500 relative">
                <h2 className="text-lg font-bold text-white text-center font-['M_PLUS_Rounded_1c']">
                  シール帳をシェア
                </h2>
                <button
                  onClick={onClose}
                  className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-colors"
                >
                  ✕
                </button>
              </div>

              {/* プレビュー */}
              <div className="flex-1 overflow-y-auto p-4">
                <div className="bg-white rounded-xl shadow-inner p-2 mb-4">
                  {isCapturing ? (
                    <div className="aspect-[4/3] flex items-center justify-center text-purple-400">
                      <div className="text-center">
                        <div className="animate-spin w-8 h-8 border-2 border-purple-400 border-t-transparent rounded-full mx-auto mb-2" />
                        <p className="text-sm">画像を作成中...</p>
                      </div>
                    </div>
                  ) : capturedImage ? (
                    <img
                      src={capturedImage}
                      alt="シール帳のプレビュー"
                      className="w-full rounded-lg"
                    />
                  ) : (
                    <div className="aspect-[4/3] flex items-center justify-center text-purple-400">
                      <p className="text-sm">プレビューを読み込み中...</p>
                    </div>
                  )}
                </div>

                {/* 保存ボタン */}
                <button
                  onClick={handleSave}
                  disabled={!capturedImage || isSaving}
                  className="w-full py-3 mb-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold text-base shadow-lg hover:shadow-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {saveSuccess ? (
                    <>
                      <span>✓</span>
                      <span>保存しました！</span>
                    </>
                  ) : (
                    <>
                      <span>💾</span>
                      <span>{isSaving ? '保存中...' : '画像を保存'}</span>
                    </>
                  )}
                </button>

                {/* シェアボタン群 */}
                <p className="text-center text-sm text-purple-600 mb-3 font-['M_PLUS_Rounded_1c']">
                  SNSでシェアしよう
                </p>
                <div className="grid grid-cols-3 gap-3">
                  {/* Xシェア */}
                  <button
                    onClick={handleShareX}
                    disabled={!capturedImage}
                    className="py-3 px-2 rounded-xl bg-black text-white font-bold text-sm shadow-md hover:shadow-lg transition-all disabled:opacity-50 flex flex-col items-center gap-1"
                  >
                    <span className="text-lg">𝕏</span>
                    <span className="text-xs">X</span>
                  </button>

                  {/* Instagramシェア */}
                  <button
                    onClick={handleShareInstagram}
                    disabled={!capturedImage}
                    className="py-3 px-2 rounded-xl bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all disabled:opacity-50 flex flex-col items-center gap-1"
                  >
                    <span className="text-lg">📷</span>
                    <span className="text-xs">Instagram</span>
                  </button>

                  {/* LINEシェア */}
                  <button
                    onClick={handleShareLINE}
                    disabled={!capturedImage}
                    className="py-3 px-2 rounded-xl bg-[#00B900] text-white font-bold text-sm shadow-md hover:shadow-lg transition-all disabled:opacity-50 flex flex-col items-center gap-1"
                  >
                    <span className="text-lg">💬</span>
                    <span className="text-xs">LINE</span>
                  </button>
                </div>

                <p className="text-center text-xs text-purple-400 mt-4">
                  ※画像を保存してからSNSに投稿することもできます
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default BookShareModal
