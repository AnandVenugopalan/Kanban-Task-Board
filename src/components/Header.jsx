import { Search, X, SlidersHorizontal, Plus } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const PRIORITY_OPTS = [
  { value: 'all',    label: 'All Priority' },
  { value: 'high',   label: '🔴 High' },
  { value: 'medium', label: '🟡 Medium' },
  { value: 'low',    label: '🟢 Low' },
]

const STATUS_OPTS = [
  { value: 'all',        label: 'All Status' },
  { value: 'todo',       label: 'Todo' },
  { value: 'inprogress', label: 'In Progress' },
  { value: 'completed',  label: 'Completed' },
]

export default function Header({ filters, onFiltersChange, onAddTask, taskCounts }) {
  const hasFilters = filters.search || filters.priority !== 'all' || filters.status !== 'all'

  function clearAll() {
    onFiltersChange({ search: '', priority: 'all', status: 'all' })
  }

  return (
    <header className="sticky top-0 z-50 glass border-b border-white/[0.06]">
      <div className="max-w-[1700px] mx-auto w-full px-4 sm:px-6">
        {/* Main row */}
        <div className="flex items-center gap-3 py-3.5 flex-wrap sm:flex-nowrap">
          {/* Logo */}
          <div className="flex items-center gap-2.5 flex-shrink-0 mr-2">
            <div className="w-9 h-9 rounded-xl bg-dark-700 border border-white/10 flex items-center justify-center">
              <svg width="22" height="22" viewBox="0 0 28 28" fill="none">
                <rect x="2" y="2" width="10" height="14" rx="3" fill="url(#g1)"/>
                <rect x="16" y="2" width="10" height="8" rx="3" fill="url(#g2)"/>
                <rect x="16" y="14" width="10" height="12" rx="3" fill="url(#g3)"/>
                <rect x="2" y="20" width="10" height="6" rx="3" fill="url(#g4)"/>
                <defs>
                  <linearGradient id="g1" x1="2" y1="2" x2="12" y2="16" gradientUnits="userSpaceOnUse"><stop stopColor="#818CF8"/><stop offset="1" stopColor="#6366F1"/></linearGradient>
                  <linearGradient id="g2" x1="16" y1="2" x2="26" y2="10" gradientUnits="userSpaceOnUse"><stop stopColor="#F472B6"/><stop offset="1" stopColor="#EC4899"/></linearGradient>
                  <linearGradient id="g3" x1="16" y1="14" x2="26" y2="26" gradientUnits="userSpaceOnUse"><stop stopColor="#34D399"/><stop offset="1" stopColor="#10B981"/></linearGradient>
                  <linearGradient id="g4" x1="2" y1="20" x2="12" y2="26" gradientUnits="userSpaceOnUse"><stop stopColor="#FBBF24"/><stop offset="1" stopColor="#F59E0B"/></linearGradient>
                </defs>
              </svg>
            </div>
            <span className="text-gradient-brand font-display font-bold text-xl tracking-tight">KanFlow</span>
          </div>

          {/* Search */}
          <div className="relative flex-1 min-w-[160px] max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-400 pointer-events-none" />
            <input
              id="search-input"
              type="text"
              value={filters.search}
              onChange={e => onFiltersChange({ ...filters, search: e.target.value })}
              placeholder="Search tasks…"
              className="form-input pl-9 pr-8 !rounded-full"
              aria-label="Search tasks"
            />
            <AnimatePresence>
              {filters.search && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.6 }}
                  onClick={() => onFiltersChange({ ...filters, search: '' })}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-400 hover:text-dark-100 transition-colors"
                  aria-label="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </motion.button>
              )}
            </AnimatePresence>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <SlidersHorizontal className="w-4 h-4 text-dark-400 hidden sm:block" />

            <select
              id="filter-priority"
              value={filters.priority}
              onChange={e => onFiltersChange({ ...filters, priority: e.target.value })}
              className="form-input !py-2 !px-3 !rounded-full text-xs font-medium cursor-pointer min-w-[110px]"
              aria-label="Filter by priority"
            >
              {PRIORITY_OPTS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>

            <select
              id="filter-status"
              value={filters.status}
              onChange={e => onFiltersChange({ ...filters, status: e.target.value })}
              className="form-input !py-2 !px-3 !rounded-full text-xs font-medium cursor-pointer min-w-[110px]"
              aria-label="Filter by status"
            >
              {STATUS_OPTS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>

          {/* Add task */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            id="btn-add-task"
            onClick={() => onAddTask()}
            className="btn-primary flex-shrink-0"
            aria-label="Add new task"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Add Task</span>
          </motion.button>
        </div>

        {/* Active filter chips */}
        <AnimatePresence>
          {hasFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="flex items-center gap-2 pb-2.5 flex-wrap overflow-hidden border-t border-white/[0.04] pt-2"
            >
              <span className="text-xs text-dark-500 font-medium">Filters:</span>
              {filters.search && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-indigo-500/15 border border-indigo-500/30 rounded-full text-xs text-indigo-300 font-medium">
                  "{filters.search}"
                </span>
              )}
              {filters.priority !== 'all' && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-indigo-500/15 border border-indigo-500/30 rounded-full text-xs text-indigo-300 font-medium capitalize">
                  {filters.priority}
                </span>
              )}
              {filters.status !== 'all' && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-indigo-500/15 border border-indigo-500/30 rounded-full text-xs text-indigo-300 font-medium capitalize">
                  {filters.status === 'inprogress' ? 'In Progress' : filters.status}
                </span>
              )}
              <button
                onClick={clearAll}
                className="ml-auto text-xs text-dark-500 hover:text-rose-400 transition-colors font-medium px-2 py-0.5 rounded"
              >
                Clear all
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  )
}
