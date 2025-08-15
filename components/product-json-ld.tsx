import type { Product } from "@/lib/types"

interface ProductJsonLdProps {
  product: Product
}

export function ProductJsonLd({ product }: ProductJsonLdProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.image || "/placeholder.svg",
    brand: {
      "@type": "Brand",
      name: "ShopHub",
    },
    category: product.category,
    sku: product.id,
    offers: {
      "@type": "Offer",
      price: product.price.toString(),
      priceCurrency: "USD",
      availability: product.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      seller: {
        "@type": "Organization",
        name: "ShopHub",
      },
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      reviewCount: "127",
      bestRating: "5",
      worstRating: "1",
    },
    review: [
      {
        "@type": "Review",
        reviewRating: {
          "@type": "Rating",
          ratingValue: "5",
          bestRating: "5",
        },
        author: {
          "@type": "Person",
          name: "John Doe",
        },
        reviewBody: "Excellent product! Highly recommended.",
      },
    ],
  }

  if (product.tags && product.tags.length > 0) {
    jsonLd.category = product.tags.join(", ")
  }

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
}
