import { format, isToday, isTomorrow, isPast, differenceInDays, parseISO } from 'date-fns'

export const COLUMNS = ['todo', 'inprogress', 'completed']

export const COLUMN_CONFIG = {
  todo: {
    label:  'Todo',
    icon:   '📋',
    color:  'indigo',
    dotClass: 'bg-indigo-400 shadow-[0_0_8px_rgba(129,140,248,0.9)]',
    headerGlow: 'from-indigo-500/20 to-transparent',
    borderHover: 'border-indigo-500/40',
    bgHover: 'bg-indigo-500/5',
    moveBtnActive: 'hover:text-indigo-400 hover:border-indigo-500/40 hover:bg-indigo-500/10',
    moveTargets: ['inprogress', 'completed'],
    moveLabel:   { inprogress: '⚡ Progress', completed: '✅ Done' },
  },
  inprogress: {
    label:  'In Progress',
    icon:   '⚡',
    color:  'amber',
    dotClass: 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.9)]',
    headerGlow: 'from-amber-500/20 to-transparent',
    borderHover: 'border-amber-500/40',
    bgHover: 'bg-amber-500/5',
    moveBtnActive: 'hover:text-amber-400 hover:border-amber-500/40 hover:bg-amber-500/10',
    moveTargets: ['todo', 'completed'],
    moveLabel:   { todo: '← Todo', completed: '✅ Done' },
  },
  completed: {
    label:  'Completed',
    icon:   '✅',
    color:  'emerald',
    dotClass: 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.9)]',
    headerGlow: 'from-emerald-500/20 to-transparent',
    borderHover: 'border-emerald-500/40',
    bgHover: 'bg-emerald-500/5',
    moveBtnActive: 'hover:text-emerald-400 hover:border-emerald-500/40 hover:bg-emerald-500/10',
    moveTargets: ['todo', 'inprogress'],
    moveLabel:   { todo: '← Todo', inprogress: '⚡ Progress' },
  },
}

export const PRIORITY_CONFIG = {
  high:   { label: 'High',   emoji: '🔴', badgeClass: 'bg-rose-500/15 text-rose-400 border-rose-500/25',   dotClass: 'priority-dot-high' },
  medium: { label: 'Medium', emoji: '🟡', badgeClass: 'bg-amber-500/15 text-amber-400 border-amber-500/25', dotClass: 'priority-dot-medium' },
  low:    { label: 'Low',    emoji: '🟢', badgeClass: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25', dotClass: 'priority-dot-low' },
}

export function getDueInfo(dateStr) {
  if (!dateStr) return null
  try {
    const date = parseISO(dateStr)
    const today = new Date(); today.setHours(0,0,0,0)
    const diff  = differenceInDays(date, today)

    if (isPast(date) && !isToday(date)) return { label: `${Math.abs(diff)}d overdue`, cls: 'text-rose-400', icon: '⚠️' }
    if (isToday(date))    return { label: 'Due today',    cls: 'text-amber-400', icon: '🔔' }
    if (isTomorrow(date)) return { label: 'Due tomorrow', cls: 'text-amber-400', icon: '📅' }
    if (diff <= 7)        return { label: `Due in ${diff}d`, cls: 'text-amber-400/80', icon: '📅' }

    return { label: format(date, 'MMM d, yyyy'), cls: 'text-dark-400', icon: '📅' }
  } catch { return null }
}

export function filterTasks(tasks, { search, priority, status }) {
  const q = search.toLowerCase().trim()
  return tasks.filter(t => {
    const matchSearch   = !q || t.title.toLowerCase().includes(q) || (t.description || '').toLowerCase().includes(q)
    const matchPriority = priority === 'all' || t.priority === priority
    const matchStatus   = status   === 'all' || t.status   === status
    return matchSearch && matchPriority && matchStatus
  })
}

export function highlightText(text, query) {
  if (!query.trim()) return text
  const re = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
  return text.replace(re, '<mark class="bg-amber-400/25 text-amber-300 rounded px-0.5">$1</mark>')
}
