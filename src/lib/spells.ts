import type { Spell } from './types'
import data from '../data/spells.json'

/** All SRD spells, pre-sorted by name. Regenerate with `npm run fetch-spells`. */
export const SPELLS = data as unknown as Spell[]

const byIndex = new Map(SPELLS.map((s) => [s.index, s] as const))

export function getSpell(index: string): Spell | undefined {
  return byIndex.get(index)
}

/**
 * Name search for the guess dialog. Prefix matches rank above substring matches.
 * `exclude` hides spells already correctly placed (each spell is usable once).
 */
export function searchSpells(query: string, exclude: ReadonlySet<string>, limit = 50): Spell[] {
  const q = query.trim().toLowerCase()
  if (!q) return []
  const starts: Spell[] = []
  const contains: Spell[] = []
  for (const s of SPELLS) {
    if (exclude.has(s.index)) continue
    const name = s.name.toLowerCase()
    if (name.startsWith(q)) starts.push(s)
    else if (name.includes(q)) contains.push(s)
  }
  return starts.concat(contains).slice(0, limit)
}
