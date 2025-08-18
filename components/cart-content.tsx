"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react"
import { useCart } from "@/hooks/use-cart"

export function CartContent() {
  const { items, updateQuantity, removeItem, clearCart, totalItems, totalPrice, isLoaded } = useCart()
  const [isLoading, setIsLoading] = useState(false)
  const [updatingItems, setUpdatingItems] = useState<Set<string>>(new Set())

  const handleQuantityChange = async (productId: string, newQuantity: number) => {
    if (updatingItems.has(productId)) return
    
    setUpdatingItems(prev => new Set(prev).add(productId))
    
    try {
      const success = updateQuantity(productId, newQuantity)
      if (!success) {
        console.error("Failed to update quantity for product:", productId)
      }
    } catch (error) {
      console.error("Error updating quantity:", error)
    } finally {
      setUpdatingItems(prev => {
        const newSet = new Set(prev)
        newSet.delete(productId)
        return newSet
      })
    }
  }

  const handleRemoveItem = async (productId: string) => {
    if (updatingItems.has(productId)) return
    
    setUpdatingItems(prev => new Set(prev).add(productId))
    
    try {
      const success = removeItem(productId)
      if (!success) {
        console.error("Failed to remove item:", productId)
      }
    } catch (error) {
      console.error("Error removing item:", error)
    } finally {
      setUpdatingItems(prev => {
        const newSet = new Set(prev)
        newSet.delete(productId)
        return newSet
      })
    }
  }

  const handleClearCart = async () => {
    if (isLoading) return
    
    setIsLoading(true)
    try {
      const success = clearCart()
      if (!success) {
        console.error("Failed to clear cart")
      }
    } catch (error) {
      console.error("Error clearing cart:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCheckout = () => {
    setIsLoading(true)
    // Simulate checkout process
    setTimeout(() => {
      alert("Checkout functionality would be implemented here!")
      setIsLoading(false)
    }, 1000)
  }

  // Show loading state while cart is being loaded
  if (!isLoaded) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
        <h2 className="text-2xl font-semibold mb-2">Loading cart...</h2>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
        <h2 className="text-2xl font-semibold mb-2">Your cart is empty</h2>
        <p className="text-muted-foreground mb-6">Add some products to get started!</p>
        <Button asChild size="lg">
          <Link href="/products">Continue Shopping</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Cart Items */}
      <div className="lg:col-span-2 space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Cart Items ({totalItems})</h2>
          <Button 
            variant="outline" 
            onClick={handleClearCart} 
            size="sm"
            disabled={isLoading}
          >
            {isLoading ? "Clearing..." : "Clear Cart"}
          </Button>
        </div>

        {items.map((item) => {
          const isUpdating = updatingItems.has(item.product.id)
          
          return (
            <Card key={item.product.id}>
              <CardContent className="p-4">
                <div className="flex gap-4">
                  <div className="relative w-20 h-20 flex-shrink-0">
                    <Image
                      src={item.product.image || "/placeholder.svg"}
                      alt={item.product.name}
                      fill
                      className="object-cover rounded"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <Link href={`/products/${item.product.slug}`} className="hover:text-primary">
                          <h3 className="font-semibold line-clamp-1">{item.product.name}</h3>
                        </Link>
                        <Badge variant="secondary" className="mt-1">
                          {item.product.category}
                        </Badge>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveItem(item.product.id)}
                        className="text-destructive hover:text-destructive"
                        disabled={isUpdating}
                      >
                        {isUpdating ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </Button>
                    </div>

                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{item.product.description}</p>

                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleQuantityChange(item.product.id, item.quantity - 1)}
                          disabled={item.quantity <= 1 || isUpdating}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center">
                          {isUpdating ? (
                            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-current mx-auto"></div>
                          ) : (
                            item.quantity
                          )}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleQuantityChange(item.product.id, item.quantity + 1)}
                          disabled={isUpdating}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">${(item.product.price * item.quantity).toFixed(2)}</p>
                        <p className="text-sm text-muted-foreground">${item.product.price.toFixed(2)} each</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Order Summary */}
      <div className="lg:col-span-1">
        <Card className="sticky top-4">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

            <div className="space-y-3 mb-4">
              <div className="flex justify-between">
                <span>Subtotal ({totalItems} items)</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="text-green-600">Free</span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span>${(totalPrice * 0.08).toFixed(2)}</span>
              </div>
              <Separator />
              <div className="flex justify-between text-lg font-semibold">
                <span>Total</span>
                <span>${(totalPrice * 1.08).toFixed(2)}</span>
              </div>
            </div>

            <Button className="w-full" size="lg" onClick={handleCheckout} disabled={isLoading}>
              {isLoading ? "Processing..." : "Proceed to Checkout"}
            </Button>

            <div className="mt-4 text-center">
              <Button variant="outline" asChild className="w-full bg-transparent">
                <Link href="/products">Continue Shopping</Link>
              </Button>
            </div>

            <div className="mt-4 text-xs text-muted-foreground text-center">
              <p>• Free shipping on orders over $50</p>
              <p>• 30-day return policy</p>
              <p>• Secure checkout</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
