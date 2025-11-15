import { describe, it, expect } from 'vitest'
import { isQuietHours } from './notifications'

describe('notifications quiet hours', () => {
  it('detects quiet hours within same-day window', () => {
    const enabled = true
    const start = { hours: 1, minutes: 0 }
    const end = { hours: 3, minutes: 0 }
    const current = { hours: 2, minutes: 0 }
    expect(isQuietHours(enabled, start, end, current)).toBe(true)
  })

  it('detects quiet hours spanning midnight', () => {
    const enabled = true
    const start = { hours: 9, minutes: 0 }
    const end = { hours: 2, minutes: 0 }
    const currentLate = { hours: 9, minutes: 30 }
    const currentEarly = { hours: 1, minutes: 30 }
    expect(isQuietHours(enabled, start, end, currentLate)).toBe(true)
    expect(isQuietHours(enabled, start, end, currentEarly)).toBe(true)
  })
})
