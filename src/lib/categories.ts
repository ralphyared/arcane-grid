import type { Category } from './types'
import { SPELLS } from './spells'

const SCHOOLS = [
  'Abjuration',
  'Conjuration',
  'Divination',
  'Enchantment',
  'Evocation',
  'Illusion',
  'Necromancy',
  'Transmutation',
]
const CLASSES = ['Bard', 'Cleric', 'Druid', 'Paladin', 'Ranger', 'Sorcerer', 'Warlock', 'Wizard']
const DAMAGE = [
  'Acid',
  'Cold',
  'Fire',
  'Force',
  'Lightning',
  'Necrotic',
  'Poison',
  'Psychic',
  'Radiant',
  'Thunder',
]
const SAVES = ['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA']

function ordinal(n: number): string {
  const suffix = ['th', 'st', 'nd', 'rd']
  const v = n % 100
  return `${n}${suffix[(v - 20) % 10] ?? suffix[v] ?? suffix[0]}`
}

/** The full catalog of axis criteria the generator draws from. */
export const CATEGORIES: Category[] = [
  ...SCHOOLS.map(
    (s): Category => ({
      id: `school:${s}`,
      kind: 'school',
      label: `School: ${s}`,
      short: s,
      test: (sp) => sp.school === s,
    }),
  ),
  { id: 'level:0', kind: 'level', label: 'Cantrip', short: 'Cantrip', test: (s) => s.level === 0 },
  ...[1, 2, 3, 4, 5, 6, 7, 8, 9].map(
    (l): Category => ({
      id: `level:${l}`,
      kind: 'level',
      label: `${ordinal(l)}-level spell`,
      short: `Lvl ${l}`,
      test: (s) => s.level === l,
    }),
  ),
  ...CLASSES.map(
    (c): Category => ({
      id: `class:${c}`,
      kind: 'class',
      label: `${c} spell list`,
      short: c,
      test: (s) => s.classes.includes(c),
    }),
  ),
  {
    id: 'tag:concentration',
    kind: 'concentration',
    label: 'Requires Concentration',
    short: 'Concentration',
    test: (s) => s.concentration,
  },
  {
    id: 'tag:ritual',
    kind: 'ritual',
    label: 'Can be cast as a Ritual',
    short: 'Ritual',
    test: (s) => s.ritual,
  },
  {
    id: 'tag:attack',
    kind: 'attack',
    label: 'Requires an attack roll',
    short: 'Attack roll',
    test: (s) => s.attack,
  },
  {
    id: 'tag:material',
    kind: 'material',
    label: 'Has a Material component',
    short: 'Material (M)',
    test: (s) => s.hasMaterial,
  },
  ...SAVES.map(
    (sv): Category => ({
      id: `save:${sv}`,
      kind: 'save',
      label: `Forces a ${sv} saving throw`,
      short: `${sv} save`,
      test: (s) => s.saveType === sv,
    }),
  ),
  ...DAMAGE.map(
    (d): Category => ({
      id: `damage:${d}`,
      kind: 'damage',
      label: `Deals ${d} damage`,
      short: `${d} dmg`,
      test: (s) => s.damageType === d,
    }),
  ),
  {
    id: 'cast:bonus',
    kind: 'casting',
    label: 'Cast as a Bonus Action',
    short: 'Bonus action',
    test: (s) => s.castingBucket === 'bonus',
  },
  {
    id: 'cast:reaction',
    kind: 'casting',
    label: 'Cast as a Reaction',
    short: 'Reaction',
    test: (s) => s.castingBucket === 'reaction',
  },
  {
    id: 'cast:long',
    kind: 'casting',
    label: 'Takes 1+ minute to cast',
    short: '1+ min cast',
    test: (s) => s.castingBucket === 'long',
  },
  {
    id: 'range:self',
    kind: 'range',
    label: 'Range: Self',
    short: 'Self',
    test: (s) => s.rangeBucket === 'self',
  },
  {
    id: 'range:touch',
    kind: 'range',
    label: 'Range: Touch',
    short: 'Touch',
    test: (s) => s.rangeBucket === 'touch',
  },
  {
    id: 'dur:instant',
    kind: 'duration',
    label: 'Instantaneous duration',
    short: 'Instantaneous',
    test: (s) => s.duration === 'Instantaneous',
  },
]

export const CATEGORY_BY_ID = new Map(CATEGORIES.map((c) => [c.id, c] as const))

/** Precomputed set of matching spell indexes per category (built once at load). */
export const CATEGORY_MATCHES: Map<string, Set<string>> = (() => {
  const m = new Map<string, Set<string>>()
  for (const cat of CATEGORIES) {
    const set = new Set<string>()
    for (const sp of SPELLS) if (cat.test(sp)) set.add(sp.index)
    m.set(cat.id, set)
  }
  return m
})()
