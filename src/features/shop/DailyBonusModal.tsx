'use client'

import React from 'react'
import {
  UserMonetization,
  SUBSCRIPTION_PLANS,
  DAILY_FREE_TICKETS,
  MAX_AD_WATCHES_PER_DAY,
  DAILY_MISSIONS,
} from '@/domain/monetization'
import { CurrencyIcon } from '@/components/ui/CurrencyIcon'

interface DailyBonusModalProps {
  isOpen: boolean
  userMonetization: UserMonetization
  ticketsReceived: number
  starsReceived: number
  onClose: () => void
}

export function DailyBonusModal({
  isOpen,
  userMonetization,
  ticketsReceived,
  starsReceived,
  onClose,
}: DailyBonusModalProps) {
  if (!isOpen) return null

  const plan = SUBSCRIPTION_PLANS[userMonetization.subscription]
  const hasPlan = userMonetization.subscription !== 'none'

  return (
    <div
      className="fixed inset-0 z-[500] flex items-center justify-center"
      style={{ background: 'rgba(0, 0, 0, 0.5)' }}
      onClick={onClose}
    >
      <div
        className="w-[90%] max-w-[320px] rounded-2xl overflow-hidden shadow-2xl"
        style={{
          background: 'linear-gradient(180deg, #FFFFFF 0%, #FFF7ED 100%)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ヘッダー */}
        <div
          className="px-4 py-5 text-center"
          style={{
            background: 'linear-gradient(90deg, #F59E0B 0%, #FBBF24 100%)',
          }}
        >
          <div className="text-4xl mb-2">☀</div>
          <h2
            className="text-white font-bold text-xl"
            style={{ fontFamily: "'M PLUS Rounded 1c', sans-serif" }}
          >
            まいにちボーナス！
          </h2>
        </div>

        {/* コンテンツ */}
        <div
          className="px-6 py-6"
          style={{ fontFamily: "'M PLUS Rounded 1c', sans-serif" }}
        >
          {/* 獲得アイテム */}
          <div className="space-y-3 mb-6">
            {/* チケット */}
            <div
              className="flex items-center justify-between p-3 rounded-xl"
              style={{
                background: 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)',
              }}
            >
              <div className="flex items-center gap-2">
                <CurrencyIcon type="ticket" size="lg" />
                <span className="font-bold text-amber-800">シルチケ</span>
              </div>
              <span className="text-xl font-bold text-amber-600">
                +{ticketsReceived}まい
              </span>
            </div>

            {/* どろっぷ（パス会員のみ） */}
            {starsReceived > 0 && (
              <div
                className="flex items-center justify-between p-3 rounded-xl"
                style={{
                  background: 'linear-gradient(135deg, #EDE9FE 0%, #DDD6FE 100%)',
                }}
              >
                <div className="flex items-center gap-2">
                  <CurrencyIcon type="star" size="lg" />
                  <span className="font-bold text-purple-800">どろっぷ</span>
                </div>
                <span className="text-xl font-bold text-purple-600">
                  +{starsReceived}
                </span>
              </div>
            )}
          </div>

          {/* 内訳 */}
          <div className="text-xs text-gray-500 space-y-1 mb-4">
            <div className="flex justify-between">
              <span>デイリーシルチケ</span>
              <span>+{DAILY_FREE_TICKETS}まい</span>
            </div>
            {plan.dailyBonusTickets > 0 && (
              <div className="flex justify-between text-purple-500">
                <span>{plan.name}ボーナス</span>
                <span>+{plan.dailyBonusTickets}まい</span>
              </div>
            )}
            {plan.skipAds && (
              <div className="flex justify-between text-green-500">
                <span>こうこくスキップぶん</span>
                <span>+{MAX_AD_WATCHES_PER_DAY}まい</span>
              </div>
            )}
            {starsReceived > 0 && (
              <div className="flex justify-between text-purple-500">
                <span>{plan.name}どろっぷ</span>
                <span>+{starsReceived}どろっぷ</span>
              </div>
            )}
          </div>

          {/* ミッション案内 */}
          <div
            className="p-3 rounded-xl text-center"
            style={{
              background: 'linear-gradient(135deg, #F0FDF4 0%, #DCFCE7 100%)',
            }}
          >
            <p className="text-sm text-green-700 font-bold mb-1">
              ミッションで もっともらおう！
            </p>
            <p className="text-xs text-green-600">
              コメントやシールはりで +{DAILY_MISSIONS.reduce((sum, m) => sum + m.reward, 0)}シルチケ
            </p>
          </div>

          {/* パス未加入者へのアップセル */}
          {!hasPlan && (
            <div
              className="mt-4 p-3 rounded-xl text-center"
              style={{
                background: 'linear-gradient(135deg, #FDF4FF 0%, #FAE8FF 100%)',
                border: '1px dashed #D946EF',
              }}
            >
              <p className="text-sm text-purple-700 font-bold">
                パスに はいると もっと おとく！
              </p>
              <p className="text-xs text-purple-500 mt-1">
                まいにち シルチケ＆どろっぷが ふえるよ
              </p>
            </div>
          )}
        </div>

        {/* フッター */}
        <div className="px-6 pb-6">
          <button
            onClick={onClose}
            className="w-full py-3 rounded-xl font-bold text-white active:scale-95 transition-all"
            style={{
              fontFamily: "'M PLUS Rounded 1c', sans-serif",
              background: 'linear-gradient(90deg, #F59E0B 0%, #FBBF24 100%)',
              boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)',
            }}
          >
            やったー！
          </button>
        </div>
      </div>
    </div>
  )
}

export default DailyBonusModal
