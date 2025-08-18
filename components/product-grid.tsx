"use client"

import type React from "react"

import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, Check } from "lucide-react"
import { useCart } from "@/hooks/use-cart"
import type { Product } from "@/lib/types"

interface ProductGridProps {
  products: Product[]
  currentPage: number
  totalPages: number
}

export function ProductGrid({ products, currentPage, totalPages }: ProductGridProps) {
  const { addItem, getItemQuantity, isLoaded } = useCart()
  const router = useRouter()
  const [addingItems, setAddingItems] = useState<Set<string>>(new Set())
  const [addedItems, setAddedItems] = useState<Set<string>>(new Set())
  const [cartQuantities, setCartQuantities] = useState<Record<string, number>>({})

  // Update cart quantities when cart changes
  useEffect(() => {
    const newQuantities: Record<string, number> = {}
    products.forEach(product => {
      newQuantities[product.id] = getItemQuantity(product.id)
    })
    setCartQuantities(newQuantities)
  }, [products, getItemQuantity])

  const handleAddToCart = async (product: Product, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (!product.inStock || addingItems.has(product.id) || !isLoaded) return

    setAddingItems(prev => new Set(prev).add(product.id))
    
    try {
      const success = addItem(product)
      if (success) {
        setAddedItems(prev => new Set(prev).add(product.id))
        
        // Update local cart quantities immediately
        setCartQuantities(prev => ({
          ...prev,
          [product.id]: (prev[product.id] || 0) + 1
        }))
        
        setTimeout(() => {
          setAddedItems(prev => {
            const newSet = new Set(prev)
            newSet.delete(product.id)
            return newSet
          })
        }, 2000)
      }
    } catch (error) {
      console.error("Error adding item to cart:", error)
    } finally {
      setAddingItems(prev => {
        const newSet = new Set(prev)
        newSet.delete(product.id)
        return newSet
      })
    }
  }

  const handlePageChange = (page: number) => {
    const url = new URL(window.location.href)
    url.searchParams.set("page", page.toString())
    router.push(url.toString())
  }

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
        {products.map((product) => {
          const isAdding = addingItems.has(product.id)
          const wasAdded = addedItems.has(product.id)
          const currentQuantity = cartQuantities[product.id] || 0
          
          return (
            <Link key={product.id} href={`/products/${product.slug}`}>
              <Card className="group hover:shadow-lg transition-all duration-300 h-full">
                <CardContent className="p-0">
                  <div className="relative aspect-square overflow-hidden rounded-t-lg">
                    <Image
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                    {!product.inStock && (
                      <Badge variant="destructive" className="absolute top-2 right-2">
                        Out of Stock
                      </Badge>
                    )}
                    {currentQuantity > 0 && (
                      <Badge variant="secondary" className="absolute top-2 left-2 bg-green-600 text-white">
                        {currentQuantity} in cart
                      </Badge>
                    )}
                  </div>
                  <div className="p-4">
                    <Badge variant="secondary" className="mb-2 text-xs">
                      {product.category}
                    </Badge>
                    <h3 className="font-semibold text-sm mb-2 line-clamp-2">{product.name}</h3>
                    <p className="text-muted-foreground text-xs mb-3 line-clamp-2">{product.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-primary">${product.price.toFixed(2)}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="p-4 pt-0 flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 bg-transparent"
                    onClick={(e) => handleAddToCart(product, e)}
                    disabled={!product.inStock || isAdding || !isLoaded}
                  >
                    {isAdding ? (
                      <>
                        <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-current mr-1"></div>
                        Adding...
                      </>
                    ) : wasAdded ? (
                      <>
                        <Check className="h-3 w-3 mr-1" />
                        Added!
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="h-3 w-3 mr-1" />
                        Add to Cart
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </Link>
          )
        })}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2">
          <Button variant="outline" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage <= 1}>
            Previous
          </Button>

          <div className="flex gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={page === currentPage ? "default" : "outline"}
                size="sm"
                onClick={() => handlePageChange(page)}
              >
                {page}
              </Button>
            ))}
          </div>

          <Button
            variant="outline"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  )
}
