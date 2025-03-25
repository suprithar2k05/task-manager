"use client"

import { useState } from "react"
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core"
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable"
import { useAppDispatch, useAppSelector } from "@/lib/hooks"
import { type TaskStatus, updateTaskStatus, updateTasksOrder } from "@/lib/redux/features/tasksSlice"
import { addActivity } from "@/lib/redux/features/activitySlice"
import { TaskColumn } from "@/components/task-column"
import { TaskCard } from "@/components/task-card"
import { TaskForm } from "@/components/task-form"
import { Button } from "@/components/ui/button"
import { UserNav } from "@/components/user-nav"
import { Plus } from "lucide-react"
import { TaskFilters } from "@/components/task-filters"

export function BoardView() {
  const dispatch = useAppDispatch()
  const tasks = useAppSelector((state) => state.tasks.tasks)
  const [activeId, setActiveId] = useState<string | null>(null)
  const [showTaskForm, setShowTaskForm] = useState(false)
  const [filters, setFilters] = useState({
    category: "all",
    search: "",
    sortBy: "dueDate",
    sortOrder: "asc",
  })

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  const handleDragStart = (event: any) => {
    setActiveId(event.active.id)
  }

  const handleDragEnd = (event: any) => {
    const { active, over } = event

    if (!over) return

    const activeTaskId = active.id
    const overTaskId = over.id

    // Find the containers (columns) of the active and over tasks
    const activeContainer = active.data.current?.sortable?.containerId
    const overContainer = over.data.current?.sortable?.containerId

    if (activeContainer !== overContainer) {
      // Task moved to a different column
      dispatch(
        updateTaskStatus({
          id: activeTaskId,
          status: overContainer as TaskStatus,
        }),
      )

      // Log activity
      dispatch(
        addActivity({
          taskId: activeTaskId,
          action: "Status Changed",
          details: `Status changed to ${overContainer}`,
        }),
      )
    } else {
      // Task reordered within the same column
      const columnTasks = tasks.filter((task) => task.status === activeContainer).sort((a, b) => a.order - b.order)

      const oldIndex = columnTasks.findIndex((task) => task.id === activeTaskId)
      const newIndex = columnTasks.findIndex((task) => task.id === overTaskId)

      if (oldIndex !== newIndex) {
        const newOrder = arrayMove(
          columnTasks.map((task) => task.id),
          oldIndex,
          newIndex,
        )

        dispatch(
          updateTasksOrder({
            status: activeContainer as TaskStatus,
            taskIds: newOrder,
          }),
        )
      }
    }

    setActiveId(null)
  }

  const handleDragCancel = () => {
    setActiveId(null)
  }

  const getFilteredTasks = () => {
    return tasks.filter((task) => {
      // Filter by category
      if (filters.category !== "all" && task.category !== filters.category) {
        return false
      }

      // Filter by search term
      if (
        filters.search &&
        !task.title.toLowerCase().includes(filters.search.toLowerCase()) &&
        !task.description.toLowerCase().includes(filters.search.toLowerCase())
      ) {
        return false
      }

      return true
    })
  }

  const filteredTasks = getFilteredTasks()

  const todoTasks = filteredTasks.filter((task) => task.status === "todo").sort((a, b) => a.order - b.order)

  const inProgressTasks = filteredTasks.filter((task) => task.status === "inProgress").sort((a, b) => a.order - b.order)

  const completedTasks = filteredTasks.filter((task) => task.status === "completed").sort((a, b) => a.order - b.order)

  const activeTask = activeId ? tasks.find((task) => task.id === activeId) : null

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between px-4">
          <h1 className="text-2xl font-bold">Board View</h1>
          <UserNav />
        </div>
      </header>
      <main className="flex-1 overflow-auto">
        <div className="container py-6">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button onClick={() => setShowTaskForm(true)} className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Add Task
              </Button>
            </div>
            <TaskFilters filters={filters} setFilters={setFilters} />
          </div>

          <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDragCancel={handleDragCancel}
          >
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <TaskColumn id="todo" title="To Do" tasks={todoTasks} color="blue" />
              <TaskColumn id="inProgress" title="In Progress" tasks={inProgressTasks} color="yellow" />
              <TaskColumn id="completed" title="Completed" tasks={completedTasks} color="green" />
            </div>

            <DragOverlay>{activeId && activeTask ? <TaskCard task={activeTask} isOverlay /> : null}</DragOverlay>
          </DndContext>
        </div>
      </main>

      {showTaskForm && <TaskForm onClose={() => setShowTaskForm(false)} />}
    </div>
  )
}

