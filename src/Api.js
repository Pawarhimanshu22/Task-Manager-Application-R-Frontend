import axios from 'axios'

const BASE = '/api/tasks'

export const getAllTasks    = ()         => axios.get(BASE)
export const getTaskById   = (id)       => axios.get(`${BASE}/${id}`)
export const createTask    = (data)     => axios.post(BASE, data)
export const updateTask    = (id, data) => axios.put(`${BASE}/${id}`, data)
export const deleteTask    = (id)       => axios.delete(`${BASE}/${id}`)
export const getByStatus   = (s)        => axios.get(`${BASE}/status/${s}`)
export const getByCategory = (c)        => axios.get(`${BASE}/category/${c}`)
export const getByPriority = (p)        => axios.get(`${BASE}/priority/${p}`)
export const searchTasks   = (kw)       => axios.get(`${BASE}/search?keyword=${kw}`)