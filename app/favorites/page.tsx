import type { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { FavoritesContent } from "@/components/favorites-content"

export const metadata: Metadata = {
  title: "My Favorites - Libas Collective",
  description: "View and manage your favorite products",
}

export default function FavoritesPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">My Favorites</h1>
            <p className="text-muted-foreground">Products you've saved for later</p>
          </div>
          <FavoritesContent />
        </div>
      </main>
      <Footer />
    </div>
  )
}
