'use client'

import React from 'react'
import { getRemainingAdWatches, UserMonetization } from '@/domain/monetization'

type FundType = 'tickets' | 'stars'

interface InsufficientFundsModalProps {
  isOpen: boolean
  fundType: FundType
  required: number
  current: number
  userMonetization: UserMonetization
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
  onWatchAd,
  onBuyStars,
  onSubscribe,
  onClose,
}: InsufficientFundsModalProps) {
  if (!isOpen) return null

  const shortage = required - current
  const remainingAds = getRemainingAdWatches(userMonetization)
  const canWatchAds = remainingAds > 0 && fundType === 'tickets'

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
            background: 'linear-gradient(90deg, #F87171 0%, #FBBF24 100%)',
          }}
        >
          <div className="text-3xl mb-1">!</div>
          <h2
            className="text-white font-bold text-lg"
            style={{ fontFamily: "'M PLUS Rounded 1c', sans-serif" }}
          >
            {fundType === 'tickets' ? 'シルチケがたりないよ' : 'どろっぷがたりないよ'}
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
              {fundType === 'tickets' ? 'シルチケ' : 'どろっぷ'} たりないよ
            </p>
          </div>

          {/* 選択肢 */}
          <div className="space-y-3">
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
                <div className="flex-1">
                  <p className="font-bold text-green-700">こうこくを みる</p>
                  <p className="text-xs text-green-600">
                    のこり{remainingAds}かい +1シルチケ
                  </p>
                </div>
                <span className="text-green-600 font-bold">むりょう</span>
              </button>
            )}

            {/* どろっぷを買う / どろっぷでガチャを引く */}
            <button
              onClick={onBuyStars}
              className="w-full p-3 rounded-xl text-left flex items-center gap-3 active:scale-[0.98] transition-all"
              style={{
                background: fundType === 'tickets'
                  ? 'linear-gradient(135deg, #FEF9C3 0%, #FDE68A 100%)'
                  : 'linear-gradient(135deg, #EDE9FE 0%, #DDD6FE 100%)',
                border: fundType === 'tickets' ? '2px solid #F59E0B' : '2px solid #8B5CF6',
              }}
            >
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-white"
                style={{ background: fundType === 'tickets' ? '#F59E0B' : '#8B5CF6' }}
              >
                💧
              </div>
              <div className="flex-1">
                <p className={`font-bold ${fundType === 'tickets' ? 'text-amber-700' : 'text-purple-700'}`}>
                  {fundType === 'tickets' ? 'どろっぷで ひく' : 'どろっぷを かう'}
                </p>
                <p className={`text-xs ${fundType === 'tickets' ? 'text-amber-600' : 'text-purple-600'}`}>
                  {fundType === 'tickets'
                    ? 'シルチケの かわりに どろっぷでひけるよ！'
                    : 'どろっぷでガチャがひけるよ'}
                </p>
              </div>
              <span className={fundType === 'tickets' ? 'text-amber-600 font-bold' : 'text-purple-600'}>
                {fundType === 'tickets' ? 'おすすめ' : '→'}
              </span>
            </button>

            {/* パスに入る */}
            {userMonetization.subscription === 'none' && (
              <button
                onClick={onSubscribe}
                className="w-full p-3 rounded-xl text-left flex items-center gap-3 active:scale-[0.98] transition-all"
                style={{
                  background: 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)',
                  border: '2px solid #F59E0B',
                }}
              >
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white"
                  style={{
                    background: 'linear-gradient(135deg, #F59E0B 0%, #FBBF24 100%)',
                  }}
                >
                  ★
                </div>
                <div className="flex-1">
                  <p className="font-bold text-amber-700">パスに はいる</p>
                  <p className="text-xs text-amber-600">
                    まいにち シルチケ＆どろっぷがもらえる！
                  </p>
                </div>
                <span className="text-amber-600 font-bold">おとく</span>
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
