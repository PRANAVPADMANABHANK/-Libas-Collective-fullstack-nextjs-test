import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { getProductBySlug, getAllProducts } from "@/lib/products"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProductDetail } from "@/components/product-detail"
import { RelatedProducts } from "@/components/related-products"
import { ProductJsonLd } from "@/components/product-json-ld"

interface ProductPageProps {
  params: {
    slug: string
  }
}

export async function generateStaticParams() {
  const products = await getAllProducts()
  return products.map((product) => ({
    slug: product.slug,
  }))
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const product = await getProductBySlug(params.slug)

  if (!product) {
    return {
      title: "Product Not Found",
      description: "The requested product could not be found.",
    }
  }

  const title = product.seoTitle || `${product.name} - ShopHub`
  const description = product.seoDescription || product.description
  const images = [
    {
      url: product.image || "/placeholder.svg",
      width: 800,
      height: 600,
      alt: product.name,
    },
  ]

  return {
    title,
    description,
    keywords: product.tags?.join(", "),
    openGraph: {
      title,
      description,
      type: "website",
      url: `https://shophub.com/products/${product.slug}`,
      images,
      siteName: "ShopHub",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [product.image || "/placeholder.svg"],
    },
    alternates: {
      canonical: `https://shophub.com/products/${product.slug}`,
    },
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await getProductBySlug(params.slug)

  if (!product) {
    notFound()
  }

  // Get related products from the same category
  const allProducts = await getAllProducts()
  const relatedProducts = allProducts.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4)

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <ProductJsonLd product={product} />
        <ProductDetail product={product} />
        {relatedProducts.length > 0 && <RelatedProducts products={relatedProducts} />}
      </main>
      <Footer />
    </div>
  )
}

// Enable static generation with ISR
export const revalidate = 3600 // Revalidate every hour
