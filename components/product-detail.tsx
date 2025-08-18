"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ShoppingCart, Share2, Star, Check } from "lucide-react"
import { useCart } from "@/hooks/use-cart"
import { FavoriteButton } from "@/components/favorite-button"
import type { Product } from "@/lib/types"

interface ProductDetailProps {
  product: Product
}

export function ProductDetail({ product }: ProductDetailProps) {
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(product.image || "/placeholder.svg")
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const [showAddedFeedback, setShowAddedFeedback] = useState(false)
  const { addItem, getItemQuantity, isLoaded } = useCart()

  const currentQuantity = getItemQuantity(product.id)

  // Update current quantity when cart changes
  useEffect(() => {
    const newQuantity = getItemQuantity(product.id)
    // Force re-render to show updated quantity
  }, [getItemQuantity, product.id])

  const handleAddToCart = async () => {
    if (!product.inStock || isAddingToCart) return

    setIsAddingToCart(true)
    
    try {
      const success = addItem(product, quantity)
      if (success) {
        setShowAddedFeedback(true)
        // Show feedback for 2 seconds
        setTimeout(() => setShowAddedFeedback(false), 2000)
        
        // Add a small delay to show the loading state
        await new Promise(resolve => setTimeout(resolve, 300))
      }
    } catch (error) {
      console.error("Error adding item to cart:", error)
    } finally {
      setIsAddingToCart(false)
    }
  }

  const handleShare = async () => {
    if (typeof window === "undefined") return

    if (navigator?.share) {
      try {
        await navigator.share({
          title: product.name,
          text: product.description,
          url: window.location.href,
        })
      } catch (error) {
        console.log("Error sharing:", error)
      }
    } else if (navigator?.clipboard) {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(window.location.href)
        // You could add a toast notification here
      } catch (error) {
        console.log("Error copying to clipboard:", error)
      }
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="relative aspect-square overflow-hidden rounded-lg border">
            <Image
              src={selectedImage || "/placeholder.svg"}
              alt={product.name}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            {!product.inStock && (
              <Badge variant="destructive" className="absolute top-4 right-4">
                Out of Stock
              </Badge>
            )}
          </div>

          {/* Thumbnail images would go here if we had multiple images */}
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedImage(product.image || "/placeholder.svg")}
              className="relative aspect-square w-20 overflow-hidden rounded border-2 border-primary"
            >
              <Image
                src={product.image || "/placeholder.svg"}
                alt={product.name}
                fill
                className="object-cover"
                loading="lazy"
              />
            </button>
          </div>
        </div>

        {/* Product Information */}
        <div className="space-y-6">
          <div>
            <Badge variant="secondary" className="mb-2">
              {product.category}
            </Badge>
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">(4.8 out of 5)</span>
            </div>
            <p className="text-4xl font-bold text-primary mb-4">${product.price.toFixed(2)}</p>
          </div>

          <Separator />

          <div>
            <h3 className="font-semibold mb-2">Description</h3>
            <p className="text-muted-foreground leading-relaxed">{product.description}</p>
          </div>

          {product.tags && product.tags.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag) => (
                  <Badge key={tag} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <Separator />

          {/* Add to Cart Section */}
          <div className="space-y-4">
            {currentQuantity > 0 && (
              <div className="bg-green-50 border border-green-200 p-3 rounded-lg">
                <p className="text-sm text-green-800 font-medium">
                  ✅ You have {currentQuantity} of this item in your cart
                </p>
              </div>
            )}

            <div className="flex items-center gap-4">
              <label htmlFor="quantity" className="font-medium">
                Quantity:
              </label>
              <select
                id="quantity"
                value={quantity}
                onChange={(e) => setQuantity(Number.parseInt(e.target.value))}
                className="border rounded px-3 py-1"
                disabled={!product.inStock}
              >
                {[...Array(10)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-3">
              <Button 
                onClick={handleAddToCart} 
                disabled={!product.inStock || isAddingToCart || !isLoaded} 
                className="flex-1" 
                size="lg"
              >
                {isAddingToCart ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Adding...
                  </>
                ) : showAddedFeedback ? (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Added!
                  </>
                ) : (
                  <>
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    {product.inStock ? "Add to Cart" : "Out of Stock"}
                  </>
                )}
              </Button>
              <FavoriteButton productId={product.id} size="lg" />
              <Button variant="outline" size="lg" onClick={handleShare}>
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Product Features */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-3">Product Features</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Free shipping on orders over $50</li>
                <li>• 30-day return policy</li>
                <li>• 1-year warranty included</li>
                <li>• Secure payment processing</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
