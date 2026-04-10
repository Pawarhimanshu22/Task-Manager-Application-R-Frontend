import React from 'react'
import { useNavigate } from 'react-router-dom'
import {
  STATUS_LABELS, PRIORITY_LABELS, CATEGORY_LABELS,
  PRIORITY_CLASS, STATUS_CLASS, STATUS_DOT, PRIORITY_DOT
} from './constants'

const TaskCard = ({ task, onDelete }) => {
  const navigate = useNavigate()

  const handleDelete = (e) => {
    e.stopPropagation()
    if (window.confirm(`Delete "${task.title}"?`)) onDelete(task.id)
  }

  return (
    <div
      className={`task-card ${PRIORITY_CLASS[task.priority]}`}
      onClick={() => navigate(`/edit/${task.id}`)}
    >
      {/* Header row */}
      <div className="card-header">
        <span className={`badge ${STATUS_CLASS[task.status]}`}>
          <span>{STATUS_DOT[task.status]}</span>
          {STATUS_LABELS[task.status]}
        </span>
        <span className={`prio-pill ${PRIORITY_CLASS[task.priority]}`}>
          {PRIORITY_DOT[task.priority]} {PRIORITY_LABELS[task.priority]}
        </span>
      </div>

      {/* Title */}
      <h3 className="task-title">{task.title}</h3>

      {/* Description */}
      {task.description && <p className="task-desc">{task.description}</p>}

      {/* Meta */}
      <div className="task-meta">
        <span className="task-cat">◈ {CATEGORY_LABELS[task.category]}</span>
        {task.dueDate && <span className="task-due">⌛ {task.dueDate}</span>}
      </div>

      {/* Actions */}
      <div className="card-actions" onClick={e => e.stopPropagation()}>
        <button className="btn-edit-card" onClick={() => navigate(`/edit/${task.id}`)}>
          ✦ Edit
        </button>
        <button className="btn-del-card" onClick={handleDelete}>
          ✕ Delete
        </button>
      </div>
    </div>
  )
}

export default TaskCard