import type React from "react"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import AuthProvider from "@/components/auth-provider"
import { ReduxProvider } from "@/lib/redux/provider"
import { PersistenceProvider } from "@/components/persistence-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Task Management App",
  description: "A comprehensive task management application",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <ReduxProvider>
            <PersistenceProvider>
              <AuthProvider>
                {children}
                <Toaster />
              </AuthProvider>
            </PersistenceProvider>
          </ReduxProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}



import './globals.css'