"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import type { CartItem, Product } from "@/lib/types"

// Custom event for cart updates
const CART_UPDATE_EVENT = 'cart-updated'

export function useCart() {
  const [items, setItems] = useState<CartItem[]>([])
  const [isLoaded, setIsLoaded] = useState(false)
  const [totalItems, setTotalItems] = useState(0)
  const [totalPrice, setTotalPrice] = useState(0)
  const isInitialized = useRef(false)

  // Calculate totals whenever items change
  useEffect(() => {
    const newTotalItems = items.reduce((sum, item) => sum + item.quantity, 0)
    const newTotalPrice = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
    
    setTotalItems(newTotalItems)
    setTotalPrice(newTotalPrice)
    
    // Dispatch custom event for real-time updates
    if (isInitialized.current && typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent(CART_UPDATE_EVENT, {
        detail: { totalItems: newTotalItems, totalPrice: newTotalPrice, items }
      }))
    }
  }, [items])

  // Load cart from localStorage on mount
  useEffect(() => {
    if (typeof window === "undefined") return

    try {
      const savedCart = localStorage.getItem("cart")
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart)
        // Validate the parsed data structure
        if (Array.isArray(parsedCart)) {
          setItems(parsedCart)
        }
      }
    } catch (error) {
      console.error("Error loading cart from localStorage:", error)
      // Clear corrupted cart data
      localStorage.removeItem("cart")
    } finally {
      setIsLoaded(true)
      isInitialized.current = true
    }
  }, [])

  // Save cart to localStorage whenever items change
  useEffect(() => {
    if (!isLoaded || typeof window === "undefined") return

    try {
      localStorage.setItem("cart", JSON.stringify(items))
    } catch (error) {
      console.error("Error saving cart to localStorage:", error)
    }
  }, [items, isLoaded])

  const addItem = useCallback((product: Product, quantity = 1) => {
    if (!product || !product.id) {
      console.error("Invalid product data:", product)
      return false
    }

    if (quantity <= 0) {
      console.error("Invalid quantity:", quantity)
      return false
    }

    setItems((prev) => {
      const existingItem = prev.find((item) => item.product.id === product.id)
      if (existingItem) {
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + quantity } : item,
        )
      }
      return [...prev, { product, quantity }]
    })
    return true
  }, [])

  const removeItem = useCallback((productId: string) => {
    if (!productId) {
      console.error("Invalid product ID:", productId)
      return false
    }

    setItems((prev) => prev.filter((item) => item.product.id !== productId))
    return true
  }, [])

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (!productId) {
      console.error("Invalid product ID:", productId)
      return false
    }

    if (quantity <= 0) {
      return removeItem(productId)
    }

    setItems((prev) => prev.map((item) => (item.product.id === productId ? { ...item, quantity } : item)))
    return true
  }, [removeItem])

  const clearCart = useCallback(() => {
    setItems([])
    return true
  }, [])

  const getItemQuantity = useCallback((productId: string) => {
    const item = items.find((item) => item.product.id === productId)
    return item ? item.quantity : 0
  }, [items])

  return {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    getItemQuantity,
    totalItems,
    totalPrice,
    isLoaded,
  }
}
