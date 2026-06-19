import { describe, expect, it } from 'vitest'
import { dailySeedKey, practiceSeedKey, prettyDate, utcDateKey } from './dateSeed'

describe('dateSeed', () => {
  it('formats a date as a UTC YYYY-MM-DD key', () => {
    expect(utcDateKey(new Date('2026-06-18T23:30:00Z'))).toBe('2026-06-18')
    expect(utcDateKey(new Date('2026-01-05T00:00:00Z'))).toBe('2026-01-05')
  })

  it('builds a stable, prefixed daily seed for a given date', () => {
    expect(dailySeedKey('2026-06-18')).toBe('daily-2026-06-18')
  })

  it('builds a unique, prefixed practice seed each call', () => {
    const a = practiceSeedKey()
    const b = practiceSeedKey()
    expect(a.startsWith('practice-')).toBe(true)
    expect(a).not.toBe(b)
  })

  it('renders a human-readable date in UTC regardless of local zone', () => {
    const pretty = prettyDate('2026-06-18')
    expect(pretty).toMatch(/2026/)
    expect(pretty).toMatch(/\b18\b/)
  })
})
