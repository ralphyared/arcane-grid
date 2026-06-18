import type { Category } from '../lib/types'
import { KIND_STYLES } from '../lib/theme'

export function AxisHeader({ category }: { category: Category }) {
  return (
    <div
      title={category.label}
      className={`flex h-full min-h-[3rem] items-center justify-center rounded-lg border px-1 py-1 text-center ${KIND_STYLES[category.kind]}`}
    >
      <span className="font-display text-[10px] leading-tight font-semibold sm:text-sm">
        {category.short}
      </span>
    </div>
  )
}
