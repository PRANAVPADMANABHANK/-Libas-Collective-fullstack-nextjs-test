import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Smartphone, Shirt, Home, Dumbbell, Armchair, Coffee } from "lucide-react"

const categories = [
  {
    name: "Electronics",
    icon: Smartphone,
    description: "Latest gadgets and tech",
    href: "/products?category=Electronics",
  },
  {
    name: "Clothing",
    icon: Shirt,
    description: "Fashion and apparel",
    href: "/products?category=Clothing",
  },
  {
    name: "Home & Kitchen",
    icon: Home,
    description: "Everything for your home",
    href: "/products?category=Home%20%26%20Kitchen",
  },
  {
    name: "Sports & Fitness",
    icon: Dumbbell,
    description: "Stay active and healthy",
    href: "/products?category=Sports%20%26%20Fitness",
  },
  {
    name: "Furniture",
    icon: Armchair,
    description: "Comfort and style",
    href: "/products?category=Furniture",
  },
  {
    name: "Coffee & Tea",
    icon: Coffee,
    description: "Perfect brewing essentials",
    href: "/products?category=Coffee",
  },
]

export function CategoryGrid() {
  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Shop by Category</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Explore our diverse range of products organized by category
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((category) => {
            const Icon = category.icon
            return (
              <Link key={category.name} href={category.href}>
                <Card className="group hover:shadow-md transition-all duration-300 hover:scale-105">
                  <CardContent className="p-6 text-center">
                    <Icon className="h-8 w-8 mx-auto mb-3 text-primary group-hover:text-primary/80" />
                    <h3 className="font-semibold mb-1">{category.name}</h3>
                    <p className="text-xs text-muted-foreground">{category.description}</p>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
