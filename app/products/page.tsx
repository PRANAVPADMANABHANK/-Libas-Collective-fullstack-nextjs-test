import { Suspense } from "react"
import { getAllProducts, getProductsByCategory } from "@/lib/products"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProductGrid } from "@/components/product-grid"
import { ProductFilters } from "@/components/product-filters"
import { ProductGridSkeleton } from "@/components/product-grid-skeleton"

interface ProductsPageProps {
  searchParams: {
    category?: string
    sort?: string
    page?: string
  }
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  // Server-side rendering - fetch products on each request
  const params = await searchParams
  const { category, sort = "name", page = "1" } = params

  let products = category ? await getProductsByCategory(category) : await getAllProducts()

  // Sort products
  if (sort === "price-low") {
    products = products.sort((a, b) => a.price - b.price)
  } else if (sort === "price-high") {
    products = products.sort((a, b) => b.price - a.price)
  } else if (sort === "name") {
    products = products.sort((a, b) => a.name.localeCompare(b.name))
  }

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
            <h1 className="text-3xl font-bold mb-2">{category ? `${category} Products` : "All Products"}</h1>
            <p className="text-muted-foreground">
              Showing {paginatedProducts.length} of {products.length} products
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            <aside className="lg:w-64 flex-shrink-0">
              <ProductFilters currentCategory={category} currentSort={sort} />
            </aside>

            <div className="flex-1">
              <Suspense fallback={<ProductGridSkeleton />}>
                <ProductGrid products={paginatedProducts} currentPage={currentPage} totalPages={totalPages} />
              </Suspense>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

// Force dynamic rendering for SSR
export const dynamic = "force-dynamic"
