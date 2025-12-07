'use client'

import { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import { createPortal } from 'react-dom'

type ToastType = 'success' | 'error' | 'info' | 'warning'

interface Toast {
  id: string
  type: ToastType
  message: string
  duration?: number
}

interface ToastContextValue {
  showToast: (type: ToastType, message: string, duration?: number) => void
  success: (message: string) => void
  error: (message: string) => void
  info: (message: string) => void
  warning: (message: string) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

const toastIcons: Record<ToastType, string> = {
  success: '✅',
  error: '❌',
  info: '💡',
  warning: '⚠️',
}

const toastColors: Record<ToastType, { bg: string; border: string }> = {
  success: { bg: 'rgba(76, 175, 80, 0.1)', border: 'var(--color-success)' },
  error: { bg: 'rgba(244, 67, 54, 0.1)', border: 'var(--color-error)' },
  info: { bg: 'rgba(107, 63, 160, 0.1)', border: 'var(--color-primary)' },
  warning: { bg: 'rgba(255, 193, 7, 0.1)', border: 'var(--color-warning)' },
}

// トースト表示コンポーネント
function ToastItem({
  toast,
  onRemove,
}: {
  toast: Toast
  onRemove: (id: string) => void
}) {
  const { bg, border } = toastColors[toast.type]

  return (
    <div
      className="flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg"
      style={{
        backgroundColor: bg,
        borderLeft: `4px solid ${border}`,
        animation: 'slideIn 0.3s ease-out',
      }}
      onClick={() => onRemove(toast.id)}
    >
      <span className="text-xl">{toastIcons[toast.type]}</span>
      <p
        style={{
          fontSize: '14px',
          color: 'var(--color-text-primary)',
          fontWeight: 500,
        }}
      >
        {toast.message}
      </p>
    </div>
  )
}

// トーストコンテナ
function ToastContainer({
  toasts,
  onRemove,
}: {
  toasts: Toast[]
  onRemove: (id: string) => void
}) {
  if (typeof document === 'undefined') return null

  return createPortal(
    <div
      className="fixed top-4 right-4 left-4 z-[100] flex flex-col gap-2 pointer-events-none"
      style={{
        maxWidth: '400px',
        marginLeft: 'auto',
        marginRight: 'auto',
      }}
    >
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <ToastItem toast={toast} onRemove={onRemove} />
        </div>
      ))}
    </div>,
    document.body
  )
}

// トーストプロバイダー
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const showToast = useCallback(
    (type: ToastType, message: string, duration = 3000) => {
      const id = Math.random().toString(36).substring(7)
      const toast: Toast = { id, type, message, duration }

      setToasts((prev) => [...prev, toast])

      // 自動削除
      if (duration > 0) {
        setTimeout(() => removeToast(id), duration)
      }
    },
    [removeToast]
  )

  const value: ToastContextValue = {
    showToast,
    success: (message) => showToast('success', message),
    error: (message) => showToast('error', message),
    info: (message) => showToast('info', message),
    warning: (message) => showToast('warning', message),
  }

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  )
}

// トースト用フック
export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}
