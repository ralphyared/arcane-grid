import type { Category, GridCell, PuzzleGrid } from './types'
import { CATEGORIES, CATEGORY_MATCHES } from './categories'
import { hashString, mulberry32, shuffle } from './rng'

// Tuning knobs for puzzle quality.
const TARGET_MIN = 3 // ideal number of valid answers in the *tightest* cell
const HARD_FLOOR = 2 // never ship a daily where any cell has fewer than this
const MAX_PER_KIND = 2 // keep grids varied: at most 2 categories of one family
const ATTEMPTS = 4000

// Kinds where a spell can have at most one value, so two different such
// categories on perpendicular axes guarantee an empty (unsolvable) cell.
const EXCLUSIVE_KINDS = new Set(['school', 'level', 'save', 'damage', 'casting', 'range'])

function intersectionCount(a: Set<string>, b: Set<string>): number {
  const [small, large] = a.size < b.size ? [a, b] : [b, a]
  let n = 0
  for (const x of small) if (large.has(x)) n++
  return n
}

function intersection(a: Set<string>, b: Set<string>): string[] {
  const [small, large] = a.size < b.size ? [a, b] : [b, a]
  const out: string[] = []
  for (const x of small) if (large.has(x)) out.push(x)
  return out
}

/** Pick 6 distinct categories, capping how many share a kind (for variety). */
function pickSix(rng: () => number): Category[] | null {
  const order = shuffle(CATEGORIES, rng)
  const chosen: Category[] = []
  const perKind: Record<string, number> = {}
  for (const c of order) {
    if ((perKind[c.kind] ?? 0) >= MAX_PER_KIND) continue
    chosen.push(c)
    perKind[c.kind] = (perKind[c.kind] ?? 0) + 1
    if (chosen.length === 6) break
  }
  return chosen.length === 6 ? chosen : null
}

/** True if some row/column pair can never co-occur (would make an empty cell). */
function perpendicularConflict(rows: Category[], cols: Category[]): boolean {
  for (const r of rows) {
    for (const c of cols) {
      if (r.kind === c.kind && EXCLUSIVE_KINDS.has(r.kind)) return true
    }
  }
  return false
}

function buildGrid(seedKey: string, rows: Category[], cols: Category[]): PuzzleGrid {
  const rowSets = rows.map((r) => CATEGORY_MATCHES.get(r.id)!)
  const colSets = cols.map((c) => CATEGORY_MATCHES.get(c.id)!)
  const cells: GridCell[] = []
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      cells.push({
        index: r * 3 + c,
        row: r,
        col: c,
        validIndexes: intersection(rowSets[r], colSets[c]),
      })
    }
  }
  return { seedKey, rows, cols, cells }
}

/** Search for the best-scoring grid whose tightest cell has at least `floor` answers. */
function search(seedKey: string, floor: number): { rows: Category[]; cols: Category[] } | null {
  const rng = mulberry32(hashString(seedKey))
  let best: { rows: Category[]; cols: Category[]; score: number } | null = null
  for (let attempt = 0; attempt < ATTEMPTS; attempt++) {
    const six = pickSix(rng)
    if (!six) continue
    const rows = six.slice(0, 3)
    const cols = six.slice(3, 6)
    if (perpendicularConflict(rows, cols)) continue

    const rowSets = rows.map((r) => CATEGORY_MATCHES.get(r.id)!)
    const colSets = cols.map((c) => CATEGORY_MATCHES.get(c.id)!)
    let min = Infinity
    let total = 0
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        const n = intersectionCount(rowSets[r], colSets[c])
        total += n
        if (n < min) min = n
      }
    }
    if (min < floor) continue

    // Prefer grids whose tightest cell is near TARGET_MIN; gently discourage
    // grids so loose that nearly anything fits.
    const score = -Math.abs(min - TARGET_MIN) * 8 - Math.max(0, total - 130) * 0.03
    if (!best || score > best.score) best = { rows, cols, score }
  }
  return best ? { rows: best.rows, cols: best.cols } : null
}

/**
 * Deterministically generate a solvable 3×3 puzzle for `seedKey`.
 * The same seed always yields the same grid (this powers the shared daily).
 */
export function generateGrid(seedKey: string): PuzzleGrid {
  const pick = search(seedKey, HARD_FLOOR) ?? search(seedKey, 1)
  if (!pick) {
    // Effectively unreachable given the catalog size, but fail loudly if it ever happens.
    throw new Error(`Could not generate a solvable grid for seed "${seedKey}"`)
  }
  return buildGrid(seedKey, pick.rows, pick.cols)
}
