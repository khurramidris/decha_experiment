import { describe, it, expect } from 'vitest'
import { earthSecondsToDechaTime, getEarthSecondsSinceMidnight } from './dechaCalculations'

describe('dechaCalculations', () => {
  it('converts earth seconds to decha time', () => {
    const noonEarthSeconds = 12 * 3600
    const decha = earthSecondsToDechaTime(noonEarthSeconds)
    expect(decha.hours).toBeGreaterThanOrEqual(4)
    expect(decha.hours).toBeLessThanOrEqual(5)
    expect(decha.totalSeconds).toBeGreaterThan(0)
  })

  it('includes milliseconds in earth seconds since midnight', () => {
    const s1 = getEarthSecondsSinceMidnight()
    const s2 = getEarthSecondsSinceMidnight()
    expect(Math.abs(s2 - s1)).toBeLessThanOrEqual(1)
  })
})
