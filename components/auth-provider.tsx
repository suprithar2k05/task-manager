"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { onAuthStateChanged } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { useAppDispatch, useAppSelector } from "@/lib/hooks"
import { setUser } from "@/lib/redux/features/authSlice"

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const dispatch = useAppDispatch()
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        dispatch(
          setUser({
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
          }),
        )
      } else {
        dispatch(setUser(null))
      }
    })

    return () => unsubscribe()
  }, [dispatch])

  useEffect(() => {
    // Redirect logic
    if (isAuthenticated && pathname === "/login") {
      router.push("/")
    } else if (!isAuthenticated && pathname !== "/login") {
      router.push("/login")
    }
  }, [isAuthenticated, pathname, router])

  return <>{children}</>
}

