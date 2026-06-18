import { describe, expect, it } from 'vitest'
import { hashString, mulberry32, shuffle } from './rng'

describe('rng', () => {
  it('produces the same sequence for the same seed', () => {
    const a = mulberry32(hashString('seed-1'))
    const b = mulberry32(hashString('seed-1'))
    const seqA = Array.from({ length: 5 }, () => a())
    const seqB = Array.from({ length: 5 }, () => b())
    expect(seqA).toEqual(seqB)
  })

  it('produces different output for different seeds', () => {
    expect(mulberry32(hashString('seed-1'))()).not.toEqual(mulberry32(hashString('seed-2'))())
  })

  it('only yields values in [0, 1)', () => {
    const rng = mulberry32(123)
    for (let i = 0; i < 1000; i++) {
      const v = rng()
      expect(v).toBeGreaterThanOrEqual(0)
      expect(v).toBeLessThan(1)
    }
  })

  it('shuffle is a deterministic permutation that does not mutate input', () => {
    const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    const s1 = shuffle(arr, mulberry32(7))
    const s2 = shuffle(arr, mulberry32(7))
    expect(s1).toEqual(s2)
    expect([...s1].sort((a, b) => a - b)).toEqual(arr)
    expect(arr).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
  })
})
