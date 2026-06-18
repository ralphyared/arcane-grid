import { getSpell } from '../lib/spells'
import type { GuessRecord } from '../lib/types'

interface CellProps {
  guess: GuessRecord | null
  playable: boolean
  onClick: () => void
}

export function Cell({ guess, playable, onClick }: CellProps) {
  if (guess) {
    const spell = getSpell(guess.spellIndex)
    if (guess.correct) {
      return (
        <div
          key="correct"
          className="animate-pop flex h-full flex-col items-center justify-center gap-0.5 rounded-lg bg-emerald-500/15 p-1 text-center ring-1 ring-emerald-400/40"
        >
          <span className="text-[10px] font-bold text-emerald-300">✓</span>
          <span className="line-clamp-2 text-[11px] leading-tight font-medium text-emerald-50 sm:text-sm">
            {spell?.name}
          </span>
          {spell && (
            <span className="text-[9px] text-emerald-200/70 sm:text-[10px]">
              Lvl {spell.level} · {spell.school}
            </span>
          )}
        </div>
      )
    }
    return (
      <div
        key="wrong"
        className="animate-shake flex h-full flex-col items-center justify-center gap-0.5 rounded-lg bg-rose-500/10 p-1 text-center ring-1 ring-rose-400/30"
      >
        <span className="text-[10px] font-bold text-rose-300">✗</span>
        <span className="line-clamp-2 text-[11px] leading-tight font-medium text-rose-100/80 line-through decoration-rose-400/60 sm:text-sm">
          {spell?.name ?? 'Not a match'}
        </span>
      </div>
    )
  }

  return (
    <button
      type="button"
      disabled={!playable}
      onClick={onClick}
      aria-label={playable ? 'Guess a spell for this cell' : 'Empty cell'}
      className={`group h-full w-full rounded-lg transition ${
        playable
          ? 'cursor-pointer bg-white/[0.02] ring-1 ring-white/10 hover:bg-arcane-500/10 hover:ring-arcane-400/40'
          : 'cursor-default bg-white/[0.01] ring-1 ring-white/5'
      }`}
    >
      {playable && (
        <span className="text-2xl text-white/15 transition group-hover:text-arcane-300/60">+</span>
      )}
    </button>
  )
}
