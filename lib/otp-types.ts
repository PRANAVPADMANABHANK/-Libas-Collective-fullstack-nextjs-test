// OTP (One-Time Password) related types and interfaces

export interface OTPData {
  otp: string
  timestamp: number
  attempts: number
}

export interface OTPRequest {
  email: string
  displayName?: string
}

export interface OTPVerificationRequest {
  email: string
  otp: string
}

export interface OTPResponse {
  success: boolean
  message?: string
  error?: string
  emailResult?: any
}
