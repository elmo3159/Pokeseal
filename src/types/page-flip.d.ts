declare module 'page-flip' {
  export interface PageFlipOptions {
    width: number
    height: number
    size?: 'fixed' | 'stretch'
    minWidth?: number
    maxWidth?: number
    minHeight?: number
    maxHeight?: number
    drawShadow?: boolean
    flippingTime?: number
    usePortrait?: boolean
    startZIndex?: number
    autoSize?: boolean
    maxShadowOpacity?: number
    showCover?: boolean
    mobileScrollSupport?: boolean
    clickEventForward?: boolean
    useMouseEvents?: boolean
    swipeDistance?: number
    showPageCorners?: boolean
    disableFlipByClick?: boolean
  }

  export interface FlipEvent {
    data: number
  }

  export class PageFlip {
    constructor(element: HTMLElement, options: PageFlipOptions)

    loadFromHTML(elements: NodeListOf<HTMLElement>): void
    loadFromImages(images: string[]): void

    flip(pageNum: number): void
    flipNext(corner?: string): void
    flipPrev(corner?: string): void

    turnToPage(pageNum: number): void
    turnToNextPage(): void
    turnToPrevPage(): void

    getPageCount(): number
    getCurrentPageIndex(): number
    getOrientation(): string
    getState(): string

    on(event: 'flip' | 'changeOrientation' | 'changeState', callback: (e: FlipEvent) => void): void
    off(event: string): void

    destroy(): void
    update(): void
  }
}
