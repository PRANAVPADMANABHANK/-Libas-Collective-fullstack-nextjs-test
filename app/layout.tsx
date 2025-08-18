import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import "./globals.css"
import { AuthProvider } from "@/contexts/auth-context"
import { FavoritesProvider } from "@/contexts/favorites-context"
import { StructuredData } from "@/components/structured-data"

export const metadata: Metadata = {
  title: {
    default: "Libas Collective - Premium E-commerce Store",
    template: "%s | Libas Collective",
  },
  description:
    "Discover premium products at Libas Collective. From electronics to fashion, find everything you need with fast shipping and excellent customer service.",
  keywords: [
    "e-commerce",
    "online shopping",
    "electronics",
    "fashion",
    "home goods",
    "premium products",
    "fast shipping",
  ],
  authors: [{ name: "Libas Collective Team" }],
  creator: "Libas Collective",
  publisher: "Libas Collective",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://libascollective.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://libascollective.com",
    title: "Libas Collective - Premium E-commerce Store",
    description:
      "Discover premium products at Libas Collective. From electronics to fashion, find everything you need with fast shipping and excellent customer service.",
    siteName: "Libas Collective",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Libas Collective - Premium E-commerce Store",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Libas Collective - Premium E-commerce Store",
    description:
      "Discover premium products at Libas Collective. From electronics to fashion, find everything you need with fast shipping and excellent customer service.",
    images: ["/og-image.png"],
    creator: "@libascollective",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "google-site-verification-code",
    yandex: "yandex-verification-code",
    yahoo: "yahoo-site-verification-code",
  },
  generator: "Next.js",
}

interface RootLayoutProps {
  readonly children: React.ReactNode
}

/**
 * Root layout component that wraps all pages with necessary providers and global elements
 */
export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <head>
        <StructuredData />
        <style>{`
html {
  font-family: ${GeistSans.style.fontFamily};
  --font-sans: ${GeistSans.variable};
  --font-mono: ${GeistMono.variable};
}
        `}</style>
      </head>
      <body>
        <AuthProvider>
          <FavoritesProvider>
            {children}
          </FavoritesProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
