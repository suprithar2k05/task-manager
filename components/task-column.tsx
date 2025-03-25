"use client"

import { useMemo } from "react"
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { useDroppable } from "@dnd-kit/core"
import type { Task } from "@/lib/redux/features/tasksSlice"
import { SortableTaskCard } from "@/components/sortable-task-card"

interface TaskColumnProps {
  id: string
  title: string
  tasks: Task[]
  color: string
}

export function TaskColumn({ id, title, tasks, color }: TaskColumnProps) {
  const { setNodeRef } = useDroppable({
    id,
  })

  const taskIds = useMemo(() => tasks.map((task) => task.id), [tasks])

  const getColumnColor = () => {
    switch (color) {
      case "blue":
        return "bg-blue-500"
      case "yellow":
        return "bg-yellow-500"
      case "green":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div className="flex h-full flex-col rounded-lg border bg-card text-card-foreground shadow-sm">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <div className={`h-3 w-3 rounded-full ${getColumnColor()}`} />
          <h3 className="font-medium">{title}</h3>
        </div>
        <div className="rounded-full bg-muted px-2 py-1 text-xs font-medium">{tasks.length}</div>
      </div>

      <div ref={setNodeRef} className="flex flex-1 flex-col gap-2 overflow-y-auto p-2">
        <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
          {tasks.map((task) => (
            <SortableTaskCard key={task.id} task={task} />
          ))}
        </SortableContext>

        {tasks.length === 0 && (
          <div className="flex h-24 items-center justify-center rounded-md border border-dashed p-2 text-sm text-muted-foreground">
            No tasks
          </div>
        )}
      </div>
    </div>
  )
}

