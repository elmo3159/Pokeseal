'use client'

import React, { useState } from 'react'
import {
  AdminMode,
  SavedUserData,
  exportData,
  importData,
  resetAllData,
  TestUser,
  TEST_USERS,
  resetTestUserData,
  resetAllTestUsersData,
} from '@/utils/persistence'
import { Sticker } from '@/features/sticker-book'

interface AdminViewProps {
  adminMode: AdminMode
  userData: SavedUserData
  allStickers: Sticker[]
  currentTestUser: TestUser
  onChangeMode: (mode: AdminMode) => void
  onSwitchUser: (userId: string) => void
  onGrantCurrency: (type: 'tickets' | 'gems' | 'stars', amount: number) => void
  onGrantSticker: (stickerId: string, quantity: number) => void
  onGrantAllStickers: () => void
  onResetCollection: () => void
  onResetAll: () => void
  onClose: () => void
}

export function AdminView({
  adminMode,
  userData,
  allStickers,
  currentTestUser,
  onChangeMode,
  onSwitchUser,
  onGrantCurrency,
  onGrantSticker,
  onGrantAllStickers,
  onResetCollection,
  onResetAll,
  onClose,
}: AdminViewProps) {
  const [selectedTab, setSelectedTab] = useState<'user' | 'mode' | 'currency' | 'sticker' | 'data'>('user')
  const [currencyAmount, setCurrencyAmount] = useState(100)
  const [selectedStickerId, setSelectedStickerId] = useState<string>('')
  const [stickerQuantity, setStickerQuantity] = useState(1)
  const [importText, setImportText] = useState('')
  const [showExportData, setShowExportData] = useState(false)
  const [exportedData, setExportedData] = useState('')

  // 所持シール数を計算
  const ownedStickersCount = userData.collection.reduce((sum, item) => sum + item.quantity, 0)
  const uniqueStickersCount = userData.collection.filter(item => item.quantity > 0).length

  const handleExport = () => {
    const data = exportData()
    if (data) {
      setExportedData(data)
      setShowExportData(true)
    }
  }

  const handleImport = () => {
    if (importText.trim()) {
      const success = importData(importText)
      if (success) {
        alert('データをインポートしました。ページを再読み込みしてください。')
        window.location.reload()
      } else {
        alert('インポートに失敗しました。JSONの形式を確認してください。')
      }
    }
  }

  const handleReset = () => {
    if (confirm('本当にすべてのデータをリセットしますか？この操作は取り消せません。')) {
      onResetAll()
    }
  }

  return (
    <div className="fixed inset-0 bg-black/80 z-[9999] flex items-center justify-center p-4">
      <div
        className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-hidden flex flex-col"
        style={{ fontFamily: "'M PLUS Rounded 1c', sans-serif" }}
      >
        {/* ヘッダー */}
        <div
          className="px-4 py-3 flex items-center justify-between shrink-0"
          style={{
            background: 'linear-gradient(135deg, #1F2937 0%, #374151 100%)',
          }}
        >
          <h2 className="text-white font-bold">🔧 管理者パネル</h2>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white text-xl"
          >
            ×
          </button>
        </div>

        {/* モード表示 */}
        <div
          className={`px-4 py-2 text-center text-sm font-bold ${
            adminMode === 'test'
              ? 'bg-yellow-400 text-yellow-900'
              : 'bg-green-400 text-green-900'
          }`}
        >
          {adminMode === 'test' ? '🧪 テストモード' : '🌐 本番モード'}
        </div>

        {/* タブ */}
        <div className="flex border-b border-gray-200 shrink-0">
          {[
            { id: 'user', label: 'ユーザー' },
            { id: 'mode', label: 'モード' },
            { id: 'currency', label: '通貨' },
            { id: 'sticker', label: 'シール' },
            { id: 'data', label: 'データ' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id as typeof selectedTab)}
              className={`flex-1 py-2 text-sm font-bold transition-colors ${
                selectedTab === tab.id
                  ? 'text-purple-600 border-b-2 border-purple-600'
                  : 'text-gray-500'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* コンテンツ */}
        <div className="flex-1 overflow-y-auto p-4">
          {selectedTab === 'user' && (
            <div className="space-y-4">
              {/* 現在のユーザー */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="font-bold text-gray-700 mb-2">現在のテストユーザー</h3>
                <div
                  className="flex items-center gap-3 p-3 rounded-lg"
                  style={{ backgroundColor: currentTestUser.color + '20', border: `2px solid ${currentTestUser.color}` }}
                >
                  <span className="text-3xl">{currentTestUser.emoji}</span>
                  <div>
                    <div className="font-bold" style={{ color: currentTestUser.color }}>
                      {currentTestUser.name}
                    </div>
                    <div className="text-xs text-gray-500">
                      ID: {currentTestUser.id}
                    </div>
                  </div>
                </div>
              </div>

              {/* ユーザー切り替え */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="font-bold text-gray-700 mb-2">ユーザーを切り替え</h3>
                <p className="text-xs text-gray-500 mb-3">
                  異なるテストユーザーで操作して交換機能などをテストできます。
                  各ユーザーは独立したデータを持ちます。
                </p>
                <div className="space-y-2">
                  {TEST_USERS.map(user => (
                    <button
                      key={user.id}
                      onClick={() => onSwitchUser(user.id)}
                      disabled={user.id === currentTestUser.id}
                      className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all ${
                        user.id === currentTestUser.id
                          ? 'opacity-50 cursor-not-allowed'
                          : 'hover:scale-[1.02] active:scale-[0.98]'
                      }`}
                      style={{
                        backgroundColor: user.id === currentTestUser.id ? user.color + '40' : user.color + '20',
                        border: `2px solid ${user.color}`,
                      }}
                    >
                      <span className="text-2xl">{user.emoji}</span>
                      <div className="text-left flex-1">
                        <div className="font-bold" style={{ color: user.color }}>
                          {user.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          {user.id === currentTestUser.id ? '（現在選択中）' : 'タップで切り替え'}
                        </div>
                      </div>
                      {user.id === currentTestUser.id && (
                        <span className="text-lg">✓</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* ユーザーデータリセット */}
              <div className="bg-red-50 rounded-xl p-4">
                <h3 className="font-bold text-red-700 mb-2">⚠️ テストユーザーデータ管理</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => {
                      if (confirm(`${currentTestUser.name}のデータをリセットしますか？`)) {
                        resetTestUserData(currentTestUser.id)
                        window.location.reload()
                      }
                    }}
                    className="w-full py-2 bg-orange-500 text-white rounded-lg font-bold text-sm"
                  >
                    🗑️ 現在のユーザーをリセット
                  </button>
                  <button
                    onClick={() => {
                      if (confirm('全てのテストユーザーのデータをリセットしますか？\nこの操作は取り消せません。')) {
                        resetAllTestUsersData()
                        window.location.reload()
                      }
                    }}
                    className="w-full py-2 bg-red-500 text-white rounded-lg font-bold text-sm"
                  >
                    🗑️ 全ユーザーをリセット
                  </button>
                </div>
              </div>
            </div>
          )}

          {selectedTab === 'mode' && (
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="font-bold text-gray-700 mb-2">モード切替</h3>
                <p className="text-xs text-gray-500 mb-3">
                  テストモード: 全シール所持、通貨無限<br />
                  本番モード: 一般ユーザーと同じ
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => onChangeMode('production')}
                    className={`flex-1 py-2 rounded-lg font-bold text-sm transition-all ${
                      adminMode === 'production'
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    本番モード
                  </button>
                  <button
                    onClick={() => onChangeMode('test')}
                    className={`flex-1 py-2 rounded-lg font-bold text-sm transition-all ${
                      adminMode === 'test'
                        ? 'bg-yellow-500 text-white'
                        : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    テストモード
                  </button>
                </div>
              </div>

              {/* 現在の状態 */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="font-bold text-gray-700 mb-2">現在の状態</h3>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">シルチケ</span>
                    <span className="font-bold">{userData.monetization.tickets}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">プレシル</span>
                    <span className="font-bold">{userData.monetization.gems}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">どろっぷ</span>
                    <span className="font-bold">{userData.monetization.stars.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">所持シール</span>
                    <span className="font-bold">{uniqueStickersCount}種 / {ownedStickersCount}枚</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">EXP</span>
                    <span className="font-bold">{userData.profile.totalExp}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {selectedTab === 'currency' && (
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="font-bold text-gray-700 mb-2">通貨付与</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm text-gray-500">付与数</label>
                    <input
                      type="number"
                      value={currencyAmount}
                      onChange={(e) => setCurrencyAmount(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => onGrantCurrency('tickets', currencyAmount)}
                      className="flex-1 py-2 bg-pink-500 text-white rounded-lg font-bold text-sm"
                    >
                      🎫 シルチケ
                    </button>
                    <button
                      onClick={() => onGrantCurrency('gems', currencyAmount)}
                      className="flex-1 py-2 bg-blue-500 text-white rounded-lg font-bold text-sm"
                    >
                      💎 プレシル
                    </button>
                    <button
                      onClick={() => onGrantCurrency('stars', currencyAmount)}
                      className="flex-1 py-2 bg-yellow-500 text-white rounded-lg font-bold text-sm"
                    >
                      💧 どろっぷ
                    </button>
                  </div>
                </div>
              </div>

              {/* クイック付与 */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="font-bold text-gray-700 mb-2">クイック付与</h3>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => onGrantCurrency('tickets', 100)}
                    className="py-2 bg-pink-100 text-pink-600 rounded-lg font-bold text-sm"
                  >
                    +100 シルチケ
                  </button>
                  <button
                    onClick={() => onGrantCurrency('gems', 100)}
                    className="py-2 bg-blue-100 text-blue-600 rounded-lg font-bold text-sm"
                  >
                    +100 プレシル
                  </button>
                  <button
                    onClick={() => onGrantCurrency('stars', 1000)}
                    className="py-2 bg-yellow-100 text-yellow-600 rounded-lg font-bold text-sm"
                  >
                    +1000 どろっぷ
                  </button>
                  <button
                    onClick={() => onGrantCurrency('stars', 10000)}
                    className="py-2 bg-yellow-100 text-yellow-600 rounded-lg font-bold text-sm"
                  >
                    +10000 どろっぷ
                  </button>
                </div>
              </div>
            </div>
          )}

          {selectedTab === 'sticker' && (
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="font-bold text-gray-700 mb-2">シール付与</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm text-gray-500">シール選択</label>
                    <select
                      value={selectedStickerId}
                      onChange={(e) => setSelectedStickerId(e.target.value)}
                      className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    >
                      <option value="">-- 選択してください --</option>
                      {allStickers.map(sticker => (
                        <option key={sticker.id} value={sticker.id}>
                          {'★'.repeat(sticker.rarity)} {sticker.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">枚数</label>
                    <input
                      type="number"
                      value={stickerQuantity}
                      onChange={(e) => setStickerQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg"
                      min="1"
                      max="99"
                    />
                  </div>
                  <button
                    onClick={() => selectedStickerId && onGrantSticker(selectedStickerId, stickerQuantity)}
                    disabled={!selectedStickerId}
                    className="w-full py-2 bg-purple-500 text-white rounded-lg font-bold text-sm disabled:opacity-50"
                  >
                    シールを付与
                  </button>
                </div>
              </div>

              {/* 一括操作 */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="font-bold text-gray-700 mb-2">一括操作</h3>
                <div className="space-y-2">
                  <button
                    onClick={onGrantAllStickers}
                    className="w-full py-2 bg-green-500 text-white rounded-lg font-bold text-sm"
                  >
                    🎁 全シールを1枚ずつ付与
                  </button>
                  <button
                    onClick={() => {
                      if (confirm('コレクションをリセットしますか？')) {
                        onResetCollection()
                      }
                    }}
                    className="w-full py-2 bg-red-100 text-red-600 rounded-lg font-bold text-sm"
                  >
                    🗑️ コレクションをリセット
                  </button>
                </div>
              </div>
            </div>
          )}

          {selectedTab === 'data' && (
            <div className="space-y-4">
              {/* エクスポート */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="font-bold text-gray-700 mb-2">データエクスポート</h3>
                <button
                  onClick={handleExport}
                  className="w-full py-2 bg-blue-500 text-white rounded-lg font-bold text-sm"
                >
                  📤 データをエクスポート
                </button>
                {showExportData && (
                  <textarea
                    readOnly
                    value={exportedData}
                    className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-lg text-xs h-32"
                    onClick={(e) => (e.target as HTMLTextAreaElement).select()}
                  />
                )}
              </div>

              {/* インポート */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="font-bold text-gray-700 mb-2">データインポート</h3>
                <textarea
                  value={importText}
                  onChange={(e) => setImportText(e.target.value)}
                  placeholder="JSONデータを貼り付け..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs h-24"
                />
                <button
                  onClick={handleImport}
                  disabled={!importText.trim()}
                  className="w-full mt-2 py-2 bg-green-500 text-white rounded-lg font-bold text-sm disabled:opacity-50"
                >
                  📥 データをインポート
                </button>
              </div>

              {/* リセット */}
              <div className="bg-red-50 rounded-xl p-4">
                <h3 className="font-bold text-red-700 mb-2">⚠️ 危険ゾーン</h3>
                <button
                  onClick={handleReset}
                  className="w-full py-2 bg-red-500 text-white rounded-lg font-bold text-sm"
                >
                  🗑️ 全データをリセット
                </button>
                <p className="text-xs text-red-500 mt-2">
                  この操作は取り消せません。すべてのデータが削除されます。
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminView
