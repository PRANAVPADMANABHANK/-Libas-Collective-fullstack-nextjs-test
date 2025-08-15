/*
import { collection, getDocs, query, where, orderBy } from "firebase/firestore"
import { db } from "./firebase"
*/
import type { Product } from "./types"

const DUMMY_PRODUCTS: Product[] = [
  {
    id: "1",
    name: "Wireless Bluetooth Headphones",
    description:
      "Premium quality wireless headphones with noise cancellation and 30-hour battery life. Perfect for music lovers and professionals.",
    price: 199.99,
    image: "/wireless-headphones.png",
    category: "Electronics",
    inStock: true,
    slug: "wireless-bluetooth-headphones",
    seoTitle: "Premium Wireless Bluetooth Headphones - 30hr Battery",
    seoDescription:
      "Experience superior sound quality with our wireless Bluetooth headphones featuring noise cancellation and extended battery life.",
    tags: ["wireless", "bluetooth", "headphones", "audio", "music"],
  },
  {
    id: "2",
    name: "Smart Fitness Watch",
    description:
      "Advanced fitness tracking watch with heart rate monitor, GPS, and smartphone connectivity. Track your health goals effortlessly.",
    price: 299.99,
    image: "/placeholder.svg",
    category: "Electronics",
    inStock: true,
    slug: "smart-fitness-watch",
    seoTitle: "Smart Fitness Watch with GPS & Heart Rate Monitor",
    seoDescription:
      "Stay fit and connected with our advanced smart fitness watch featuring GPS tracking and comprehensive health monitoring.",
    tags: ["fitness", "watch", "smart", "health", "gps"],
  },
  {
    id: "3",
    name: "Organic Cotton T-Shirt",
    description:
      "Comfortable and sustainable organic cotton t-shirt. Available in multiple colors and sizes. Perfect for everyday wear.",
    price: 29.99,
    image: "/organic-cotton-tshirt.png",
    category: "Clothing",
    inStock: true,
    slug: "organic-cotton-t-shirt",
    seoTitle: "Organic Cotton T-Shirt - Sustainable & Comfortable",
    seoDescription:
      "Eco-friendly organic cotton t-shirt that's soft, comfortable, and perfect for conscious consumers.",
    tags: ["organic", "cotton", "t-shirt", "sustainable", "clothing"],
  },
  {
    id: "4",
    name: "Professional Camera Lens",
    description: "High-quality 50mm prime lens for professional photography. Sharp images with beautiful bokeh effect.",
    price: 599.99,
    image: "/placeholder.svg",
    category: "Electronics",
    inStock: true,
    slug: "professional-camera-lens",
    seoTitle: "50mm Professional Camera Lens - Sharp & Clear",
    seoDescription:
      "Capture stunning photos with our professional 50mm prime lens, perfect for portraits and professional photography.",
    tags: ["camera", "lens", "photography", "professional", "50mm"],
  },
  {
    id: "5",
    name: "Ergonomic Office Chair",
    description:
      "Comfortable ergonomic office chair with lumbar support and adjustable height. Perfect for long work sessions.",
    price: 399.99,
    image: "/ergonomic-office-chair.png",
    category: "Furniture",
    inStock: true,
    slug: "ergonomic-office-chair",
    seoTitle: "Ergonomic Office Chair with Lumbar Support",
    seoDescription:
      "Work comfortably all day with our ergonomic office chair featuring adjustable height and superior lumbar support.",
    tags: ["office", "chair", "ergonomic", "furniture", "comfort"],
  },
  {
    id: "6",
    name: "Stainless Steel Water Bottle",
    description:
      "Insulated stainless steel water bottle that keeps drinks cold for 24 hours or hot for 12 hours. BPA-free and eco-friendly.",
    price: 34.99,
    image: "/stainless-steel-bottle.png",
    category: "Home & Garden",
    inStock: true,
    slug: "stainless-steel-water-bottle",
    seoTitle: "Insulated Stainless Steel Water Bottle - 24hr Cold",
    seoDescription:
      "Stay hydrated with our premium insulated water bottle that keeps drinks at perfect temperature all day long.",
    tags: ["water", "bottle", "insulated", "stainless steel", "eco-friendly"],
  },
]

export async function getAllProducts(): Promise<Product[]> {
  // Simulate async operation
  await new Promise((resolve) => setTimeout(resolve, 100))
  return DUMMY_PRODUCTS
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  // Simulate async operation
  await new Promise((resolve) => setTimeout(resolve, 100))
  return DUMMY_PRODUCTS.find((product) => product.slug === slug) || null
}

export async function getProductsByCategory(category: string): Promise<Product[]> {
  // Simulate async operation
  await new Promise((resolve) => setTimeout(resolve, 100))
  return DUMMY_PRODUCTS.filter((product) => product.category === category)
}

export async function searchProducts(searchTerm: string): Promise<Product[]> {
  // Simulate async operation
  await new Promise((resolve) => setTimeout(resolve, 100))
  const lowercaseSearch = searchTerm.toLowerCase()

  return DUMMY_PRODUCTS.filter(
    (product) =>
      product.name.toLowerCase().includes(lowercaseSearch) ||
      product.description.toLowerCase().includes(lowercaseSearch) ||
      product.category.toLowerCase().includes(lowercaseSearch) ||
      product.tags?.some((tag) => tag.toLowerCase().includes(lowercaseSearch)),
  )
}

export async function searchProductsAdvanced(searchTerm: string): Promise<Product[]> {
  // Simulate async operation
  await new Promise((resolve) => setTimeout(resolve, 100))
  const lowercaseSearch = searchTerm.toLowerCase()
  const searchWords = lowercaseSearch.split(" ").filter((word) => word.length > 0)

  return DUMMY_PRODUCTS.filter((product) => {
    const searchableText = [product.name, product.description, product.category, ...(product.tags || [])]
      .join(" ")
      .toLowerCase()

    // Check if all search words are found
    return searchWords.every((word) => searchableText.includes(word))
  }).sort((a, b) => {
    // Sort by relevance - exact name matches first
    const aNameMatch = a.name.toLowerCase().includes(lowercaseSearch)
    const bNameMatch = b.name.toLowerCase().includes(lowercaseSearch)

    if (aNameMatch && !bNameMatch) return -1
    if (!aNameMatch && bNameMatch) return 1

    return a.name.localeCompare(b.name)
  })
}

export async function getProductById(id: string): Promise<Product | null> {
  // Simulate async operation
  await new Promise((resolve) => setTimeout(resolve, 100))
  return DUMMY_PRODUCTS.find((product) => product.id === id) || null
}
