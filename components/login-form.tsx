"use client"

import { useState } from "react"
import { signInWithPopup, signInWithRedirect, getRedirectResult } from "firebase/auth"
import { auth, googleProvider } from "@/lib/firebase"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { FcGoogle } from "react-icons/fc"
import { useEffect } from "react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [authError, setAuthError] = useState<string | null>(null)
  const { toast } = useToast()

  // Check for redirect result on component mount
  useEffect(() => {
    const checkRedirectResult = async () => {
      try {
        const result = await getRedirectResult(auth)
        if (result) {
          toast({
            title: "Success",
            description: "You have successfully signed in!",
          })
        }
      } catch (error) {
        console.error("Redirect sign-in error:", error)
        handleAuthError(error)
      }
    }

    checkRedirectResult()
  }, [toast])

  const handleAuthError = (error: any) => {
    console.error("Authentication error:", error)

    // Handle specific error codes
    if (error.code === "auth/unauthorized-domain") {
      setAuthError("unauthorized-domain")
      toast({
        title: "Domain Not Authorized",
        description: "This domain is not authorized in Firebase. See instructions below.",
        variant: "destructive",
      })
    } else {
      // Generic error handling for other errors
      let errorMessage = "Failed to sign in with Google. Please try again."

      if (error.code === "auth/popup-blocked") {
        errorMessage = "Popup was blocked by your browser. Please allow popups or try the redirect method."
      } else if (error.code === "auth/popup-closed-by-user") {
        errorMessage = "Sign-in popup was closed before completing the sign-in process."
      } else if (error.code === "auth/cancelled-popup-request") {
        errorMessage = "Multiple popup requests were triggered. Only the latest one will be processed."
      } else if (error.code === "auth/configuration-not-found") {
        errorMessage = "Authentication configuration not found. Please check your Firebase setup."
      }

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    }
  }

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true)
      setAuthError(null)

      // Check if we're in a mobile environment
      const isMobile = window.innerWidth <= 768

      if (isMobile) {
        // Use redirect for mobile devices
        await signInWithRedirect(auth, googleProvider)
      } else {
        // Use popup for desktop
        await signInWithPopup(auth, googleProvider)
        toast({
          title: "Success",
          description: "You have successfully signed in!",
        })
      }
    } catch (error) {
      handleAuthError(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-[400px] max-w-full">
      <CardHeader>
        <CardTitle className="text-2xl">Welcome</CardTitle>
        <CardDescription>Sign in to access your task management dashboard</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Button variant="outline" onClick={handleGoogleSignIn} disabled={isLoading} className="w-full">
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                <span>Signing in...</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <FcGoogle className="h-5 w-5" />
                <span>Sign in with Google</span>
              </div>
            )}
          </Button>

          {authError === "unauthorized-domain" && (
            <Alert variant="destructive" className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Unauthorized Domain</AlertTitle>
              <AlertDescription>
                <p className="mb-2">Your current domain is not authorized in Firebase. To fix this:</p>
                <ol className="list-decimal pl-5 space-y-1 text-sm">
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
                  <li>
                    Add "{typeof window !== "undefined" ? window.location.hostname : "your current domain"}" to the list
                  </li>
                  <li>For local development, make sure "localhost" is in the list</li>
                </ol>
              </AlertDescription>
            </Alert>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-muted-foreground">
          By signing in, you agree to our Terms of Service and Privacy Policy
        </p>
      </CardFooter>
    </Card>
  )
}

