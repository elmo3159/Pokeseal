'use client'

import { ReactNode, useEffect } from 'react'
import { AuthProvider } from '@/contexts/AuthContext'
import { ErrorBoundary } from '@/components/error'
import { captureError, initSentry } from '@/services/logging/sentry'

interface ProvidersProps {
  children: ReactNode
}

export function Providers({ children }: ProvidersProps) {
  useEffect(() => {
    initSentry()
  }, [])

  return (
    <ErrorBoundary
      onError={(error, errorInfo) => {
        // 本番環境では外部のエラー監視サービスに送信
        if (process.env.NODE_ENV === 'production') {
          captureError(error, {
            componentStack: errorInfo.componentStack,
          })
        }
      }}
    >
      <AuthProvider>
        {children}
      </AuthProvider>
    </ErrorBoundary>
  )
}
