"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowUpDown, Search, X } from "lucide-react"

interface TaskFiltersProps {
  filters: {
    category: string
    search: string
    sortBy: string
    sortOrder: string
  }
  setFilters: React.Dispatch<
    React.SetStateAction<{
      category: string
      search: string
      sortBy: string
      sortOrder: string
    }>
  >
}

export function TaskFilters({ filters, setFilters }: TaskFiltersProps) {
  const toggleSortOrder = () => {
    setFilters((prev) => ({
      ...prev,
      sortOrder: prev.sortOrder === "asc" ? "desc" : "asc",
    }))
  }

  const clearFilters = () => {
    setFilters({
      category: "all",
      search: "",
      sortBy: "dueDate",
      sortOrder: "asc",
    })
  }

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
      <div className="relative w-full sm:w-auto">
        <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search tasks..."
          value={filters.search}
          onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
          className="pl-8 pr-8"
        />
        {filters.search && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-0 top-0 h-full"
            onClick={() => setFilters((prev) => ({ ...prev, search: "" }))}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      <Select value={filters.category} onValueChange={(value) => setFilters((prev) => ({ ...prev, category: value }))}>
        <SelectTrigger className="w-full sm:w-[150px]">
          <SelectValue placeholder="Category" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Categories</SelectItem>
          <SelectItem value="work">Work</SelectItem>
          <SelectItem value="personal">Personal</SelectItem>
          <SelectItem value="urgent">Urgent</SelectItem>
          <SelectItem value="other">Other</SelectItem>
        </SelectContent>
      </Select>

      <Select value={filters.sortBy} onValueChange={(value) => setFilters((prev) => ({ ...prev, sortBy: value }))}>
        <SelectTrigger className="w-full sm:w-[150px]">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="dueDate">Due Date</SelectItem>
          <SelectItem value="title">Title</SelectItem>
          <SelectItem value="status">Status</SelectItem>
          <SelectItem value="category">Category</SelectItem>
        </SelectContent>
      </Select>

      <Button variant="outline" size="icon" onClick={toggleSortOrder} className="h-10 w-10">
        <ArrowUpDown className={`h-4 w-4 ${filters.sortOrder === "desc" ? "rotate-180" : ""}`} />
      </Button>

      {(filters.category !== "all" ||
        filters.search ||
        filters.sortBy !== "dueDate" ||
        filters.sortOrder !== "asc") && (
        <Button variant="ghost" size="sm" onClick={clearFilters}>
          Clear
        </Button>
      )}
    </div>
  )
}

