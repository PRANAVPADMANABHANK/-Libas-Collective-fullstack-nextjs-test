import { collection, doc, setDoc, getDocs } from "firebase/firestore"
import { db, isFirebaseConfigured } from "../lib/firebase"
import { DUMMY_PRODUCTS } from "../lib/products"

async function seedFirestore() {
  if (!isFirebaseConfigured()) {
    console.error("Firebase is not configured. Please set up your environment variables.")
    return
  }

  try {
    console.log("Starting Firestore seeding...")

    // Check if products already exist
    const productsRef = collection(db, "products")
    const existingProducts = await getDocs(productsRef)

    if (!existingProducts.empty) {
      console.log(`Found ${existingProducts.size} existing products. Skipping seed.`)
      return
    }

    // Seed products
    for (const product of DUMMY_PRODUCTS) {
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
      console.log(`Seeded product: ${product.name}`)
    }

    console.log("Firestore seeding completed successfully!")
  } catch (error) {
    console.error("Error seeding Firestore:", error)
  }
}

// Run the seeding function
seedFirestore()
