import * as Sentry from '@sentry/react'

let initialized = false

export function initSentry(): boolean {
  if (initialized) return true

  if (typeof window === 'undefined') {
    return false
  }

  const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN
  if (!dsn) {
    return false
  }

  Sentry.init({
    dsn,
    environment: process.env.NODE_ENV,
    tracesSampleRate: 0.05,
  })

  initialized = true
  return true
}

export function captureError(error: unknown, context?: Record<string, unknown>): void {
  if (!initialized && !initSentry()) {
    return
  }

  Sentry.captureException(error, {
    extra: context,
  })
}

