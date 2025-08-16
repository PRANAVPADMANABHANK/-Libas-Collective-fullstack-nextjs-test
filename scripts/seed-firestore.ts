// Node.js script to seed Firestore using the Admin SDK (bypasses security rules)
import * as admin from 'firebase-admin';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Get __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Product data to seed
const PRODUCTS_TO_SEED = [
  {
    id: "1",
    name: "Wireless Bluetooth Headphones",
    description: "Premium quality wireless headphones with noise cancellation and 30-hour battery life. Perfect for music lovers and professionals.",
    price: 199.99,
    image: "/wireless-headphones.png",
    category: "Electronics",
    inStock: true,
    slug: "wireless-bluetooth-headphones",
    seoTitle: "Premium Wireless Bluetooth Headphones - 30hr Battery",
    seoDescription: "Experience superior sound quality with our wireless Bluetooth headphones featuring noise cancellation and extended battery life.",
    tags: ["wireless", "bluetooth", "headphones", "audio", "music"],
  },
  {
    id: "2",
    name: "Smart Fitness Watch",
    description: "Advanced fitness tracking watch with heart rate monitor, GPS, and smartphone connectivity. Track your health goals effortlessly.",
    price: 299.99,
    image: "/running-shoes-on-track.png",
    category: "Electronics",
    inStock: true,
    slug: "smart-fitness-watch",
    seoTitle: "Smart Fitness Watch with GPS & Heart Rate Monitor",
    seoDescription: "Stay fit and connected with our advanced smart fitness watch featuring GPS tracking and comprehensive health monitoring.",
    tags: ["fitness", "watch", "smart", "health", "gps"],
  },
  {
    id: "3",
    name: "Organic Cotton T-Shirt",
    description: "Comfortable and sustainable organic cotton t-shirt. Available in multiple colors and sizes. Perfect for everyday wear.",
    price: 29.99,
    image: "/organic-cotton-tshirt.png",
    category: "Clothing",
    inStock: true,
    slug: "organic-cotton-t-shirt",
    seoTitle: "Organic Cotton T-Shirt - Sustainable & Comfortable",
    seoDescription: "Eco-friendly organic cotton t-shirt that's soft, comfortable, and perfect for conscious consumers.",
    tags: ["organic", "cotton", "t-shirt", "sustainable", "clothing"],
  },
  {
    id: "4",
    name: "Professional Camera Lens",
    description: "High-quality 50mm prime lens for professional photography. Sharp images with beautiful bokeh effect.",
    price: 599.99,
    image: "/electronics-category.png",
    category: "Electronics",
    inStock: true,
    slug: "professional-camera-lens",
    seoTitle: "50mm Professional Camera Lens - Sharp & Clear",
    seoDescription: "Capture stunning photos with our professional 50mm prime lens, perfect for portraits and professional photography.",
    tags: ["camera", "lens", "photography", "professional", "50mm"],
  },
  {
    id: "5",
    name: "Ergonomic Office Chair",
    description: "Comfortable ergonomic office chair with lumbar support and adjustable height. Perfect for long work sessions.",
    price: 399.99,
    image: "/ergonomic-office-chair.png",
    category: "Furniture",
    inStock: true,
    slug: "ergonomic-office-chair",
    seoTitle: "Ergonomic Office Chair with Lumbar Support",
    seoDescription: "Work comfortably all day with our ergonomic office chair featuring adjustable height and superior lumbar support.",
    tags: ["office", "chair", "ergonomic", "furniture", "comfort"],
  },
  {
    id: "6",
    name: "Stainless Steel Water Bottle",
    description: "Insulated stainless steel water bottle that keeps drinks cold for 24 hours or hot for 12 hours. BPA-free and eco-friendly.",
    price: 34.99,
    image: "/stainless-steel-bottle.png",
    category: "Home & Garden",
    inStock: true,
    slug: "stainless-steel-water-bottle",
    seoTitle: "Insulated Stainless Steel Water Bottle - 24hr Cold",
    seoDescription: "Stay hydrated with our premium insulated water bottle that keeps drinks at perfect temperature all day long.",
    tags: ["water", "bottle", "insulated", "stainless steel", "eco-friendly"],
  },
];

// Path to your service account key JSON file
const SERVICE_ACCOUNT_PATH = path.resolve(__dirname, '../serviceAccountKey.json');

if (!fs.existsSync(SERVICE_ACCOUNT_PATH)) {
  console.error('Service account key file not found at:', SERVICE_ACCOUNT_PATH);
  console.error('Download it from Firebase Console > Project Settings > Service Accounts.');
  process.exit(1);
}

// Read the service account file
const serviceAccountData = JSON.parse(fs.readFileSync(SERVICE_ACCOUNT_PATH, 'utf8'));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccountData),
});

const db = admin.firestore();

async function seedFirestore() {
  console.log('[Admin] Starting Firestore seeding...');
  const productsRef = db.collection('products');

  // Delete all existing products
  const existing = await productsRef.get();
  if (!existing.empty) {
    console.log(`[Admin] Deleting ${existing.size} existing products...`);
    const batch = db.batch();
    existing.docs.forEach(doc => batch.delete(doc.ref));
    await batch.commit();
  }

  // Add new products
  for (const product of PRODUCTS_TO_SEED) {
    const docRef = productsRef.doc(product.id);
    await docRef.set({
      ...product,
    });
    console.log(`[Admin] Seeded product: ${product.name}`);
  }

  console.log(`[Admin] Firestore seeding complete. Total products: ${PRODUCTS_TO_SEED.length}`);
}

seedFirestore().catch(err => {
  console.error('[Admin] Error seeding Firestore:', err);
  process.exit(1);
});
