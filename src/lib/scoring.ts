import type { GameState, PuzzleGrid } from './types'

export const MAX_GUESSES = 9

/**
 * Per-cell points for a correct answer. Tighter cells (fewer valid spells) are
 * worth more. This is a *local* difficulty proxy; a future backend version can
 * swap it for true crowd-sourced rarity (% of players who chose your answer).
 */
export function cellRarityPoints(validCount: number): number {
  return Math.round(100 / Math.max(1, validCount))
}

export interface ScoreBreakdown {
  correct: number
  attempted: number
  score: number
}

export function scoreGame(grid: PuzzleGrid, state: GameState): ScoreBreakdown {
  let correct = 0
  let attempted = 0
  let score = 0
  state.guesses.forEach((g, i) => {
    if (!g) return
    attempted++
    if (g.correct) {
      correct++
      score += cellRarityPoints(grid.cells[i].validIndexes.length)
    }
  })
  return { correct, attempted, score }
}

export function isFinished(state: GameState): boolean {
  return state.guessesLeft <= 0 || state.guesses.every((g) => g !== null)
}
