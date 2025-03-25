import { LoginForm } from "@/components/login-form"
import { FirebaseDebug } from "@/components/firebase-debug"
import { DomainHelper } from "@/components/domain-helper"

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 p-4">
      <LoginForm />

      {/* Include the debug components in development */}
      {process.env.NODE_ENV === "development" && (
        <div className="space-y-4 w-full max-w-md">
          <FirebaseDebug />
          <DomainHelper />
        </div>
      )}
    </div>
  )
}

