"use client"

import { Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useFavorites } from "@/hooks/use-favorites"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"

interface FavoriteButtonProps {
  productId: string
  variant?: "default" | "outline" | "ghost"
  size?: "default" | "sm" | "lg" | "icon"
  className?: string
}

export function FavoriteButton({ productId, variant = "outline", size = "default", className }: FavoriteButtonProps) {
  const { user } = useAuth()
  const { isFavorite, toggleFavorite } = useFavorites()
  const router = useRouter()

  const handleClick = async () => {
    if (!user) {
      router.push("/login")
      return
    }

    await toggleFavorite(productId)
  }

  const isProductFavorite = isFavorite(productId)

  return (
    <Button variant={variant} size={size} onClick={handleClick} className={className}>
      <Heart className={`h-4 w-4 ${isProductFavorite ? "fill-red-500 text-red-500" : ""}`} />
      {size !== "icon" && (
        <span className="ml-2">{isProductFavorite ? "Remove from Favorites" : "Add to Favorites"}</span>
      )}
    </Button>
  )
}
