import { initializeApp } from "firebase/app"
import { getFirestore, collection, addDoc } from "firebase/firestore"

const firebaseConfig = {
  // Add your Firebase config here
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id",
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

const sampleProducts = [
  {
    name: "Wireless Bluetooth Headphones",
    description: "Premium quality wireless headphones with noise cancellation and 30-hour battery life.",
    price: 199.99,
    image: "/placeholder-psojr.png",
    category: "Electronics",
    inStock: true,
    slug: "wireless-bluetooth-headphones",
    seoTitle: "Premium Wireless Bluetooth Headphones - 30Hr Battery",
    seoDescription:
      "Experience superior sound quality with our wireless Bluetooth headphones featuring noise cancellation and extended battery life.",
    tags: ["audio", "wireless", "bluetooth", "headphones"],
  },
  {
    name: "Smart Fitness Watch",
    description: "Track your health and fitness with this advanced smartwatch featuring heart rate monitoring and GPS.",
    price: 299.99,
    image: "/smart-fitness-watch.png",
    category: "Electronics",
    inStock: true,
    slug: "smart-fitness-watch",
    seoTitle: "Smart Fitness Watch with Heart Rate Monitor & GPS",
    seoDescription:
      "Stay fit and connected with our advanced smartwatch featuring comprehensive health tracking and GPS navigation.",
    tags: ["fitness", "smartwatch", "health", "gps"],
  },
  {
    name: "Organic Cotton T-Shirt",
    description: "Comfortable and sustainable organic cotton t-shirt available in multiple colors.",
    price: 29.99,
    image: "/organic-cotton-t-shirt.png",
    category: "Clothing",
    inStock: true,
    slug: "organic-cotton-t-shirt",
    seoTitle: "Sustainable Organic Cotton T-Shirt - Eco-Friendly Fashion",
    seoDescription: "Shop our comfortable organic cotton t-shirts made from sustainable materials in various colors.",
    tags: ["clothing", "organic", "cotton", "sustainable"],
  },
  {
    name: "Professional Coffee Maker",
    description: "Brew barista-quality coffee at home with this professional-grade coffee maker.",
    price: 149.99,
    image: "/placeholder-mys6z.png",
    category: "Home & Kitchen",
    inStock: true,
    slug: "professional-coffee-maker",
    seoTitle: "Professional Coffee Maker - Barista Quality at Home",
    seoDescription: "Create perfect coffee every time with our professional-grade coffee maker designed for home use.",
    tags: ["coffee", "kitchen", "appliance", "brewing"],
  },
  {
    name: "Ergonomic Office Chair",
    description: "Comfortable ergonomic office chair with lumbar support and adjustable height.",
    price: 399.99,
    image: "/ergonomic-office-chair.png",
    category: "Furniture",
    inStock: true,
    slug: "ergonomic-office-chair",
    seoTitle: "Ergonomic Office Chair with Lumbar Support",
    seoDescription:
      "Improve your workspace comfort with our ergonomic office chair featuring adjustable height and lumbar support.",
    tags: ["furniture", "office", "ergonomic", "chair"],
  },
  {
    name: "Yoga Mat Premium",
    description: "Non-slip premium yoga mat perfect for all types of yoga and exercise routines.",
    price: 49.99,
    image: "/premium-yoga-mat.png",
    category: "Sports & Fitness",
    inStock: true,
    slug: "yoga-mat-premium",
    seoTitle: "Premium Non-Slip Yoga Mat for All Exercise Types",
    seoDescription: "Enhance your yoga practice with our premium non-slip yoga mat, perfect for all fitness routines.",
    tags: ["yoga", "fitness", "exercise", "mat"],
  },
]

async function seedProducts() {
  try {
    const productsRef = collection(db, "products")

    for (const product of sampleProducts) {
      await addDoc(productsRef, product)
      console.log(`Added product: ${product.name}`)
    }

    console.log("Successfully seeded all products!")
  } catch (error) {
    console.error("Error seeding products:", error)
  }
}

seedProducts()
