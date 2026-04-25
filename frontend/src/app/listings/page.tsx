'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Search, MapPin, Package, ArrowRight } from 'lucide-react'

import { listingsApi } from '@/lib/api/listings'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'

interface Listing {
  id: string
  title: string
  price: number
  condition: string
  status: string
  location: string
}

export default function BrowseListingsPage() {
  const router = useRouter()
  const [listings, setListings] = useState<Listing[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchKeyword, setSearchKeyword] = useState('')
  const [currentQuery, setCurrentQuery] = useState('')

  const fetchListings = async (keyword?: string) => {
    try {
      setIsLoading(true)
      const data = await listingsApi.browse(keyword)
      // data could be a paginated response (with .content) or an array
      setListings(data.content || data || [])
    } catch (err) {
      console.error('Failed to fetch listings:', err)
      setListings([])
    } finally {
      setIsLoading(false)
    }
  }

  // Fetch initial data
  useEffect(() => {
    fetchListings()
  }, [])

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setCurrentQuery(searchKeyword)
    fetchListings(searchKeyword)
  }

  const formatRupiah = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <span className="font-display text-2xl font-bold tracking-tight text-primary">
              Vendly
            </span>
          </Link>
          <div className="flex items-center gap-2 sm:gap-4">
            <Button asChild variant="ghost" className="text-muted-foreground hidden sm:inline-flex">
              <Link href="/dashboard">Dashboard</Link>
            </Button>
            <Button asChild>
              <Link href="/listings/create">Buat Listing</Link>
            </Button>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 space-y-6">
          <div className="text-center md:text-left">
            <h1 className="text-4xl font-display font-bold tracking-tight">
              Browse Listing
            </h1>
            <p className="mt-2 text-muted-foreground max-w-2xl text-lg">
              Temukan barang menarik dari komunitas! Gunakan pencarian di bawah untuk mencari berdasarkan kata kunci.
            </p>
          </div>

          <form onSubmit={handleSearchSubmit} className="flex gap-2 max-w-2xl">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Cari nama barang, kategori, atau deskripsi..."
                className="pl-10 h-12 text-base bg-card/60 backdrop-blur-md"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
              />
            </div>
            <Button type="submit" size="lg" className="h-12" disabled={isLoading}>
              Cari
            </Button>
          </form>
        </div>

        {/* Current Query Display */}
        {currentQuery && !isLoading && (
          <p className="mb-6 text-muted-foreground">
            Menampilkan hasil untuk: <span className="font-semibold text-foreground">&quot;{currentQuery}&quot;</span>
          </p>
        )}

        {/* Listings Grid */}
        {isLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[...Array(8)].map((_, i) => (
              <Card key={i} className="overflow-hidden border-border/50">
                <div className="aspect-square sm:aspect-video w-full bg-muted/50">
                  <Skeleton className="h-full w-full rounded-none" />
                </div>
                <CardContent className="p-4 space-y-3">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-6 w-1/2" />
                  <div className="flex gap-2 pt-2">
                    <Skeleton className="h-5 w-16 rounded-full" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </CardContent>
                <CardFooter className="p-4 pt-0">
                  <Skeleton className="h-10 w-full" />
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : listings.length === 0 ? (
          <Card className="border-dashed bg-transparent p-12 text-center text-muted-foreground mt-6">
            <Package className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
            <h3 className="text-xl font-medium text-foreground mb-2">Tidak ada listing ditemukan</h3>
            <p className="text-sm mb-6 max-w-md mx-auto">
              Maaf, kami tidak dapat menemukan barang yang sesuai dengan pencarian Anda. Silakan coba kata kunci lain.
            </p>
            {currentQuery && (
              <Button variant="outline" onClick={() => {
                setSearchKeyword('')
                setCurrentQuery('')
                fetchListings('')
              }}>
                Hapus Pencarian
              </Button>
            )}
          </Card>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {listings.map((item) => (
              <Card 
                key={item.id} 
                className="flex flex-col overflow-hidden bg-card/60 border-border/50 backdrop-blur-md transition-all hover:border-primary/30 hover:shadow-lg group"
              >
                <div className="aspect-square sm:aspect-video w-full bg-muted/20 relative flex items-center justify-center overflow-hidden">
                  <Package className="h-12 w-12 text-muted-foreground/30 transition-transform group-hover:scale-110" />
                  <div className="absolute top-3 right-3">
                    <Badge variant={item.status === 'SOLD' ? 'secondary' : 'default'} className="shadow-sm">
                      {item.status || 'AVAILABLE'}
                    </Badge>
                  </div>
                </div>
                
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="line-clamp-2 text-lg leading-tight" title={item.title}>
                    {item.title}
                  </CardTitle>
                  <div className="text-xl font-bold text-primary mt-2">
                    {formatRupiah(item.price)}
                  </div>
                </CardHeader>
                
                <CardContent className="p-4 pt-0 flex-grow space-y-3">
                  <div className="flex items-center justify-between mt-1">
                    <Badge variant="outline" className="text-[10px] tracking-wider uppercase border-primary/20 text-primary bg-primary/5">
                      {item.condition}
                    </Badge>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3 mr-1" />
                      <span className="truncate max-w-[100px]" title={item.location}>{item.location || 'Online'}</span>
                    </div>
                  </div>
                </CardContent>
                
                <CardFooter className="p-4 pt-0 mt-auto">
                  <Button asChild className="w-full group/btn relative overflow-hidden">
                    <Link href={`/listings/${item.id}`}>
                      Lihat Detail
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
