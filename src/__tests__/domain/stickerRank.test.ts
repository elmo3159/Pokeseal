/**
 * シールランクシステムのテスト
 */
import { describe, it, expect } from 'vitest'
import {
  calculateStickerPoints,
  convertToStarPoints,
  getRankEffect,
  getRankColor,
  getRankGradient,
  STICKER_POINTS,
  starPointsPerRarity,
  UPGRADE_RANKS,
} from '@/domain/stickerRank'

describe('stickerRank', () => {
  describe('calculateStickerPoints', () => {
    it('should return correct points for Normal rank', () => {
      expect(calculateStickerPoints(1, UPGRADE_RANKS.NORMAL)).toBe(5)
      expect(calculateStickerPoints(3, UPGRADE_RANKS.NORMAL)).toBe(50)
      expect(calculateStickerPoints(5, UPGRADE_RANKS.NORMAL)).toBe(500)
    })

    it('should return correct points for Silver rank', () => {
      expect(calculateStickerPoints(1, UPGRADE_RANKS.SILVER)).toBe(20)
      expect(calculateStickerPoints(3, UPGRADE_RANKS.SILVER)).toBe(100)
      expect(calculateStickerPoints(5, UPGRADE_RANKS.SILVER)).toBe(750)
    })

    it('should return correct points for Gold rank', () => {
      expect(calculateStickerPoints(1, UPGRADE_RANKS.GOLD)).toBe(60)
      expect(calculateStickerPoints(3, UPGRADE_RANKS.GOLD)).toBe(200)
      expect(calculateStickerPoints(5, UPGRADE_RANKS.GOLD)).toBe(1250)
    })

    it('should return correct points for Prism rank', () => {
      expect(calculateStickerPoints(1, UPGRADE_RANKS.PRISM)).toBe(100)
      expect(calculateStickerPoints(3, UPGRADE_RANKS.PRISM)).toBe(600)
      expect(calculateStickerPoints(5, UPGRADE_RANKS.PRISM)).toBe(3000)
    })

    it('should clamp rarity to valid range', () => {
      // Rarity below 1 should be clamped to 1
      expect(calculateStickerPoints(0, UPGRADE_RANKS.NORMAL)).toBe(5)
      expect(calculateStickerPoints(-1, UPGRADE_RANKS.NORMAL)).toBe(5)

      // Rarity above 5 should be clamped to 5
      expect(calculateStickerPoints(6, UPGRADE_RANKS.NORMAL)).toBe(500)
      expect(calculateStickerPoints(10, UPGRADE_RANKS.NORMAL)).toBe(500)
    })

    it('should clamp rank to valid range', () => {
      // Rank below 0 should be clamped to 0
      expect(calculateStickerPoints(1, -1 as any)).toBe(5)

      // Rank above 3 should be clamped to 3
      expect(calculateStickerPoints(1, 4 as any)).toBe(100)
    })

    it('should use default rank 0 when not provided', () => {
      expect(calculateStickerPoints(3)).toBe(50)
    })
  })

  describe('convertToStarPoints', () => {
    it('should multiply points by quantity', () => {
      expect(convertToStarPoints(1, UPGRADE_RANKS.NORMAL, 1)).toBe(5)
      expect(convertToStarPoints(1, UPGRADE_RANKS.NORMAL, 5)).toBe(25)
      expect(convertToStarPoints(3, UPGRADE_RANKS.PRISM, 2)).toBe(1200)
    })

    it('should default to quantity 1', () => {
      expect(convertToStarPoints(1, UPGRADE_RANKS.NORMAL)).toBe(5)
    })
  })

  describe('getRankEffect', () => {
    it('should return correct effect for each rank', () => {
      expect(getRankEffect(UPGRADE_RANKS.NORMAL)).toBe('none')
      expect(getRankEffect(UPGRADE_RANKS.SILVER)).toBe('glow')
      expect(getRankEffect(UPGRADE_RANKS.GOLD)).toBe('sparkle')
      expect(getRankEffect(UPGRADE_RANKS.PRISM)).toBe('prism')
    })
  })

  describe('getRankColor', () => {
    it('should return correct color for each rank', () => {
      expect(getRankColor(UPGRADE_RANKS.NORMAL)).toBe('#FFD700')
      expect(getRankColor(UPGRADE_RANKS.SILVER)).toBe('#C0C0C0')
      expect(getRankColor(UPGRADE_RANKS.GOLD)).toBe('#FFD700')
      expect(getRankColor(UPGRADE_RANKS.PRISM)).toBe('#FF69B4')
    })
  })

  describe('getRankGradient', () => {
    it('should return correct gradient for each rank', () => {
      expect(getRankGradient(UPGRADE_RANKS.NORMAL)).toBe('from-yellow-400 to-amber-500')
      expect(getRankGradient(UPGRADE_RANKS.SILVER)).toBe('from-slate-300 to-slate-400')
      expect(getRankGradient(UPGRADE_RANKS.GOLD)).toBe('from-yellow-300 to-amber-400')
      expect(getRankGradient(UPGRADE_RANKS.PRISM)).toBe('from-pink-400 via-purple-400 to-cyan-400')
    })
  })

  describe('STICKER_POINTS table', () => {
    it('should have correct structure for all rarities', () => {
      for (let rarity = 1; rarity <= 5; rarity++) {
        expect(STICKER_POINTS[rarity]).toBeDefined()
        expect(STICKER_POINTS[rarity][0]).toBeDefined()
        expect(STICKER_POINTS[rarity][1]).toBeDefined()
        expect(STICKER_POINTS[rarity][2]).toBeDefined()
        expect(STICKER_POINTS[rarity][3]).toBeDefined()
      }
    })

    it('should have increasing points for higher upgrade ranks', () => {
      for (let rarity = 1; rarity <= 5; rarity++) {
        const normal = STICKER_POINTS[rarity][0]
        const silver = STICKER_POINTS[rarity][1]
        const gold = STICKER_POINTS[rarity][2]
        const prism = STICKER_POINTS[rarity][3]

        expect(silver).toBeGreaterThan(normal)
        expect(gold).toBeGreaterThan(silver)
        expect(prism).toBeGreaterThan(gold)
      }
    })

    it('should have increasing points for higher rarities', () => {
      for (let rank = 0; rank <= 3; rank++) {
        for (let rarity = 1; rarity < 5; rarity++) {
          expect(STICKER_POINTS[rarity + 1][rank]).toBeGreaterThan(STICKER_POINTS[rarity][rank])
        }
      }
    })
  })

  describe('starPointsPerRarity', () => {
    it('should match STICKER_POINTS Normal rank values', () => {
      for (let rarity = 1; rarity <= 5; rarity++) {
        expect(starPointsPerRarity[rarity]).toBe(STICKER_POINTS[rarity][0])
      }
    })
  })
})
