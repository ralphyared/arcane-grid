import { useCallback, useEffect, useMemo, useState } from 'react'
import { generateGrid } from '../lib/gridGenerator'
import { isFinished, MAX_GUESSES, scoreGame } from '../lib/scoring'
import { loadJSON, saveJSON } from '../lib/storage'
import type { GameState, GuessRecord, PuzzleGrid } from '../lib/types'

function freshState(seedKey: string): GameState {
  return { seedKey, guesses: Array(9).fill(null), guessesLeft: MAX_GUESSES }
}

function storageKey(seedKey: string): string {
  return `state:${seedKey}`
}

function loadState(seedKey: string): GameState {
  const saved = loadJSON<GameState>(storageKey(seedKey))
  if (saved?.seedKey === seedKey && Array.isArray(saved.guesses) && saved.guesses.length === 9) {
    return saved
  }
  return freshState(seedKey)
}

function correctlyUsed(guesses: (GuessRecord | null)[]): Set<string> {
  return new Set(
    guesses.filter((g): g is GuessRecord => g !== null && g.correct).map((g) => g.spellIndex),
  )
}

export interface UseGame {
  grid: PuzzleGrid
  state: GameState
  finished: boolean
  correct: number
  attempted: number
  score: number
  /** Spells already placed correctly (each spell may be used only once). */
  usedSpellIndexes: Set<string>
  guess: (cellIndex: number, spellIndex: string) => void
  reset: () => void
}

export function useGame(seedKey: string): UseGame {
  const grid = useMemo(() => generateGrid(seedKey), [seedKey])
  const [state, setState] = useState<GameState>(() => loadState(seedKey))
  const [trackedSeed, setTrackedSeed] = useState(seedKey)

  // When the active seed changes (new day / new practice grid), load that game's
  // saved progress. This is a render-phase adjustment — React's recommended
  // alternative to syncing state inside an effect. After it runs, `state` always
  // matches the current seed before any effect fires.
  if (seedKey !== trackedSeed) {
    setTrackedSeed(seedKey)
    setState(loadState(seedKey))
  }

  // Persist the active game's progress whenever it changes.
  useEffect(() => {
    saveJSON(storageKey(seedKey), state)
  }, [seedKey, state])

  const guess = useCallback(
    (cellIndex: number, spellIndex: string) => {
      setState((prev) => {
        if (prev.guesses[cellIndex] || prev.guessesLeft <= 0) return prev
        const used = correctlyUsed(prev.guesses)
        const cell = grid.cells[cellIndex]
        const correct = cell.validIndexes.includes(spellIndex) && !used.has(spellIndex)
        const guesses = prev.guesses.slice()
        guesses[cellIndex] = { spellIndex, correct }
        return { ...prev, guesses, guessesLeft: prev.guessesLeft - 1 }
      })
    },
    [grid],
  )

  const reset = useCallback(() => setState(freshState(seedKey)), [seedKey])

  const { correct, attempted, score } = useMemo(() => scoreGame(grid, state), [grid, state])
  const usedSpellIndexes = useMemo(() => correctlyUsed(state.guesses), [state])
  const finished = isFinished(state)

  return { grid, state, finished, correct, attempted, score, usedSpellIndexes, guess, reset }
}
