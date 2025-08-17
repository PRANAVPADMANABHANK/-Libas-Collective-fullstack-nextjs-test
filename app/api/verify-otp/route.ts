import { NextRequest, NextResponse } from 'next/server'
import { OTPData, OTPVerificationRequest, OTPResponse } from '@/lib/otp-types'

// In-memory OTP store (in production, use Redis or database)
const otpStore = new Map<string, OTPData>()

export async function POST(request: NextRequest): Promise<NextResponse<OTPResponse>> {
  console.log('🚀 API route: verify-otp triggered')
  
  try {
    const { email, otp }: OTPVerificationRequest = await request.json()
    
    console.log('🔐 OTP verification request:', { email, otp })
    
    if (!email || !otp) {
      console.log('❌ Email and OTP are required')
      return NextResponse.json(
        { success: false, error: 'Email and OTP are required' },
        { status: 400 }
      )
    }

    // Check if OTP exists
    const otpData = otpStore.get(email)
    
    if (!otpData) {
      console.log('❌ No OTP found for email:', email)
      return NextResponse.json(
        { success: false, error: 'OTP expired or not found' },
        { status: 400 }
      )
    }

    // Check if OTP has expired (10 minutes)
    const now = Date.now()
    const otpAge = now - otpData.timestamp
    const maxAge = 10 * 60 * 1000 // 10 minutes in milliseconds

    if (otpAge > maxAge) {
      console.log('❌ OTP expired for email:', email)
      otpStore.delete(email)
      return NextResponse.json(
        { success: false, error: 'OTP has expired. Please request a new one.' },
        { status: 400 }
      )
    }

    // Check if too many attempts
    if (otpData.attempts >= 3) {
      console.log('❌ Too many OTP attempts for email:', email)
      otpStore.delete(email)
      return NextResponse.json(
        { success: false, error: 'Too many failed attempts. Please request a new OTP.' },
        { status: 400 }
      )
    }

    // Verify OTP
    if (otpData.otp !== otp) {
      console.log('❌ Invalid OTP for email:', email)
      
      // Increment attempts
      otpData.attempts += 1
      otpStore.set(email, otpData)
      
      return NextResponse.json(
        { success: false, error: 'Invalid OTP. Please try again.' },
        { status: 400 }
      )
    }

    // OTP is valid - remove it from store
    otpStore.delete(email)
    
    console.log('✅ OTP verified successfully for email:', email)
    
    return NextResponse.json({ 
      success: true, 
      message: 'OTP verified successfully'
    })
    
  } catch (error) {
    console.error('❌ Error in verify-otp API route:')
    console.error('Error details:', error)
    if (error instanceof Error) {
      console.error('Error message:', error.message)
      console.error('Error stack:', error.stack)
    }
    return NextResponse.json(
      { success: false, error: 'Failed to verify OTP' },
      { status: 500 }
    )
  }
}
