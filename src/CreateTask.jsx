import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createTask } from './api'
import TaskForm from './TaskForm'

const CreateTask = () => {
  const [saving,   setSaving]   = useState(false)
  const [apiError, setApiError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (data) => {
    setSaving(true); setApiError('')
    try {
      await createTask(data)
      navigate('/tasks')
    } catch (err) {
      const msg = err?.response?.data?.messages
        ? Object.values(err.response.data.messages).join(', ')
        : err?.response?.data?.message || 'Something went wrong.'
      setApiError(msg)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="form-wrap">
      <div className="form-card">
        <div className="form-card-head">
          <button className="btn-back" onClick={() => navigate(-1)}>← Back</button>
          <h1 className="form-card-title">Create New Task</h1>
          <p className="form-card-sub">Add a new task to your workspace</p>
        </div>
        {apiError && <div className="api-error">⚠ {apiError}</div>}
        <TaskForm onSubmit={handleSubmit} onCancel={() => navigate('/tasks')} saving={saving} />
      </div>
    </div>
  )
}

export default CreateTask