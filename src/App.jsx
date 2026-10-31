import { useState, useCallback, useMemo } from 'react'
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  TouchSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  closestCorners,
} from '@dnd-kit/core'
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable'

import Header        from './components/Header'
import StatsBar      from './components/StatsBar'
import KanbanColumn  from './components/KanbanColumn'
import TaskCard      from './components/TaskCard'
import TaskModal     from './components/TaskModal'
import DeleteModal   from './components/DeleteModal'
import ToastContainer from './components/ToastContainer'

import { useKanban }  from './hooks/useKanban'
import { useToast }   from './hooks/useToast'
import { COLUMNS, COLUMN_CONFIG, filterTasks } from './utils/kanban'
import { motion } from 'framer-motion'

const NO_RESULTS_MESSAGES = {
  all:    { emoji: '🔍', title: 'No tasks found', sub: 'Try adjusting your search or filters' },
  todo:   { emoji: '📋', title: 'No Todo tasks', sub: 'Your search returned no Todo tasks' },
  inprogress: { emoji: '⚡', title: 'No In Progress tasks', sub: 'No tasks match your filters' },
  completed:  { emoji: '✅', title: 'No Completed tasks', sub: 'No completed tasks match your filters' },
}

export default function App() {
  const { tasks, addTask, updateTask, deleteTask, moveTask, reorderTasks } = useKanban()
  const { toasts, addToast, removeToast } = useToast()

  // Modal state
  const [modalOpen, setModalOpen]     = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [defaultStatus, setDefaultStatus] = useState('todo')

  // Delete state
  const [deleteOpen, setDeleteOpen]   = useState(false)
  const [deletingId, setDeletingId]   = useState(null)

  // Drag state
  const [activeTask, setActiveTask]   = useState(null)

  // Filters
  const [filters, setFilters] = useState({ search: '', priority: 'all', status: 'all' })

  // Derived filtered tasks
  const filteredTasks = useMemo(() => filterTasks(tasks, filters), [tasks, filters])
  const hasFilters    = !!(filters.search || filters.priority !== 'all' || filters.status !== 'all')
  const noResults     = hasFilters && filteredTasks.length === 0

  // Tasks per column (from filtered set)
  function getColumnTasks(status) {
    return filteredTasks.filter(t => t.status === status)
  }

  // DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor,   { activationConstraint: { delay: 150, tolerance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )

  function handleDragStart({ active }) {
    const task = tasks.find(t => t.id === active.id)
    setActiveTask(task || null)
  }

  function handleDragEnd({ active, over }) {
    setActiveTask(null)
    if (!over) return

    const activeId  = active.id
    const overId    = over.id
    const activeTask = tasks.find(t => t.id === activeId)
    if (!activeTask) return

    // Dropped on a column container (droppable id = status string)
    const newStatus = COLUMNS.includes(overId) ? overId : tasks.find(t => t.id === overId)?.status

    if (!newStatus) return

    if (activeTask.status !== newStatus) {
      reorderTasks(activeId, COLUMNS.includes(overId) ? null : overId, newStatus)
      addToast(`Moved to ${COLUMN_CONFIG[newStatus].label}`, 'success')
    } else if (activeId !== overId) {
      reorderTasks(activeId, overId, newStatus)
    }
  }

  // Open modal helpers
  const openAddModal = useCallback((status = 'todo') => {
    setEditingTask(null)
    setDefaultStatus(status)
    setModalOpen(true)
  }, [])

  const openEditModal = useCallback((task) => {
    setEditingTask(task)
    setModalOpen(true)
  }, [])

  const handleSave = useCallback((data) => {
    if (editingTask) {
      updateTask(editingTask.id, data)
      addToast('Task updated successfully', 'info')
    } else {
      addTask(data)
      addToast('Task created! 🎉', 'success')
    }
    setModalOpen(false)
    setEditingTask(null)
  }, [editingTask, addTask, updateTask, addToast])

  // Delete handlers
  const handleDeleteRequest = useCallback((id) => {
    setDeletingId(id)
    setDeleteOpen(true)
  }, [])

  const handleDeleteConfirm = useCallback(() => {
    if (deletingId) {
      deleteTask(deletingId)
      addToast('Task deleted', 'error')
    }
    setDeleteOpen(false)
    setDeletingId(null)
  }, [deletingId, deleteTask, addToast])

  const handleMove = useCallback((id, newStatus) => {
    moveTask(id, newStatus)
    addToast(`Moved to ${COLUMN_CONFIG[newStatus].label}`, 'success')
  }, [moveTask, addToast])

  return (
    <div className="flex flex-col min-h-screen">
      <Header
        filters={filters}
        onFiltersChange={setFilters}
        onAddTask={openAddModal}
        taskCounts={tasks.length}
      />

      <StatsBar tasks={tasks} />

      {/* Board */}
      <main className="flex-1 p-4 sm:p-6" role="main">
        <div className="max-w-[1700px] mx-auto">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            {noResults ? (
              /* Global no-results state */
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center py-24 text-center"
              >
                <div className="text-5xl mb-4 opacity-40">🔍</div>
                <h2 className="font-display font-bold text-xl text-dark-300 mb-2">No tasks found</h2>
                <p className="text-sm text-dark-500 max-w-xs leading-relaxed">
                  No tasks match <span className="text-dark-300 font-medium">"{filters.search || 'your filters'}"</span>. Try a different search or clear the filters.
                </p>
                <button
                  onClick={() => setFilters({ search: '', priority: 'all', status: 'all' })}
                  className="mt-6 btn-secondary text-sm"
                >
                  Clear filters
                </button>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
                {COLUMNS.map(status => (
                  <KanbanColumn
                    key={status}
                    status={status}
                    tasks={getColumnTasks(status)}
                    allTasks={tasks}
                    searchQuery={filters.search}
                    hasFilters={hasFilters}
                    onAddTask={openAddModal}
                    onEdit={openEditModal}
                    onDelete={handleDeleteRequest}
                    onMove={handleMove}
                  />
                ))}
              </div>
            )}

            {/* Drag overlay — renders the floating card while dragging */}
            <DragOverlay>
              {activeTask ? (
                <div className="rotate-2 scale-105 opacity-90 pointer-events-none">
                  <TaskCard
                    task={activeTask}
                    searchQuery={filters.search}
                    onEdit={() => {}}
                    onDelete={() => {}}
                    onMove={() => {}}
                  />
                </div>
              ) : null}
            </DragOverlay>
          </DndContext>
        </div>
      </main>

      {/* Modals */}
      <TaskModal
        isOpen={modalOpen}
        task={editingTask}
        defaultStatus={defaultStatus}
        onClose={() => { setModalOpen(false); setEditingTask(null) }}
        onSave={handleSave}
      />

      <DeleteModal
        isOpen={deleteOpen}
        onClose={() => { setDeleteOpen(false); setDeletingId(null) }}
        onConfirm={handleDeleteConfirm}
      />

      {/* Toasts */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  )
}
