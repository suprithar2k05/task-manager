"use client"

import type React from "react"

import { useState } from "react"
import { format } from "date-fns"
import { useAppDispatch, useAppSelector } from "@/lib/hooks"
import { deleteTask, type Attachment, addAttachment, removeAttachment } from "@/lib/redux/features/tasksSlice"
import { addActivity } from "@/lib/redux/features/activitySlice"
import { v4 as uuidv4 } from "uuid"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { TaskForm } from "@/components/task-form"
import { Paperclip, Trash, Calendar, Edit, FileText } from "lucide-react"

interface TaskDetailsProps {
  taskId: string
  onClose: () => void
}

export function TaskDetails({ taskId, onClose }: TaskDetailsProps) {
  const dispatch = useAppDispatch()
  const task = useAppSelector((state) => state.tasks.tasks.find((t) => t.id === taskId))
  const activities = useAppSelector((state) => state.activity.activities.filter((a) => a.taskId === taskId)).sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
  )

  const [showEditForm, setShowEditForm] = useState(false)
  const [isUploading, setIsUploading] = useState(false)

  if (!task) {
    return null
  }

  const handleDelete = () => {
    dispatch(deleteTask(task.id))
    onClose()
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setIsUploading(true)

    // Simulate file upload
    setTimeout(() => {
      const file = files[0]
      const fileExtension = file.name.split(".").pop() || ""

      // In a real app, you would upload the file to a storage service
      // and get back a URL. Here we're just simulating that.
      const attachment: Attachment = {
        id: uuidv4(),
        name: file.name,
        url: `https://example.com/files/${file.name}`, // Simulated URL
        type: fileExtension,
      }

      dispatch(addAttachment({ taskId: task.id, attachment }))

      dispatch(
        addActivity({
          taskId: task.id,
          action: "Attachment Added",
          details: `Added attachment: ${file.name}`,
        }),
      )

      setIsUploading(false)
    }, 1000)

    // Reset the file input
    e.target.value = ""
  }

  const handleRemoveAttachment = (attachmentId: string) => {
    dispatch(removeAttachment({ taskId: task.id, attachmentId }))

    dispatch(
      addActivity({
        taskId: task.id,
        action: "Attachment Removed",
        details: "Removed an attachment",
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

  const getStatusBadge = () => {
    switch (task.status) {
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
    <>
      <Dialog open={true} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>{task.title}</span>
              <Button variant="outline" size="icon" onClick={() => setShowEditForm(true)}>
                <Edit className="h-4 w-4" />
              </Button>
            </DialogTitle>
          </DialogHeader>

          <Tabs defaultValue="details">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="attachments">Attachments</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-4 py-4">
              <div className="flex flex-wrap gap-2">
                {getCategoryBadge()}
                {getStatusBadge()}
              </div>

              {task.dueDate && (
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4" />
                  <span>Due: {format(new Date(task.dueDate), "PPP")}</span>
                </div>
              )}

              <Separator />

              <div>
                <h4 className="mb-2 font-medium">Description</h4>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {task.description || "No description provided."}
                </p>
              </div>

              <div className="text-xs text-muted-foreground">
                <div>Created: {format(new Date(task.createdAt), "PPP p")}</div>
                <div>Last updated: {format(new Date(task.updatedAt), "PPP p")}</div>
              </div>
            </TabsContent>

            <TabsContent value="attachments" className="py-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Attachments</h4>
                  <div>
                    <input type="file" id="file-upload" className="hidden" onChange={handleFileUpload} />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => document.getElementById("file-upload")?.click()}
                      disabled={isUploading}
                    >
                      {isUploading ? (
                        <div className="flex items-center gap-2">
                          <div className="h-3 w-3 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                          <span>Uploading...</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Paperclip className="h-4 w-4" />
                          <span>Add File</span>
                        </div>
                      )}
                    </Button>
                  </div>
                </div>

                {task.attachments?.length === 0 ? (
                  <div className="flex h-24 items-center justify-center rounded-md border border-dashed p-2 text-sm text-muted-foreground">
                    No attachments yet
                  </div>
                ) : (
                  <div className="space-y-2">
                    {task.attachments?.map((attachment) => (
                      <div key={attachment.id} className="flex items-center justify-between rounded-md border p-2">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          <span className="text-sm">{attachment.name}</span>
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => handleRemoveAttachment(attachment.id)}>
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="activity" className="py-4">
              <h4 className="mb-2 font-medium">Activity Log</h4>

              {activities.length === 0 ? (
                <div className="flex h-24 items-center justify-center rounded-md border border-dashed p-2 text-sm text-muted-foreground">
                  No activity recorded yet
                </div>
              ) : (
                <div className="space-y-2">
                  {activities.map((activity) => (
                    <div key={activity.id} className="rounded-md border p-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{activity.action}</span>
                        <span className="text-xs text-muted-foreground">
                          {format(new Date(activity.timestamp), "PPP p")}
                        </span>
                      </div>
                      {activity.details && <p className="mt-1 text-xs text-muted-foreground">{activity.details}</p>}
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>

          <DialogFooter>
            <Button variant="destructive" onClick={handleDelete}>
              Delete Task
            </Button>
            <Button onClick={onClose}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {showEditForm && <TaskForm task={task} onClose={() => setShowEditForm(false)} />}
    </>
  )
}

