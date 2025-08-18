import { onRequest } from "firebase-functions/v2/https"
import { onDocumentCreated, onDocumentDeleted, onDocumentUpdated } from "firebase-functions/v2/firestore"
import { beforeUserCreated } from "firebase-functions/v2/identity"
import * as admin from "firebase-admin"
import { Resend } from "resend"

// Initialize Firebase Admin
admin.initializeApp()

const db = admin.firestore()

// Send welcome email when user signs up (using beforeUserCreated)
export const sendWelcomeEmail = beforeUserCreated(async (event: any) => {
  console.log('🚀 sendWelcomeEmail function triggered')
  console.log('Event data:', JSON.stringify(event.data, null, 2))
  
  const user = event.data
  if (!user) {
    console.log('❌ No user data found in event, exiting function')
    return
  }

  console.log(`👤 New user registration detected:`, {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    emailVerified: user.emailVerified,
    createdAt: user.metadata?.creationTime
  })

  try {
    console.log('📝 Storing user metadata in Firestore...')
    // Store user metadata first
    await db.collection('users').doc(user.uid).set({
      email: user.email,
      displayName: user.displayName,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      lastLogin: admin.firestore.FieldValue.serverTimestamp(),
      welcomeEmailSent: false
    })
    console.log('✅ User metadata stored successfully in Firestore')

    // Send welcome email using Resend
    const resendApiKey = process.env.RESEND_API_KEY
    console.log('🔑 Checking Resend API key...', resendApiKey ? '✅ API key found' : '❌ API key missing')
    
    if (resendApiKey) {
      console.log('📧 Initializing Resend client...')
      const resend = new Resend(resendApiKey)
      
      try {
        console.log('📤 Attempting to send welcome email...')
        console.log('📮 Email details:', {
          from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
          to: user.email!,
          subject: 'Welcome to Libas Collective! 🎉'
        })
        
        const emailResult = await resend.emails.send({
          from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
          to: user.email!,
          subject: 'Welcome to Libas Collective! 🎉',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h1 style="color: #2563eb; text-align: center;">Welcome to Libas Collective!</h1>
              <p>Hi ${user.displayName || 'there'},</p>
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
        console.log(`🎯 Email sent to: ${user.email}`)
        
        // Update user document to mark welcome email as sent
        await db.collection('users').doc(user.uid).update({
          welcomeEmailSent: true,
          welcomeEmailSentAt: admin.firestore.FieldValue.serverTimestamp()
        })
        console.log('✅ User document updated with welcome email status')
        
      } catch (emailError) {
        console.error('❌ Error sending email with Resend:')
        console.error('Error details:', emailError)
        if (emailError instanceof Error) {
          console.error('Error message:', emailError.message)
          console.error('Error stack:', emailError.stack)
        }
      }
    } else {
      console.log('⚠️ Resend API key not configured, skipping email send')
      console.log('💡 To enable email sending, set RESEND_API_KEY environment variable')
    }
    
    console.log('🎉 sendWelcomeEmail function completed successfully')
  } catch (error) {
    console.error('❌ Error in sendWelcomeEmail function:')
    console.error('Error details:', error)
    if (error instanceof Error) {
      console.error('Error message:', error.message)
      console.error('Error stack:', error.stack)
    }
    // Don't throw error to prevent user creation from failing
  }
})

// Backup trigger: Send welcome email when user document is created in Firestore
export const sendWelcomeEmailOnUserCreated = onDocumentCreated('users/{userId}', async (event) => {
  console.log('🚀 sendWelcomeEmailOnUserCreated Firestore trigger activated')
  
  const userId = event.params.userId
  const userData = event.data?.data()
  
  if (!userData) {
    console.log('❌ No user data found in Firestore document')
    return
  }
  
  console.log(`👤 Firestore user document created for:`, {
    uid: userId,
    email: userData.email,
    displayName: userData.displayName,
    welcomeEmailSent: userData.welcomeEmailSent
  })
  
  // Only send email if it hasn't been sent yet
  if (userData.welcomeEmailSent) {
    console.log('✅ Welcome email already sent, skipping...')
    return
  }
  
  try {
    // Send welcome email using Resend
    const resendApiKey = process.env.RESEND_API_KEY
    console.log('🔑 Checking Resend API key...', resendApiKey ? '✅ API key found' : '❌ API key missing')
    
    if (resendApiKey) {
      console.log('📧 Initializing Resend client...')
      const resend = new Resend(resendApiKey)
      
      try {
        console.log('📤 Attempting to send welcome email via Firestore trigger...')
        console.log('📮 Email details:', {
          from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
          to: userData.email,
          subject: 'Welcome to Libas Collective! 🎉'
        })
        
        const emailResult = await resend.emails.send({
          from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
          to: userData.email,
          subject: 'Welcome to Libas Collective! 🎉',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h1 style="color: #2563eb; text-align: center;">Welcome to Libas Collective!</h1>
              <p>Hi ${userData.displayName || 'there'},</p>
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
        
        console.log('✅ Welcome email sent successfully via Firestore trigger!')
        console.log('📧 Email result:', JSON.stringify(emailResult, null, 2))
        console.log(`🎯 Email sent to: ${userData.email}`)
        
        // Update user document to mark welcome email as sent
        await event.data?.ref.update({
          welcomeEmailSent: true,
          welcomeEmailSentAt: admin.firestore.FieldValue.serverTimestamp()
        })
        console.log('✅ User document updated with welcome email status via Firestore trigger')
        
      } catch (emailError) {
        console.error('❌ Error sending email with Resend via Firestore trigger:')
        console.error('Error details:', emailError)
        if (emailError instanceof Error) {
          console.error('Error message:', emailError.message)
          console.error('Error stack:', emailError.stack)
        }
      }
    } else {
      console.log('⚠️ Resend API key not configured, skipping email send via Firestore trigger')
    }
    
    console.log('🎉 sendWelcomeEmailOnUserCreated function completed successfully')
  } catch (error) {
    console.error('❌ Error in sendWelcomeEmailOnUserCreated function:')
    console.error('Error details:', error)
    if (error instanceof Error) {
      console.error('Error message:', error.message)
      console.error('Error stack:', error.stack)
    }
  }
})

// Get product recommendations based on user preferences
export const getProductRecommendations = onRequest(async (req, res) => {
  try {
    const { userId, category, limit = 5 } = req.body

    let query = db.collection('products').where('inStock', '==', true)
    
    if (category) {
      query = query.where('category', '==', category)
    }

    const snapshot = await query.limit(limit).get()
    const products = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))

    res.json({ success: true, products })
  } catch (error) {
    console.error('Error getting recommendations:', error)
    res.status(500).json({ success: false, error: 'Failed to get recommendations' })
  }
})

// Update product view count
export const updateProductViews = onRequest(async (req, res) => {
  try {
    const { productId } = req.body
    
    if (!productId) {
      res.status(400).json({ success: false, error: 'Product ID required' })
      return
    }

    const productRef = db.collection('products').doc(productId)
    await productRef.update({
      viewCount: admin.firestore.FieldValue.increment(1),
      lastViewed: admin.firestore.FieldValue.serverTimestamp()
    })

    res.json({ success: true })
  } catch (error) {
    console.error('Error updating product views:', error)
    res.status(500).json({ success: false, error: 'Failed to update views' })
  }
})

// Cleanup user data when account is deleted (using Firestore trigger instead)
export const cleanupUserData = onDocumentDeleted('users/{userId}', async (event) => {
  const userId = event.params.userId

  try {
    // Remove user favorites
    const favoritesSnapshot = await db.collection('favorites')
      .where('userId', '==', userId)
      .get()
    
    const batch = db.batch()
    favoritesSnapshot.docs.forEach(doc => {
      batch.delete(doc.ref)
    })
    
    await batch.commit()
    console.log(`Cleaned up data for user: ${userId}`)
  } catch (error) {
    console.error('Error cleaning up user data:', error)
  }
})

// Get analytics data
export const getAnalytics = onRequest(async (req, res) => {
  try {
    const { startDate, endDate } = req.query
    
    const productsRef = db.collection('products')
    
    let snapshot
    if (startDate && endDate) {
      snapshot = await productsRef
        .where('createdAt', '>=', new Date(startDate as string))
        .where('createdAt', '<=', new Date(endDate as string))
        .get()
    } else {
      snapshot = await productsRef.get()
    }

    const products = snapshot.docs.map(doc => doc.data())
    
    const analytics = {
      totalProducts: products.length,
      categories: products.reduce((acc: any, product: any) => {
        acc[product.category] = (acc[product.category] || 0) + 1
        return acc
      }, {}),
      averagePrice: products.reduce((sum: number, product: any) => sum + product.price, 0) / products.length,
      inStockCount: products.filter((p: any) => p.inStock).length
    }

    res.json({ success: true, analytics })
  } catch (error) {
    console.error('Error getting analytics:', error)
    res.status(500).json({ success: false, error: 'Failed to get analytics' })
  }
})

// Process order when cart is submitted
export const processOrder = onRequest(async (req, res) => {
  try {
    const { userId, items, total, shippingAddress } = req.body
    
    if (!userId || !items || !total) {
      res.status(400).json({ success: false, error: 'Missing required order data' })
      return
    }

    // Create order document
    const orderRef = await db.collection('orders').add({
      userId,
      items,
      total,
      shippingAddress,
      status: 'pending',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    })

    // Update product inventory
    const batch = db.batch()
    for (const item of items) {
      const productRef = db.collection('products').doc(item.productId)
      const productDoc = await productRef.get()
      const currentStock = productDoc.data()?.stockQuantity || 0
      const newStock = currentStock - item.quantity
      
      batch.update(productRef, {
        stockQuantity: newStock,
        inStock: newStock > 0
      })
    }
    
    await batch.commit()

    res.json({ 
      success: true, 
      orderId: orderRef.id,
      message: 'Order processed successfully' 
    })
  } catch (error) {
    console.error('Error processing order:', error)
    res.status(500).json({ success: false, error: 'Failed to process order' })
  }
})

// Search products with advanced filtering
export const searchProducts = onRequest(async (req, res) => {
  try {
    const { query, category, minPrice, maxPrice, sortBy = 'name', sortOrder = 'asc' } = req.query
    
    let productsRef = db.collection('products').where('inStock', '==', true)
    
    // Apply category filter
    if (category && category !== 'all') {
      productsRef = productsRef.where('category', '==', category)
    }
    
    // Apply price filters
    if (minPrice) {
      productsRef = productsRef.where('price', '>=', parseFloat(minPrice as string))
    }
    if (maxPrice) {
      productsRef = productsRef.where('price', '<=', parseFloat(maxPrice as string))
    }
    
    const snapshot = await productsRef.get()
    let products = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as any[]
    
    // Apply text search if query provided
    if (query) {
      const searchTerm = (query as string).toLowerCase()
      products = products.filter(product => 
        product.name?.toLowerCase().includes(searchTerm) ||
        product.description?.toLowerCase().includes(searchTerm) ||
        product.category?.toLowerCase().includes(searchTerm)
      )
    }
    
    // Apply sorting
    products.sort((a, b) => {
      const aVal = a[sortBy as string]
      const bVal = b[sortBy as string]
      
      if (sortOrder === 'desc') {
        return bVal > aVal ? 1 : -1
      }
      return aVal > bVal ? 1 : -1
    })
    
    res.json({ success: true, products, total: products.length })
  } catch (error) {
    console.error('Error searching products:', error)
    res.status(500).json({ success: false, error: 'Failed to search products' })
  }
})

// Update product popularity score based on views and interactions
export const updateProductPopularity = onDocumentUpdated('products/{productId}', async (event) => {
  try {
    const productId = event.params.productId
    const newData = event.data?.after.data()
    const oldData = event.data?.before.data()
    
    if (!newData || !oldData) return
    
    // Calculate popularity score based on views, favorites, and sales
    const popularityScore = (
      (newData.viewCount || 0) * 0.3 +
      (newData.favoriteCount || 0) * 0.4 +
      (newData.salesCount || 0) * 0.3
    )
    
    // Only update if popularity score changed significantly
    if (Math.abs(popularityScore - (oldData.popularityScore || 0)) > 0.1) {
      await event.data?.after.ref.update({
        popularityScore: Math.round(popularityScore * 100) / 100,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      })
    }
  } catch (error) {
    console.error('Error updating product popularity:', error)
  }
})

// Get trending products based on popularity
export const getTrendingProducts = onRequest(async (req, res) => {
  try {
    const { limit = 10 } = req.query
    
    const snapshot = await db.collection('products')
      .where('inStock', '==', true)
      .orderBy('popularityScore', 'desc')
      .limit(parseInt(limit as string))
      .get()
    
    const products = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
    
    res.json({ success: true, products })
  } catch (error) {
    console.error('Error getting trending products:', error)
    res.status(500).json({ success: false, error: 'Failed to get trending products' })
  }
})

// Manually send welcome email (for testing or resending)
export const sendWelcomeEmailManual = onRequest(async (req, res) => {
  console.log('🚀 sendWelcomeEmailManual function triggered')
  console.log('Request body:', JSON.stringify(req.body, null, 2))
  
  try {
    const { email, displayName } = req.body
    
    if (!email) {
      console.log('❌ Email is required but not provided')
      res.status(400).json({ success: false, error: 'Email is required' })
      return
    }

    console.log(`📧 Manual email request for: ${email} (${displayName || 'No name provided'})`)

    const resendApiKey = process.env.RESEND_API_KEY
    console.log('🔑 Checking Resend API key...', resendApiKey ? '✅ API key found' : '❌ API key missing')
    
    if (!resendApiKey) {
      console.log('❌ Resend API key not configured')
      res.status(500).json({ success: false, error: 'Resend API key not configured' })
      return
    }

    console.log('📧 Initializing Resend client...')
    const resend = new Resend(resendApiKey)
    
    try {
      console.log('📤 Attempting to send manual welcome email...')
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
      
      console.log('✅ Manual welcome email sent successfully!')
      console.log('📧 Email result:', JSON.stringify(emailResult, null, 2))
      console.log(`🎯 Email sent to: ${email}`)
      res.json({ success: true, message: 'Welcome email sent successfully' })
    } catch (emailError) {
      console.error('❌ Error sending manual email with Resend:')
      console.error('Error details:', emailError)
      if (emailError instanceof Error) {
        console.error('Error message:', emailError.message)
        console.error('Error stack:', emailError.stack)
      }
      res.status(500).json({ success: false, error: 'Failed to send email' })
    }
  } catch (error) {
    console.error('❌ Error in sendWelcomeEmailManual function:')
    console.error('Error details:', error)
    if (error instanceof Error) {
      console.error('Error message:', error.message)
      console.error('Error stack:', error.stack)
    }
    res.status(500).json({ success: false, error: 'Failed to send welcome email' })
  }
})

// Test function to manually send welcome email (for testing)
export const testWelcomeEmail = onRequest(async (req, res) => {
  console.log('🚀 testWelcomeEmail function triggered')
  
  try {
    const { email, displayName } = req.body || req.query
    
    if (!email) {
      console.log('❌ Email is required but not provided')
      res.status(400).json({ success: false, error: 'Email is required' })
      return
    }

    console.log(`📧 Test email request for: ${email} (${displayName || 'No name provided'})`)

    const resendApiKey = process.env.RESEND_API_KEY
    console.log('🔑 Checking Resend API key...', resendApiKey ? '✅ API key found' : '❌ API key missing')
    
    if (!resendApiKey) {
      console.log('❌ Resend API key not configured')
      res.status(500).json({ success: false, error: 'Resend API key not configured' })
      return
    }

    console.log('📧 Initializing Resend client...')
    const resend = new Resend(resendApiKey)
    
    try {
      console.log('📤 Attempting to send test welcome email...')
      console.log('📮 Email details:', {
        from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
        to: email,
        subject: 'Test Welcome to Libas Collective! 🎉'
      })
      
      const emailResult = await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
        to: email,
        subject: 'Test Welcome to Libas Collective! 🎉',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #2563eb; text-align: center;">Test Welcome to Libas Collective!</h1>
            <p>Hi ${displayName || 'there'},</p>
            <p>This is a TEST email to verify email sending is working!</p>
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
      
      console.log('✅ Test welcome email sent successfully!')
      console.log('📧 Email result:', JSON.stringify(emailResult, null, 2))
      console.log(`🎯 Email sent to: ${email}`)
      res.json({ success: true, message: 'Test welcome email sent successfully', emailResult })
    } catch (emailError) {
      console.error('❌ Error sending test email with Resend:')
      console.error('Error details:', emailError)
      if (emailError instanceof Error) {
        console.error('Error message:', emailError.message)
        console.error('Error stack:', emailError.stack)
      }
      res.status(500).json({ success: false, error: 'Failed to send test email' })
    }
  } catch (error) {
    console.error('❌ Error in testWelcomeEmail function:')
    console.error('Error details:', error)
    if (error instanceof Error) {
      console.error('Error message:', error.message)
      console.error('Error stack:', error.stack)
    }
    res.status(500).json({ success: false, error: 'Failed to send test welcome email' })
  }
})
