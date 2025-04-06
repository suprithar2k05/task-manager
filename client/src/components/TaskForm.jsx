import React, { useState, useEffect } from 'react'

const TaskForm = ({ initialData = {}, onSubmit, onCancel }) => {
  const [form, setForm] = useState({
    title: '',
    description: '',
    tag: '',
    priority: 'Medium',
    dueDate: '',
    isCompleted: false,
  })

  useEffect(() => {
    if (initialData) {
      setForm((prevForm) => ({ ...prevForm, ...initialData, tag: initialData?.tags.join(',') }))
    }
  }, [initialData])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(form)
  }

  return (
   <div className="max-h-[80vh] overflow-y-auto p-4">
    <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-white rounded-lg shadow-md max-w-md mx-auto">
      <h2 className="text-xl font-semibold text-gray-800 mb-2">
        {initialData && initialData._id ? 'Edit Task' : 'Create New Task'}
      </h2>

      <input
        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        type="text"
        name="title"
        placeholder="Task Title"
        value={form.title}
        onChange={handleChange}
        required
      />

      <textarea
        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        name="description"
        placeholder="Task Description"
        rows="4"
        value={form.description}
        onChange={handleChange}
      />

      <input
        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        type="text"
        name="tag"
        placeholder="Tag (e.g., Work, Personal)"
        value={form.tag}
        onChange={handleChange}
      />

      <select
        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        name="priority"
        value={form.priority}
        onChange={handleChange}
      >
        <option value="High">High Priority</option>
        <option value="Medium">Medium Priority</option>
        <option value="Low">Low Priority</option>
      </select>

      <input
        className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        type="date"
        name="dueDate"
        value={form.dueDate ? new Date(form.dueDate).toISOString().split('T')[0] : ''}
        onChange={handleChange}
      />

      <label className="inline-flex items-center space-x-2 text-sm text-gray-700">
        <input
          type="checkbox"
          name="isCompleted"
          checked={form.isCompleted}
          onChange={handleChange}
          className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
        />
        <span>Mark as Completed</span>
      </label>

      <div className="flex justify-between pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          {initialData && initialData._id ? 'Update Task' : 'Create Task'}
        </button>
      </div>
    </form>
    </div>
  )
}

export default TaskForm
