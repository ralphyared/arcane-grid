import { describe, expect, it } from 'vitest'
import { cellRarityPoints, isFinished, MAX_GUESSES, scoreGame } from './scoring'
import { generateGrid } from './gridGenerator'
import type { GameState } from './types'

describe('scoring', () => {
  it('rewards tighter cells with more points and guards divide-by-zero', () => {
    expect(cellRarityPoints(1)).toBeGreaterThan(cellRarityPoints(10))
    expect(cellRarityPoints(0)).toBe(100)
  })

  it('counts correct and attempted cells', () => {
    const grid = generateGrid('daily-2026-06-18')
    const guesses: GameState['guesses'] = Array(9).fill(null)
    guesses[0] = { spellIndex: grid.cells[0].validIndexes[0], correct: true }
    guesses[1] = { spellIndex: 'definitely-not-a-spell', correct: false }
    const state: GameState = { seedKey: grid.seedKey, guesses, guessesLeft: MAX_GUESSES - 2 }

    const r = scoreGame(grid, state)
    expect(r.correct).toBe(1)
    expect(r.attempted).toBe(2)
    expect(r.score).toBeGreaterThan(0)
  })

  it('detects finish by exhausted guesses or a full board', () => {
    const full: GameState = {
      seedKey: 'x',
      guesses: Array(9).fill({ spellIndex: 'a', correct: true }),
      guessesLeft: 0,
    }
    const fresh: GameState = { seedKey: 'x', guesses: Array(9).fill(null), guessesLeft: 9 }
    expect(isFinished(full)).toBe(true)
    expect(isFinished(fresh)).toBe(false)
  })
})
