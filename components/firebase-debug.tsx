"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function FirebaseDebug() {
  const [config, setConfig] = useState<Record<string, string>>({})

  useEffect(() => {
    // Collect Firebase config for debugging
    const firebaseConfig = {
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "Not set",
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "Not set",
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "Not set",
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "Not set",
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "Not set",
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "Not set",
    }

    // Mask sensitive values for display
    const maskedConfig = Object.entries(firebaseConfig).reduce(
      (acc, [key, value]) => {
        if (value === "Not set") {
          acc[key] = "Not set"
        } else if (key === "apiKey" || key === "appId") {
          // Show only first and last few characters
          acc[key] = `${value.substring(0, 4)}...${value.substring(value.length - 4)}`
        } else {
          acc[key] = value
        }
        return acc
      },
      {} as Record<string, string>,
    )

    setConfig(maskedConfig)
  }, [])

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Firebase Configuration Debug</CardTitle>
        <CardDescription>Check if your Firebase environment variables are properly set</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {Object.entries(config).map(([key, value]) => (
            <div key={key} className="flex justify-between">
              <span className="font-medium">{key}:</span>
              <span className={value === "Not set" ? "text-red-500" : "text-green-500"}>{value}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

