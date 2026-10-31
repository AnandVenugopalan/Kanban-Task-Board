import { AnimatePresence, motion } from 'framer-motion'
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react'

const ICONS = {
  success: <CheckCircle className="w-4 h-4 text-emerald-400" />,
  error:   <AlertCircle className="w-4 h-4 text-rose-400" />,
  info:    <Info className="w-4 h-4 text-indigo-400" />,
  warning: <AlertTriangle className="w-4 h-4 text-amber-400" />,
}

const BORDER = {
  success: 'border-emerald-500/30',
  error:   'border-rose-500/30',
  info:    'border-indigo-500/30',
  warning: 'border-amber-500/30',
}

export default function ToastContainer({ toasts, onRemove }) {
  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-2 pointer-events-none">
      <AnimatePresence>
        {toasts.map(toast => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 60, scale: 0.85 }}
            animate={{ opacity: 1, x: 0,  scale: 1 }}
            exit={{    opacity: 0, x: 60, scale: 0.85 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className={`
              flex items-center gap-3 px-4 py-3 rounded-2xl pointer-events-auto
              bg-dark-800/95 backdrop-blur-xl border ${BORDER[toast.type] || BORDER.info}
              shadow-[0_8px_32px_rgba(0,0,0,0.6)] max-w-xs
            `}
          >
            {ICONS[toast.type] || ICONS.info}
            <span className="text-sm text-dark-100 font-medium flex-1">{toast.message}</span>
            <button
              onClick={() => onRemove(toast.id)}
              className="text-dark-500 hover:text-dark-200 transition-colors flex-shrink-0"
              aria-label="Dismiss"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
