import { describe, it, expect, vi } from 'vitest'
import {
  withTimeout,
  withRetry,
  delay,
  TimeoutError,
} from '@/utils/timeout'

describe('withTimeout', () => {
  it('should resolve if promise completes before timeout', async () => {
    const promise = Promise.resolve('success')
    const result = await withTimeout(promise, 1000)
    expect(result).toBe('success')
  })

  it('should reject with TimeoutError if promise takes too long', async () => {
    const slowPromise = new Promise((resolve) => setTimeout(resolve, 500))
    await expect(withTimeout(slowPromise, 100)).rejects.toThrow(TimeoutError)
  })

  it('should use custom error message', async () => {
    const slowPromise = new Promise((resolve) => setTimeout(resolve, 500))
    await expect(
      withTimeout(slowPromise, 100, 'Custom timeout message')
    ).rejects.toThrow('Custom timeout message')
  })

  it('should propagate original error if promise rejects', async () => {
    const failingPromise = Promise.reject(new Error('Original error'))
    await expect(withTimeout(failingPromise, 1000)).rejects.toThrow('Original error')
  })
})

describe('withRetry', () => {
  it('should succeed on first try', async () => {
    const operation = vi.fn().mockResolvedValue('success')
    const result = await withRetry(operation)
    expect(result).toBe('success')
    expect(operation).toHaveBeenCalledTimes(1)
  })

  it('should retry on failure', async () => {
    const operation = vi
      .fn()
      .mockRejectedValueOnce(new Error('Fail 1'))
      .mockRejectedValueOnce(new Error('Fail 2'))
      .mockResolvedValue('success')

    const result = await withRetry(operation, { delayMs: 10 })
    expect(result).toBe('success')
    expect(operation).toHaveBeenCalledTimes(3)
  })

  it('should throw after max retries', async () => {
    const operation = vi.fn().mockRejectedValue(new Error('Always fails'))

    await expect(
      withRetry(operation, { maxRetries: 2, delayMs: 10 })
    ).rejects.toThrow('Always fails')
    expect(operation).toHaveBeenCalledTimes(3) // initial + 2 retries
  })

  it('should respect shouldRetry predicate', async () => {
    const operation = vi.fn().mockRejectedValue(new Error('No retry'))

    await expect(
      withRetry(operation, {
        maxRetries: 3,
        delayMs: 10,
        shouldRetry: () => false,
      })
    ).rejects.toThrow('No retry')
    expect(operation).toHaveBeenCalledTimes(1)
  })
})

describe('delay', () => {
  it('should wait for specified time', async () => {
    const start = Date.now()
    await delay(100)
    const elapsed = Date.now() - start
    expect(elapsed).toBeGreaterThanOrEqual(90) // Allow some variance
    expect(elapsed).toBeLessThan(200)
  })
})
