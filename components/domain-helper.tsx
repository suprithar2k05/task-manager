"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Copy } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export function DomainHelper() {
  const [currentDomain, setCurrentDomain] = useState("")
  const { toast } = useToast()

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentDomain(window.location.hostname)
    }
  }, [])

  const copyToClipboard = () => {
    navigator.clipboard.writeText(currentDomain)
    toast({
      title: "Copied!",
      description: "Domain copied to clipboard",
    })
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Firebase Domain Configuration</CardTitle>
        <CardDescription>Add this domain to your Firebase authorized domains list</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-2">
          <Input value={currentDomain} readOnly />
          <Button size="icon" onClick={copyToClipboard}>
            <Copy className="h-4 w-4" />
          </Button>
        </div>
        <div className="mt-4 text-sm text-muted-foreground">
          <p className="mb-2">To authorize this domain in Firebase:</p>
          <ol className="list-decimal pl-5 space-y-1">
            <li>
              Go to the{" "}
              <a
                href="https://console.firebase.google.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                Firebase Console
              </a>
            </li>
            <li>Select your project</li>
            <li>Go to Authentication → Settings → Authorized domains</li>
            <li>Click "Add domain" and paste your domain</li>
            <li>Click "Add"</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  )
}

