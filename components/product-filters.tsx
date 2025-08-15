"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface ProductFiltersProps {
  currentCategory?: string
  currentSort: string
}

const categories = ["Electronics", "Clothing", "Home & Kitchen", "Sports & Fitness", "Furniture"]

const sortOptions = [
  { value: "name", label: "Name (A-Z)" },
  { value: "price-low", label: "Price (Low to High)" },
  { value: "price-high", label: "Price (High to Low)" },
]

export function ProductFilters({ currentCategory, currentSort }: ProductFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const updateFilter = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString())

    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }

    // Reset to first page when filtering
    params.delete("page")

    router.push(`/products?${params.toString()}`)
  }

  const clearFilters = () => {
    router.push("/products")
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filters</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-medium mb-3">Category</h4>
            <div className="space-y-2">
              <Button
                variant={!currentCategory ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => updateFilter("category", null)}
              >
                All Categories
              </Button>
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={currentCategory === category ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => updateFilter("category", category)}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-3">Sort By</h4>
            <Select value={currentSort} onValueChange={(value) => updateFilter("sort", value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button variant="outline" className="w-full bg-transparent" onClick={clearFilters}>
            Clear All Filters
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
