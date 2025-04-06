import { useState, useEffect } from 'react'
import API from '../services/api'
import { toast } from 'react-toastify'

const useTasks = () => {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [filters, setFilters] = useState({
   status: 'all', // 'all' | 'completed' | 'pending'
   tag: 'all',
   priority: 'all',
  })
 
  const filteredTasks = tasks.filter(task => {   return (
     (filters.status === 'all' || task.isCompleted === (filters.status === 'completed')) &&
     (filters.tag === 'all' || task.tags.includes(filters.tag)) &&
     (filters.priority === 'all' || task.priority === filters.priority)
   )
 })

  const fetchTasks = async () => {
    setLoading(true)
    try {
      const res = await API.get('/tasks')
      if(Array.isArray(res.data)){
         setTasks(res.data)
      }
    } catch (err) {
      setError(err)
      toast.error('Failed to load tasks')
    } finally {
      setLoading(false)
    }
  }

  const createTask = async task => {
    try {
      const res = await API.post('/tasks', task)
      setTasks(prev => [res.data, ...prev])
      toast.success('Task created!')
    } catch (err) {
      toast.error('Failed to create task');
      console.log('errr >>>', err.message);
    }
  }

  const updateTask = async (id, updatedData) => {
    try {
      const res = await API.put(`/tasks/${id}`, updatedData);

      setTasks(prev =>
        prev.map(t => (t._id === id ? res.data : t))
      )
      toast.success('Task updated!')
    } catch (err) {
      toast.error('Failed to update task')
    }
  }

  const deleteTask = async id => {
    try {
      await API.delete(`/tasks/${id}`)
      setTasks(prev => prev.filter(t => t._id !== id))
      toast.success('Task deleted!')
    } catch (err) {
      toast.error('Failed to delete task')
    }
  }

  const toggleComplete = async id => {
    const task = tasks.find(t => t._id === id)
    if (!task) return
    updateTask(id, { ...task, isCompleted: !task.isCompleted })
  }

  useEffect(() => {
    fetchTasks()
  }, [])

  return {
    tasks,
    loading,
    error,
    createTask,
    updateTask,
    deleteTask,
    toggleComplete,
    filters, 
    setFilters, 
    filteredTasks
  }
}

export default useTasks
