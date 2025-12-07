'use client'

import { ButtonHTMLAttributes, ReactNode } from 'react'

type ButtonVariant = 'primary' | 'secondary' | 'icon' | 'ghost'
type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  children: ReactNode
  fullWidth?: boolean
  loading?: boolean
}

const variantStyles: Record<ButtonVariant, React.CSSProperties> = {
  primary: {
    background: 'linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%)',
    color: '#FFFFFF',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    boxShadow: '0 4px 16px rgba(139, 92, 246, 0.3)',
  },
  secondary: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    backdropFilter: 'blur(8px)',
    color: '#8B5CF6',
    border: '1px solid rgba(139, 92, 246, 0.3)',
    boxShadow: '0 2px 8px rgba(139, 92, 246, 0.1)',
  },
  icon: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    backdropFilter: 'blur(8px)',
    color: '#8B5CF6',
    border: '1px solid rgba(255, 255, 255, 0.5)',
    boxShadow: '0 2px 8px rgba(139, 92, 246, 0.1)',
  },
  ghost: {
    backgroundColor: 'transparent',
    color: '#7A5090',
    border: 'none',
    boxShadow: 'none',
  },
}

const sizeStyles: Record<ButtonSize, { padding: string; fontSize: string; minHeight: string }> = {
  sm: {
    padding: '8px 16px',
    fontSize: '14px',
    minHeight: '36px',
  },
  md: {
    padding: '12px 24px',
    fontSize: '16px',
    minHeight: '48px',
  },
  lg: {
    padding: '16px 32px',
    fontSize: '20px',
    minHeight: '56px',
  },
}

export function Button({
  variant = 'primary',
  size = 'md',
  children,
  fullWidth = false,
  loading = false,
  disabled,
  className = '',
  style,
  ...props
}: ButtonProps) {
  const baseStyles: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '12px',
    fontWeight: 'bold',
    cursor: disabled || loading ? 'not-allowed' : 'pointer',
    opacity: disabled || loading ? 0.6 : 1,
    transition: 'all 0.2s ease',
    width: fullWidth ? '100%' : 'auto',
    ...variantStyles[variant],
    ...sizeStyles[size],
    ...style,
  }

  return (
    <button
      className={`hover:opacity-90 active:scale-95 ${className}`}
      style={baseStyles}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="animate-spin mr-2">⏳</span>
      ) : null}
      {children}
    </button>
  )
}

// アイコンボタン用の特別なコンポーネント
interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: string | ReactNode
  size?: 'sm' | 'md' | 'lg'
  variant?: 'primary' | 'secondary' | 'ghost'
}

const iconSizeMap: Record<'sm' | 'md' | 'lg', { size: string; fontSize: string }> = {
  sm: { size: '40px', fontSize: '18px' },
  md: { size: '48px', fontSize: '24px' },
  lg: { size: '64px', fontSize: '32px' },
}

export function IconButton({
  icon,
  size = 'md',
  variant = 'ghost',
  disabled,
  className = '',
  style,
  ...props
}: IconButtonProps) {
  const sizeConfig = iconSizeMap[size]

  const getVariantStyles = (): React.CSSProperties => {
    switch (variant) {
      case 'primary':
        return {
          background: 'linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%)',
          color: '#FFFFFF',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)',
        }
      case 'secondary':
        return {
          backgroundColor: 'rgba(255, 255, 255, 0.7)',
          backdropFilter: 'blur(8px)',
          color: '#8B5CF6',
          border: '1px solid rgba(139, 92, 246, 0.3)',
        }
      default: // ghost
        return {
          backgroundColor: 'transparent',
          color: '#7A5090',
          border: 'none',
        }
    }
  }

  const baseStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '50%',
    width: sizeConfig.size,
    height: sizeConfig.size,
    fontSize: sizeConfig.fontSize,
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.6 : 1,
    transition: 'all 0.2s ease',
    ...getVariantStyles(),
    ...style,
  }

  return (
    <button
      className={`hover:opacity-80 active:scale-90 ${className}`}
      style={baseStyles}
      disabled={disabled}
      {...props}
    >
      {icon}
    </button>
  )
}
