"use client"

import type React from "react"

import { useEffect } from "react"
import { useAppSelector } from "@/lib/hooks"
import { saveState } from "@/lib/redux/localStorage"

export function PersistenceProvider({ children }: { children: React.ReactNode }) {
  const state = useAppSelector((state) => state)

  // Save state to localStorage whenever it changes
  useEffect(() => {
    saveState(state)
  }, [state])

  return <>{children}</>
}

