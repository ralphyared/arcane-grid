import { Modal } from './Modal'

export function HelpModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Modal open={open} onClose={onClose} title="How to play">
      <div className="space-y-3 text-sm leading-relaxed text-arcane-100/90">
        <p>
          Each <strong>row</strong> and <strong>column</strong> has a criterion. Fill every cell
          with a D&amp;D 5e spell that matches <em>both</em> its row and its column.
        </p>
        <p>
          For example, a cell where <strong>Evocation</strong> meets the <strong>Wizard</strong>{' '}
          spell list could be answered with <em>Fireball</em>.
        </p>
        <ul className="list-disc space-y-1.5 pl-5 text-arcane-100/80">
          <li>
            You get <strong>9 guesses</strong> — each cell can be attempted once.
          </li>
          <li>
            Every spell may be used <strong>only once</strong> across the grid.
          </li>
          <li>
            Tighter cells (fewer possible spells) are worth more <strong>Arcane score</strong>.
          </li>
          <li>
            The <strong>Daily</strong> grid is the same for everyone and resets at midnight UTC.{' '}
            <strong>Practice</strong> gives you unlimited fresh grids.
          </li>
        </ul>
        <p className="text-arcane-200/60">
          All 319 spells come from the D&amp;D 5e SRD. If you can name it from the core rules, it’s
          in here.
        </p>
      </div>
    </Modal>
  )
}
