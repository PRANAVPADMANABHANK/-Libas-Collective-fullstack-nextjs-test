export interface Product {
  id: string
  name: string
  description: string
  price: number
  image: string
  category: string
  inStock: boolean
  slug: string
  seoTitle?: string
  seoDescription?: string
  tags?: string[]
}

export interface CartItem {
  product: Product
  quantity: number
}

export interface User {
  id: string
  email: string
  name?: string
  favorites: string[]
}
