/**
 * Application-wide constants for maintainable configuration
 */

// Product display configuration
export const FEATURED_PRODUCTS_COUNT = 6
export const PRODUCTS_PER_PAGE = 12
export const RELATED_PRODUCTS_COUNT = 4

// Cache and revalidation settings
export const REVALIDATE_INTERVAL = 3600 // 1 hour in seconds
export const CACHE_TTL = 300 // 5 minutes in seconds

// Application metadata
export const APP_CONFIG = {
  name: "ShopHub",
  description: "Premium E-commerce Store",
  url: "https://shophub.com",
  email: "support@shophub.com",
  phone: "+1-555-0123",
} as const

// Product categories
export const PRODUCT_CATEGORIES = [
  "Electronics",
  "Fashion",
  "Home & Garden",
  "Sports & Outdoors",
  "Books & Media",
  "Health & Beauty",
] as const

// Firebase collection names
export const FIREBASE_COLLECTIONS = {
  PRODUCTS: "products",
  USERS: "users",
  FAVORITES: "favorites",
  ORDERS: "orders",
} as const

// Authentication routes
export const AUTH_ROUTES = {
  LOGIN: "/login",
  REGISTER: "/register",
  PROFILE: "/profile",
  FAVORITES: "/favorites",
} as const
