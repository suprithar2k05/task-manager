import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import { v4 as uuidv4 } from "uuid"

export type TaskStatus = "todo" | "inProgress" | "completed"

export type TaskCategory = "work" | "personal" | "urgent" | "other"

export interface Attachment {
  id: string
  name: string
  url: string
  type: string
}

export interface Task {
  id: string
  title: string
  description: string
  status: TaskStatus
  category: TaskCategory
  dueDate: string | null
  createdAt: string
  updatedAt: string
  attachments: Attachment[]
  order: number
}

interface TasksState {
  tasks: Task[]
  selectedTasks: string[]
}

const initialState: TasksState = {
  tasks: [],
  selectedTasks: [],
}

export const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    addTask: (state, action: PayloadAction<Omit<Task, "id" | "createdAt" | "updatedAt" | "order">>) => {
      const maxOrder = state.tasks
        .filter((task) => task.status === action.payload.status)
        .reduce((max, task) => Math.max(max, task.order), -1)

      const newTask: Task = {
        id: uuidv4(),
        ...action.payload,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        order: maxOrder + 1,
      }
      state.tasks.push(newTask)
    },
    updateTask: (state, action: PayloadAction<Partial<Task> & { id: string }>) => {
      const index = state.tasks.findIndex((task) => task.id === action.payload.id)
      if (index !== -1) {
        state.tasks[index] = {
          ...state.tasks[index],
          ...action.payload,
          updatedAt: new Date().toISOString(),
        }
      }
    },
    deleteTask: (state, action: PayloadAction<string>) => {
      state.tasks = state.tasks.filter((task) => task.id !== action.payload)
    },
    deleteTasks: (state, action: PayloadAction<string[]>) => {
      state.tasks = state.tasks.filter((task) => !action.payload.includes(task.id))
      state.selectedTasks = []
    },
    updateTaskStatus: (state, action: PayloadAction<{ id: string; status: TaskStatus }>) => {
      const { id, status } = action.payload
      const task = state.tasks.find((task) => task.id === id)

      if (task) {
        // Get max order in the target status column
        const maxOrder = state.tasks.filter((t) => t.status === status).reduce((max, t) => Math.max(max, t.order), -1)

        task.status = status
        task.updatedAt = new Date().toISOString()
        task.order = maxOrder + 1
      }
    },
    updateTasksOrder: (state, action: PayloadAction<{ status: TaskStatus; taskIds: string[] }>) => {
      const { status, taskIds } = action.payload

      taskIds.forEach((id, index) => {
        const task = state.tasks.find((t) => t.id === id)
        if (task) {
          task.status = status
          task.order = index
          task.updatedAt = new Date().toISOString()
        }
      })
    },
    toggleTaskSelection: (state, action: PayloadAction<string>) => {
      const taskId = action.payload
      if (state.selectedTasks.includes(taskId)) {
        state.selectedTasks = state.selectedTasks.filter((id) => id !== taskId)
      } else {
        state.selectedTasks.push(taskId)
      }
    },
    clearTaskSelection: (state) => {
      state.selectedTasks = []
    },
    selectAllTasks: (state) => {
      state.selectedTasks = state.tasks.map((task) => task.id)
    },
    updateBatchStatus: (state, action: PayloadAction<{ ids: string[]; status: TaskStatus }>) => {
      const { ids, status } = action.payload

      ids.forEach((id) => {
        const task = state.tasks.find((t) => t.id === id)
        if (task) {
          task.status = status
          task.updatedAt = new Date().toISOString()
        }
      })

      // Recalculate order for each task in the status column
      const tasksInStatus = state.tasks.filter((t) => t.status === status).sort((a, b) => a.order - b.order)

      tasksInStatus.forEach((task, index) => {
        task.order = index
      })
    },
    addAttachment: (state, action: PayloadAction<{ taskId: string; attachment: Attachment }>) => {
      const { taskId, attachment } = action.payload
      const task = state.tasks.find((t) => t.id === taskId)

      if (task) {
        task.attachments.push(attachment)
        task.updatedAt = new Date().toISOString()
      }
    },
    removeAttachment: (state, action: PayloadAction<{ taskId: string; attachmentId: string }>) => {
      const { taskId, attachmentId } = action.payload
      const task = state.tasks.find((t) => t.id === taskId)

      if (task) {
        task.attachments = task.attachments.filter((a) => a.id !== attachmentId)
        task.updatedAt = new Date().toISOString()
      }
    },
  },
})

export const {
  addTask,
  updateTask,
  deleteTask,
  deleteTasks,
  updateTaskStatus,
  updateTasksOrder,
  toggleTaskSelection,
  clearTaskSelection,
  selectAllTasks,
  updateBatchStatus,
  addAttachment,
  removeAttachment,
} = tasksSlice.actions

export default tasksSlice.reducer

