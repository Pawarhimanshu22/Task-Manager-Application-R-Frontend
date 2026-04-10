import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar     from './Navbar'
import Dashboard  from './Dashboard'
import TaskList   from './TaskList'
import CreateTask from './CreateTask'
import EditTask   from './EditTask'

const NotFound = () => (
  <div className="notfound">
    <div className="notfound-code">404</div>
    <h2 className="notfound-title">Lost in the void</h2>
    <p className="notfound-msg">This page doesn't exist in your workspace.</p>
    <a href="/" className="btn btn-primary" style={{ textDecoration: 'none' }}>
      ← Back to Dashboard
    </a>
  </div>
)

function App() {
  return (
    <BrowserRouter>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Navbar />
        <main style={{ flex: 1 }}>
          <Routes>
            <Route path="/"         element={<Dashboard />} />
            <Route path="/tasks"    element={<TaskList />} />
            <Route path="/create"   element={<CreateTask />} />
            <Route path="/edit/:id" element={<EditTask />} />
            <Route path="*"         element={<NotFound />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

export default App