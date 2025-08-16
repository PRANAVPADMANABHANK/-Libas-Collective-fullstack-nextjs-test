"use client"

import { useEffect, useState } from "react"
import { Heart, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useFavorites } from "@/hooks/use-favorites"
import { useAuth } from "@/contexts/auth-context"
import { getProductById } from "@/lib/products"
import type { Product } from "@/lib/types"
import Image from "next/image"
import Link from "next/link"
import { useCart } from "@/hooks/use-cart"

export function FavoritesContent() {
  const { user } = useAuth()
  const { favorites, loading: favoritesLoading, removeFromFavorites } = useFavorites()
  const { addItem } = useCart()
  const [favoriteProducts, setFavoriteProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadFavoriteProducts = async () => {
      if (!favorites.length) {
        setFavoriteProducts([])
        setLoading(false)
        return
      }

      try {
        const products = await Promise.all(favorites.map((id) => getProductById(id)))
        setFavoriteProducts(products.filter((product): product is Product => product !== null))
      } catch (error) {
        console.error("[v0] Error loading favorite products:", error)
        setFavoriteProducts([])
      } finally {
        setLoading(false)
      }
    }

    if (!favoritesLoading) {
      loadFavoriteProducts()
    }
  }, [favorites, favoritesLoading])

  if (!user) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Heart className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Sign in to view favorites</h3>
          <p className="text-muted-foreground text-center mb-4">
            Create an account or sign in to save your favorite products
          </p>
          <Button asChild>
            <Link href="/login">Sign In</Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  if (loading || favoritesLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <div className="aspect-square bg-muted rounded-lg mb-4 animate-pulse" />
              <div className="h-4 bg-muted rounded mb-2 animate-pulse" />
              <div className="h-4 bg-muted rounded w-2/3 animate-pulse" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (favoriteProducts.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Heart className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No favorites yet</h3>
          <p className="text-muted-foreground text-center mb-4">
            Start browsing products and add them to your favorites to see them here
          </p>
          <Button asChild>
            <Link href="/products">Browse Products</Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {favoriteProducts.map((product) => (
        <Card key={product.id} className="group hover:shadow-lg transition-shadow">
          <CardContent className="p-4">
            <div className="relative aspect-square mb-4 overflow-hidden rounded-lg">
              <Image
                src={product.image || "/placeholder.svg"}
                alt={product.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold line-clamp-2">
                <Link href={`/products/${product.slug}`} className="hover:text-primary">
                  {product.name}
                </Link>
              </h3>
              <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>
              <p className="text-lg font-bold text-primary">${product.price.toFixed(2)}</p>
            </div>

            <div className="flex gap-2 mt-4">
              <Button onClick={() => addItem(product, 1)} disabled={!product.inStock} className="flex-1" size="sm">
                <ShoppingBag className="h-4 w-4 mr-2" />
                {product.inStock ? "Add to Cart" : "Out of Stock"}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => removeFromFavorites(product.id)}
                className="text-red-500 hover:text-red-600"
              >
                <Heart className="h-4 w-4 fill-current" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
