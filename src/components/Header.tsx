interface HeaderProps {
  onHelp: () => void
  onStats: () => void
  streak: number
}

export function Header({ onHelp, onStats, streak }: HeaderProps) {
  return (
    <header className="flex items-center justify-between py-5">
      <div className="flex items-center gap-2.5">
        <img src="./favicon.svg" alt="" className="h-9 w-9" />
        <div>
          <h1 className="font-display text-xl leading-none font-bold text-arcane-100 sm:text-2xl">
            Arcane Grid
          </h1>
          <p className="mt-1 text-[11px] text-arcane-300/60">A D&D 5e spell puzzle</p>
        </div>
      </div>
      <div className="flex items-center gap-1.5">
        {streak > 0 && (
          <span
            className="mr-1 hidden items-center gap-1 rounded-md bg-gold/10 px-2 py-1 text-xs font-medium text-gold sm:inline-flex"
            title="Current daily streak"
          >
            🔥 {streak}
          </span>
        )}
        <button type="button" onClick={onStats} aria-label="Statistics" className="icon-btn">
          📊
        </button>
        <button type="button" onClick={onHelp} aria-label="How to play" className="icon-btn">
          ?
        </button>
      </div>
    </header>
  )
}

export function Footer() {
  return (
    <footer className="mt-auto pt-10 text-center text-[11px] leading-relaxed text-arcane-300/40">
      <p>Spell data from the D&D 5e SRD 5.1, used under the OGL 1.0a / CC-BY-4.0.</p>
      <p>Not affiliated with or endorsed by Wizards of the Coast.</p>
    </footer>
  )
}
