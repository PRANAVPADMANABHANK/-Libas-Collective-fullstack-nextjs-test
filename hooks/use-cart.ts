"use client"

import { useState, useEffect } from "react"
import type { CartItem, Product } from "@/lib/types"

export function useCart() {
  const [items, setItems] = useState<CartItem[]>([])

  useEffect(() => {
    if (typeof window === "undefined" || !window.localStorage) return

    try {
      const savedCart = localStorage.getItem("cart")
      if (savedCart) {
        setItems(JSON.parse(savedCart))
      }
    } catch (error) {
      console.log("Error loading cart from localStorage:", error)
    }
  }, [])

  useEffect(() => {
    if (typeof window === "undefined" || !window.localStorage) return

    try {
      localStorage.setItem("cart", JSON.stringify(items))
    } catch (error) {
      console.log("Error saving cart to localStorage:", error)
    }
  }, [items])

  const addItem = (product: Product, quantity = 1) => {
    setItems((prev) => {
      const existingItem = prev.find((item) => item.product.id === product.id)
      if (existingItem) {
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + quantity } : item,
        )
      }
      return [...prev, { product, quantity }]
    })
  }

  const removeItem = (productId: string) => {
    setItems((prev) => prev.filter((item) => item.product.id !== productId))
  }

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId)
      return
    }
    setItems((prev) => prev.map((item) => (item.product.id === productId ? { ...item, quantity } : item)))
  }

  const clearCart = () => {
    setItems([])
  }

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)

  return {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    totalItems,
    totalPrice,
  }
}
