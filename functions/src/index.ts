import { onRequest } from "firebase-functions/v2/https"
import { onDocumentCreated, onDocumentDeleted } from "firebase-functions/v2/firestore"
import { beforeUserCreated } from "firebase-functions/v2/identity"
import * as admin from "firebase-admin"

// Initialize Firebase Admin
admin.initializeApp()

const db = admin.firestore()

// Send welcome email when user signs up
export const sendWelcomeEmail = beforeUserCreated(async (event) => {
  const user = event.data
  if (!user) return

  try {
    // In a real app, you'd integrate with an email service like SendGrid
    console.log(`Welcome email sent to: ${user.email}`)
    
    // Store user metadata
    await db.collection('users').doc(user.uid).set({
      email: user.email,
      displayName: user.displayName,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      lastLogin: admin.firestore.FieldValue.serverTimestamp()
    })
  } catch (error) {
    console.error('Error sending welcome email:', error)
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
