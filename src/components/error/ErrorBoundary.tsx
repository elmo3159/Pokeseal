'use client'

import React, { Component, ReactNode } from 'react'

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
  errorInfo: React.ErrorInfo | null
}

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void
  resetKeys?: unknown[]
}

/**
 * エラーバウンダリコンポーネント
 * 子コンポーネントでのJavaScriptエラーをキャッチし、フォールバックUIを表示
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    }
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    // エラーをログに記録
    console.error('[ErrorBoundary] Caught error:', error)
    console.error('[ErrorBoundary] Error info:', errorInfo)

    this.setState({ errorInfo })

    // 外部のエラーハンドラーを呼び出し
    this.props.onError?.(error, errorInfo)
  }

  componentDidUpdate(prevProps: ErrorBoundaryProps): void {
    // resetKeysが変更されたらエラー状態をリセット
    if (this.state.hasError && prevProps.resetKeys !== this.props.resetKeys) {
      const keysChanged = prevProps.resetKeys?.some(
        (key, index) => key !== this.props.resetKeys?.[index]
      )
      if (keysChanged) {
        this.resetError()
      }
    }
  }

  resetError = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    })
  }

  render(): ReactNode {
    if (this.state.hasError) {
      // カスタムフォールバックが提供されている場合はそれを使用
      if (this.props.fallback) {
        return this.props.fallback
      }

      // デフォルトのフォールバックUI
      return (
        <div className="flex flex-col items-center justify-center min-h-[200px] p-6 bg-red-50 rounded-xl border border-red-200">
          <div className="text-4xl mb-4">😢</div>
          <h2 className="text-lg font-bold text-red-700 mb-2">
            エラーが発生しました
          </h2>
          <p className="text-sm text-red-600 text-center mb-4">
            画面の読み込み中に問題が発生しました。
          </p>
          <button
            onClick={this.resetError}
            className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium text-sm hover:bg-red-700 transition-colors"
          >
            もう一度試す
          </button>
          {process.env.NODE_ENV === 'development' && this.state.error && (
            <details className="mt-4 w-full max-w-md">
              <summary className="text-xs text-red-500 cursor-pointer">
                詳細情報（開発用）
              </summary>
              <pre className="mt-2 p-2 bg-red-100 rounded text-xs text-red-800 overflow-auto max-h-40">
                {this.state.error.message}
                {'\n\n'}
                {this.state.error.stack}
              </pre>
            </details>
          )}
        </div>
      )
    }

    return this.props.children
  }
}

/**
 * フィーチャー用のエラーバウンダリ
 * 特定の機能がクラッシュしても他の機能は動作し続ける
 */
interface FeatureErrorBoundaryProps {
  children: ReactNode
  featureName: string
  onRetry?: () => void
}

export class FeatureErrorBoundary extends Component<
  FeatureErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: FeatureErrorBoundaryProps) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    }
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error(`[${this.props.featureName}] Error:`, error)
    this.setState({ errorInfo })
  }

  handleRetry = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    })
    this.props.onRetry?.()
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center p-4 bg-gray-100 rounded-lg">
          <p className="text-sm text-gray-600 mb-2">
            {this.props.featureName}の読み込みに失敗しました
          </p>
          <button
            onClick={this.handleRetry}
            className="px-3 py-1.5 bg-gray-600 text-white rounded text-sm"
          >
            再試行
          </button>
        </div>
      )
    }

    return this.props.children
  }
}

/**
 * Suspense用のフォールバックコンポーネント
 */
export function LoadingFallback({ message = '読み込み中...' }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[100px] p-4">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mb-2" />
      <p className="text-sm text-gray-500">{message}</p>
    </div>
  )
}

export default ErrorBoundary
