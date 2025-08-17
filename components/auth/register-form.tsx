"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/contexts/auth-context"
import { Alert, AlertDescription } from "@/components/ui/alert"

export function RegisterForm() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [otp, setOtp] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [otpSent, setOtpSent] = useState(false)
  const [otpVerified, setOtpVerified] = useState(false)
  const [sendingOtp, setSendingOtp] = useState(false)
  const [verifyingOtp, setVerifyingOtp] = useState(false)
  const { signUp } = useAuth()
  const router = useRouter()

  const handleSendOtp = async () => {
    if (!email || !name) {
      setError("Please fill in your name and email first")
      return
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters")
      return
    }

    setSendingOtp(true)
    setError("")

    try {
      const response = await fetch('/api/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          displayName: name
        }),
      })

      const result = await response.json()

      if (result.success) {
        setOtpSent(true)
        setError("")
      } else {
        setError(result.error || "Failed to send OTP")
      }
    } catch (error: any) {
      setError("Failed to send OTP. Please try again.")
    } finally {
      setSendingOtp(false)
    }
  }

  const handleVerifyOtp = async () => {
    if (!otp) {
      setError("Please enter the OTP")
      return
    }

    setVerifyingOtp(true)
    setError("")

    try {
      const response = await fetch('/api/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          otp
        }),
      })

      const result = await response.json()

      if (result.success) {
        setOtpVerified(true)
        setError("")
      } else {
        setError(result.error || "Invalid OTP")
      }
    } catch (error: any) {
      setError("Failed to verify OTP. Please try again.")
    } finally {
      setVerifyingOtp(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!otpVerified) {
      setError("Please verify your email with OTP first")
      return
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters")
      return
    }

    setLoading(true)

    try {
      await signUp(email, password, name)
      router.push("/")
    } catch (error: any) {
      setError(error.message || "Failed to create account")
    } finally {
      setLoading(false)
    }
  }

  const handleResendOtp = () => {
    setOtpSent(false)
    setOtpVerified(false)
    setOtp("")
    handleSendOtp()
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Create Account</CardTitle>
        <CardDescription>Sign up for a new account to start shopping</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input 
              id="name" 
              type="text" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              required 
              disabled={otpVerified}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email" 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
              disabled={otpVerified}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={otpVerified}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={otpVerified}
            />
          </div>

          {!otpSent ? (
            <Button 
              type="button" 
              className="w-full" 
              onClick={handleSendOtp}
              disabled={sendingOtp || !email || !name || password !== confirmPassword || password.length < 6}
            >
              {sendingOtp ? "Sending OTP..." : "Send OTP"}
            </Button>
          ) : !otpVerified ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="otp">Enter OTP</Label>
                <Input
                  id="otp"
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter 6-digit code"
                  maxLength={6}
                  required
                />
                <p className="text-sm text-muted-foreground">
                  We've sent a 6-digit code to {email}
                </p>
              </div>

              <div className="flex space-x-2">
                <Button 
                  type="button" 
                  className="flex-1" 
                  onClick={handleVerifyOtp}
                  disabled={verifyingOtp || !otp}
                >
                  {verifyingOtp ? "Verifying..." : "Verify OTP"}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handleResendOtp}
                  disabled={sendingOtp}
                >
                  {sendingOtp ? "Sending..." : "Resend"}
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <Alert>
                <AlertDescription className="text-green-600">
                  ✅ Email verified successfully! You can now create your account.
                </AlertDescription>
              </Alert>
              
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Creating Account..." : "Create Account"}
              </Button>
            </div>
          )}

          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  )
}
