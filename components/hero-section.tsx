import Link from "next/link"
import { Button } from "@/components/ui/button"

export function HeroSection() {
  return (
    <section className="bg-gradient-to-r from-primary/10 to-secondary/10 py-20">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">Discover Amazing Products</h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Shop the latest trends and find everything you need in one place. Quality products, competitive prices, and
          exceptional service.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg">
            <Link href="/products">Shop Now</Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link href="/products?category=Electronics">Browse Electronics</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
