import { motion, AnimatePresence } from 'framer-motion'
import { Plus, SearchX } from 'lucide-react'
import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import TaskCard from './TaskCard'
import { COLUMN_CONFIG } from '../utils/kanban'

function EmptyState({ status, hasFilters, onAddTask }) {
  const cfg = COLUMN_CONFIG[status]
  if (hasFilters) {
    return (
      <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
        <div className="w-12 h-12 rounded-2xl bg-dark-700/60 border border-white/[0.06] flex items-center justify-center mb-3 text-xl">
          <SearchX className="w-5 h-5 text-dark-400" />
        </div>
        <p className="text-sm font-medium text-dark-400">No matches</p>
        <p className="text-xs text-dark-500 mt-1">Try adjusting your filters</p>
      </div>
    )
  }

  const msgs = {
    todo:       { title: 'No tasks yet',        sub: 'Click + to create your first task' },
    inprogress: { title: 'Nothing in progress', sub: 'Move a task here to start working' },
    completed:  { title: 'No completions yet',  sub: 'Finish a task to see it here 🎉' },
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-10 px-4 text-center"
    >
      <div className="w-12 h-12 rounded-2xl bg-dark-700/60 border border-white/[0.06] flex items-center justify-center mb-3 text-xl">
        {cfg.icon}
      </div>
      <p className="text-sm font-semibold text-dark-300">{msgs[status].title}</p>
      <p className="text-xs text-dark-500 mt-1 leading-relaxed">{msgs[status].sub}</p>
      {status === 'todo' && !hasFilters && (
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          onClick={onAddTask}
          className="mt-4 flex items-center gap-1.5 px-4 py-2 bg-indigo-500/15 border border-indigo-500/30 rounded-full text-xs font-semibold text-indigo-400 hover:bg-indigo-500/25 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" /> Add first task
        </motion.button>
      )}
    </motion.div>
  )
}

export default function KanbanColumn({
  status, tasks, allTasks, searchQuery,
  hasFilters, onAddTask, onEdit, onDelete, onMove
}) {
  const cfg      = COLUMN_CONFIG[status]
  const realCount = allTasks.filter(t => t.status === status).length

  const { setNodeRef, isOver } = useDroppable({ id: status })

  const colorMap = {
    todo:       'text-indigo-400',
    inprogress: 'text-amber-400',
    completed:  'text-emerald-400',
  }

  return (
    <section
      aria-label={`${cfg.label} column`}
      className={`
        flex flex-col rounded-3xl border transition-all duration-200
        ${isOver
          ? `border-indigo-500/50 bg-indigo-500/5 shadow-[0_0_0_2px_rgba(99,102,241,0.25)]`
          : 'border-white/[0.07] bg-dark-900/40'}
      `}
    >
      {/* Column Header */}
      <div className={`flex items-center justify-between px-4 py-3.5 border-b border-white/[0.05] bg-gradient-to-r ${cfg.headerGlow} rounded-t-3xl`}>
        <div className="flex items-center gap-2.5">
          <span className={`w-2 h-2 rounded-full flex-shrink-0 ${cfg.dotClass}`} />
          <h2 className="font-display font-semibold text-sm text-dark-100 tracking-tight">{cfg.label}</h2>
          <motion.span
            key={realCount}
            initial={{ scale: 1.3, opacity: 0.5 }}
            animate={{ scale: 1,   opacity: 1 }}
            transition={{ type: 'spring', stiffness: 500, damping: 25 }}
            className={`inline-flex items-center justify-center min-w-[22px] h-[22px] px-1.5 bg-dark-700 border border-white/[0.08] rounded-full text-[10px] font-bold ${colorMap[status]}`}
          >
            {realCount}
          </motion.span>
        </div>

        <motion.button
          whileHover={{ scale: 1.1, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => onAddTask(status)}
          className="w-7 h-7 flex items-center justify-center bg-dark-700 border border-white/[0.08] rounded-lg text-dark-400 hover:text-indigo-400 hover:border-indigo-500/40 hover:bg-indigo-500/10 transition-all duration-150"
          aria-label={`Add task to ${cfg.label}`}
        >
          <Plus className="w-3.5 h-3.5" />
        </motion.button>
      </div>

      {/* Drop zone */}
      <div
        ref={setNodeRef}
        className="flex-1 p-3 min-h-[200px]"
        role="list"
        aria-label={`${cfg.label} tasks`}
      >
        <SortableContext
          items={tasks.map(t => t.id)}
          strategy={verticalListSortingStrategy}
        >
          <AnimatePresence mode="popLayout">
            {tasks.length === 0 ? (
              <EmptyState status={status} hasFilters={hasFilters} onAddTask={() => onAddTask(status)} />
            ) : (
              <div className="flex flex-col gap-2.5">
                {tasks.map(task => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    searchQuery={searchQuery}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onMove={onMove}
                  />
                ))}
              </div>
            )}
          </AnimatePresence>
        </SortableContext>
      </div>
    </section>
  )
}
