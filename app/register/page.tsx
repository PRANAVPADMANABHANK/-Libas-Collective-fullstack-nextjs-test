import { Suspense } from "react"
import { RegisterForm } from "@/components/auth/register-form"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

export default function RegisterPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Suspense fallback={<LoadingSpinner text="Loading registration form..." />}>
        <RegisterForm />
      </Suspense>
    </div>
  )
}
