import { Suspense } from "react"
import { searchProducts } from "@/lib/products"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { SearchResults } from "@/components/search-results"
import { ProductGridSkeleton } from "@/components/product-grid-skeleton"

interface SearchPageProps {
  searchParams: Promise<{
    q?: string
    page?: string
  }>
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams
  const { q: query = "", page = "1" } = params

  // Server-side search
  const products = query ? await searchProducts(query) : []

  // Pagination
  const pageSize = 12
  const currentPage = Number.parseInt(page)
  const totalPages = Math.ceil(products.length / pageSize)
  const startIndex = (currentPage - 1) * pageSize
  const paginatedProducts = products.slice(startIndex, startIndex + pageSize)

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">{query ? `Search Results for "${query}"` : "Search Products"}</h1>
            <p className="text-muted-foreground">
              {query ? `Found ${products.length} products` : "Enter a search term to find products"}
            </p>
          </div>

          <Suspense fallback={<ProductGridSkeleton />}>
            <SearchResults
              products={paginatedProducts}
              query={query}
              currentPage={currentPage}
              totalPages={totalPages}
              totalResults={products.length}
            />
          </Suspense>
        </div>
      </main>
      <Footer />
    </div>
  )
}

// Static generation with revalidation
export const revalidate = 3600 // 1 hour
