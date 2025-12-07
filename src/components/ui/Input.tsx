'use client'

import { InputHTMLAttributes, TextareaHTMLAttributes, ReactNode, forwardRef } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
  leftIcon?: ReactNode
  rightIcon?: ReactNode
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, leftIcon, rightIcon, className = '', style, ...props }, ref) => {
    const hasError = !!error

    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label
            style={{
              fontSize: '14px',
              fontWeight: 600,
              color: 'var(--color-text-primary)',
              marginBottom: '4px',
            }}
          >
            {label}
          </label>
        )}

        <div className="relative">
          {leftIcon && (
            <div
              className="absolute left-4 top-1/2 -translate-y-1/2"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              {leftIcon}
            </div>
          )}

          <input
            ref={ref}
            className={`w-full transition-all duration-200 outline-none ${className}`}
            style={{
              padding: '14px 16px',
              paddingLeft: leftIcon ? '48px' : '16px',
              paddingRight: rightIcon ? '48px' : '16px',
              fontSize: '16px',
              color: 'var(--color-text-primary)',
              backgroundColor: 'var(--color-surface)',
              border: hasError
                ? '2px solid var(--color-error)'
                : '2px solid rgba(155, 111, 208, 0.3)',
              borderRadius: '12px',
              ...style,
            }}
            {...props}
          />

          {rightIcon && (
            <div
              className="absolute right-4 top-1/2 -translate-y-1/2"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              {rightIcon}
            </div>
          )}
        </div>

        {error && (
          <p style={{ fontSize: '12px', color: 'var(--color-error)', marginTop: '4px' }}>
            ⚠️ {error}
          </p>
        )}

        {hint && !error && (
          <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginTop: '4px' }}>
            {hint}
          </p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

// テキストエリア
interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  hint?: string
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, hint, className = '', style, ...props }, ref) => {
    const hasError = !!error

    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label
            style={{
              fontSize: '14px',
              fontWeight: 600,
              color: 'var(--color-text-primary)',
              marginBottom: '4px',
            }}
          >
            {label}
          </label>
        )}

        <textarea
          ref={ref}
          className={`w-full transition-all duration-200 outline-none resize-none ${className}`}
          style={{
            padding: '14px 16px',
            fontSize: '16px',
            color: 'var(--color-text-primary)',
            backgroundColor: 'var(--color-surface)',
            border: hasError
              ? '2px solid var(--color-error)'
              : '2px solid rgba(155, 111, 208, 0.3)',
            borderRadius: '12px',
            minHeight: '120px',
            ...style,
          }}
          {...props}
        />

        {error && (
          <p style={{ fontSize: '12px', color: 'var(--color-error)', marginTop: '4px' }}>
            ⚠️ {error}
          </p>
        )}

        {hint && !error && (
          <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginTop: '4px' }}>
            {hint}
          </p>
        )}
      </div>
    )
  }
)

Textarea.displayName = 'Textarea'

// 検索入力
interface SearchInputProps extends Omit<InputProps, 'leftIcon'> {
  onSearch?: (value: string) => void
}

export function SearchInput({ onSearch, ...props }: SearchInputProps) {
  return (
    <Input
      type="search"
      leftIcon={<span>🔍</span>}
      placeholder="けんさく..."
      {...props}
      onKeyDown={(e) => {
        if (e.key === 'Enter' && onSearch) {
          onSearch((e.target as HTMLInputElement).value)
        }
        props.onKeyDown?.(e)
      }}
    />
  )
}
