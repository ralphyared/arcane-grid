import { useState } from 'react'
import { Modal } from './Modal'
import { getSpell } from '../lib/spells'
import { buildShareText } from '../lib/share'
import type { GameState, PuzzleGrid } from '../lib/types'

interface ResultModalProps {
  open: boolean
  onClose: () => void
  grid: PuzzleGrid
  state: GameState
  title: string
  correct: number
  score: number
  isPractice: boolean
  onNewPractice: () => void
}

export function ResultModal({
  open,
  onClose,
  grid,
  state,
  title,
  correct,
  score,
  isPractice,
  onNewPractice,
}: ResultModalProps) {
  const [copied, setCopied] = useState(false)
  const cells = state.guesses.map((g) => (g ? g.correct : null))

  const share = async () => {
    const url = window.location.origin + window.location.pathname
    const text = buildShareText({ title, cells, correct, score, url })
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      // Clipboard unavailable (e.g. insecure context) — silently ignore.
    }
  }

  return (
    <Modal open={open} onClose={onClose} title={title} wide>
      <div className="text-center">
        <div className="font-display text-5xl font-bold text-gold">{correct}/9</div>
        <div className="mt-1 text-sm text-arcane-200/70">
          Arcane score <span className="font-semibold text-white">{score}</span>
        </div>
      </div>

      <p className="mt-4 mb-1.5 text-center text-xs tracking-wide text-arcane-200/50 uppercase">
        Answers
      </p>
      <div className="grid grid-cols-3 gap-1.5">
        {grid.cells.map((cell, i) => {
          const g = state.guesses[i]
          const ok = g?.correct
          const example = getSpell(cell.validIndexes[0])
          return (
            <div
              key={i}
              className={`rounded-lg border p-2 text-center text-xs ${
                ok ? 'border-emerald-400/40 bg-emerald-500/10' : 'border-white/10 bg-white/[0.02]'
              }`}
            >
              <div className="mb-0.5 text-[10px] text-arcane-200/50">
                {grid.rows[cell.row].short} × {grid.cols[cell.col].short}
              </div>
              {ok ? (
                <div className="font-medium text-emerald-100">{getSpell(g.spellIndex)?.name}</div>
              ) : (
                <div className="text-white/70">
                  {example?.name ?? '—'}
                  {cell.validIndexes.length > 1 && (
                    <span className="text-white/35"> +{cell.validIndexes.length - 1}</span>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>

      <div className="mt-5 flex flex-col gap-2 sm:flex-row">
        <button type="button" onClick={share} className="btn-primary flex-1">
          {copied ? 'Copied to clipboard!' : 'Share result'}
        </button>
        {isPractice ? (
          <button
            type="button"
            onClick={() => {
              onNewPractice()
              onClose()
            }}
            className="btn-secondary flex-1"
          >
            New practice grid
          </button>
        ) : (
          <button type="button" onClick={onClose} className="btn-secondary flex-1">
            Close
          </button>
        )}
      </div>
      {!isPractice && (
        <p className="mt-3 text-center text-xs text-arcane-200/50">
          A new daily grid unlocks at midnight UTC.
        </p>
      )}
    </Modal>
  )
}
