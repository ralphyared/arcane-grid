import { Modal } from './Modal'
import type { StatsView } from '../hooks/useStats'

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.02] px-3 py-2.5 text-center">
      <div className="font-display text-2xl font-bold text-white">{value}</div>
      <div className="mt-0.5 text-[11px] text-arcane-200/60">{label}</div>
    </div>
  )
}

export function StatsModal({
  open,
  onClose,
  stats,
}: {
  open: boolean
  onClose: () => void
  stats: StatsView
}) {
  const maxBar = Math.max(1, ...stats.distribution)
  return (
    <Modal open={open} onClose={onClose} title="Your statistics">
      {stats.played === 0 ? (
        <p className="py-6 text-center text-sm text-arcane-200/60">
          No daily grids played yet. Solve today’s grid to start a streak!
        </p>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            <Stat label="Played" value={stats.played} />
            <Stat label="Avg correct" value={stats.avgCorrect.toFixed(1)} />
            <Stat label="Streak" value={stats.currentStreak} />
            <Stat label="Max streak" value={stats.maxStreak} />
          </div>

          <p className="mt-5 mb-2 text-xs tracking-wide text-arcane-200/50 uppercase">
            Correct answers per game
          </p>
          <div className="space-y-1">
            {stats.distribution.map((count, n) => (
              <div key={n} className="flex items-center gap-2">
                <span className="w-4 text-right text-xs text-arcane-200/60">{n}</span>
                <div className="h-4 flex-1 overflow-hidden rounded bg-white/5">
                  <div
                    className="h-full rounded bg-arcane-500/70"
                    style={{ width: `${(count / maxBar) * 100}%`, minWidth: count ? '1.25rem' : 0 }}
                  />
                </div>
                <span className="w-5 text-xs text-arcane-200/60">{count}</span>
              </div>
            ))}
          </div>
          <p className="mt-4 text-center text-[11px] text-arcane-200/50">
            Best: {stats.bestCorrect}/9 · top Arcane score {stats.bestScore}
          </p>
        </>
      )}
    </Modal>
  )
}
