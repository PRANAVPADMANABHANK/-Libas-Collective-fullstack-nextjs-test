"use client"

import type React from "react"

import Link from "next/link"
import { ShoppingCart, Search, Heart, User, LogOut, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useCart } from "@/hooks/use-cart"
import { useFavorites } from "@/hooks/use-favorites"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export function Header() {
  const { totalItems } = useCart()
  const { totalFavorites } = useFavorites()
  const [searchQuery, setSearchQuery] = useState("")
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const router = useRouter()
  const { user, logout, loading } = useAuth()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
      setIsMobileMenuOpen(false) // Close mobile menu after search
    }
  }

  const handleLogout = async () => {
    try {
      await logout()
      router.push("/")
      setIsMobileMenuOpen(false) // Close mobile menu after logout
    } catch (error) {
      console.error("Failed to logout:", error)
    }
  }

  const closeMobileMenu = () => setIsMobileMenuOpen(false)

  return (
    <header className="border-b bg-background sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        {/* Desktop Header */}
        <div className="hidden md:flex items-center justify-between gap-4">
          <Link href="/" className="text-2xl font-bold flex-shrink-0">
            ShopHub
          </Link>

          <form onSubmit={handleSearch} className="flex-1 max-w-md mx-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="search"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </form>

          <nav className="flex items-center gap-2 flex-shrink-0">
            <Link href="/products" className="hover:text-primary px-2 py-1 rounded-md transition-colors">
              Products
            </Link>

            {user && (
              <Link href="/favorites" className="relative">
                <Button variant="ghost" size="sm">
                  <Heart className="h-4 w-4" />
                  {totalFavorites > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
                      {totalFavorites}
                    </span>
                  )}
                </Button>
              </Link>
            )}

            <Link href="/cart" className="relative">
              <Button variant="outline" size="sm">
                <ShoppingCart className="h-4 w-4" />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full text-xs w-5 h-5 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </Button>
            </Link>

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <User className="h-4 w-4 mr-2" />
                    <span className="hidden lg:inline">{user.displayName || user.email}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex gap-2">
                <Button variant="outline" size="sm" asChild>
                  <Link href="/login">Sign In</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link href="/register">Sign Up</Link>
                </Button>
              </div>
            )}
          </nav>
        </div>

        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between gap-2">
          <Link href="/" className="text-xl font-bold flex-shrink-0">
            ShopHub
          </Link>

          <div className="flex items-center gap-2">
            <Link href="/cart" className="relative">
              <Button variant="outline" size="sm">
                <ShoppingCart className="h-4 w-4" />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full text-xs w-5 h-5 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </Button>
            </Link>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2"
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden mt-4">
          <form onSubmit={handleSearch}>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="search"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-full"
              />
            </div>
          </form>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t pt-4">
            <nav className="flex flex-col gap-3">
              <Link 
                href="/products" 
                className="hover:text-primary px-2 py-2 rounded-md transition-colors"
                onClick={closeMobileMenu}
              >
                Products
              </Link>

              {user && (
                <Link 
                  href="/favorites" 
                  className="flex items-center gap-2 px-2 py-2 rounded-md hover:bg-muted transition-colors"
                  onClick={closeMobileMenu}
                >
                  <Heart className="h-4 w-4" />
                  <span>Favorites</span>
                  {totalFavorites > 0 && (
                    <span className="bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
                      {totalFavorites}
                    </span>
                  )}
                </Link>
              )}

              {user ? (
                <div className="flex flex-col gap-2">
                  <div className="px-2 py-2 text-sm text-muted-foreground">
                    Welcome, {user.displayName || user.email}
                  </div>
                  <Button 
                    variant="outline" 
                    onClick={handleLogout}
                    className="justify-start"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <Button variant="outline" asChild>
                    <Link href="/login" onClick={closeMobileMenu}>Sign In</Link>
                  </Button>
                  <Button asChild>
                    <Link href="/register" onClick={closeMobileMenu}>Sign Up</Link>
                  </Button>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
