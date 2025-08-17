import { NextRequest, NextResponse } from 'next/server'
import { otpStore } from '@/lib/otp-store'

export async function GET(request: NextRequest) {
  console.log('🔍 Debug OTP store requested')
  
  try {
    // Convert Map to object for easier viewing
    const storeData: Record<string, any> = {}
    otpStore.forEach((value, key) => {
      storeData[key] = {
        ...value,
        timestamp: new Date(value.timestamp).toISOString(),
        age: Date.now() - value.timestamp
      }
    })
    
    console.log('📊 Current OTP store contents:', storeData)
    
    return NextResponse.json({
      success: true,
      message: 'OTP store debug info',
      storeSize: otpStore.size,
      storeData,
      currentTime: new Date().toISOString()
    })
    
  } catch (error) {
    console.error('❌ Error in debug-otp API route:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to get debug info' },
      { status: 500 }
    )
  }
}
