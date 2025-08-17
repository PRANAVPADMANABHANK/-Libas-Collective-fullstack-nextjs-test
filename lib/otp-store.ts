// Shared OTP store for both send-otp and verify-otp API routes
import { OTPData } from './otp-types'

// In-memory OTP store (in production, use Redis or database)
// This is shared across all API routes
export const otpStore = new Map<string, OTPData>()

// Helper functions for OTP management
export const storeOTP = (email: string, otp: string): void => {
  otpStore.set(email, {
    otp,
    timestamp: Date.now(),
    attempts: 0
  })
  
  // OTP expires in 10 minutes
  setTimeout(() => {
    otpStore.delete(email)
  }, 10 * 60 * 1000)
}

export const getOTP = (email: string): OTPData | undefined => {
  return otpStore.get(email)
}

export const deleteOTP = (email: string): void => {
  otpStore.delete(email)
}

export const incrementAttempts = (email: string): void => {
  const otpData = otpStore.get(email)
  if (otpData) {
    otpData.attempts += 1
    otpStore.set(email, otpData)
  }
}

export const isOTPExpired = (otpData: OTPData): boolean => {
  const now = Date.now()
  const otpAge = now - otpData.timestamp
  const maxAge = 10 * 60 * 1000 // 10 minutes in milliseconds
  return otpAge > maxAge
}

export const hasExceededAttempts = (otpData: OTPData): boolean => {
  return otpData.attempts >= 3
}
