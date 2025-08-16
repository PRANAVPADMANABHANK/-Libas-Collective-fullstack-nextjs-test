import { collection, doc, setDoc, getDocs, deleteDoc } from "firebase/firestore"
import { db, isFirebaseConfigured } from "../lib/firebase"
import { DUMMY_PRODUCTS } from "../lib/products"

async function seedFirestore() {
  console.log("[v0] Starting seeding process...")
  console.log("[v0] Firebase configured:", isFirebaseConfigured())
  console.log("[v0] Database instance:", db ? "Available" : "Not available")
  console.log("[v0] Products to seed:", DUMMY_PRODUCTS.length)

  if (!isFirebaseConfigured()) {
    console.error("Firebase is not configured. Please set up your environment variables.")
    return
  }

  try {
    console.log("Starting Firestore seeding...")

    console.log("[v0] Attempting to connect to Firestore...")
    const productsRef = collection(db, "products")
    console.log("[v0] Products collection reference created")

    // Clear existing products to ensure fresh data
    console.log("[v0] Checking for existing products...")
    const existingProducts = await getDocs(productsRef)
    console.log("[v0] Existing products query completed, count:", existingProducts.size)

    if (!existingProducts.empty) {
      console.log(`Clearing ${existingProducts.size} existing products...`)
      for (const productDoc of existingProducts.docs) {
        await deleteDoc(productDoc.ref)
        console.log("[v0] Deleted product:", productDoc.id)
      }
    }

    // Seed all products from DUMMY_PRODUCTS
    console.log(`Seeding ${DUMMY_PRODUCTS.length} products...`)
    for (let i = 0; i < DUMMY_PRODUCTS.length; i++) {
      const product = DUMMY_PRODUCTS[i]
      console.log(`[v0] Seeding product ${i + 1}/${DUMMY_PRODUCTS.length}: ${product.name}`)

      const productRef = doc(db, "products", product.id)
      await setDoc(productRef, {
        name: product.name,
        description: product.description,
        price: product.price,
        image: product.image,
        category: product.category,
        inStock: product.inStock,
        slug: product.slug,
        seoTitle: product.seoTitle,
        seoDescription: product.seoDescription,
        tags: product.tags,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      console.log(`✓ Seeded product: ${product.name} ($${product.price})`)
    }

    console.log("🎉 Firestore seeding completed successfully!")
    console.log(`Total products seeded: ${DUMMY_PRODUCTS.length}`)

    console.log("[v0] Verifying products were added...")
    const verifyProducts = await getDocs(productsRef)
    console.log("[v0] Products in database after seeding:", verifyProducts.size)
  } catch (error) {
    console.error("❌ Error seeding Firestore:", error)
    console.error("[v0] Full error details:", JSON.stringify(error, null, 2))
  }
}

// Run the seeding function
seedFirestore()
