"use client"

import { useState, useEffect, useCallback } from "react"
import { doc, setDoc, getDoc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore"
import { db, isFirebaseConfigured } from "@/lib/firebase"
import { useAuth } from "@/contexts/auth-context"

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  // Load user favorites from Firestore
  const loadFavorites = useCallback(async () => {
    if (!user || !isFirebaseConfigured()) {
      setFavorites([])
      setLoading(false)
      return
    }

    try {
      const userRef = doc(db, "users", user.uid)
      const userSnap = await getDoc(userRef)

      if (userSnap.exists()) {
        const userData = userSnap.data()
        setFavorites(userData.favorites || [])
      } else {
        // Create user document if it doesn't exist
        await setDoc(userRef, {
          email: user.email,
          name: user.displayName || "",
          favorites: [],
          createdAt: new Date(),
        })
        setFavorites([])
      }
    } catch (error) {
      console.error("[v0] Error loading favorites:", error)
      setFavorites([])
    } finally {
      setLoading(false)
    }
  }, [user])

  // Load favorites when user changes
  useEffect(() => {
    loadFavorites()
  }, [loadFavorites])

  // Add product to favorites
  const addToFavorites = async (productId: string) => {
    if (!user || !isFirebaseConfigured()) {
      console.log("[v0] User not authenticated or Firebase not configured")
      return
    }

    try {
      const userRef = doc(db, "users", user.uid)
      await updateDoc(userRef, {
        favorites: arrayUnion(productId),
      })
      setFavorites((prev) => [...prev, productId])
    } catch (error) {
      console.error("[v0] Error adding to favorites:", error)
    }
  }

  // Remove product from favorites
  const removeFromFavorites = async (productId: string) => {
    if (!user || !isFirebaseConfigured()) {
      console.log("[v0] User not authenticated or Firebase not configured")
      return
    }

    try {
      const userRef = doc(db, "users", user.uid)
      await updateDoc(userRef, {
        favorites: arrayRemove(productId),
      })
      setFavorites((prev) => prev.filter((id) => id !== productId))
    } catch (error) {
      console.error("[v0] Error removing from favorites:", error)
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

  return {
    favorites,
    loading,
    addToFavorites,
    removeFromFavorites,
    toggleFavorite,
    isFavorite,
    totalFavorites: favorites.length,
  }
}
