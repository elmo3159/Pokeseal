import { describe, it, expect } from 'vitest'
import {
  validateUsername,
  validateDisplayName,
  validateBio,
  validateComment,
  validatePositiveInteger,
  validateUUID,
  validateInvitationCode,
  validateUserCode,
  sanitizeText,
  escapeHtml,
} from '@/utils/validation'

describe('validateUsername', () => {
  it('should accept valid usernames', () => {
    expect(validateUsername('テストユーザー').isValid).toBe(true)
    expect(validateUsername('test_user').isValid).toBe(true)
    expect(validateUsername('ユーザー123').isValid).toBe(true)
  })

  it('should reject empty usernames', () => {
    expect(validateUsername('').isValid).toBe(false)
    expect(validateUsername('   ').isValid).toBe(false)
  })

  it('should reject too long usernames', () => {
    expect(validateUsername('a'.repeat(21)).isValid).toBe(false)
  })

  it('should strip HTML tags', () => {
    // HTML tags are stripped, leaving the text content
    const result = validateUsername('ユーザー<b>名</b>')
    expect(result.isValid).toBe(true)
    expect(result.sanitizedValue).toBe('ユーザー名')
  })
})

describe('validateDisplayName', () => {
  it('should accept valid display names', () => {
    expect(validateDisplayName('テストくん').isValid).toBe(true)
    expect(validateDisplayName('Test User 123').isValid).toBe(true)
  })

  it('should allow longer names than username', () => {
    expect(validateDisplayName('a'.repeat(30)).isValid).toBe(true)
    expect(validateDisplayName('a'.repeat(31)).isValid).toBe(false)
  })
})

describe('validateBio', () => {
  it('should accept empty bio', () => {
    expect(validateBio('').isValid).toBe(true)
    expect(validateBio('').sanitizedValue).toBe('')
  })

  it('should accept valid bio', () => {
    expect(validateBio('自己紹介文です').isValid).toBe(true)
  })

  it('should reject too long bio', () => {
    expect(validateBio('a'.repeat(201)).isValid).toBe(false)
  })
})

describe('validateComment', () => {
  it('should reject empty comments', () => {
    expect(validateComment('').isValid).toBe(false)
    expect(validateComment('   ').isValid).toBe(false)
  })

  it('should accept valid comments', () => {
    expect(validateComment('素敵なシールですね！').isValid).toBe(true)
  })

  it('should reject too long comments', () => {
    expect(validateComment('a'.repeat(301)).isValid).toBe(false)
  })
})

describe('validatePositiveInteger', () => {
  it('should accept valid positive integers', () => {
    expect(validatePositiveInteger(1).isValid).toBe(true)
    expect(validatePositiveInteger(100).isValid).toBe(true)
    expect(validatePositiveInteger('10').isValid).toBe(true)
  })

  it('should reject invalid values', () => {
    expect(validatePositiveInteger(0).isValid).toBe(false)
    expect(validatePositiveInteger(-1).isValid).toBe(false)
    expect(validatePositiveInteger('abc').isValid).toBe(false)
    expect(validatePositiveInteger(1.5).isValid).toBe(false)
  })

  it('should respect min/max options', () => {
    expect(validatePositiveInteger(5, { min: 10 }).isValid).toBe(false)
    expect(validatePositiveInteger(150, { max: 100 }).isValid).toBe(false)
  })
})

describe('validateUUID', () => {
  it('should accept valid UUIDs', () => {
    expect(validateUUID('123e4567-e89b-12d3-a456-426614174000').isValid).toBe(true)
  })

  it('should reject invalid UUIDs', () => {
    expect(validateUUID('not-a-uuid').isValid).toBe(false)
    expect(validateUUID('').isValid).toBe(false)
    expect(validateUUID('123456').isValid).toBe(false)
  })
})

describe('validateInvitationCode', () => {
  it('should accept valid invitation codes', () => {
    expect(validateInvitationCode('ABCD1234').isValid).toBe(true)
    expect(validateInvitationCode('abcd1234').isValid).toBe(true)
  })

  it('should reject invalid invitation codes', () => {
    expect(validateInvitationCode('ABC123').isValid).toBe(false) // too short
    expect(validateInvitationCode('ABCD12345').isValid).toBe(false) // too long
    expect(validateInvitationCode('ABCD-123').isValid).toBe(false) // contains dash
  })

  it('should uppercase the result', () => {
    const result = validateInvitationCode('abcd1234')
    expect(result.sanitizedValue).toBe('ABCD1234')
  })
})

describe('validateUserCode', () => {
  it('should accept valid user codes', () => {
    expect(validateUserCode('#12345678').isValid).toBe(true)
    expect(validateUserCode('12345678').isValid).toBe(true)
  })

  it('should add # prefix if missing', () => {
    const result = validateUserCode('12345678')
    expect(result.sanitizedValue).toBe('#12345678')
  })

  it('should reject invalid user codes', () => {
    expect(validateUserCode('#1234567').isValid).toBe(false) // too short
    expect(validateUserCode('#123456789').isValid).toBe(false) // too long
    expect(validateUserCode('#ABCD1234').isValid).toBe(false) // contains letters
  })
})

describe('sanitizeText', () => {
  it('should remove control characters', () => {
    expect(sanitizeText('test\x00\x01\x02')).toBe('test')
  })

  it('should remove HTML tags', () => {
    expect(sanitizeText('<div>test</div>')).toBe('test')
    expect(sanitizeText('<script>alert("xss")</script>')).toBe('alert("xss")')
  })

  it('should collapse whitespace', () => {
    expect(sanitizeText('test   multiple   spaces')).toBe('test multiple spaces')
  })
})

describe('escapeHtml', () => {
  it('should escape HTML special characters', () => {
    expect(escapeHtml('<script>')).toBe('&lt;script&gt;')
    expect(escapeHtml('"test"')).toBe('&quot;test&quot;')
    expect(escapeHtml("test's")).toBe('test&#039;s')
    expect(escapeHtml('a & b')).toBe('a &amp; b')
  })
})
