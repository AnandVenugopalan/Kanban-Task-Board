import { motion } from 'framer-motion'
import { Pencil, Trash2, Calendar, ChevronRight } from 'lucide-react'
import { PRIORITY_CONFIG, COLUMN_CONFIG, getDueInfo, highlightText } from '../utils/kanban'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

export default function TaskCard({ task, searchQuery, onEdit, onDelete, onMove }) {
  const priority = PRIORITY_CONFIG[task.priority]
  const due      = getDueInfo(task.dueDate)
  const colCfg   = COLUMN_CONFIG[task.status]
  const isCompleted = task.status === 'completed'

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id, data: { status: task.status } })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.35 : 1,
    zIndex: isDragging ? 50 : 'auto',
  }

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      layout
      initial={{ opacity: 0, y: 10, scale: 0.97 }}
      animate={{ opacity: 1, y: 0,  scale: 1 }}
      exit={{    opacity: 0, y: -8, scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      whileHover={{ y: -2 }}
      className={`
        group relative bg-dark-800/70 border border-white/[0.06] rounded-2xl p-4 cursor-grab active:cursor-grabbing
        hover:border-white/[0.12] hover:bg-dark-800/90 hover:shadow-card-hover
        transition-shadow duration-200 select-none overflow-hidden
        ${isDragging ? 'rotate-1 scale-95 shadow-modal' : ''}
      `}
      role="listitem"
      aria-label={`Task: ${task.title}`}
    >
      {/* Priority top accent bar */}
      <div className={`
        absolute top-0 left-0 right-0 h-0.5 rounded-t-2xl
        ${task.priority === 'high'   ? 'bg-gradient-to-r from-rose-500 to-rose-400' :
          task.priority === 'medium' ? 'bg-gradient-to-r from-amber-500 to-amber-400' :
                                       'bg-gradient-to-r from-emerald-500 to-emerald-400'}
      `} />

      {/* Shine overlay */}
      <div className="absolute inset-0 rounded-2xl bg-card-shine pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Header */}
      <div className="flex items-start gap-2 mb-2.5">
        <h3
          className={`flex-1 text-sm font-semibold leading-snug tracking-tight ${isCompleted ? 'line-through text-dark-400' : 'text-dark-50'}`}
          dangerouslySetInnerHTML={{ __html: highlightText(task.title, searchQuery) }}
        />
        {/* Action buttons — shown on hover */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-150 flex-shrink-0 -mt-0.5">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => { e.stopPropagation(); onEdit(task) }}
            className="p-1.5 rounded-lg bg-dark-700 border border-white/[0.08] text-dark-400 hover:text-indigo-400 hover:border-indigo-500/40 transition-colors"
            aria-label="Edit task"
          >
            <Pencil className="w-3 h-3" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => { e.stopPropagation(); onDelete(task.id) }}
            className="p-1.5 rounded-lg bg-dark-700 border border-white/[0.08] text-dark-400 hover:text-rose-400 hover:border-rose-500/40 transition-colors"
            aria-label="Delete task"
          >
            <Trash2 className="w-3 h-3" />
          </motion.button>
        </div>
      </div>

      {/* Description */}
      {task.description && (
        <p
          className="text-xs text-dark-400 leading-relaxed mb-3 line-clamp-2"
          dangerouslySetInnerHTML={{ __html: highlightText(task.description, searchQuery) }}
        />
      )}

      {/* Footer tags */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-1.5 flex-wrap">
          {/* Priority badge */}
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide border ${priority.badgeClass}`}>
            <span className={priority.dotClass} />
            {priority.label}
          </span>
        </div>
        {/* Due date */}
        {due && (
          <span className={`inline-flex items-center gap-1 text-[10px] font-medium ${due.cls}`}>
            <Calendar className="w-3 h-3 flex-shrink-0" />
            {due.label}
          </span>
        )}
      </div>

      {/* Move buttons */}
      <div className="flex gap-1.5 mt-3 pt-3 border-t border-white/[0.05]">
        {colCfg.moveTargets.map(target => (
          <motion.button
            key={target}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={(e) => { e.stopPropagation(); onMove(task.id, target) }}
            className={`
              flex-1 flex items-center justify-center gap-1 py-1.5 px-2 rounded-lg
              bg-dark-700/80 border border-white/[0.06] text-dark-400 text-[10px] font-medium
              transition-all duration-150 ${colCfg.moveBtnActive}
            `}
            aria-label={`Move to ${COLUMN_CONFIG[target].label}`}
          >
            {colCfg.moveLabel[target]}
            <ChevronRight className="w-3 h-3" />
          </motion.button>
        ))}
      </div>
    </motion.div>
  )
}
