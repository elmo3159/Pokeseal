'use client'

import React, { useState } from 'react'
import { ShopItem, formatPoints } from '@/domain/starPoints'
import { PointsDisplay } from './PointsDisplay'

interface PointsShopProps {
  isOpen: boolean
  onClose: () => void
  balance: number
  shopItems: ShopItem[]
  purchasedItems: string[]
  onPurchase: (itemId: string) => { success: boolean; message: string }
  canPurchase: (itemId: string) => boolean
}

// アイテムカテゴリー
const CATEGORIES = [
  { id: 'all', label: 'ぜんぶ', emoji: '🌟' },
  { id: 'gacha_ticket', label: 'ガチャ', emoji: '🎫' },
  { id: 'theme', label: 'テーマ', emoji: '🎨' },
  { id: 'title', label: 'しょうごう', emoji: '🏆' },
  { id: 'charm', label: 'チャーム', emoji: '✨' },
]

// 購入確認モーダル
const PurchaseConfirmModal: React.FC<{
  item: ShopItem
  balance: number
  onConfirm: () => void
  onCancel: () => void
}> = ({ item, balance, onConfirm, onCancel }) => {
  const remaining = balance - item.cost

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
        <h3 className="text-xl font-bold text-purple-700 text-center mb-4">
          かってもいい？
        </h3>

        {/* アイテム情報 */}
        <div className="bg-purple-50 rounded-xl p-4 mb-4">
          <div className="flex items-center gap-3">
            <span className="text-4xl">{item.emoji}</span>
            <div>
              <p className="font-bold text-purple-800">{item.name}</p>
              <p className="text-sm text-purple-600">{item.description}</p>
            </div>
          </div>
        </div>

        {/* ポイント計算 */}
        <div className="space-y-2 mb-6">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">いまのポイント</span>
            <span className="font-bold text-yellow-600">{formatPoints(balance)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">おかいもの</span>
            <span className="font-bold text-red-500">-{formatPoints(item.cost)}</span>
          </div>
          <div className="border-t pt-2 flex justify-between">
            <span className="font-bold text-purple-700">のこりのポイント</span>
            <span className={`font-bold ${remaining >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatPoints(remaining)}
            </span>
          </div>
        </div>

        {/* ボタン */}
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-3 rounded-xl bg-gray-100 text-gray-600 font-bold transition-all hover:bg-gray-200"
          >
            やめる
          </button>
          <button
            onClick={onConfirm}
            disabled={remaining < 0}
            className={`
              flex-1 py-3 rounded-xl font-bold transition-all
              ${remaining >= 0
                ? 'bg-gradient-to-r from-yellow-400 to-orange-400 text-white hover:shadow-lg'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }
            `}
          >
            かう！
          </button>
        </div>
      </div>
    </div>
  )
}

// 購入完了モーダル
const PurchaseSuccessModal: React.FC<{
  item: ShopItem
  onClose: () => void
}> = ({ item, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl text-center">
        <div className="text-6xl mb-4 animate-bounce">🎉</div>
        <h3 className="text-xl font-bold text-purple-700 mb-2">
          ゲットしたよ！
        </h3>
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 mb-4">
          <span className="text-4xl">{item.emoji}</span>
          <p className="font-bold text-purple-800 mt-2">{item.name}</p>
        </div>
        <button
          onClick={onClose}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold"
        >
          やったー！
        </button>
      </div>
    </div>
  )
}

// ショップアイテムカード
const ShopItemCard: React.FC<{
  item: ShopItem
  canAfford: boolean
  isOwned: boolean
  onBuy: () => void
}> = ({ item, canAfford, isOwned, onBuy }) => {
  return (
    <div
      className={`
        bg-white rounded-xl p-3 shadow-md
        border-2 transition-all
        ${isOwned
          ? 'border-green-300 bg-green-50 opacity-60'
          : canAfford
            ? 'border-purple-200 hover:border-purple-400 hover:shadow-lg'
            : 'border-gray-200 opacity-70'
        }
      `}
    >
      {/* 限定バッジ */}
      {item.isLimited && (
        <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">
          げんてい
        </div>
      )}

      {/* アイテム画像/絵文字 */}
      <div className="text-4xl text-center mb-2">
        {isOwned ? '✅' : item.emoji}
      </div>

      {/* アイテム名 */}
      <p className="font-bold text-purple-800 text-sm text-center truncate">
        {item.name}
      </p>

      {/* 説明 */}
      <p className="text-xs text-gray-500 text-center mt-1 line-clamp-2">
        {item.description}
      </p>

      {/* 価格と購入ボタン */}
      {isOwned ? (
        <div className="mt-3 py-2 text-center text-green-600 font-bold text-sm">
          もってるよ！
        </div>
      ) : (
        <button
          onClick={onBuy}
          disabled={!canAfford}
          className={`
            w-full mt-3 py-2 rounded-lg font-bold text-sm transition-all
            ${canAfford
              ? 'bg-gradient-to-r from-yellow-400 to-orange-400 text-white hover:shadow-md'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }
          `}
        >
          ⭐ {formatPoints(item.cost)}
        </button>
      )}
    </div>
  )
}

export const PointsShop: React.FC<PointsShopProps> = ({
  isOpen,
  onClose,
  balance,
  shopItems,
  purchasedItems,
  onPurchase,
  canPurchase,
}) => {
  const [category, setCategory] = useState('all')
  const [confirmItem, setConfirmItem] = useState<ShopItem | null>(null)
  const [successItem, setSuccessItem] = useState<ShopItem | null>(null)

  // カテゴリーでフィルタリング
  const filteredItems = shopItems.filter(item => {
    if (category === 'all') return true
    return item.type === category
  })

  // 購入処理
  const handlePurchase = () => {
    if (!confirmItem) return

    const result = onPurchase(confirmItem.id)
    if (result.success) {
      setSuccessItem(confirmItem)
    }
    setConfirmItem(null)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-40 bg-gradient-to-b from-purple-100 to-pink-100">
      {/* ヘッダー */}
      <div className="bg-white shadow-md p-4">
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={onClose}
            className="text-2xl text-purple-600 hover:text-purple-800"
          >
            ←
          </button>
          <h1 className="text-xl font-bold text-purple-700">
            ⭐ ポイントショップ
          </h1>
          <PointsDisplay balance={balance} size="sm" showLabel={false} />
        </div>

        {/* カテゴリータブ */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.id)}
              className={`
                flex items-center gap-1 px-3 py-1.5 rounded-full
                font-bold text-sm whitespace-nowrap transition-all
                ${category === cat.id
                  ? 'bg-purple-600 text-white'
                  : 'bg-purple-100 text-purple-600 hover:bg-purple-200'
                }
              `}
            >
              <span>{cat.emoji}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* アイテムグリッド */}
      <div className="flex-1 overflow-y-auto p-4">
        {filteredItems.length === 0 ? (
          <div className="text-center py-12 text-purple-400">
            <span className="text-4xl block mb-2">🏪</span>
            <p>このカテゴリーには アイテムがないよ</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {filteredItems.map(item => (
              <div key={item.id} className="relative">
                <ShopItemCard
                  item={item}
                  canAfford={canPurchase(item.id)}
                  isOwned={purchasedItems.includes(item.id)}
                  onBuy={() => setConfirmItem(item)}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 購入確認モーダル */}
      {confirmItem && (
        <PurchaseConfirmModal
          item={confirmItem}
          balance={balance}
          onConfirm={handlePurchase}
          onCancel={() => setConfirmItem(null)}
        />
      )}

      {/* 購入成功モーダル */}
      {successItem && (
        <PurchaseSuccessModal
          item={successItem}
          onClose={() => setSuccessItem(null)}
        />
      )}
    </div>
  )
}

export default PointsShop
