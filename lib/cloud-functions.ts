import { httpsCallable } from "firebase/functions"
import { functions, isFirebaseConfigured } from "./firebase"

// Get product recommendations
export const getProductRecommendations = async (limit = 5) => {
  if (!isFirebaseConfigured()) {
    console.log("[ShopHub] Firebase not configured, skipping recommendations")
    return { recommendations: [], reason: "firebase-not-configured" }
  }

  try {
    const getRecommendations = httpsCallable(functions, "getProductRecommendations")
    const result = await getRecommendations({ limit })
    return result.data
  } catch (error) {
    console.error("[ShopHub] Error getting product recommendations:", error)
    return { recommendations: [], reason: "error" }
  }
}

// Update product view count
export const updateProductViews = async (productId: string) => {
  if (!isFirebaseConfigured()) {
    console.log("[ShopHub] Firebase not configured, skipping view count update")
    return
  }

  try {
    const updateViews = httpsCallable(functions, "updateProductViews")
    await updateViews({ productId })
  } catch (error) {
    console.error("[ShopHub] Error updating product views:", error)
  }
}

// Get analytics data (admin only)
export const getAnalytics = async () => {
  if (!isFirebaseConfigured()) {
    console.log("[ShopHub] Firebase not configured, skipping analytics")
    return null
  }

  try {
    const getAnalyticsData = httpsCallable(functions, "getAnalytics")
    const result = await getAnalyticsData()
    return result.data
  } catch (error) {
    console.error("[ShopHub] Error getting analytics:", error)
    return null
  }
}
