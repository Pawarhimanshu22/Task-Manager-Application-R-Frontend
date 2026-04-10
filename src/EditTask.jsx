import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getTaskById, updateTask } from './api'
import TaskForm from './TaskForm'

const EditTask = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const [task,     setTask]     = useState(null)
  const [loading,  setLoading]  = useState(true)
  const [saving,   setSaving]   = useState(false)
  const [fetchErr, setFetchErr] = useState('')
  const [apiError, setApiError] = useState('')

  useEffect(() => {
    getTaskById(id)
      .then(res => setTask(res.data))
      .catch(err => setFetchErr(err?.response?.data?.message || 'Task not found.'))
      .finally(() => setLoading(false))
  }, [id])

  const handleSubmit = async (data) => {
    setSaving(true); setApiError('')
    try {
      await updateTask(id, data)
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

  if (loading) return (
    <div className="center">
      <div className="spinner" />
      <span className="loading-text">Loading task...</span>
    </div>
  )

  if (fetchErr) return (
    <div className="center">
      <div className="error-box">
        {fetchErr}
        <br />
        <button className="btn-back" style={{ marginTop: 14 }} onClick={() => navigate('/tasks')}>
          ← Back to Tasks
        </button>
      </div>
    </div>
  )

  return (
    <div className="form-wrap">
      <div className="form-card">
        <div className="form-card-head">
          <button className="btn-back" onClick={() => navigate(-1)}>← Back</button>
          <h1 className="form-card-title">Edit Task</h1>
          <p className="form-card-sub">Update task details</p>
        </div>
        {apiError && <div className="api-error">⚠ {apiError}</div>}
        <TaskForm initial={task} onSubmit={handleSubmit} onCancel={() => navigate('/tasks')} saving={saving} />
      </div>
    </div>
  )
}

export default EditTask