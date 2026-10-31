import { motion } from 'framer-motion'
import { COLUMNS, COLUMN_CONFIG } from '../utils/kanban'

export default function StatsBar({ tasks }) {
  const counts = { todo: 0, inprogress: 0, completed: 0 }
  tasks.forEach(t => { if (counts[t.status] !== undefined) counts[t.status]++ })
  const total = tasks.length
  const pct   = total ? Math.round((counts.completed / total) * 100) : 0

  return (
    <div className="bg-dark-900/50 border-b border-white/[0.04] backdrop-blur-sm">
      <div className="max-w-[1700px] mx-auto px-4 sm:px-6 py-2.5 flex items-center gap-1 sm:gap-3 flex-wrap">
        {/* Total */}
        <div className="flex items-center gap-2 px-3 py-1">
          <span className="font-display font-bold text-lg text-dark-100 tabular-nums">{total}</span>
          <span className="text-xs text-dark-500 font-medium">Total</span>
        </div>

        <div className="w-px h-5 bg-white/[0.06] hidden sm:block" />

        {/* Per-column counts */}
        {COLUMNS.map((col, i) => {
          const cfg = COLUMN_CONFIG[col]
          const colorMap = { todo: 'text-indigo-400', inprogress: 'text-amber-400', completed: 'text-emerald-400' }
          return (
            <div key={col} className="flex items-center gap-2 px-3 py-1">
              <div className={`w-1.5 h-1.5 rounded-full ${cfg.dotClass}`} />
              <span className={`font-display font-bold text-lg tabular-nums ${colorMap[col]}`}>{counts[col]}</span>
              <span className="text-xs text-dark-500 font-medium hidden sm:inline">{cfg.label}</span>
              {i < COLUMNS.length - 1 && <div className="w-px h-5 bg-white/[0.06] hidden sm:block ml-1" />}
            </div>
          )
        })}

        {/* Progress bar */}
        <div className="hidden sm:flex items-center gap-3 ml-auto">
          <div className="w-28 h-1.5 bg-dark-700 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
            />
          </div>
          <span className="text-xs text-dark-400 font-medium tabular-nums">{pct}% done</span>
        </div>
      </div>
    </div>
  )
}
