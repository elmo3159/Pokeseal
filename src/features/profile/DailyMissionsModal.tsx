'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { DailyMissionPanel } from '@/components/missions/DailyMissionPanel'
import type { UserDailyMission } from '@/services/dailyMissions/dailyMissionService'

interface DailyMissionsModalProps {
  isOpen: boolean
  onClose: () => void
  userId: string
  onRewardClaimed?: (mission: UserDailyMission) => void
}

export const DailyMissionsModal: React.FC<DailyMissionsModalProps> = ({
  isOpen,
  onClose,
  userId,
  onRewardClaimed,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '16px',
          }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            style={{
              background: 'linear-gradient(to bottom, #FFF5F8, #FFE5EF)',
              borderRadius: '24px',
              padding: '24px',
              maxWidth: '500px',
              width: '100%',
              maxHeight: '80vh',
              overflowY: 'auto',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
              fontFamily: "'M PLUS Rounded 1c', sans-serif",
            }}
          >
            {/* ヘッダー */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '16px',
              marginLeft: '-24px',
              marginRight: '-24px',
              marginTop: '-24px',
              padding: '16px 24px',
              backgroundImage: 'url(/images/Header_UI.png)',
              backgroundSize: '100% 100%',
              backgroundPosition: 'center top',
              backgroundRepeat: 'no-repeat',
            }}>
              <h2 style={{
                margin: 0,
                color: '#FFFFFF',
                fontSize: '20px',
                fontWeight: 'bold',
                textShadow: '0 1px 3px rgba(157, 76, 108, 0.6), 0 0 8px rgba(255, 255, 255, 0.3)',
              }}>
                📋 デイリーミッション
              </h2>
              <button
                onClick={onClose}
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  border: 'none',
                  background: 'rgba(255, 255, 255, 0.8)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '18px',
                  color: '#9D4C6C',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                }}
              >
                ✕
              </button>
            </div>

            {/* ミッションパネル */}
            <DailyMissionPanel
              userId={userId}
              onRewardClaimed={onRewardClaimed}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default DailyMissionsModal
