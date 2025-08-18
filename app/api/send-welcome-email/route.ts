import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  console.log('🚀 API route: send-welcome-email triggered')
  
  try {
    const { email, displayName, uid } = await request.json()
    
    console.log('📧 Welcome email request:', { email, displayName, uid })
    
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

    console.log('📧 Initializing Resend client...')
    
    try {
      console.log('📤 Attempting to send welcome email...')
      console.log('📮 Email details:', {
        from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
        to: email,
        subject: 'Welcome to Libas Collective! 🎉'
      })
      
      const emailResult = await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
        to: email,
        subject: 'Welcome to Libas Collective! 🎉',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #2563eb; text-align: center;">Welcome to Libas Collective!</h1>
            <p>Hi ${displayName || 'there'},</p>
            <p>Thank you for creating an account with Libas Collective! We're excited to have you on board.</p>
            <p>Here's what you can do with your new account:</p>
            <ul>
              <li>Browse our extensive product catalog</li>
              <li>Add items to your favorites</li>
              <li>Shop with our secure cart system</li>
              <li>Track your orders</li>
            </ul>
            <p>Start shopping now by visiting our website!</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.FRONTEND_URL || 'https://yourdomain.com'}" 
                 style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                Start Shopping
              </a>
            </div>
            <p>If you have any questions, feel free to reach out to our support team.</p>
            <p>Best regards,<br>The Libas Collective Team</p>
          </div>
        `
      })
      
      console.log('✅ Welcome email sent successfully!')
      console.log('📧 Email result:', JSON.stringify(emailResult, null, 2))
      console.log(`🎯 Email sent to: ${email}`)
      
      return NextResponse.json({ 
        success: true, 
        message: 'Welcome email sent successfully',
        emailResult 
      })
      
    } catch (emailError) {
      console.error('❌ Error sending email with Resend:')
      console.error('Error details:', emailError)
      if (emailError instanceof Error) {
        console.error('Error message:', emailError.message)
        console.error('Error stack:', emailError.stack)
      }
      return NextResponse.json(
        { success: false, error: 'Failed to send email' },
        { status: 500 }
      )
    }
    
  } catch (error) {
    console.error('❌ Error in send-welcome-email API route:')
    console.error('Error details:', error)
    if (error instanceof Error) {
      console.error('Error message:', error.message)
      console.error('Error stack:', error.stack)
    }
    return NextResponse.json(
      { success: false, error: 'Failed to send welcome email' },
      { status: 500 }
    )
  }
}
