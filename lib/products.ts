import { collection, getDocs, query, where, orderBy, doc, getDoc } from "firebase/firestore"
import { db, isFirebaseConfigured } from "./firebase"
import type { Product } from "./types"

// Helper function to convert Firestore document to plain object
function convertFirestoreDoc(doc: any): Product {
  const data = doc.data()
  return {
    id: doc.id,
    name: data.name,
    description: data.description,
    price: data.price,
    image: data.image,
    category: data.category,
    inStock: data.inStock,
    slug: data.slug,
    seoTitle: data.seoTitle,
    seoDescription: data.seoDescription,
    tags: data.tags || [],
  }
}

export async function getAllProducts(): Promise<Product[]> {
  if (!isFirebaseConfigured()) {
    console.error("[ShopHub] Firebase not configured")
    return []
  }

  try {
    const productsRef = collection(db, "products")
    const querySnapshot = await getDocs(productsRef)

    const products: Product[] = []
    querySnapshot.forEach((doc) => {
      products.push(convertFirestoreDoc(doc))
    })

    return products
  } catch (error) {
    console.error("[ShopHub] Error fetching products from Firestore:", error)
    return []
  }
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  if (!isFirebaseConfigured()) {
    console.error("[ShopHub] Firebase not configured")
    return null
  }

  try {
    const productsRef = collection(db, "products")
    const q = query(productsRef, where("slug", "==", slug))
    const querySnapshot = await getDocs(q)

    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0]
      return convertFirestoreDoc(doc)
    }

    return null
  } catch (error) {
    console.error("[ShopHub] Error fetching product by slug from Firestore:", error)
    return null
  }
}

export async function getProductsByCategory(category: string): Promise<Product[]> {
  if (!isFirebaseConfigured()) {
    console.error("[ShopHub] Firebase not configured")
    return []
  }

  try {
    const productsRef = collection(db, "products")
    const q = query(productsRef, where("category", "==", category))
    const querySnapshot = await getDocs(q)

    const products: Product[] = []
    querySnapshot.forEach((doc) => {
      products.push(convertFirestoreDoc(doc))
    })

    return products
  } catch (error) {
    console.error("[ShopHub] Error fetching products by category from Firestore:", error)
    return []
  }
}

export async function searchProducts(searchTerm: string): Promise<Product[]> {
  if (!isFirebaseConfigured()) {
    console.error("[ShopHub] Firebase not configured")
    return []
  }

  try {
    // Note: Firestore doesn't support full-text search natively
    // For production, consider using Algolia or similar service
    const productsRef = collection(db, "products")
    const querySnapshot = await getDocs(productsRef)

    const products: Product[] = []
    querySnapshot.forEach((doc) => {
      products.push(convertFirestoreDoc(doc))
    })

    const lowercaseSearch = searchTerm.toLowerCase()
    return products.filter(
      (product) =>
        product.name.toLowerCase().includes(lowercaseSearch) ||
        product.description.toLowerCase().includes(lowercaseSearch) ||
        product.category.toLowerCase().includes(lowercaseSearch) ||
        product.tags?.some((tag) => tag.toLowerCase().includes(lowercaseSearch)),
    )
  } catch (error) {
    console.error("[ShopHub] Error searching products in Firestore:", error)
    return []
  }
}

export async function searchProductsAdvanced(searchTerm: string): Promise<Product[]> {
  const products = await searchProducts(searchTerm)
  const lowercaseSearch = searchTerm.toLowerCase()
  const searchWords = lowercaseSearch.split(" ").filter((word) => word.length > 0)

  return products
    .filter((product) => {
      const searchableText = [product.name, product.description, product.category, ...(product.tags || [])]
        .join(" ")
        .toLowerCase()

      return searchWords.every((word) => searchableText.includes(word))
    })
    .sort((a, b) => {
      const aNameMatch = a.name.toLowerCase().includes(lowercaseSearch)
      const bNameMatch = b.name.toLowerCase().includes(lowercaseSearch)

      if (aNameMatch && !bNameMatch) return -1
      if (!aNameMatch && bNameMatch) return 1

      return a.name.localeCompare(b.name)
    })
}

export async function getProductById(id: string): Promise<Product | null> {
  if (!isFirebaseConfigured()) {
    console.error("[ShopHub] Firebase not configured")
    return null
  }

  try {
    const productRef = doc(db, "products", id)
    const productSnap = await getDoc(productRef)

    if (productSnap.exists()) {
      return convertFirestoreDoc(productSnap)
    } else {
      return null
    }
  } catch (error) {
    console.error("[ShopHub] Error fetching product by ID from Firestore:", error)
    return null
  }
}
