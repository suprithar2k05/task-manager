import React, { useState } from 'react'
import useTasks from '../hooks/useTasks'
import TaskModal from '../components/TaskModal'

const Dashboard = () => {
  const {
    loading,
    tasks,
    filteredTasks,
    filters,
    setFilters,
    createTask,
    updateTask,
    deleteTask,
    toggleComplete,
  } = useTasks()

  const [modalOpen, setModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState(null);
  const tags = [...new Set(tasks.flatMap(t => t.tags))]
  const handleEdit = (task) => {
    setEditingTask(task)
    setModalOpen(true)
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700"
          onClick={() => setModalOpen(true)}
        >
          + New Task
        </button>
      </div>

      {/* Filters */}
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        <select
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          className="border p-2 rounded"
        >
          <option value="all">All Status</option>
          <option value="completed">Completed</option>
          <option value="pending">Pending</option>
        </select>

        <select
          value={filters.tag}
          onChange={(e) => setFilters({ ...filters, tag: e.target.value })}
          className="border p-2 rounded"
        >
          <option value="all">All Tags</option>
          {tags.map((tag, idx) => (
            <option key={idx} value={tag}>{tag}</option>
          ))}
        </select>

        <select
          value={filters.priority}
          onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
          className="border p-2 rounded"
        >
          <option value="all">All Priorities</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
      </div>

      {/* Task List */}
      <div className="space-y-4">
        {filteredTasks.length === 0 ? (
          <p className="text-gray-500">No tasks found.</p>
        ) : loading ? <p className="text-gray-500">Loading tasks...</p> : (
          filteredTasks.map((task) => (
            <div
              key={task._id}
              className="border rounded p-4 flex flex-col md:flex-row md:items-center justify-between bg-white shadow-sm"
            >
              <div>
                <h2 className={`text-lg font-semibold ${task.completed ? 'line-through text-gray-400' : ''}`}>
                  {task.title}
                </h2>
                <p className="text-sm text-gray-600">{task.description}</p>
                <div className="text-sm mt-2 flex flex-wrap gap-2 text-gray-500">
                  <span>Tag: {task.tags.join(',') || '—'}</span>
                  <span>Priority: {task.priority}</span>
                  <span>Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : '—'}</span>
                  <span>Status: {task.isCompleted ? 'Completed' : 'Pending'}</span>
                </div>
              </div>

              <div className="flex gap-2 mt-4 md:mt-0">
                <button
                  onClick={() => toggleComplete(task._id)}
                  className="bg-yellow-400 text-white px-3 py-1 rounded hover:bg-yellow-500"
                >
                  Toggle
                </button>
                <button
                  onClick={() => handleEdit(task)}
                  className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteTask(task._id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      <TaskModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false)
          setEditingTask(null)
        }}
        onSave={(data) =>
          editingTask ? updateTask(editingTask._id, data) : createTask(data)
        }
        task={editingTask}
      />
    </div>
  )
}

export default Dashboard
