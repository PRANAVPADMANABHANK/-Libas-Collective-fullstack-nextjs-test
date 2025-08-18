"use client"

import { useState, useEffect } from "react"
import { useCart } from "./use-cart"

export function useCartCount() {
  const { totalItems, isLoaded } = useCart()
  const [cartCount, setCartCount] = useState(0)

  useEffect(() => {
    if (isLoaded) {
      setCartCount(totalItems)
    }
  }, [totalItems, isLoaded])

  // Listen for cart update events for real-time updates
  useEffect(() => {
    const handleCartUpdate = (event: CustomEvent) => {
      setCartCount(event.detail.totalItems)
    }

    if (typeof window !== "undefined") {
      window.addEventListener('cart-updated', handleCartUpdate as EventListener)
      
      return () => {
        window.removeEventListener('cart-updated', handleCartUpdate as EventListener)
      }
    }
  }, [])

  return {
    cartCount,
    isLoaded
  }
}
