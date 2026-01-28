import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
  key: vi.fn(),
  length: 0,
}

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
})

// Mock performance.now
if (typeof performance === 'undefined') {
  Object.defineProperty(global, 'performance', {
    value: {
      now: () => Date.now(),
    },
  })
}
