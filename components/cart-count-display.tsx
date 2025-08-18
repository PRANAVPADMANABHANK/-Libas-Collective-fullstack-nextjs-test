"use client"

import { useCartCount } from "@/hooks/use-cart-count"
import { Badge } from "@/components/ui/badge"

export function CartCountDisplay() {
  const { cartCount, isLoaded } = useCartCount()

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Badge variant="default" className="text-sm">
        {isLoaded ? `Cart: ${cartCount} items` : "Loading..."}
      </Badge>
    </div>
  )
}
