/** Compact, app-shaped spell record (produced by scripts/fetch-spells.mjs). */
export interface Spell {
  index: string
  name: string
  level: number
  school: string
  classes: string[]
  castingTime: string
  castingBucket: 'action' | 'bonus' | 'reaction' | 'long'
  range: string
  rangeBucket: 'self' | 'touch' | 'ranged' | 'special'
  duration: string
  concentration: boolean
  ritual: boolean
  components: string[]
  hasMaterial: boolean
  damageType: string | null
  saveType: string | null
  attack: boolean
  summary: string
}

/** Family a category belongs to. Drives variety + conflict rules in the generator. */
export type CategoryKind =
  | 'school'
  | 'level'
  | 'class'
  | 'concentration'
  | 'ritual'
  | 'attack'
  | 'material'
  | 'save'
  | 'damage'
  | 'casting'
  | 'range'
  | 'duration'

/** A grid axis criterion (e.g. "Evocation", "Wizard", "Deals Fire damage"). */
export interface Category {
  id: string
  kind: CategoryKind
  /** Full label shown in the search dialog / tooltips. */
  label: string
  /** Compact label shown on the small axis headers. */
  short: string
  test: (spell: Spell) => boolean
}

export interface GridCell {
  /** 0..8, row-major. */
  index: number
  row: number
  col: number
  /** Spell indexes satisfying both the row and column criteria. */
  validIndexes: string[]
}

export interface PuzzleGrid {
  seedKey: string
  rows: Category[]
  cols: Category[]
  cells: GridCell[]
}

export interface GuessRecord {
  spellIndex: string
  correct: boolean
}

export interface GameState {
  seedKey: string
  /** One slot per cell (0..8); null = not yet attempted. */
  guesses: (GuessRecord | null)[]
  guessesLeft: number
}
