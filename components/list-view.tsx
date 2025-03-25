"use client"

import { useState } from "react"
import { useAppSelector, useAppDispatch } from "@/lib/hooks"
import {
  type TaskStatus,
  updateBatchStatus,
  deleteTasks,
  toggleTaskSelection,
  clearTaskSelection,
  selectAllTasks,
} from "@/lib/redux/features/tasksSlice"
import { addActivity } from "@/lib/redux/features/activitySlice"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { UserNav } from "@/components/user-nav"
import { TaskForm } from "@/components/task-form"
import { TaskFilters } from "@/components/task-filters"
import { TaskDetails } from "@/components/task-details"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { Plus, Trash, CheckCircle, AlertCircle } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export function ListView() {
  const dispatch = useAppDispatch()
  const tasks = useAppSelector((state) => state.tasks.tasks)
  const selectedTasks = useAppSelector((state) => state.tasks.selectedTasks)
  const [showTaskForm, setShowTaskForm] = useState(false)
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null)
  const [filters, setFilters] = useState({
    category: "all",
    search: "",
    sortBy: "dueDate",
    sortOrder: "asc",
  })

  const handleSelectAll = () => {
    if (selectedTasks.length === filteredTasks.length) {
      dispatch(clearTaskSelection())
    } else {
      dispatch(selectAllTasks())
    }
  }

  const handleBatchStatusUpdate = (status: TaskStatus) => {
    if (selectedTasks.length > 0) {
      dispatch(updateBatchStatus({ ids: selectedTasks, status }))

      // Log activity for each task
      selectedTasks.forEach((taskId) => {
        dispatch(
          addActivity({
            taskId,
            action: "Status Changed",
            details: `Status changed to ${status} (batch update)`,
          }),
        )
      })

      dispatch(clearTaskSelection())
    }
  }

  const handleBatchDelete = () => {
    if (selectedTasks.length > 0) {
      dispatch(deleteTasks(selectedTasks))
    }
  }

  const getFilteredTasks = () => {
    return tasks
      .filter((task) => {
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
      .sort((a, b) => {
        // Sort by the selected field
        if (filters.sortBy === "dueDate") {
          // Handle null due dates
          if (!a.dueDate && !b.dueDate) return 0
          if (!a.dueDate) return 1
          if (!b.dueDate) return -1

          const dateA = new Date(a.dueDate).getTime()
          const dateB = new Date(b.dueDate).getTime()

          return filters.sortOrder === "asc" ? dateA - dateB : dateB - dateA
        } else if (filters.sortBy === "title") {
          return filters.sortOrder === "asc" ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title)
        } else if (filters.sortBy === "status") {
          return filters.sortOrder === "asc" ? a.status.localeCompare(b.status) : b.status.localeCompare(a.status)
        } else if (filters.sortBy === "category") {
          return filters.sortOrder === "asc"
            ? a.category.localeCompare(b.category)
            : b.category.localeCompare(a.category)
        }

        return 0
      })
  }

  const filteredTasks = getFilteredTasks()

  const getCategoryBadge = (category: string) => {
    switch (category) {
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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "todo":
        return <Badge className="bg-blue-500">To Do</Badge>
      case "inProgress":
        return <Badge className="bg-yellow-500">In Progress</Badge>
      case "completed":
        return <Badge className="bg-green-500">Completed</Badge>
      default:
        return <Badge>Unknown</Badge>
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between px-4">
          <h1 className="text-2xl font-bold">List View</h1>
          <UserNav />
        </div>
      </header>
      <main className="flex-1">
        <div className="container py-6">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <Button onClick={() => setShowTaskForm(true)} className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Add Task
              </Button>

              {selectedTasks.length > 0 && (
                <>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline">Set Status ({selectedTasks.length})</Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => handleBatchStatusUpdate("todo")}>To Do</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleBatchStatusUpdate("inProgress")}>
                        In Progress
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleBatchStatusUpdate("completed")}>
                        Completed
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <Button variant="destructive" onClick={handleBatchDelete} className="flex items-center gap-2">
                    <Trash className="h-4 w-4" />
                    Delete ({selectedTasks.length})
                  </Button>
                </>
              )}
            </div>

            <TaskFilters filters={filters} setFilters={setFilters} />
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={filteredTasks.length > 0 && selectedTasks.length === filteredTasks.length}
                      onCheckedChange={handleSelectAll}
                      aria-label="Select all tasks"
                    />
                  </TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Attachments</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTasks.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      No tasks found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTasks.map((task) => (
                    <TableRow key={task.id} className={selectedTasks.includes(task.id) ? "bg-muted/50" : undefined}>
                      <TableCell>
                        <Checkbox
                          checked={selectedTasks.includes(task.id)}
                          onCheckedChange={() => dispatch(toggleTaskSelection(task.id))}
                          aria-label={`Select task ${task.title}`}
                        />
                      </TableCell>
                      <TableCell
                        className="font-medium hover:cursor-pointer hover:underline"
                        onClick={() => setSelectedTaskId(task.id)}
                      >
                        {task.title}
                      </TableCell>
                      <TableCell>{getCategoryBadge(task.category)}</TableCell>
                      <TableCell>{getStatusBadge(task.status)}</TableCell>
                      <TableCell>
                        {task.dueDate ? (
                          <div className="flex items-center gap-2">
                            {new Date(task.dueDate) < new Date() && task.status !== "completed" ? (
                              <AlertCircle className="h-4 w-4 text-red-500" />
                            ) : task.status === "completed" ? (
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            ) : null}
                            {format(new Date(task.dueDate), "MMM d, yyyy")}
                          </div>
                        ) : (
                          "No due date"
                        )}
                      </TableCell>
                      <TableCell>{task.attachments?.length || 0}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </main>

      {showTaskForm && <TaskForm onClose={() => setShowTaskForm(false)} />}

      {selectedTaskId && <TaskDetails taskId={selectedTaskId} onClose={() => setSelectedTaskId(null)} />}
    </div>
  )
}

