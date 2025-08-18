import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

// Store OTP codes temporarily (in production, use Redis or database)
const otpStore = new Map<string, { code: string; expiresAt: number }>()

export async function POST(request: NextRequest) {
  try {
    const { email, name } = await request.json()

    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email is required' },
        { status: 400 }
      )
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    const expiresAt = Date.now() + 10 * 60 * 1000 // 10 minutes

    // Store OTP with expiration
    otpStore.set(email, { code: otp, expiresAt })

    // Send OTP email
    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'noreply@yourdomain.com',
      to: email,
      subject: 'Verify Your Email - Libas Collective',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Welcome to Libas Collective!</h2>
          <p>Hi ${name || 'there'},</p>
          <p>Thank you for registering with us. Please use the verification code below to complete your registration:</p>
          
          <div style="background-color: #f5f5f5; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px;">
            <h1 style="color: #007bff; font-size: 32px; margin: 0; letter-spacing: 4px;">${otp}</h1>
          </div>
          
          <p><strong>This code will expire in 10 minutes.</strong></p>
          
          <p>If you didn't request this verification code, please ignore this email.</p>
          
          <p>Best regards,<br>The Libas Collective Team</p>
        </div>
      `,
    })

    if (error) {
      console.error('Resend error:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to send OTP email' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, message: 'OTP sent successfully' })
  } catch (error) {
    console.error('Send OTP error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// API endpoint to verify OTP
export async function PUT(request: NextRequest) {
  try {
    const { email, otp } = await request.json()

    if (!email || !otp) {
      return NextResponse.json(
        { success: false, error: 'Email and OTP are required' },
        { status: 400 }
      )
    }

    const storedData = otpStore.get(email)
    
    if (!storedData) {
      return NextResponse.json(
        { success: false, error: 'OTP not found or expired' },
        { status: 400 }
      )
    }

    if (Date.now() > storedData.expiresAt) {
      otpStore.delete(email)
      return NextResponse.json(
        { success: false, error: 'OTP has expired' },
        { status: 400 }
      )
    }

    if (storedData.code !== otp) {
      return NextResponse.json(
        { success: false, error: 'Invalid OTP' },
        { status: 400 }
      )
    }

    // Remove OTP after successful verification
    otpStore.delete(email)

    return NextResponse.json({ success: true, message: 'OTP verified successfully' })
  } catch (error) {
    console.error('Verify OTP error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
