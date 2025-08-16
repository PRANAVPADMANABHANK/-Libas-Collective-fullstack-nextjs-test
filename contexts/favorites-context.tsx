"use client"

import React, { createContext, useContext, useState, useEffect, useCallback } from "react"
import { doc, setDoc, getDoc, updateDoc, arrayUnion, arrayRemove, onSnapshot } from "firebase/firestore"
import { db, isFirebaseConfigured } from "@/lib/firebase"
import { useAuth } from "./auth-context"

interface FavoritesContextType {
  favorites: string[]
  loading: boolean
  addToFavorites: (productId: string) => Promise<void>
  removeFromFavorites: (productId: string) => Promise<void>
  toggleFavorite: (productId: string) => Promise<void>
  isFavorite: (productId: string) => boolean
  totalFavorites: number
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined)

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  // Load user favorites from Firestore with real-time updates
  const loadFavorites = useCallback(async () => {
    if (!user || !isFirebaseConfigured()) {
      setFavorites([])
      setLoading(false)
      return
    }

    try {
      const userRef = doc(db, "users", user.uid)
      
      // Set up real-time listener for favorites
      const unsubscribe = onSnapshot(userRef, (doc) => {
        if (doc.exists()) {
          const userData = doc.data()
          setFavorites(userData.favorites || [])
        } else {
          // Create user document if it doesn't exist
          setDoc(userRef, {
            email: user.email,
            name: user.displayName || "",
            favorites: [],
            createdAt: new Date(),
          })
          setFavorites([])
        }
        setLoading(false)
      }, (error) => {
        console.error("[ShopHub] Error in favorites listener:", error)
        setLoading(false)
      })

      return unsubscribe
    } catch (error) {
      console.error("[ShopHub] Error loading favorites:", error)
      setFavorites([])
      setLoading(false)
    }
  }, [user])

  // Load favorites when user changes
  useEffect(() => {
    let unsubscribe: (() => void) | undefined
    
    if (user) {
      loadFavorites().then((unsub) => {
        unsubscribe = unsub
      })
    } else {
      setFavorites([])
      setLoading(false)
    }

    return () => {
      if (unsubscribe) {
        unsubscribe()
      }
    }
  }, [user, loadFavorites])

  // Add product to favorites
  const addToFavorites = async (productId: string) => {
    if (!user || !isFirebaseConfigured()) {
      console.log("[ShopHub] User not authenticated or Firebase not configured")
      return
    }

    try {
      const userRef = doc(db, "users", user.uid)
      await updateDoc(userRef, {
        favorites: arrayUnion(productId),
      })
      // State will be updated automatically by the listener
    } catch (error) {
      console.error("[ShopHub] Error adding to favorites:", error)
    }
  }

  // Remove product from favorites
  const removeFromFavorites = async (productId: string) => {
    if (!user || !isFirebaseConfigured()) {
      console.log("[ShopHub] User not authenticated or Firebase not configured")
      return
    }

    try {
      const userRef = doc(db, "users", user.uid)
      await updateDoc(userRef, {
        favorites: arrayRemove(productId),
      })
      // State will be updated automatically by the listener
    } catch (error) {
      console.error("[ShopHub] Error removing from favorites:", error)
    }
  }

  // Toggle favorite status
  const toggleFavorite = async (productId: string) => {
    if (favorites.includes(productId)) {
      await removeFromFavorites(productId)
    } else {
      await addToFavorites(productId)
    }
  }

  // Check if product is favorited
  const isFavorite = (productId: string) => {
    return favorites.includes(productId)
  }

  const value = {
    favorites,
    loading,
    addToFavorites,
    removeFromFavorites,
    toggleFavorite,
    isFavorite,
    totalFavorites: favorites.length,
  }

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>
}

export function useFavorites() {
  const context = useContext(FavoritesContext)
  if (context === undefined) {
    throw new Error("useFavorites must be used within a FavoritesProvider")
  }
  return context
}
