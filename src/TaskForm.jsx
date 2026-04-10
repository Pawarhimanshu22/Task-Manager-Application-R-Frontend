import React, { useState, useEffect } from 'react'
import { PRIORITY_LABELS, STATUS_LABELS, CATEGORY_LABELS } from './constants'

const EMPTY = {
  title: '', description: '',
  priority: 'MEDIUM', status: 'TODO', category: 'GENERAL', dueDate: '',
}

const TaskForm = ({ initial, onSubmit, onCancel, saving }) => {
  const [form,   setForm]   = useState(EMPTY)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (initial) setForm({
      title:       initial.title       || '',
      description: initial.description || '',
      priority:    initial.priority    || 'MEDIUM',
      status:      initial.status      || 'TODO',
      category:    initial.category    || 'GENERAL',
      dueDate:     initial.dueDate     || '',
    })
  }, [initial])

  const validate = () => {
    const e = {}
    if (!form.title.trim())               e.title = 'Title is required'
    else if (form.title.trim().length < 2) e.title = 'Minimum 2 characters'
    else if (form.title.length > 100)     e.title = 'Maximum 100 characters'
    if (form.description.length > 500)    e.description = 'Maximum 500 characters'
    return e
  }

  const onChange = (e) => {
    const { name, value } = e.target
    setForm(p => ({ ...p, [name]: value }))
    if (errors[name]) setErrors(p => ({ ...p, [name]: '' }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    onSubmit({ ...form, dueDate: form.dueDate || null })
  }

  return (
    <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>

      {/* Title */}
      <div className="form-group">
        <label className="form-label">Title <span className="required">*</span></label>
        <input
          className={`form-input ${errors.title ? 'error' : ''}`}
          name="title" value={form.title} onChange={onChange}
          placeholder="What needs to be done?" maxLength={100}
        />
        {errors.title && <span className="err-msg">⚠ {errors.title}</span>}
      </div>

      {/* Description */}
      <div className="form-group">
        <label className="form-label">Description</label>
        <textarea
          className={`form-input form-textarea ${errors.description ? 'error' : ''}`}
          name="description" value={form.description} onChange={onChange}
          placeholder="Add more context..." maxLength={500} rows={3}
        />
        <span className="char-count">{form.description.length} / 500</span>
        {errors.description && <span className="err-msg">⚠ {errors.description}</span>}
      </div>

      {/* Priority + Status */}
      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Priority</label>
          <select className="form-input form-select" name="priority" value={form.priority} onChange={onChange}>
            {Object.entries(PRIORITY_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Status</label>
          <select className="form-input form-select" name="status" value={form.status} onChange={onChange}>
            {Object.entries(STATUS_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
        </div>
      </div>

      {/* Category + Due Date */}
      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Category</label>
          <select className="form-input form-select" name="category" value={form.category} onChange={onChange}>
            {Object.entries(CATEGORY_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Due Date</label>
          <input
            className="form-input" type="date" name="dueDate"
            value={form.dueDate} onChange={onChange}
            min={new Date().toISOString().split('T')[0]}
          />
        </div>
      </div>

      {/* Actions */}
      <div className="form-actions">
        <button type="button" className="btn btn-ghost" onClick={onCancel}>Cancel</button>
        <button type="submit" className="btn btn-primary" disabled={saving}>
          {saving ? '⟳ Saving...' : (initial ? '✓ Update Task' : '✦ Create Task')}
        </button>
      </div>
    </form>
  )
}

export default TaskForm