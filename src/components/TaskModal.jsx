import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, CheckCircle, AlertCircle } from 'lucide-react'

const PRIORITIES = [
  { value: 'high',   label: '🔴 High' },
  { value: 'medium', label: '🟡 Medium' },
  { value: 'low',    label: '🟢 Low' },
]

const STATUSES = [
  { value: 'todo',       label: 'Todo' },
  { value: 'inprogress', label: 'In Progress' },
  { value: 'completed',  label: 'Completed' },
]

function validate(data) {
  const errors = {}
  if (!data.title.trim())        errors.title    = 'Title is required'
  else if (data.title.trim().length < 2) errors.title = 'Title must be at least 2 characters'
  if (!data.priority)            errors.priority = 'Please select a priority'
  return errors
}

export default function TaskModal({ isOpen, task, defaultStatus = 'todo', onClose, onSave }) {
  const isEdit = Boolean(task)

  const [form, setForm]     = useState({ title: '', description: '', priority: '', status: 'todo', dueDate: '' })
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  const titleRef = useRef(null)

  // Populate form when opening
  useEffect(() => {
    if (isOpen) {
      setErrors({})
      setTouched({})
      if (task) {
        setForm({ title: task.title, description: task.description || '', priority: task.priority, status: task.status, dueDate: task.dueDate || '' })
      } else {
        setForm({ title: '', description: '', priority: '', status: defaultStatus, dueDate: '' })
      }
      setTimeout(() => titleRef.current?.focus(), 80)
    }
  }, [isOpen, task, defaultStatus])

  // Escape key
  useEffect(() => {
    const fn = e => { if (e.key === 'Escape' && isOpen) onClose() }
    document.addEventListener('keydown', fn)
    return () => document.removeEventListener('keydown', fn)
  }, [isOpen, onClose])

  // Lock body scroll
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  function handleChange(field, value) {
    setForm(prev => ({ ...prev, [field]: value }))
    if (touched[field]) {
      const errs = validate({ ...form, [field]: value })
      setErrors(prev => ({ ...prev, [field]: errs[field] }))
    }
  }

  function handleBlur(field) {
    setTouched(prev => ({ ...prev, [field]: true }))
    const errs = validate(form)
    setErrors(prev => ({ ...prev, [field]: errs[field] }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    const errs = validate(form)
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      setTouched({ title: true, priority: true })
      return
    }
    onSave(form)
  }

  const titleLen = form.title.length
  const descLen  = form.description.length

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[500] flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-dark-950/80 backdrop-blur-lg"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 24 }}
            animate={{ opacity: 1, scale: 1,   y: 0 }}
            exit={{    opacity: 0, scale: 0.9, y: 24 }}
            transition={{ type: 'spring', stiffness: 350, damping: 28 }}
            className="relative w-full max-w-lg bg-dark-800 border border-white/[0.09] rounded-3xl shadow-modal overflow-hidden"
          >
            {/* Gradient shimmer top */}
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />

            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/[0.06]">
              <div>
                <h2 id="modal-title" className="font-display font-bold text-lg text-dark-50 tracking-tight">
                  {isEdit ? 'Edit Task' : 'Create New Task'}
                </h2>
                <p className="text-xs text-dark-400 mt-0.5">
                  {isEdit ? 'Update task details below' : 'Fill in the details for your new task'}
                </p>
              </div>
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center bg-dark-700 border border-white/[0.08] rounded-xl text-dark-400 hover:text-rose-400 hover:border-rose-500/40 transition-colors"
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </motion.button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} noValidate className="px-6 py-5 space-y-4 max-h-[70vh] overflow-y-auto scrollbar-hide">
              {/* Title */}
              <div className="space-y-1.5">
                <label htmlFor="task-title" className="block text-xs font-semibold text-dark-300 tracking-wide uppercase">
                  Title <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <input
                    ref={titleRef}
                    id="task-title"
                    type="text"
                    value={form.title}
                    onChange={e => handleChange('title', e.target.value)}
                    onBlur={() => handleBlur('title')}
                    placeholder="e.g. Design the landing page mockup"
                    maxLength={100}
                    autoComplete="off"
                    className={`form-input pr-14 ${errors.title ? 'form-input-error' : ''}`}
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-dark-500 font-medium tabular-nums">
                    {titleLen}/100
                  </span>
                </div>
                <AnimatePresence>
                  {errors.title && (
                    <motion.p
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      className="text-xs text-rose-400 flex items-center gap-1"
                    >
                      <AlertCircle className="w-3 h-3 flex-shrink-0" />{errors.title}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label htmlFor="task-desc" className="block text-xs font-semibold text-dark-300 tracking-wide uppercase">
                  Description
                </label>
                <div className="relative">
                  <textarea
                    id="task-desc"
                    value={form.description}
                    onChange={e => handleChange('description', e.target.value)}
                    placeholder="Add more details about this task…"
                    maxLength={500}
                    rows={3}
                    className="form-input resize-none leading-relaxed"
                  />
                  <span className="absolute bottom-2 right-3 text-[10px] text-dark-500 font-medium tabular-nums">
                    {descLen}/500
                  </span>
                </div>
              </div>

              {/* Priority + Due Date row */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label htmlFor="task-priority" className="block text-xs font-semibold text-dark-300 tracking-wide uppercase">
                    Priority <span className="text-rose-400">*</span>
                  </label>
                  <select
                    id="task-priority"
                    value={form.priority}
                    onChange={e => handleChange('priority', e.target.value)}
                    onBlur={() => handleBlur('priority')}
                    className={`form-input cursor-pointer ${errors.priority ? 'form-input-error' : ''}`}
                  >
                    <option value="">Select…</option>
                    {PRIORITIES.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
                  </select>
                  <AnimatePresence>
                    {errors.priority && (
                      <motion.p
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        className="text-xs text-rose-400 flex items-center gap-1"
                      >
                        <AlertCircle className="w-3 h-3 flex-shrink-0" />{errors.priority}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="task-due" className="block text-xs font-semibold text-dark-300 tracking-wide uppercase">
                    Due Date
                  </label>
                  <input
                    id="task-due"
                    type="date"
                    value={form.dueDate}
                    onChange={e => handleChange('dueDate', e.target.value)}
                    className="form-input cursor-pointer"
                  />
                </div>
              </div>

              {/* Status */}
              <div className="space-y-1.5">
                <label htmlFor="task-status" className="block text-xs font-semibold text-dark-300 tracking-wide uppercase">
                  Status
                </label>
                <select
                  id="task-status"
                  value={form.status}
                  onChange={e => handleChange('status', e.target.value)}
                  className="form-input cursor-pointer"
                >
                  {STATUSES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                </select>
              </div>
            </form>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-white/[0.06] flex items-center justify-end gap-2.5 bg-dark-900/30">
              <button type="button" onClick={onClose} className="btn-secondary">
                Cancel
              </button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                type="button"
                onClick={handleSubmit}
                className="btn-primary"
              >
                <CheckCircle className="w-4 h-4" />
                {isEdit ? 'Save Changes' : 'Create Task'}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
