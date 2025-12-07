'use client'

import { useCallback, useState } from 'react'
import html2canvas from 'html2canvas'

export type AspectRatio = '1:1' | '9:16'

export interface ExportOptions {
  aspectRatio: AspectRatio
  quality: number
  includeWatermark: boolean
}

export interface ExportResult {
  dataUrl: string
  blob: Blob
}

const ASPECT_RATIOS: Record<AspectRatio, { width: number; height: number }> = {
  '1:1': { width: 1080, height: 1080 },
  '9:16': { width: 1080, height: 1920 }
}

export function useImageExport() {
  const [isExporting, setIsExporting] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)

  const captureElement = useCallback(async (
    element: HTMLElement,
    options: ExportOptions
  ): Promise<ExportResult | null> => {
    setIsExporting(true)
    setProgress(0)
    setError(null)

    try {
      const { width, height } = ASPECT_RATIOS[options.aspectRatio]

      setProgress(20)

      // html2canvasでキャプチャ
      const canvas = await html2canvas(element, {
        scale: 2, // 高解像度
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#FFF5F8',
        logging: false,
        width: element.offsetWidth,
        height: element.offsetHeight
      })

      setProgress(60)

      // 指定のアスペクト比にリサイズ
      const outputCanvas = document.createElement('canvas')
      outputCanvas.width = width
      outputCanvas.height = height
      const ctx = outputCanvas.getContext('2d')

      if (!ctx) {
        throw new Error('Canvas context not available')
      }

      // 背景を塗りつぶす
      ctx.fillStyle = '#FFF5F8'
      ctx.fillRect(0, 0, width, height)

      // キャプチャした画像をセンタリングして配置
      const srcRatio = canvas.width / canvas.height
      const destRatio = width / height

      let drawWidth: number
      let drawHeight: number
      let offsetX: number
      let offsetY: number

      if (srcRatio > destRatio) {
        // 元が横長
        drawWidth = width * 0.9
        drawHeight = drawWidth / srcRatio
        offsetX = (width - drawWidth) / 2
        offsetY = (height - drawHeight) / 2
      } else {
        // 元が縦長
        drawHeight = height * 0.85
        drawWidth = drawHeight * srcRatio
        offsetX = (width - drawWidth) / 2
        offsetY = (height - drawHeight) / 2
      }

      ctx.drawImage(canvas, offsetX, offsetY, drawWidth, drawHeight)

      setProgress(80)

      // ウォーターマークを追加
      if (options.includeWatermark) {
        ctx.fillStyle = 'rgba(107, 63, 160, 0.6)'
        ctx.font = 'bold 24px sans-serif'
        ctx.textAlign = 'right'
        ctx.textBaseline = 'bottom'
        ctx.fillText('Made with ポケシル 🩷', width - 30, height - 20)
      }

      setProgress(90)

      // データURLとBlobを生成
      const dataUrl = outputCanvas.toDataURL('image/png', options.quality)
      const blob = await new Promise<Blob>((resolve, reject) => {
        outputCanvas.toBlob(
          (b) => {
            if (b) resolve(b)
            else reject(new Error('Failed to create blob'))
          },
          'image/png',
          options.quality
        )
      })

      setProgress(100)

      return { dataUrl, blob }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'エクスポートに失敗しました')
      return null
    } finally {
      setIsExporting(false)
    }
  }, [])

  const downloadImage = useCallback((dataUrl: string, filename: string) => {
    const link = document.createElement('a')
    link.href = dataUrl
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }, [])

  const shareImage = useCallback(async (blob: Blob, title: string) => {
    if (navigator.share && navigator.canShare) {
      const file = new File([blob], `${title}.png`, { type: 'image/png' })
      const shareData = {
        title: 'ポケシル シール帳',
        text: 'わたしのシール帳をみてね！🩷',
        files: [file]
      }

      if (navigator.canShare(shareData)) {
        try {
          await navigator.share(shareData)
          return true
        } catch (err) {
          // ユーザーがキャンセルした場合など
          console.log('Share cancelled or failed:', err)
          return false
        }
      }
    }
    return false
  }, [])

  return {
    isExporting,
    progress,
    error,
    captureElement,
    downloadImage,
    shareImage
  }
}
