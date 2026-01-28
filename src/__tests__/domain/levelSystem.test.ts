/**
 * レベルシステムのテスト
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import {
  calculateLevel,
  getCurrentLevelExp,
  getExpToNextLevel,
  getLevelTitle,
  addExp,
  addExpWithDailyLimit,
  getLevelUpRewards,
  getLevelProgress,
  hasReachedDailyLimit,
  getRemainingDailyCount,
  updateDailyCount,
  createInitialDailyCounts,
  getTodayDateString,
  MAX_LEVEL,
  MAX_TOTAL_EXP,
  EXP_REWARDS,
  EXP_DAILY_LIMITS,
  LEVEL_EXP_REQUIREMENTS,
  LEVEL_TITLES,
  type DailyActionCounts,
} from '@/domain/levelSystem'

describe('levelSystem', () => {
  describe('calculateLevel', () => {
    it('should return level 1 for 0 exp', () => {
      expect(calculateLevel(0)).toBe(1)
    })

    it('should return level 1 for exp below level 2 threshold', () => {
      const level2Exp = LEVEL_EXP_REQUIREMENTS[1]
      expect(calculateLevel(level2Exp - 1)).toBe(1)
    })

    it('should return level 2 for exp between level 2 and 3', () => {
      const level2Exp = LEVEL_EXP_REQUIREMENTS[1]
      const level3Exp = LEVEL_EXP_REQUIREMENTS[2]
      expect(calculateLevel(level2Exp)).toBe(2)
      expect(calculateLevel(level3Exp - 1)).toBe(2)
    })

    it('should return correct level for various exp values', () => {
      expect(calculateLevel(LEVEL_EXP_REQUIREMENTS[2])).toBe(3)
      expect(calculateLevel(LEVEL_EXP_REQUIREMENTS[4])).toBe(5)
      expect(calculateLevel(LEVEL_EXP_REQUIREMENTS[9])).toBe(10)
    })

    it('should return max level for very high exp', () => {
      expect(calculateLevel(LEVEL_EXP_REQUIREMENTS[MAX_LEVEL - 1])).toBe(MAX_LEVEL)
      expect(calculateLevel(LEVEL_EXP_REQUIREMENTS[MAX_LEVEL - 1] + 100000)).toBe(MAX_LEVEL)
    })
  })

  describe('getCurrentLevelExp', () => {
    it('should return 0 for level 1 start', () => {
      expect(getCurrentLevelExp(0)).toBe(0)
    })

    it('should return correct exp within level', () => {
      const level2Start = LEVEL_EXP_REQUIREMENTS[1]
      const level3Start = LEVEL_EXP_REQUIREMENTS[2]
      expect(getCurrentLevelExp(level2Start + 50)).toBe(50)
      expect(getCurrentLevelExp(level3Start + 50)).toBe(50)
    })
  })

  describe('getExpToNextLevel', () => {
    it('should return correct exp needed for next level', () => {
      const level2Exp = LEVEL_EXP_REQUIREMENTS[1]
      const level3Exp = LEVEL_EXP_REQUIREMENTS[2]
      expect(getExpToNextLevel(0)).toBe(level2Exp)
      expect(getExpToNextLevel(level2Exp)).toBe(level3Exp - level2Exp)
    })

    it('should return 0 for max level', () => {
      expect(getExpToNextLevel(LEVEL_EXP_REQUIREMENTS[MAX_LEVEL - 1])).toBe(0)
      expect(getExpToNextLevel(LEVEL_EXP_REQUIREMENTS[MAX_LEVEL - 1] + 50000)).toBe(0)
    })
  })

  describe('getLevelTitle', () => {
    it('should return correct title for each level', () => {
      expect(getLevelTitle(1)).toBe('シールあつめびと')
      expect(getLevelTitle(5)).toBe('シールマイスター')
      expect(getLevelTitle(10)).toBe('シールスター')
      expect(getLevelTitle(20)).toBe('シールでんせつ')
      expect(getLevelTitle(50)).toBe('シールかいおう')
      expect(getLevelTitle(100)).toBe('シールぜんのうしん')
    })

    it('should return max level title for levels above max', () => {
      expect(getLevelTitle(120)).toBe('シールぜんのうしん')
    })
  })

  describe('addExp', () => {
    it('should add experience correctly', () => {
      const result = addExp(0, 'gacha_single')
      expect(result.expGained).toBe(EXP_REWARDS.gacha_single)
      expect(result.newTotalExp).toBe(10)
      expect(result.oldLevel).toBe(1)
      expect(result.newLevel).toBe(1)
      expect(result.leveledUp).toBe(false)
    })

    it('should not exceed max total exp', () => {
      const result = addExp(MAX_TOTAL_EXP, 'gacha_single')
      expect(result.newTotalExp).toBe(MAX_TOTAL_EXP)
      expect(result.expGained).toBe(0)
      expect(result.newLevel).toBe(MAX_LEVEL)
      expect(result.leveledUp).toBe(false)
    })

    it('should detect level up', () => {
      const result = addExp(95, 'gacha_single') // 95 + 10 = 105 -> Level 2
      expect(result.leveledUp).toBe(true)
      expect(result.oldLevel).toBe(1)
      expect(result.newLevel).toBe(2)
      expect(result.levelsGained).toBe(1)
    })

    it('should handle multiple level ups', () => {
      const result = addExp(95, 'gacha_ten') // 95 + 100 = 195 -> Level 2
      expect(result.leveledUp).toBe(true)
      expect(result.newLevel).toBe(2)
    })
  })

  describe('getLevelUpRewards', () => {
    it('should always include title unlock', () => {
      const rewards = getLevelUpRewards(1)
      expect(rewards.some(r => r.type === 'title_unlock')).toBe(true)
    })

    it('should include gacha ticket every 5 levels', () => {
      const rewards5 = getLevelUpRewards(5)
      expect(rewards5.some(r => r.type === 'gacha_ticket')).toBe(true)

      const rewards10 = getLevelUpRewards(10)
      expect(rewards10.some(r => r.type === 'gacha_ticket')).toBe(true)

      const rewards3 = getLevelUpRewards(3)
      expect(rewards3.some(r => r.type === 'gacha_ticket')).toBe(false)
    })

    it('should include theme unlock every 10 levels', () => {
      const rewards10 = getLevelUpRewards(10)
      expect(rewards10.some(r => r.type === 'theme_unlock')).toBe(true)

      const rewards5 = getLevelUpRewards(5)
      expect(rewards5.some(r => r.type === 'theme_unlock')).toBe(false)
    })
  })

  describe('getLevelProgress', () => {
    it('should return 0 at level start', () => {
      expect(getLevelProgress(0)).toBe(0)
      expect(getLevelProgress(LEVEL_EXP_REQUIREMENTS[1])).toBe(0)
    })

    it('should return 100 at max level', () => {
      expect(getLevelProgress(LEVEL_EXP_REQUIREMENTS[MAX_LEVEL - 1])).toBe(100)
      expect(getLevelProgress(LEVEL_EXP_REQUIREMENTS[MAX_LEVEL - 1] + 50000)).toBe(100)
    })

    it('should return correct progress percentage', () => {
      const level2Exp = LEVEL_EXP_REQUIREMENTS[1]
      expect(getLevelProgress(Math.floor(level2Exp / 2))).toBe(50)
    })
  })

  describe('Daily Limits', () => {
    const mockDate = '2024-12-27'

    beforeEach(() => {
      vi.useFakeTimers()
      vi.setSystemTime(new Date('2024-12-27T12:00:00Z'))
    })

    afterEach(() => {
      vi.useRealTimers()
    })

    describe('getTodayDateString', () => {
      it('should return correct date format', () => {
        const date = getTodayDateString()
        expect(date).toMatch(/^\d{4}-\d{2}-\d{2}$/)
      })
    })

    describe('createInitialDailyCounts', () => {
      it('should create empty counts with today date', () => {
        const counts = createInitialDailyCounts()
        expect(counts.date).toBe(mockDate)
        expect(counts.counts).toEqual({})
      })
    })

    describe('hasReachedDailyLimit', () => {
      it('should return false for unlimited actions', () => {
        const counts: DailyActionCounts = {
          date: mockDate,
          counts: { gacha_single: 100 },
        }
        expect(hasReachedDailyLimit('gacha_single', counts)).toBe(false)
      })

      it('should return true when limit is reached', () => {
        const counts: DailyActionCounts = {
          date: mockDate,
          counts: { place_sticker: 30 }, // Limit is 30
        }
        expect(hasReachedDailyLimit('place_sticker', counts)).toBe(true)
      })

      it('should return false when under limit', () => {
        const counts: DailyActionCounts = {
          date: mockDate,
          counts: { place_sticker: 10 },
        }
        expect(hasReachedDailyLimit('place_sticker', counts)).toBe(false)
      })

      it('should reset on new day', () => {
        const counts: DailyActionCounts = {
          date: '2024-12-26', // Yesterday
          counts: { place_sticker: 20 },
        }
        expect(hasReachedDailyLimit('place_sticker', counts)).toBe(false)
      })
    })

    describe('getRemainingDailyCount', () => {
      it('should return null for unlimited actions', () => {
        const counts: DailyActionCounts = {
          date: mockDate,
          counts: {},
        }
        expect(getRemainingDailyCount('gacha_single', counts)).toBeNull()
      })

      it('should return correct remaining count', () => {
        const counts: DailyActionCounts = {
          date: mockDate,
          counts: { place_sticker: 15 },
        }
        expect(getRemainingDailyCount('place_sticker', counts)).toBe(15) // 30 - 15
      })

      it('should return full limit for new day', () => {
        const counts: DailyActionCounts = {
          date: '2024-12-26',
          counts: { place_sticker: 30 },
        }
        expect(getRemainingDailyCount('place_sticker', counts)).toBe(30)
      })
    })

    describe('updateDailyCount', () => {
      it('should increment count for same day', () => {
        const counts: DailyActionCounts = {
          date: mockDate,
          counts: { place_sticker: 5 },
        }
        const updated = updateDailyCount(counts, 'place_sticker')
        expect(updated.counts.place_sticker).toBe(6)
      })

      it('should reset counts for new day', () => {
        const counts: DailyActionCounts = {
          date: '2024-12-26',
          counts: { place_sticker: 20 },
        }
        const updated = updateDailyCount(counts, 'place_sticker')
        expect(updated.date).toBe(mockDate)
        expect(updated.counts.place_sticker).toBe(1)
      })
    })

    describe('addExpWithDailyLimit', () => {
      it('should not add exp when limit reached', () => {
        const counts: DailyActionCounts = {
          date: mockDate,
          counts: { place_sticker: 30 },
        }
        const result = addExpWithDailyLimit(100, 'place_sticker', counts)
        expect(result.expGained).toBe(0)
        expect(result.dailyLimitReached).toBe(true)
        expect(result.newTotalExp).toBe(100) // Unchanged
      })

      it('should add exp and update counts when under limit', () => {
        const counts: DailyActionCounts = {
          date: mockDate,
          counts: { place_sticker: 10 },
        }
        const result = addExpWithDailyLimit(100, 'place_sticker', counts)
        expect(result.expGained).toBe(EXP_REWARDS.place_sticker)
        expect(result.newDailyCounts.counts.place_sticker).toBe(11)
      })
    })
  })

  describe('Constants', () => {
    it('should have correct MAX_LEVEL', () => {
      expect(MAX_LEVEL).toBe(100)
    })

    it('should have LEVEL_EXP_REQUIREMENTS for all levels', () => {
      expect(LEVEL_EXP_REQUIREMENTS.length).toBe(MAX_LEVEL)
    })

    it('should have LEVEL_TITLES for all levels', () => {
      expect(LEVEL_TITLES[1]).toBeDefined()
      expect(LEVEL_TITLES[5]).toBeDefined()
      expect(LEVEL_TITLES[10]).toBeDefined()
      expect(LEVEL_TITLES[20]).toBeDefined()
      expect(LEVEL_TITLES[50]).toBeDefined()
      expect(LEVEL_TITLES[100]).toBeDefined()
    })

    it('should have increasing exp requirements', () => {
      for (let i = 1; i < LEVEL_EXP_REQUIREMENTS.length; i++) {
        expect(LEVEL_EXP_REQUIREMENTS[i]).toBeGreaterThan(LEVEL_EXP_REQUIREMENTS[i - 1])
      }
    })
  })
})
