import { describe, expect, it } from 'vitest'
import { generateGrid } from './gridGenerator'
import { dailySeedKey } from './dateSeed'

function dailySeedsFrom(startUtc: string, days: number): string[] {
  const out: string[] = []
  const base = Date.parse(`${startUtc}T00:00:00Z`)
  for (let i = 0; i < days; i++) {
    out.push(dailySeedKey(new Date(base + i * 86_400_000).toISOString().slice(0, 10)))
  }
  return out
}

const seeds = [
  ...dailySeedsFrom('2026-01-01', 150),
  'practice-abc',
  'practice-xyz',
  'x',
  'hello world',
]

describe('generateGrid', () => {
  it('always produces a fully solvable 3×3 grid', () => {
    for (const seed of seeds) {
      const g = generateGrid(seed)
      expect(g.rows).toHaveLength(3)
      expect(g.cols).toHaveLength(3)
      expect(g.cells).toHaveLength(9)
      for (const cell of g.cells) {
        expect(cell.validIndexes.length, `${seed} cell ${cell.index}`).toBeGreaterThanOrEqual(1)
      }
    }
  })

  it('uses 6 distinct categories', () => {
    for (const seed of seeds.slice(0, 40)) {
      const g = generateGrid(seed)
      const ids = [...g.rows, ...g.cols].map((c) => c.id)
      expect(new Set(ids).size).toBe(6)
    }
  })

  it('is deterministic for a given seed', () => {
    const a = generateGrid('daily-2026-06-18')
    const b = generateGrid('daily-2026-06-18')
    expect(a.rows.map((r) => r.id)).toEqual(b.rows.map((r) => r.id))
    expect(a.cols.map((c) => c.id)).toEqual(b.cols.map((c) => c.id))
  })

  it('meets the hard floor (every cell ≥ 2 answers) for all daily seeds', () => {
    const offenders = dailySeedsFrom('2026-01-01', 150).filter((seed) => {
      const g = generateGrid(seed)
      return g.cells.some((c) => c.validIndexes.length < 2)
    })
    expect(offenders).toEqual([])
  })
})
