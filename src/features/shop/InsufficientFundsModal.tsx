'use client'

import React from 'react'
import { getRemainingAdWatches, UserMonetization, GACHA_COSTS } from '@/domain/monetization'

type FundType = 'tickets' | 'gems' | 'stars'

interface InsufficientFundsModalProps {
  isOpen: boolean
  fundType: FundType
  required: number
  current: number
  userMonetization: UserMonetization
  // どろっぷで代替可能な場合の情報
  canUseDropsInstead?: boolean
  dropsRequired?: number
  // コールバック
  onUseDrops?: () => void  // どろっぷで引く
  onWatchAd: () => void
  onBuyStars: () => void
  onSubscribe: () => void
  onClose: () => void
}

export function InsufficientFundsModal({
  isOpen,
  fundType,
  required,
  current,
  userMonetization,
  canUseDropsInstead = false,
  dropsRequired = 0,
  onUseDrops,
  onWatchAd,
  onBuyStars,
  onSubscribe,
  onClose,
}: InsufficientFundsModalProps) {
  if (!isOpen) return null

  const shortage = required - current
  const remainingAds = getRemainingAdWatches(userMonetization)
  const canWatchAds = remainingAds > 0 && fundType === 'tickets'

  // 通貨名を取得
  const getCurrencyName = (type: FundType) => {
    switch (type) {
      case 'tickets': return 'シルチケ'
      case 'gems': return 'プレシル'
      case 'stars': return 'どろっぷ'
    }
  }

  // 通貨アイコンを取得
  const getCurrencyIcon = (type: FundType) => {
    switch (type) {
      case 'tickets': return '🎫'
      case 'gems': return '💎'
      case 'stars': return '💧'
    }
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center"
      style={{ background: 'rgba(0, 0, 0, 0.5)' }}
      onClick={onClose}
    >
      <div
        className="w-[90%] max-w-[320px] rounded-2xl overflow-hidden shadow-2xl"
        style={{
          background: 'linear-gradient(180deg, #FFFFFF 0%, #FEF2F2 100%)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ヘッダー */}
        <div
          className="px-4 py-4 text-center"
          style={{
            background: fundType === 'gems'
              ? 'linear-gradient(90deg, #8B5CF6 0%, #EC4899 100%)'
              : 'linear-gradient(90deg, #F87171 0%, #FBBF24 100%)',
          }}
        >
          <div className="text-3xl mb-1">{getCurrencyIcon(fundType)}</div>
          <h2
            className="text-white font-bold text-lg"
            style={{ fontFamily: "'M PLUS Rounded 1c', sans-serif" }}
          >
            {getCurrencyName(fundType)}がたりないよ
          </h2>
        </div>

        {/* コンテンツ */}
        <div
          className="px-6 py-5"
          style={{ fontFamily: "'M PLUS Rounded 1c', sans-serif" }}
        >
          {/* 不足表示 */}
          <div className="text-center mb-5">
            <div className="flex items-center justify-center gap-4 mb-2">
              <div className="text-center">
                <p className="text-xs text-gray-400">もっている</p>
                <p className="text-2xl font-bold text-gray-600">
                  {current}
                </p>
              </div>
              <div className="text-2xl text-gray-300">→</div>
              <div className="text-center">
                <p className="text-xs text-gray-400">ひつよう</p>
                <p className="text-2xl font-bold text-red-500">
                  {required}
                </p>
              </div>
            </div>
            <p className="text-sm text-red-400">
              あと <span className="font-bold">{shortage}</span>
              {getCurrencyName(fundType)} たりないよ
            </p>
          </div>

          {/* 選択肢 */}
          <div className="space-y-3">
            {/* どろっぷで引く（チケット/プレシル不足時、どろっぷ残高がある場合） */}
            {canUseDropsInstead && onUseDrops && (fundType === 'tickets' || fundType === 'gems') && (
              <button
                onClick={onUseDrops}
                className="w-full p-3 rounded-xl text-left flex items-center gap-3 active:scale-[0.98] transition-all relative overflow-hidden"
                style={{
                  background: 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)',
                  border: '3px solid #F59E0B',
                  boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)',
                }}
              >
                {/* おすすめバッジ */}
                <div
                  className="absolute top-0 right-0 px-2 py-0.5 text-[10px] font-bold text-white rounded-bl-lg"
                  style={{ background: 'linear-gradient(90deg, #F59E0B 0%, #EF4444 100%)' }}
                >
                  おすすめ！
                </div>
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-white text-xl"
                  style={{ background: 'linear-gradient(135deg, #F59E0B 0%, #FBBF24 100%)' }}
                >
                  💧
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-amber-800 text-base">どろっぷで ひく</p>
                  <p className="text-xs text-amber-600">
                    {dropsRequired}どろっぷ でガチャがひけるよ！
                  </p>
                  <p className="text-[10px] text-amber-500 mt-0.5">
                    いまの どろっぷ: {userMonetization.stars.toLocaleString()}
                  </p>
                </div>
                <span className="text-amber-600 font-bold text-lg shrink-0">→</span>
              </button>
            )}

            {/* 広告を見る（チケット不足時のみ） */}
            {canWatchAds && (
              <button
                onClick={onWatchAd}
                className="w-full p-3 rounded-xl text-left flex items-center gap-3 active:scale-[0.98] transition-all"
                style={{
                  background: 'linear-gradient(135deg, #D1FAE5 0%, #A7F3D0 100%)',
                  border: '2px solid #10B981',
                }}
              >
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white"
                  style={{ background: '#10B981' }}
                >
                  ▷
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-green-700">こうこくを みる</p>
                  <p className="text-[10px] text-green-600">
                    のこり{remainingAds}かい／+1シルチケ
                  </p>
                </div>
                <span className="text-green-600 font-bold text-sm shrink-0">むりょう</span>
              </button>
            )}

            {/* どろっぷを買う（どろっぷ不足の場合、または代替できない場合） */}
            {(fundType === 'stars' || !canUseDropsInstead) && (
              <button
                onClick={onBuyStars}
                className="w-full p-3 rounded-xl text-left flex items-center gap-3 active:scale-[0.98] transition-all"
                style={{
                  background: 'linear-gradient(135deg, #EDE9FE 0%, #DDD6FE 100%)',
                  border: '2px solid #8B5CF6',
                }}
              >
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white"
                  style={{ background: '#8B5CF6' }}
                >
                  💧
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-purple-700">どろっぷを かう</p>
                  <p className="text-[10px] text-purple-600">
                    {fundType === 'stars'
                      ? 'どろっぷでガチャがひけるよ'
                      : 'どろっぷを買ってガチャをひこう'}
                  </p>
                </div>
                <span className="text-purple-600 text-sm shrink-0">→</span>
              </button>
            )}

            {/* パスに入る */}
            {userMonetization.subscription === 'none' && (
              <button
                onClick={onSubscribe}
                className="w-full p-3 rounded-xl text-left flex items-center gap-3 active:scale-[0.98] transition-all"
                style={{
                  background: 'linear-gradient(135deg, #FDF4FF 0%, #FAE8FF 100%)',
                  border: '2px solid #D946EF',
                }}
              >
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white"
                  style={{
                    background: 'linear-gradient(135deg, #D946EF 0%, #EC4899 100%)',
                  }}
                >
                  ★
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-purple-700">パスに はいる</p>
                  <p className="text-[10px] text-purple-600">
                    毎日シルチケ＆どろっぷがもらえてお得！
                  </p>
                </div>
                <span className="text-purple-600 font-bold text-sm shrink-0">おとく</span>
              </button>
            )}
          </div>
        </div>

        {/* フッター */}
        <div className="px-6 pb-5">
          <button
            onClick={onClose}
            className="w-full py-2 rounded-xl font-bold text-gray-500 bg-gray-100 active:scale-95 transition-all text-sm"
            style={{ fontFamily: "'M PLUS Rounded 1c', sans-serif" }}
          >
            あとで
          </button>
        </div>
      </div>
    </div>
  )
}

export default InsufficientFundsModal
