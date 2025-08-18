"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/hooks/use-cart"
import { useCartCount } from "@/hooks/use-cart-count"
import { CartCountDisplay } from "@/components/cart-count-display"
import type { Product } from "@/lib/types"

export default function DebugCartPage() {
  const { 
    items, 
    addItem, 
    removeItem, 
    updateQuantity, 
    clearCart, 
    getItemQuantity, 
    totalItems, 
    totalPrice, 
    isLoaded 
  } = useCart()
  
  const { cartCount } = useCartCount()
  const [testResults, setTestResults] = useState<any>(null)

  // Test product for debugging
  const testProduct: Product = {
    id: "debug-test-product",
    name: "Debug Test Product",
    description: "This is a test product for debugging cart functionality",
    price: 19.99,
    image: "/placeholder.svg",
    category: "Debug",
    inStock: true,
    slug: "debug-test-product",
    seoTitle: "Debug Test Product",
    seoDescription: "Test product for debugging cart functionality",
    tags: ["debug", "test", "cart"]
  }

  const runCartTests = async () => {
    const results = {
      isLoaded,
      totalItems,
      totalPrice,
      cartCount,
      itemCount: items.length,
      localStorageAvailable: typeof window !== "undefined" && !!window.localStorage,
      testProductInCart: getItemQuantity(testProduct.id),
      cartCountMatches: totalItems === cartCount
    }
    
    setTestResults(results)
  }

  const testAddItem = () => {
    const success = addItem(testProduct, 1)
    console.log("Add item test result:", success)
    runCartTests()
  }

  const testRemoveItem = () => {
    const success = removeItem(testProduct.id)
    console.log("Remove item test result:", success)
    runCartTests()
  }

  const testUpdateQuantity = () => {
    const success = updateQuantity(testProduct.id, 3)
    console.log("Update quantity test result:", success)
    runCartTests()
  }

  const testClearCart = () => {
    const success = clearCart()
    console.log("Clear cart test result:", success)
    runCartTests()
  }

  useEffect(() => {
    runCartTests()
  }, [isLoaded, items, cartCount])

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Cart Debug Page</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Test Controls */}
        <Card>
          <CardHeader>
            <CardTitle>Test Controls</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Button onClick={testAddItem} variant="outline">
                Add Test Item
              </Button>
              <Button onClick={testRemoveItem} variant="outline">
                Remove Test Item
              </Button>
              <Button onClick={testUpdateQuantity} variant="outline">
                Update Quantity to 3
              </Button>
              <Button onClick={testClearCart} variant="outline">
                Clear Cart
              </Button>
              <Button onClick={runCartTests} variant="outline">
                Refresh Tests
              </Button>
            </div>
            
            <div className="p-4 bg-muted rounded-lg">
              <h3 className="font-semibold mb-2">Test Product:</h3>
              <p className="text-sm text-muted-foreground">
                {testProduct.name} - ${testProduct.price}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Test Results */}
        <Card>
          <CardHeader>
            <CardTitle>Test Results</CardTitle>
          </CardHeader>
          <CardContent>
            {testResults ? (
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Cart Loaded:</span>
                  <Badge variant={testResults.isLoaded ? "default" : "destructive"}>
                    {testResults.isLoaded ? "Yes" : "No"}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span>Total Items (Hook):</span>
                  <span>{testResults.totalItems}</span>
                </div>
                <div className="flex justify-between">
                  <span>Cart Count (Real-time):</span>
                  <span className="font-bold">{testResults.cartCount}</span>
                </div>
                <div className="flex justify-between">
                  <span>Counts Match:</span>
                  <Badge variant={testResults.cartCountMatches ? "default" : "destructive"}>
                    {testResults.cartCountMatches ? "Yes" : "No"}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span>Total Price:</span>
                  <span>${testResults.totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Unique Items:</span>
                  <span>{testResults.itemCount}</span>
                </div>
                <div className="flex justify-between">
                  <span>localStorage Available:</span>
                  <Badge variant={testResults.localStorageAvailable ? "default" : "destructive"}>
                    {testResults.localStorageAvailable ? "Yes" : "No"}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span>Test Product in Cart:</span>
                  <span>{testResults.testProductInCart}</span>
                </div>
              </div>
            ) : (
              <p>Click "Refresh Tests" to see results</p>
            )}
          </CardContent>
        </Card>

        {/* Current Cart Items */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Current Cart Items ({items.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {items.length === 0 ? (
              <p className="text-muted-foreground">Cart is empty</p>
            ) : (
              <div className="space-y-2">
                {items.map((item) => (
                  <div key={item.product.id} className="flex justify-between items-center p-2 bg-muted rounded">
                    <div>
                      <span className="font-medium">{item.product.name}</span>
                      <span className="text-sm text-muted-foreground ml-2">
                        x{item.quantity} @ ${item.product.price}
                      </span>
                    </div>
                    <span className="font-semibold">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* localStorage Debug */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>localStorage Debug</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="p-4 bg-muted rounded-lg font-mono text-sm">
              <pre>
                {typeof window !== "undefined" 
                  ? localStorage.getItem("cart") || "No cart data in localStorage"
                  : "localStorage not available (server-side)"
                }
              </pre>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Real-time Cart Count Display */}
      <CartCountDisplay />
    </div>
  )
}
