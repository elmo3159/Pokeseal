'use client'

export type CurrencyType = 'ticket' | 'gem' | 'star'

interface CurrencyIconProps {
  type: CurrencyType
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

const sizeMap = {
  xs: 12,
  sm: 16,
  md: 24,
  lg: 32,
  xl: 48,
}

const currencyImages: Record<CurrencyType, string> = {
  ticket: '/images/ticket/ticket.png',
  gem: '/images/ticket/premium_ticket.png',
  star: '/images/ticket/drop.png',
}

export const CurrencyIcon: React.FC<CurrencyIconProps> = ({
  type,
  size = 'md',
  className = '',
}) => {
  const pixelSize = sizeMap[size]

  return (
    <img
      src={currencyImages[type]}
      alt={type === 'ticket' ? 'シルチケ' : type === 'gem' ? 'プレシルチケ' : 'どろっぷ'}
      width={pixelSize}
      height={pixelSize}
      className={`object-contain ${className}`}
      style={{ width: pixelSize, height: pixelSize }}
    />
  )
}

export default CurrencyIcon
