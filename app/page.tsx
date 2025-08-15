import { getAllProducts } from "@/lib/products"
import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { FeaturedProducts } from "@/components/featured-products"
import { CategoryGrid } from "@/components/category-grid"
import { Footer } from "@/components/footer"
import { WebsiteJsonLd, OrganizationJsonLd } from "@/components/structured-data"

export default async function HomePage() {
  // Static generation - fetch products at build time
  const products = await getAllProducts()
  const featuredProducts = products.slice(0, 6)

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
}

// Enable static generation
export const revalidate = 3600 // Revalidate every hour
