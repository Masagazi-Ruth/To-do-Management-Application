import { useState, useEffect } from 'react'
import './App.css'

const API = '/api'

type Task = {
  id: string
  title: string
  description?: string
  completed: boolean
  dueDate: string | null
  priority?: 'low' | 'medium' | 'high'
  category?: string
  createdAt: string
  updatedAt: string
}

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium')
  const [category, setCategory] = useState('')
  const [query, setQuery] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState('')
  const [editDescription, setEditDescription] = useState('')
  const [editDueDate, setEditDueDate] = useState('')

  useEffect(() => {
    fetchTasks()
  }, [query])

  async function fetchTasks() {
    setLoading(true)
    try {
      const res = await fetch(`${API}/tasks${query ? `?q=${query}` : ''}`)
      if (!res.ok) throw new Error('Failed to fetch')
      const data = await res.json()
      setTasks(data)
      setError('')
    } catch (e: any) {
      setError(e.message || 'Error')
    } finally {
      setLoading(false)
    }
  }

  async function addTask(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) return
    
    setLoading(true)
    try {
      const res = await fetch(`${API}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim() || undefined,
          dueDate: dueDate || null,
          priority,
          category: category || undefined
        })
      })
      if (!res.ok) throw new Error('Failed to add')
      setTitle('')
      setDescription('')
      setDueDate('')
      setPriority('medium')
      setCategory('')
      await fetchTasks()
    } catch (e: any) {
      setError(e.message || 'Error')
    } finally {
      setLoading(false)
    }
  }

  async function toggleComplete(task: Task) {
    try {
      const res = await fetch(`${API}/tasks/${task.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: !task.completed })
      })
      if (!res.ok) throw new Error('Failed to update task')
      await fetchTasks()
    } catch (e: any) {
      setError(e.message || 'Error')
    }
  }

  function startEdit(task: Task) {
    setEditingId(task.id)
    setEditTitle(task.title)
    setEditDescription(task.description || '')
    setEditDueDate(task.dueDate || '')
  }

  function cancelEdit() {
    setEditingId(null)
    setEditTitle('')
    setEditDescription('')
    setEditDueDate('')
  }

  async function saveEdit(taskId: string) {
    try {
      const res = await fetch(`${API}/tasks/${taskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: editTitle.trim(),
          description: editDescription.trim(),
          dueDate: editDueDate || null
        })
      })
      if (!res.ok) throw new Error('Failed to update task')
      cancelEdit()
      await fetchTasks()
    } catch (e: any) {
      setError(e.message || 'Error')
    }
  }

  async function deleteTask(id: string) {
    try {
      const res = await fetch(`${API}/tasks/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete')
      await fetchTasks()
    } catch (e: any) {
      setError(e.message || 'Error')
    }
  }

  const filteredTasks = query
    ? tasks.filter(t => t.title.toLowerCase().includes(query.toLowerCase()))
    : tasks

  const remaining = filteredTasks.filter(t => !t.completed).length
  const completed = filteredTasks.filter(t => t.completed).length

  return (
    <div className="app-container">
      <div className="content-wrapper">
        {/* Header */}
        <div className="app-header">
          <h1 className="app-title">Task Manager</h1>
          <p className="app-subtitle">Organize your tasks efficiently</p>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card remaining">
            <p className="stat-label">Remaining Tasks</p>
            <p className="stat-value remaining">{remaining}</p>
          </div>
          <div className="stat-card completed">
            <p className="stat-label">Completed Tasks</p>
            <p className="stat-value completed">{completed}</p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="search-container">
          <input
            type="text"
            placeholder="🔍 Search tasks..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="search-input"
          />
        </div>

        {/* Add Task Form */}
        <div className="form-container">
          <h2 className="form-title">Create New Task</h2>
          <form onSubmit={addTask} className="task-form">
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Task Title *</label>
                <input
                  type="text"
                  placeholder="Enter task title..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Priority</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as 'low' | 'medium' | 'high')}
                  className="form-select"
                >
                  <option value="low">Low Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="high">High Priority</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Description (Optional)</label>
              <textarea
                placeholder="Enter description..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="form-textarea"
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Due Date (Optional)</label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Category (Optional)</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="form-select"
                >
                  <option value="">No Category</option>
                  <option value="Work">Work</option>
                  <option value="Personal">Personal</option>
                  <option value="Shopping">Shopping</option>
                  <option value="Health">Health</option>
                  <option value="Study">Study</option>
                </select>
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="submit-btn"
            >
              {loading ? '⏳ Adding Task...' : '✨ Add Task'}
            </button>
          </form>
          {error && <p className="error-message">{error}</p>}
        </div>

        {/* Tasks List */}
        <div className="tasks-container">
          <h2 className="tasks-title">Your Tasks</h2>
          
          {loading ? (
            <div className="loading-container">
              <div className="spinner"></div>
              <p className="loading-text">Loading tasks...</p>
            </div>
          ) : filteredTasks.length === 0 ? (
            <div className="empty-state">
              <svg className="empty-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <h3 className="empty-title">No tasks found</h3>
              <p className="empty-description">
                {query ? 'Try a different search term' : 'Create your first task above'}
              </p>
            </div>
          ) : (
            <div className="tasks-list">
              {filteredTasks.map(task => (
                <div
                  key={task.id}
                  className={`task-card ${task.completed ? 'completed' : 'active'}`}
                >
                  {editingId === task.id ? (
                    <div className="edit-form">
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="edit-input"
                        autoFocus
                      />
                      <textarea
                        value={editDescription}
                        onChange={(e) => setEditDescription(e.target.value)}
                        placeholder="Description (optional)"
                        className="edit-textarea"
                      />
                      <input
                        type="date"
                        value={editDueDate}
                        onChange={(e) => setEditDueDate(e.target.value)}
                        className="edit-input"
                      />
                      <div className="edit-actions">
                        <button
                          onClick={() => saveEdit(task.id)}
                          className="edit-btn save"
                        >
                          💾 Save
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="edit-btn cancel"
                        >
                          ❌ Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="task-content">
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => toggleComplete(task)}
                        className="task-checkbox"
                      />
                      <div className="task-details">
                        <h3 className={`task-title ${task.completed ? 'completed' : ''}`}>
                          {task.title}
                        </h3>
                        {task.description && (
                          <p className="task-description">{task.description}</p>
                        )}
                        <div className="task-badges">
                          {task.priority && (
                            <span className={`badge priority-${task.priority}`}>
                              {task.priority === 'high' ? '🔴' : task.priority === 'medium' ? '🟡' : '🟢'}{' '}
                              {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} Priority
                            </span>
                          )}
                          {task.category && (
                            <span className="badge category">
                              🏷️ {task.category}
                            </span>
                          )}
                          {task.dueDate && (
                            <span className="badge due-date">
                              📅 Due: {new Date(task.dueDate).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="task-actions">
                        <button
                          onClick={() => startEdit(task)}
                          className="action-btn edit"
                          title="Edit task"
                        >
                          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => deleteTask(task.id)}
                          className="action-btn delete"
                          title="Delete task"
                        >
                          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
