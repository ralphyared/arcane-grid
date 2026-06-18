import { type ReactNode, useEffect } from 'react'

interface ModalProps {
  open: boolean
  onClose: () => void
  title?: ReactNode
  children: ReactNode
  wide?: boolean
}

export function Modal({ open, onClose, title, children, wide }: ModalProps) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center p-3 sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div
        className={`relative w-full ${wide ? 'max-w-2xl' : 'max-w-md'} rounded-2xl border border-arcane-400/30 bg-arcane-950/95 shadow-2xl shadow-black/60`}
      >
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-3.5">
          <h2 className="font-display text-lg text-arcane-100">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-md px-2 py-1 text-arcane-300/70 transition hover:bg-white/10 hover:text-white"
          >
            ✕
          </button>
        </div>
        <div className="scroll-thin max-h-[75vh] overflow-y-auto px-5 py-4">{children}</div>
      </div>
    </div>
  )
}
