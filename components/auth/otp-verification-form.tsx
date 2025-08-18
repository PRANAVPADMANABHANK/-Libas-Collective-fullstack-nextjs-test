"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Mail, CheckCircle, AlertCircle, ArrowLeft } from "lucide-react"

interface OTPVerificationFormProps {
  email: string
  name: string
  onVerificationSuccess: () => void
  onBack: () => void
}

export function OTPVerificationForm({ email, name, onVerificationSuccess, onBack }: OTPVerificationFormProps) {
  const [otp, setOtp] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [isVerified, setIsVerified] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [timeLeft, setTimeLeft] = useState(600) // 10 minutes in seconds

  // Countdown timer
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [timeLeft])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!otp.trim()) {
      setError("Please enter the OTP code")
      return
    }

    setLoading(true)
    setError("")

    try {
      const response = await fetch('/api/send-otp', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          otp: otp.trim()
        }),
      })

      const result = await response.json()

      if (result.success) {
        setIsVerified(true)
        setTimeout(() => {
          onVerificationSuccess()
        }, 2000)
      } else {
        setError(result.error || "Failed to verify OTP")
      }
    } catch (error) {
      setError("Failed to verify OTP. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleResendOTP = async () => {
    setIsResending(true)
    setError("")

    try {
      const response = await fetch('/api/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          name
        }),
      })

      const result = await response.json()

      if (result.success) {
        setTimeLeft(600) // Reset timer to 10 minutes
        setError("")
      } else {
        setError(result.error || "Failed to resend OTP")
      }
    } catch (error) {
      setError("Failed to resend OTP. Please try again.")
    } finally {
      setIsResending(false)
    }
  }

  if (isVerified) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <div className="flex items-center justify-center mb-4">
            <CheckCircle className="h-12 w-12 text-green-500" />
          </div>
          <CardTitle className="text-center">Email Verified!</CardTitle>
          <CardDescription className="text-center">
            Your email has been successfully verified. Creating your account...
          </CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <div className="flex items-center justify-center mb-4">
          <Mail className="h-12 w-12 text-primary" />
        </div>
        <CardTitle>Verify Your Email</CardTitle>
        <CardDescription>
          We've sent a 6-digit verification code to <strong>{email}</strong>. Please enter the code below to complete your registration.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleVerifyOTP} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="otp">Verification Code</Label>
            <Input
              id="otp"
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="Enter 6-digit code"
              maxLength={6}
              className="text-center text-lg tracking-widest"
            />
            <p className="text-xs text-muted-foreground">
              Enter the 6-digit code sent to your email
            </p>
          </div>

          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-2">
              Time remaining: <span className="font-mono">{formatTime(timeLeft)}</span>
            </p>
          </div>

          <Button type="submit" className="w-full" disabled={loading || timeLeft === 0}>
            {loading ? "Verifying..." : "Verify & Create Account"}
          </Button>

          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              Didn't receive the code?
            </p>
            <Button
              type="button"
              variant="outline"
              onClick={handleResendOTP}
              disabled={isResending || timeLeft > 0}
              className="w-full"
            >
              {isResending ? "Sending..." : "Resend Code"}
            </Button>
          </div>

          <div className="text-center">
            <Button
              type="button"
              variant="ghost"
              onClick={onBack}
              className="text-sm"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Registration
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
