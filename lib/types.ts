import type React from "react"
/**
 * Core type definitions for the e-commerce application
 * Provides type safety and documentation for all data structures
 */

/**
 * Product entity representing items in the store
 */
export interface Product {
  id: string
  name: string
  description: string
  price: number
  image: string
  category: string
  inStock: boolean
  slug: string
  seoTitle?: string
  seoDescription?: string
  tags?: string[]
}

/**
 * Shopping cart item with product reference and quantity
 */
export interface CartItem {
  product: Product
  quantity: number
}

/**
 * User entity with authentication and preference data
 */
export interface User {
  id: string
  email: string
  name?: string
  favorites: string[]
}

/**
 * Authentication state for user session management
 */
export interface AuthState {
  user: User | null
  loading: boolean
  error: string | null
}

/**
 * Product search and filtering parameters
 */
export interface ProductFilters {
  category?: string
  minPrice?: number
  maxPrice?: number
  inStock?: boolean
  searchQuery?: string
  sortBy?: "name" | "price" | "category"
  sortOrder?: "asc" | "desc"
}

/**
 * API response wrapper for consistent error handling
 */
export interface ApiResponse<T> {
  data: T | null
  error: string | null
  loading: boolean
}

/**
 * Firebase document with metadata
 */
export interface FirebaseDocument {
  id: string
  createdAt: Date
  updatedAt: Date
}

/**
 * Extended product interface for Firestore documents
 */
export interface ProductDocument extends Product, FirebaseDocument {
  viewCount?: number
  featured?: boolean
}

/**
 * User favorites document structure in Firestore
 */
export interface UserFavoritesDocument extends FirebaseDocument {
  userId: string
  productIds: string[]
}

/**
 * Component prop types for better reusability
 */
export interface BaseComponentProps {
  className?: string
  children?: React.ReactNode
}

/**
 * Product card component props
 */
export interface ProductCardProps extends BaseComponentProps {
  product: Product
  showFavorite?: boolean
  onAddToCart?: (product: Product) => void
}

/**
 * Page metadata for SEO optimization
 */
export interface PageMetadata {
  title: string
  description: string
  keywords?: string[]
  canonical?: string
  ogImage?: string
}
