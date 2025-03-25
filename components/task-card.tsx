"use client"

import { useState } from "react"
import { format } from "date-fns"
import type { Task } from "@/lib/redux/features/tasksSlice"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Paperclip, Calendar, MoreHorizontal } from "lucide-react"
import { TaskDetails } from "@/components/task-details"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useAppDispatch } from "@/lib/hooks"
import { deleteTask, updateTaskStatus } from "@/lib/redux/features/tasksSlice"
import { addActivity } from "@/lib/redux/features/activitySlice"

interface TaskCardProps {
  task: Task
  isOverlay?: boolean
}

export function TaskCard({ task, isOverlay = false }: TaskCardProps) {
  const dispatch = useAppDispatch()
  const [showDetails, setShowDetails] = useState(false)

  const handleDelete = () => {
    dispatch(deleteTask(task.id))
  }

  const handleStatusChange = (status: "todo" | "inProgress" | "completed") => {
    dispatch(updateTaskStatus({ id: task.id, status }))
    dispatch(
      addActivity({
        taskId: task.id,
        action: "Status Changed",
        details: `Status changed to ${status}`,
      }),
    )
  }

  const getCategoryBadge = () => {
    switch (task.category) {
      case "work":
        return (
          <Badge variant="outline" className="bg-blue-100">
            Work
          </Badge>
        )
      case "personal":
        return (
          <Badge variant="outline" className="bg-green-100">
            Personal
          </Badge>
        )
      case "urgent":
        return (
          <Badge variant="outline" className="bg-red-100">
            Urgent
          </Badge>
        )
      default:
        return <Badge variant="outline">Other</Badge>
    }
  }

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== "completed"

  return (
    <>
      <Card
        className={`${isOverlay ? "cursor-grabbing opacity-80" : "cursor-grab"} ${isOverdue ? "border-red-300" : ""}`}
      >
        <CardContent className="p-3">
          <div className="space-y-2">
            <div className="flex items-start justify-between">
              <h4 className="font-medium">{task.title}</h4>
              {!isOverlay && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setShowDetails(true)}>View Details</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleStatusChange("todo")}>Move to To Do</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleStatusChange("inProgress")}>
                      Move to In Progress
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleStatusChange("completed")}>
                      Move to Completed
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600" onClick={handleDelete}>
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>

            <p className="text-sm text-muted-foreground line-clamp-2">{task.description || "No description"}</p>
          </div>
        </CardContent>

        <CardFooter className="flex items-center justify-between p-3 pt-0">
          <div className="flex items-center gap-2">
            {getCategoryBadge()}

            {task.attachments?.length > 0 && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Paperclip className="h-3 w-3" />
                {task.attachments.length}
              </div>
            )}
          </div>

          {task.dueDate && (
            <div className={`flex items-center gap-1 text-xs ${isOverdue ? "text-red-500" : "text-muted-foreground"}`}>
              <Calendar className="h-3 w-3" />
              {format(new Date(task.dueDate), "MMM d")}
            </div>
          )}
        </CardFooter>
      </Card>

      {showDetails && <TaskDetails taskId={task.id} onClose={() => setShowDetails(false)} />}
    </>
  )
}

