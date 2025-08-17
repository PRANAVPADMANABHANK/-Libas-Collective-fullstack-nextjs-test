import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  console.log('🚀 API route: send-otp triggered')
  
  try {
    const { email, displayName } = await request.json()
    
    console.log('📧 OTP request:', { email, displayName })
    
    if (!email) {
      console.log('❌ Email is required but not provided')
      return NextResponse.json(
        { success: false, error: 'Email is required' },
        { status: 400 }
      )
    }

    const resendApiKey = process.env.RESEND_API_KEY
    console.log('🔑 Checking Resend API key...', resendApiKey ? '✅ API key found' : '❌ API key missing')
    
    if (!resendApiKey) {
      console.log('❌ Resend API key not configured')
      return NextResponse.json(
        { success: false, error: 'Resend API key not configured' },
        { status: 500 }
      )
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    
    // Store OTP in memory (in production, use Redis or database)
    // For now, we'll use a simple Map (this will reset on server restart)
    if (!global.otpStore) {
      global.otpStore = new Map()
    }
    
    // Store OTP with email and timestamp
    global.otpStore.set(email, {
      otp,
      timestamp: Date.now(),
      attempts: 0
    })
    
    // OTP expires in 10 minutes
    setTimeout(() => {
      if (global.otpStore) {
        global.otpStore.delete(email)
      }
    }, 10 * 60 * 1000)

    console.log('📧 Initializing Resend client...')
    
    try {
      console.log('📤 Attempting to send OTP email...')
      console.log('📮 Email details:', {
        from: process.env.RESEND_FROM_EMAIL || 'noreply@arinfrastructures.com',
        to: email,
        subject: 'Verify Your Email - ShopHub'
      })
      
      const emailResult = await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL || 'noreply@arinfrastructures.com',
        to: email,
        subject: 'Verify Your Email - ShopHub',
        html: `
          <!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Verify Your Email - ShopHub</title>
          </head>
          <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f8fafc;">
            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f8fafc;">
              <tr>
                <td align="center" style="padding: 40px 20px;">
                  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="max-width: 600px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                    <tr>
                      <td style="padding: 40px 30px; text-align: center; background-color: #2563eb; border-radius: 8px 8px 0 0;">
                        <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 600;">Verify Your Email</h1>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 40px 30px;">
                        <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">Hi ${displayName || 'there'},</p>
                        
                        <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">Thank you for signing up with ShopHub! To complete your registration, please verify your email address using the verification code below:</p>
                        
                        <div style="text-align: center; margin: 30px 0; padding: 20px; background-color: #f3f4f6; border-radius: 8px;">
                          <p style="color: #6b7280; font-size: 14px; margin: 0 0 10px 0;">Your verification code is:</p>
                          <div style="font-size: 32px; font-weight: bold; color: #2563eb; letter-spacing: 8px; font-family: monospace;">
                            ${otp}
                          </div>
                        </div>
                        
                        <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">This code will expire in 10 minutes for security reasons.</p>
                        
                        <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">If you didn't create this account, please ignore this email.</p>
                        
                        <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">Best regards,<br>The ShopHub Team</p>
                        
                        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
                        
                        <p style="color: #6b7280; font-size: 14px; line-height: 1.5; margin: 0; text-align: center;">
                          This email was sent to ${email} to verify your ShopHub account.<br>
                          Please do not share this verification code with anyone.
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </body>
          </html>
        `,
        text: `Verify Your Email - ShopHub

Hi ${displayName || 'there'},

Thank you for signing up with ShopHub! To complete your registration, please verify your email address using the verification code below:

Your verification code is: ${otp}

This code will expire in 10 minutes for security reasons.

If you didn't create this account, please ignore this email.

Best regards,
The ShopHub Team

---
This email was sent to ${email} to verify your ShopHub account.
Please do not share this verification code with anyone.`
      })
      
      console.log('✅ OTP email sent successfully!')
      console.log('📧 Email result:', JSON.stringify(emailResult, null, 2))
      console.log(`🎯 OTP sent to: ${email}`)
      
      return NextResponse.json({ 
        success: true, 
        message: 'OTP sent successfully',
        emailResult 
      })
      
    } catch (emailError) {
      console.error('❌ Error sending OTP email with Resend:')
      console.error('Error details:', emailError)
      if (emailError instanceof Error) {
        console.error('Error message:', emailError.message)
        console.error('Error stack:', emailError.stack)
      }
      return NextResponse.json(
        { success: false, error: 'Failed to send OTP email' },
        { status: 500 }
      )
    }
    
  } catch (error) {
    console.error('❌ Error in send-otp API route:')
    console.error('Error details:', error)
    if (error instanceof Error) {
      console.error('Error message:', error.message)
      console.error('Error stack:', error.stack)
    }
    return NextResponse.json(
      { success: false, error: 'Failed to send OTP' },
      { status: 500 }
    )
  }
}
