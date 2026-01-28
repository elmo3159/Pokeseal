/**
 * アップグレードランクシステムのテスト
 */
import { describe, it, expect } from 'vitest'
import {
  UPGRADE_RANKS,
  UPGRADE_REQUIREMENTS,
  STAR_BONUS,
  RANK_NAMES,
  RANK_COLORS,
  RANK_MARK_COUNT,
  RANK_SUFFIX,
  formatNameWithRank,
  getNextRank,
  getUpgradeRequirement,
  getTotalRequiredCount,
  isMaxRank,
  compareRanks,
} from '@/constants/upgradeRanks'

describe('upgradeRanks', () => {
  describe('UPGRADE_RANKS constants', () => {
    it('should have correct values', () => {
      expect(UPGRADE_RANKS.NORMAL).toBe(0)
      expect(UPGRADE_RANKS.SILVER).toBe(1)
      expect(UPGRADE_RANKS.GOLD).toBe(2)
      expect(UPGRADE_RANKS.PRISM).toBe(3)
    })
  })

  describe('UPGRADE_REQUIREMENTS', () => {
    it('should have correct requirements for Silver', () => {
      expect(UPGRADE_REQUIREMENTS[UPGRADE_RANKS.SILVER]).toEqual({
        fromRank: UPGRADE_RANKS.NORMAL,
        count: 5,
      })
    })

    it('should have correct requirements for Gold', () => {
      expect(UPGRADE_REQUIREMENTS[UPGRADE_RANKS.GOLD]).toEqual({
        fromRank: UPGRADE_RANKS.SILVER,
        count: 2,
      })
    })

    it('should have correct requirements for Prism', () => {
      expect(UPGRADE_REQUIREMENTS[UPGRADE_RANKS.PRISM]).toEqual({
        fromRank: UPGRADE_RANKS.GOLD,
        count: 2,
      })
    })
  })

  describe('STAR_BONUS', () => {
    it('should have correct bonus values', () => {
      expect(STAR_BONUS[UPGRADE_RANKS.NORMAL]).toBe(0)
      expect(STAR_BONUS[UPGRADE_RANKS.SILVER]).toBe(1)
      expect(STAR_BONUS[UPGRADE_RANKS.GOLD]).toBe(3)
      expect(STAR_BONUS[UPGRADE_RANKS.PRISM]).toBe(5)
    })
  })

  describe('RANK_NAMES', () => {
    it('should have Japanese names for all ranks', () => {
      expect(RANK_NAMES[UPGRADE_RANKS.NORMAL]).toBe('ノーマル')
      expect(RANK_NAMES[UPGRADE_RANKS.SILVER]).toBe('シルバー')
      expect(RANK_NAMES[UPGRADE_RANKS.GOLD]).toBe('ゴールド')
      expect(RANK_NAMES[UPGRADE_RANKS.PRISM]).toBe('プリズム')
    })
  })

  describe('RANK_COLORS', () => {
    it('should have color definitions for all ranks', () => {
      expect(RANK_COLORS[UPGRADE_RANKS.NORMAL]).toBeDefined()
      expect(RANK_COLORS[UPGRADE_RANKS.SILVER]).toBeDefined()
      expect(RANK_COLORS[UPGRADE_RANKS.GOLD]).toBeDefined()
      expect(RANK_COLORS[UPGRADE_RANKS.PRISM]).toBeDefined()
    })

    it('should have primary, secondary, and glow properties', () => {
      for (const rank of [UPGRADE_RANKS.NORMAL, UPGRADE_RANKS.SILVER, UPGRADE_RANKS.GOLD, UPGRADE_RANKS.PRISM]) {
        expect(RANK_COLORS[rank]).toHaveProperty('primary')
        expect(RANK_COLORS[rank]).toHaveProperty('secondary')
        expect(RANK_COLORS[rank]).toHaveProperty('glow')
      }
    })
  })

  describe('RANK_MARK_COUNT', () => {
    it('should have correct mark counts', () => {
      expect(RANK_MARK_COUNT[UPGRADE_RANKS.NORMAL]).toBe(0)
      expect(RANK_MARK_COUNT[UPGRADE_RANKS.SILVER]).toBe(1)
      expect(RANK_MARK_COUNT[UPGRADE_RANKS.GOLD]).toBe(2)
      expect(RANK_MARK_COUNT[UPGRADE_RANKS.PRISM]).toBe(3)
    })
  })

  describe('RANK_SUFFIX', () => {
    it('should have correct suffixes', () => {
      expect(RANK_SUFFIX[UPGRADE_RANKS.NORMAL]).toBe('')
      expect(RANK_SUFFIX[UPGRADE_RANKS.SILVER]).toBe(' SR')
      expect(RANK_SUFFIX[UPGRADE_RANKS.GOLD]).toBe(' SSR')
      expect(RANK_SUFFIX[UPGRADE_RANKS.PRISM]).toBe(' UR')
    })
  })

  describe('formatNameWithRank', () => {
    it('should add correct suffix for each rank', () => {
      expect(formatNameWithRank('ポフン', UPGRADE_RANKS.NORMAL)).toBe('ポフン')
      expect(formatNameWithRank('ポフン', UPGRADE_RANKS.SILVER)).toBe('ポフン SR')
      expect(formatNameWithRank('ポフン', UPGRADE_RANKS.GOLD)).toBe('ポフン SSR')
      expect(formatNameWithRank('ポフン', UPGRADE_RANKS.PRISM)).toBe('ポフン UR')
    })
  })

  describe('getNextRank', () => {
    it('should return next rank correctly', () => {
      expect(getNextRank(UPGRADE_RANKS.NORMAL)).toBe(UPGRADE_RANKS.SILVER)
      expect(getNextRank(UPGRADE_RANKS.SILVER)).toBe(UPGRADE_RANKS.GOLD)
      expect(getNextRank(UPGRADE_RANKS.GOLD)).toBe(UPGRADE_RANKS.PRISM)
    })

    it('should return null for max rank', () => {
      expect(getNextRank(UPGRADE_RANKS.PRISM)).toBeNull()
    })
  })

  describe('getUpgradeRequirement', () => {
    it('should return correct requirements', () => {
      expect(getUpgradeRequirement(UPGRADE_RANKS.SILVER)).toEqual({
        fromRank: UPGRADE_RANKS.NORMAL,
        count: 5,
      })
      expect(getUpgradeRequirement(UPGRADE_RANKS.GOLD)).toEqual({
        fromRank: UPGRADE_RANKS.SILVER,
        count: 2,
      })
      expect(getUpgradeRequirement(UPGRADE_RANKS.PRISM)).toEqual({
        fromRank: UPGRADE_RANKS.GOLD,
        count: 2,
      })
    })

    it('should return null for Normal rank', () => {
      expect(getUpgradeRequirement(UPGRADE_RANKS.NORMAL)).toBeNull()
    })
  })

  describe('getTotalRequiredCount', () => {
    it('should return correct cumulative counts', () => {
      expect(getTotalRequiredCount(UPGRADE_RANKS.NORMAL)).toBe(1)
      expect(getTotalRequiredCount(UPGRADE_RANKS.SILVER)).toBe(5)
      expect(getTotalRequiredCount(UPGRADE_RANKS.GOLD)).toBe(10)
      expect(getTotalRequiredCount(UPGRADE_RANKS.PRISM)).toBe(20)
    })
  })

  describe('isMaxRank', () => {
    it('should return true only for Prism', () => {
      expect(isMaxRank(UPGRADE_RANKS.NORMAL)).toBe(false)
      expect(isMaxRank(UPGRADE_RANKS.SILVER)).toBe(false)
      expect(isMaxRank(UPGRADE_RANKS.GOLD)).toBe(false)
      expect(isMaxRank(UPGRADE_RANKS.PRISM)).toBe(true)
    })
  })

  describe('compareRanks', () => {
    it('should compare ranks correctly', () => {
      expect(compareRanks(UPGRADE_RANKS.NORMAL, UPGRADE_RANKS.SILVER)).toBeLessThan(0)
      expect(compareRanks(UPGRADE_RANKS.GOLD, UPGRADE_RANKS.SILVER)).toBeGreaterThan(0)
      expect(compareRanks(UPGRADE_RANKS.PRISM, UPGRADE_RANKS.PRISM)).toBe(0)
    })
  })
})
