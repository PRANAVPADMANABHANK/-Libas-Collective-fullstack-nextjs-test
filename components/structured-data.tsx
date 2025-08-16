export function WebsiteJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "ShopHub",
    url: "https://shophub.com",
    description: "Premium e-commerce store with electronics, fashion, and home goods",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://shophub.com/search?q={search_term_string}",
      },
      "query-input": "required name=search_term_string",
    },
  }

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
}

export function OrganizationJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "ShopHub",
    url: "https://shophub.com",
    logo: "https://shophub.com/logo.png",
    description: "Premium e-commerce store offering quality products with excellent customer service",
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+1-555-123-4567",
      contactType: "customer service",
      availableLanguage: "English",
    },
    sameAs: ["https://facebook.com/shophub", "https://twitter.com/shophub", "https://instagram.com/shophub"],
  }

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
}

export function StructuredData() {
  return (
    <>
      <WebsiteJsonLd />
      <OrganizationJsonLd />
    </>
  )
}
