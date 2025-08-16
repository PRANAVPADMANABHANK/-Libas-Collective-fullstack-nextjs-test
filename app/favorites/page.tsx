import type { Metadata } from "next"
import { FavoritesContent } from "@/components/favorites-content"

export const metadata: Metadata = {
  title: "My Favorites - ShopHub",
  description: "View and manage your favorite products",
}

export default function FavoritesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">My Favorites</h1>
        <p className="text-muted-foreground">Products you've saved for later</p>
      </div>
      <FavoritesContent />
    </div>
  )
}
