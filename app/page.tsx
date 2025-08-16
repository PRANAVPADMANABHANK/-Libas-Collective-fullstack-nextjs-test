/**
 * Homepage component with static generation for optimal performance
 * Displays hero section, featured products, and category grid
 */
import { getAllProducts } from "@/lib/products"
import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { FeaturedProducts } from "@/components/featured-products"
import { CategoryGrid } from "@/components/category-grid"
import { Footer } from "@/components/footer"
import { WebsiteJsonLd, OrganizationJsonLd } from "@/components/structured-data"
import { FEATURED_PRODUCTS_COUNT, REVALIDATE_INTERVAL } from "@/lib/constants"

/**
 * Homepage component that renders the main landing page
 */
export default async function HomePage() {
  try {
    // Static generation - fetch products at build time
    const products = await getAllProducts()
    const featuredProducts = products.slice(0, FEATURED_PRODUCTS_COUNT)

    return (
      <div className="min-h-screen flex flex-col">
        <WebsiteJsonLd />
        <OrganizationJsonLd />
        <Header />
        <main className="flex-1">
          <HeroSection />
          <FeaturedProducts products={featuredProducts} />
          <CategoryGrid />
        </main>
        <Footer />
      </div>
    )
  } catch (error) {
    console.error("Error loading homepage:", error)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Loading Error</h1>
          <p className="text-muted-foreground">Unable to load the homepage. Please try again later.</p>
        </div>
      </div>
    )
  }
}

// Enable static generation with revalidation
export const revalidate = REVALIDATE_INTERVAL
