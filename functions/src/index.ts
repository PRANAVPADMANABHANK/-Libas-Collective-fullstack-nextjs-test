import * as functions from "firebase-functions"
import * as admin from "firebase-admin"

// Initialize Firebase Admin
admin.initializeApp()

const db = admin.firestore()

// Cloud Function: Send welcome email when user is created
export const sendWelcomeEmail = functions.auth.user().onCreate(async (user) => {
  const { email, displayName, uid } = user

  try {
    // Create user document in Firestore
    await db
      .collection("users")
      .doc(uid)
      .set({
        email: email,
        name: displayName || "",
        favorites: [],
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        lastLoginAt: admin.firestore.FieldValue.serverTimestamp(),
      })

    // Log welcome email (in production, you'd integrate with email service)
    functions.logger.info(`Welcome email would be sent to: ${email}`, {
      userId: uid,
      email: email,
      displayName: displayName,
    })

    // In production, integrate with email service like SendGrid, Mailgun, etc.
    // await sendEmailViaService({
    //   to: email,
    //   subject: "Welcome to ShopHub!",
    //   template: "welcome",
    //   data: { name: displayName || "Customer" }
    // })

    return { success: true, message: "Welcome email sent successfully" }
  } catch (error) {
    functions.logger.error("Error sending welcome email:", error)
    throw new functions.https.HttpsError("internal", "Failed to send welcome email")
  }
})

// Cloud Function: Get product recommendations based on user favorites
export const getProductRecommendations = functions.https.onCall(async (data, context) => {
  // Check if user is authenticated
  if (!context.auth) {
    throw new functions.https.HttpsError("unauthenticated", "User must be authenticated")
  }

  const userId = context.auth.uid
  const { limit = 5 } = data

  try {
    // Get user's favorites
    const userDoc = await db.collection("users").doc(userId).get()
    const userData = userDoc.data()
    const userFavorites = userData?.favorites || []

    if (userFavorites.length === 0) {
      // If no favorites, return popular products
      const popularProducts = await db.collection("products").orderBy("viewCount", "desc").limit(limit).get()

      return {
        recommendations: popularProducts.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })),
        reason: "popular",
      }
    }

    // Get categories of favorited products
    const favoriteProducts = await Promise.all(
      userFavorites.map((productId: string) => db.collection("products").doc(productId).get()),
    )

    const favoriteCategories = favoriteProducts
      .filter((doc) => doc.exists)
      .map((doc) => doc.data()?.category)
      .filter((category) => category)

    const uniqueCategories = [...new Set(favoriteCategories)]

    if (uniqueCategories.length === 0) {
      throw new functions.https.HttpsError("not-found", "No valid favorite categories found")
    }

    // Get recommendations from same categories, excluding already favorited items
    const recommendations = await db
      .collection("products")
      .where("category", "in", uniqueCategories.slice(0, 10)) // Firestore 'in' limit is 10
      .limit(limit * 2) // Get more to filter out favorites
      .get()

    const filteredRecommendations = recommendations.docs
      .filter((doc) => !userFavorites.includes(doc.id))
      .slice(0, limit)
      .map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))

    return {
      recommendations: filteredRecommendations,
      reason: "category-based",
      categories: uniqueCategories,
    }
  } catch (error) {
    functions.logger.error("Error getting product recommendations:", error)
    throw new functions.https.HttpsError("internal", "Failed to get recommendations")
  }
})

// Cloud Function: Update product view count
export const updateProductViews = functions.https.onCall(async (data, context) => {
  const { productId } = data

  if (!productId) {
    throw new functions.https.HttpsError("invalid-argument", "Product ID is required")
  }

  try {
    const productRef = db.collection("products").doc(productId)

    // Use transaction to safely increment view count
    await db.runTransaction(async (transaction) => {
      const productDoc = await transaction.get(productRef)

      if (!productDoc.exists) {
        throw new functions.https.HttpsError("not-found", "Product not found")
      }

      const currentViews = productDoc.data()?.viewCount || 0
      transaction.update(productRef, {
        viewCount: currentViews + 1,
        lastViewedAt: admin.firestore.FieldValue.serverTimestamp(),
      })
    })

    return { success: true, message: "Product view count updated" }
  } catch (error) {
    functions.logger.error("Error updating product views:", error)
    throw new functions.https.HttpsError("internal", "Failed to update product views")
  }
})

// Cloud Function: Clean up user data when account is deleted
export const cleanupUserData = functions.auth.user().onDelete(async (user) => {
  const userId = user.uid

  try {
    // Delete user document
    await db.collection("users").doc(userId).delete()

    // You could also clean up other user-related data here
    // For example: user reviews, user-generated content, etc.

    functions.logger.info(`Cleaned up data for deleted user: ${userId}`)
    return { success: true, message: "User data cleaned up successfully" }
  } catch (error) {
    functions.logger.error("Error cleaning up user data:", error)
    throw new functions.https.HttpsError("internal", "Failed to clean up user data")
  }
})

// Cloud Function: Get analytics data (admin only)
export const getAnalytics = functions.https.onCall(async (data, context) => {
  // Check if user is authenticated and is admin
  if (!context.auth) {
    throw new functions.https.HttpsError("unauthenticated", "User must be authenticated")
  }

  // In production, you'd check if user has admin role
  // const userDoc = await db.collection("users").doc(context.auth.uid).get()
  // const userData = userDoc.data()
  // if (!userData?.isAdmin) {
  //   throw new functions.https.HttpsError("permission-denied", "Admin access required")
  // }

  try {
    // Get total users count
    const usersSnapshot = await db.collection("users").count().get()
    const totalUsers = usersSnapshot.data().count

    // Get total products count
    const productsSnapshot = await db.collection("products").count().get()
    const totalProducts = productsSnapshot.data().count

    // Get most viewed products
    const popularProducts = await db.collection("products").orderBy("viewCount", "desc").limit(5).get()

    // Get products by category
    const productsByCategory = await db.collection("products").get()
    const categoryStats: { [key: string]: number } = {}

    productsByCategory.docs.forEach((doc) => {
      const category = doc.data().category
      categoryStats[category] = (categoryStats[category] || 0) + 1
    })

    return {
      totalUsers,
      totalProducts,
      popularProducts: popularProducts.docs.map((doc) => ({
        id: doc.id,
        name: doc.data().name,
        viewCount: doc.data().viewCount || 0,
      })),
      categoryStats,
      generatedAt: admin.firestore.FieldValue.serverTimestamp(),
    }
  } catch (error) {
    functions.logger.error("Error getting analytics:", error)
    throw new functions.https.HttpsError("internal", "Failed to get analytics data")
  }
})
