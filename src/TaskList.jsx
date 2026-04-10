import React, { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAllTasks, deleteTask } from './api'
import { STATUS_LABELS, PRIORITY_LABELS, CATEGORY_LABELS } from './constants'
import TaskCard from './TaskCard'

const TaskList = () => {
  const [tasks,    setTasks]    = useState([])
  const [loading,  setLoading]  = useState(true)
  const [error,    setError]    = useState('')
  const [search,   setSearch]   = useState('')
  const [status,   setStatus]   = useState('ALL')
  const [priority, setPriority] = useState('ALL')
  const [category, setCategory] = useState('ALL')
  const navigate = useNavigate()

  useEffect(() => {
    getAllTasks()
      .then(res => setTasks(res.data))
      .catch(() => setError('Cannot connect to backend. Make sure Spring Boot is running on port 8080.'))
      .finally(() => setLoading(false))
  }, [])

  const handleDelete = async (id) => {
    await deleteTask(id)
    setTasks(prev => prev.filter(t => t.id !== id))
  }

  const filtered = useMemo(() => tasks.filter(t =>
    t.title.toLowerCase().includes(search.toLowerCase()) &&
    (status   === 'ALL' || t.status   === status)   &&
    (priority === 'ALL' || t.priority === priority) &&
    (category === 'ALL' || t.category === category)
  ), [tasks, search, status, priority, category])

  const clearFilters = () => { setSearch(''); setStatus('ALL'); setPriority('ALL'); setCategory('ALL') }
  const hasFilter = search || status !== 'ALL' || priority !== 'ALL' || category !== 'ALL'

  if (loading) return (
    <div className="center">
      <div className="spinner" />
      <span className="loading-text">Fetching tasks...</span>
    </div>
  )

  if (error) return (
    <div className="center">
      <div className="error-box">{error}</div>
    </div>
  )

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">All Tasks</h1>
          <p className="page-sub">{filtered.length} of {tasks.length} tasks shown</p>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/create')}>✦ New Task</button>
      </div>

      {/* Filters */}
      <div className="filter-bar">
        <input
          className="filter-input"
          placeholder="⌕  Search tasks..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select className="filter-select" value={status} onChange={e => setStatus(e.target.value)}>
          <option value="ALL">All Statuses</option>
          {Object.entries(STATUS_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
        </select>
        <select className="filter-select" value={priority} onChange={e => setPriority(e.target.value)}>
          <option value="ALL">All Priorities</option>
          {Object.entries(PRIORITY_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
        </select>
        <select className="filter-select" value={category} onChange={e => setCategory(e.target.value)}>
          <option value="ALL">All Categories</option>
          {Object.entries(CATEGORY_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
        </select>
        {hasFilter && (
          <button className="btn-clear" onClick={clearFilters}>✕ Clear</button>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">{tasks.length === 0 ? '✦' : '⌕'}</span>
          <p>{tasks.length === 0 ? 'No tasks yet. Start adding!' : 'No results for those filters.'}</p>
          {tasks.length === 0
            ? <button className="btn btn-primary" onClick={() => navigate('/create')}>✦ New Task</button>
            : <button className="btn-text" onClick={clearFilters}>Clear filters</button>
          }
        </div>
      ) : (
        <div className="task-grid">
          {filtered.map(t => <TaskCard key={t.id} task={t} onDelete={handleDelete} />)}
        </div>
      )}
    </div>
  )
}

export default TaskList