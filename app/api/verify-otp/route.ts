import { NextRequest, NextResponse } from 'next/server'
import { OTPVerificationRequest, OTPResponse } from '@/lib/otp-types'
import { 
  getOTP, 
  deleteOTP, 
  incrementAttempts, 
  isOTPExpired, 
  hasExceededAttempts 
} from '@/lib/otp-store'

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
    const otpData = getOTP(email)
    
    if (!otpData) {
      console.log('❌ No OTP found for email:', email)
      return NextResponse.json(
        { success: false, error: 'OTP expired or not found' },
        { status: 400 }
      )
    }

    // Check if OTP has expired (10 minutes)
    if (isOTPExpired(otpData)) {
      console.log('❌ OTP expired for email:', email)
      deleteOTP(email)
      return NextResponse.json(
        { success: false, error: 'OTP has expired. Please request a new one.' },
        { status: 400 }
      )
    }

    // Check if too many attempts
    if (hasExceededAttempts(otpData)) {
      console.log('❌ Too many OTP attempts for email:', email)
      deleteOTP(email)
      return NextResponse.json(
        { success: false, error: 'Too many failed attempts. Please request a new OTP.' },
        { status: 400 }
      )
    }

    // Verify OTP
    if (otpData.otp !== otp) {
      console.log('❌ Invalid OTP for email:', email)
      
      // Increment attempts
      incrementAttempts(email)
      
      return NextResponse.json(
        { success: false, error: 'Invalid OTP. Please try again.' },
        { status: 400 }
      )
    }

    // OTP is valid - remove it from store
    deleteOTP(email)
    
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
