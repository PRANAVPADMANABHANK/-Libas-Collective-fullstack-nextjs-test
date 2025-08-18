import { Suspense } from "react"
import { LoginForm } from "@/components/auth/login-form"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

export default function LoginPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Suspense fallback={<LoadingSpinner text="Loading login form..." />}>
        <LoginForm />
      </Suspense>
    </div>
  )
}
