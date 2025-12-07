// シール帳関連のドメイン型定義

// 配置されたシール
export interface PlacedSticker {
  id: string
  stickerId: string
  position: {
    x: number // 0-1の範囲
    y: number // 0-1の範囲
  }
  rotation: number // 度
  scale: number // 1.0が基準
}

// シール帳のページ
export interface BookPage {
  id: string
  pageNumber: number
  stickers: PlacedSticker[]
}

// エクスポート用のページデータ変換関数
export function createExportPage(
  pageId: string,
  pageNumber: number,
  placedStickers: Array<{
    id: string
    stickerId: string
    x: number
    y: number
    rotation: number
    scale: number
  }>
): BookPage {
  return {
    id: pageId,
    pageNumber,
    stickers: placedStickers.map(s => ({
      id: s.id,
      stickerId: s.stickerId,
      position: { x: s.x, y: s.y },
      rotation: s.rotation,
      scale: s.scale
    }))
  }
}
