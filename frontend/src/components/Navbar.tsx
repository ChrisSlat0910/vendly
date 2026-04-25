'use client'

import { Search, ShoppingBag, Menu, Sun, Moon } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '@/hooks/useTheme'
import { useAuth } from '@/lib/auth-context'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Skeleton } from '@/components/ui/skeleton'

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { isDark, mounted, toggle } = useTheme()
  const { user, isInitializing } = useAuth()

  return (
    <TooltipProvider>
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="font-display text-xl font-bold tracking-tight">
            <span className="text-gradient">VENDLY</span>
          </Link>

          <div className="hidden items-center gap-6 md:flex">
            <Tooltip>
              <TooltipTrigger asChild>
                <a
                  href="#"
                  className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                  Explore
                </a>
              </TooltipTrigger>
              <TooltipContent>Jelajahi listing</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <a
                  href="#"
                  className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                  Categories
                </a>
              </TooltipTrigger>
              <TooltipContent>Lihat kategori</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <a
                  href="#"
                  className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                  Vendors
                </a>
              </TooltipTrigger>
              <TooltipContent>Lihat penjual</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <a
                  href="#"
                  className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                  About
                </a>
              </TooltipTrigger>
              <TooltipContent>Tentang Vendly</TooltipContent>
            </Tooltip>
          </div>

          <div className="flex items-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={toggle}
                  className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                  aria-label="Toggle theme"
                >
                  {mounted ? (
                    isDark ? (
                      <Sun className="h-5 w-5" />
                    ) : (
                      <Moon className="h-5 w-5" />
                    )
                  ) : (
                    <div className="h-5 w-5" />
                  )}
                </button>
              </TooltipTrigger>
              <TooltipContent>Ganti tema</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <button className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground">
                  <Search className="h-5 w-5" />
                </button>
              </TooltipTrigger>
              <TooltipContent>Cari listing</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <button className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground">
                  <ShoppingBag className="h-5 w-5" />
                </button>
              </TooltipTrigger>
              <TooltipContent>Keranjang</TooltipContent>
            </Tooltip>

            {isInitializing ? (
              <Skeleton className="hidden md:block h-9 w-24 rounded-lg" />
            ) : user ? (
              <Link
                href="/dashboard"
                className="hidden rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-all hover:glow-primary md:block"
              >
                Dashboard
              </Link>
            ) : (
              <Link
                href="/login"
                className="hidden rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-all hover:glow-primary md:block"
              >
                Sign In
              </Link>
            )}

            <button
              className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground md:hidden"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>

        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden border-t border-border bg-background md:hidden"
            >
              <div className="flex flex-col gap-2 p-4">
                <a
                  href="#"
                  className="rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-secondary hover:text-foreground"
                >
                  Explore
                </a>
                <a
                  href="#"
                  className="rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-secondary hover:text-foreground"
                >
                  Categories
                </a>
                <a
                  href="#"
                  className="rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-secondary hover:text-foreground"
                >
                  Vendors
                </a>
                <a
                  href="#"
                  className="rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-secondary hover:text-foreground"
                >
                  About
                </a>
                
                {isInitializing ? (
                  <Skeleton className="mt-2 h-9 w-full rounded-lg" />
                ) : user ? (
                  <Link
                    href="/dashboard"
                    className="mt-2 block rounded-lg bg-primary px-4 py-2 text-center text-sm font-semibold text-primary-foreground"
                  >
                    Dashboard
                  </Link>
                ) : (
                  <Link
                    href="/login"
                    className="mt-2 block rounded-lg bg-primary px-4 py-2 text-center text-sm font-semibold text-primary-foreground"
                  >
                    Sign In
                  </Link>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </TooltipProvider>
  )
}

export default Navbar
