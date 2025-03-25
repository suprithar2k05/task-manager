"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAppSelector } from "@/lib/hooks"
import { UserNav } from "@/components/user-nav"
import { ListChecks, Kanban } from "lucide-react"

export function HomeView() {
  const router = useRouter()
  const user = useAppSelector((state) => state.auth.user)
  const tasks = useAppSelector((state) => state.tasks.tasks)

  const todoCount = tasks.filter((task) => task.status === "todo").length
  const inProgressCount = tasks.filter((task) => task.status === "inProgress").length
  const completedCount = tasks.filter((task) => task.status === "completed").length

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between px-4">
          <h1 className="text-2xl font-bold">Task Manager</h1>
          <UserNav />
        </div>
      </header>
      <main className="flex-1">
        <div className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
          <div className="flex flex-col items-start gap-2">
            <h1 className="text-3xl font-bold tracking-tight">Welcome, {user?.displayName || "User"}</h1>
            <p className="text-muted-foreground">Choose how you want to view and manage your tasks</p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">To Do</CardTitle>
                <div className="h-4 w-4 rounded-full bg-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{todoCount}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">In Progress</CardTitle>
                <div className="h-4 w-4 rounded-full bg-yellow-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{inProgressCount}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Completed</CardTitle>
                <div className="h-4 w-4 rounded-full bg-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{completedCount}</div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card className="flex flex-col items-center p-6">
              <Kanban className="h-12 w-12 mb-4" />
              <CardTitle>Board View</CardTitle>
              <CardDescription className="text-center mt-2 mb-4">
                Visualize your tasks in a Kanban-style board with drag-and-drop functionality
              </CardDescription>
              <Button onClick={() => router.push("/board")}>Open Board View</Button>
            </Card>
            <Card className="flex flex-col items-center p-6">
              <ListChecks className="h-12 w-12 mb-4" />
              <CardTitle>List View</CardTitle>
              <CardDescription className="text-center mt-2 mb-4">
                View your tasks in a list format with sorting and filtering options
              </CardDescription>
              <Button onClick={() => router.push("/list")}>Open List View</Button>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}

