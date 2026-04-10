import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAllTasks, deleteTask } from './api'
import TaskCard from './TaskCard'

const STATS = [
  { key: 'total',    label: 'Total Tasks',   icon: '◈', color: '#00d4ff', glow: 'rgba(0,212,255,0.25)',    iconBg: 'rgba(0,212,255,0.12)' },
  { key: 'todo',     label: 'To Do',         icon: '○', color: '#94a3b8', glow: 'rgba(148,163,184,0.2)',   iconBg: 'rgba(148,163,184,0.1)' },
  { key: 'progress', label: 'In Progress',   icon: '◑', color: '#fbbf24', glow: 'rgba(251,191,36,0.2)',    iconBg: 'rgba(251,191,36,0.1)' },
  { key: 'done',     label: 'Completed',     icon: '●', color: '#34d399', glow: 'rgba(52,211,153,0.2)',    iconBg: 'rgba(52,211,153,0.1)' },
  { key: 'high',     label: 'High Priority', icon: '↑', color: '#fb7185', glow: 'rgba(251,113,133,0.2)',   iconBg: 'rgba(251,113,133,0.1)' },
]

const Dashboard = () => {
  const [tasks,   setTasks]   = useState([])
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState('')
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

  const counts = {
    total:    tasks.length,
    todo:     tasks.filter(t => t.status === 'TODO').length,
    progress: tasks.filter(t => t.status === 'IN_PROGRESS').length,
    done:     tasks.filter(t => t.status === 'DONE').length,
    high:     tasks.filter(t => t.priority === 'HIGH').length,
  }

  if (loading) return (
    <div className="center">
      <div className="spinner" />
      <span className="loading-text">Loading your workspace...</span>
    </div>
  )

  if (error) return (
    <div className="center">
      <div className="error-box">{error}</div>
    </div>
  )

  return (
    <div className="page">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Good work, dev 👋</h1>
          <p className="page-sub">Here's what's on your plate today</p>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/create')}>
          ✦ New Task
        </button>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        {STATS.map(s => (
          <div
            key={s.key}
            className="stat-card"
            style={{
              '--stat-color': s.color,
              '--stat-glow': s.glow,
              '--stat-icon-bg': s.iconBg,
            }}
          >
            <div className="stat-icon" style={{ background: s.iconBg }}>
              <span style={{ fontSize: 20, color: s.color }}>{s.icon}</span>
            </div>
            <div className="stat-val">{counts[s.key]}</div>
            <div className="stat-lbl">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Recent tasks */}
      <div className="section-header">
        <h2 className="section-title">Recent Tasks</h2>
        <button className="btn-text" onClick={() => navigate('/tasks')}>View all →</button>
      </div>

      {tasks.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">✦</span>
          <p>No tasks yet. Create your first one!</p>
          <button className="btn btn-primary" onClick={() => navigate('/create')}>✦ New Task</button>
        </div>
      ) : (
        <div className="task-grid">
          {tasks.slice(0, 6).map(t => (
            <TaskCard key={t.id} task={t} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  )
}

export default Dashboard