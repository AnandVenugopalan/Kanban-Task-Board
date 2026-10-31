import { useState, useCallback, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'

const STORAGE_KEY = 'kanflow_v3'

const DEMO_TASKS = () => {
  const today = new Date()
  const dt = (offset) => {
    const d = new Date(today)
    d.setDate(d.getDate() + offset)
    return d.toISOString().split('T')[0]
  }
  return [
    { id: uuidv4(), title: 'Design KanFlow landing page', description: 'Create wireframes and high-fidelity mockups using Figma. Focus on mobile-first layout.', priority: 'high', status: 'todo', dueDate: dt(2), createdAt: Date.now() - 5000, updatedAt: Date.now() - 5000 },
    { id: uuidv4(), title: 'Set up CI/CD pipeline', description: 'Configure GitHub Actions for automated testing and Vercel deployment on every push to main.', priority: 'high', status: 'inprogress', dueDate: dt(1), createdAt: Date.now() - 4000, updatedAt: Date.now() - 4000 },
    { id: uuidv4(), title: 'Write API documentation', description: 'Document all REST endpoints with request/response examples using OpenAPI 3.0 spec.', priority: 'medium', status: 'todo', dueDate: dt(5), createdAt: Date.now() - 3000, updatedAt: Date.now() - 3000 },
    { id: uuidv4(), title: 'User research interviews', description: 'Schedule 5 moderated user interviews to validate the new onboarding flow and collect feedback.', priority: 'medium', status: 'inprogress', dueDate: dt(3), createdAt: Date.now() - 2500, updatedAt: Date.now() - 2500 },
    { id: uuidv4(), title: 'Fix mobile navigation bug', description: 'Drawer overlaps content on iOS Safari 17. Root cause: z-index stacking context. Already patched locally.', priority: 'high', status: 'completed', dueDate: dt(-1), createdAt: Date.now() - 2000, updatedAt: Date.now() - 2000 },
    { id: uuidv4(), title: 'Update npm dependencies', description: 'Run npm audit and upgrade all outdated packages to their latest stable versions without breaking changes.', priority: 'low', status: 'todo', dueDate: dt(10), createdAt: Date.now() - 1500, updatedAt: Date.now() - 1500 },
    { id: uuidv4(), title: 'Write unit test suite', description: 'Achieve 80% code coverage for core business logic using Vitest. Focus on state management modules.', priority: 'medium', status: 'completed', dueDate: dt(-2), createdAt: Date.now() - 1000, updatedAt: Date.now() - 1000 },
  ]
}

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch { return null }
}

function saveToStorage(tasks) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks)) } catch { /* quota exceeded */ }
}

export function useKanban() {
  const [tasks, setTasks] = useState(() => {
    const saved = loadFromStorage()
    return saved && saved.length > 0 ? saved : DEMO_TASKS()
  })

  // Persist on every change
  useEffect(() => { saveToStorage(tasks) }, [tasks])

  const addTask = useCallback((data) => {
    const task = {
      id:          uuidv4(),
      title:       data.title.trim(),
      description: (data.description || '').trim(),
      priority:    data.priority,
      status:      data.status || 'todo',
      dueDate:     data.dueDate || null,
      createdAt:   Date.now(),
      updatedAt:   Date.now(),
    }
    setTasks(prev => [task, ...prev])
    return task
  }, [])

  const updateTask = useCallback((id, data) => {
    setTasks(prev => prev.map(t =>
      t.id === id
        ? { ...t, ...data, title: data.title.trim(), description: (data.description || '').trim(), updatedAt: Date.now() }
        : t
    ))
  }, [])

  const deleteTask = useCallback((id) => {
    setTasks(prev => prev.filter(t => t.id !== id))
  }, [])

  const moveTask = useCallback((id, newStatus) => {
    setTasks(prev => prev.map(t =>
      t.id === id ? { ...t, status: newStatus, updatedAt: Date.now() } : t
    ))
  }, [])

  const reorderTasks = useCallback((activeId, overId, newStatus) => {
    setTasks(prev => {
      const activeTask = prev.find(t => t.id === activeId)
      if (!activeTask) return prev

      // Move to new status
      const updated = prev.map(t =>
        t.id === activeId ? { ...t, status: newStatus, updatedAt: Date.now() } : t
      )

      if (!overId || activeId === overId) return updated

      // Reorder within or across columns
      const oldIdx = updated.findIndex(t => t.id === activeId)
      const newIdx = updated.findIndex(t => t.id === overId)
      if (oldIdx === -1 || newIdx === -1) return updated

      const result = [...updated]
      const [moved] = result.splice(oldIdx, 1)
      result.splice(newIdx, 0, moved)
      return result
    })
  }, [])

  return { tasks, addTask, updateTask, deleteTask, moveTask, reorderTasks }
}
