import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  console.log('🚀 API route: test-email triggered')
  
  try {
    const { email, displayName } = await request.json()
    
    console.log('📧 Test email request:', { email, displayName })
    
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
      console.log('📤 Attempting to send test email...')
      console.log('📮 Email details:', {
        from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
        to: email,
        subject: 'Test Email from ShopHub! 🧪'
      })
      
      const emailResult = await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
        to: email,
        subject: 'Test Email from ShopHub! 🧪',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #2563eb; text-align: center;">Test Email from ShopHub!</h1>
            <p>Hi ${displayName || 'there'},</p>
            <p>This is a <strong>TEST EMAIL</strong> to verify that email sending is working correctly!</p>
            <p>If you received this email, it means:</p>
            <ul>
              <li>✅ Your Resend API key is configured correctly</li>
              <li>✅ Email sending is working</li>
              <li>✅ Welcome emails will be sent to new users</li>
            </ul>
            <p>You can now register new users and they will receive welcome emails!</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.FRONTEND_URL || 'https://yourdomain.com'}" 
                 style="background-color: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                Visit ShopHub
              </a>
            </div>
            <p>Best regards,<br>The ShopHub Team</p>
          </div>
        `
      })
      
      console.log('✅ Test email sent successfully!')
      console.log('📧 Email result:', JSON.stringify(emailResult, null, 2))
      console.log(`🎯 Email sent to: ${email}`)
      
      return NextResponse.json({ 
        success: true, 
        message: 'Test email sent successfully',
        emailResult 
      })
      
    } catch (emailError) {
      console.error('❌ Error sending test email with Resend:')
      console.error('Error details:', emailError)
      if (emailError instanceof Error) {
        console.error('Error message:', emailError.message)
        console.error('Error stack:', emailError.stack)
      }
      return NextResponse.json(
        { success: false, error: 'Failed to send test email' },
        { status: 500 }
      )
    }
    
  } catch (error) {
    console.error('❌ Error in test-email API route:')
    console.error('Error details:', error)
    if (error instanceof Error) {
      console.error('Error message:', error.message)
      console.error('Error stack:', error.stack)
    }
    return NextResponse.json(
      { success: false, error: 'Failed to send test email' },
      { status: 500 }
    )
  }
}
