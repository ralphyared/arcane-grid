import { Fragment } from 'react'
import { AxisHeader } from './AxisHeader'
import { Cell } from './Cell'
import type { GameState, PuzzleGrid } from '../lib/types'

interface GridProps {
  grid: PuzzleGrid
  state: GameState
  finished: boolean
  onCellClick: (cellIndex: number) => void
}

export function Grid({ grid, state, finished, onCellClick }: GridProps) {
  return (
    <div className="mx-auto w-full max-w-[34rem]">
      <div
        className="grid gap-1.5 sm:gap-2"
        style={{ gridTemplateColumns: 'minmax(52px, 0.85fr) repeat(3, 1fr)' }}
      >
        <div className="flex items-center justify-center text-center">
          <span className="font-display text-[9px] leading-tight text-arcane-300/60 sm:text-[11px]">
            match
            <br />
            row × col
          </span>
        </div>
        {grid.cols.map((c) => (
          <AxisHeader key={c.id} category={c} />
        ))}

        {grid.rows.map((row, r) => (
          <Fragment key={row.id}>
            <AxisHeader category={row} />
            {grid.cols.map((_, c) => {
              const idx = r * 3 + c
              const guess = state.guesses[idx]
              const playable = !finished && !guess && state.guessesLeft > 0
              return (
                <div key={idx} className="aspect-square">
                  <Cell guess={guess} playable={playable} onClick={() => onCellClick(idx)} />
                </div>
              )
            })}
          </Fragment>
        ))}
      </div>
    </div>
  )
}
