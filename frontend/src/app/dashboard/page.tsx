'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { LogOut, Plus, Search, Edit, Trash2, Package, AlertCircle } from 'lucide-react'

import { useAuth } from '@/lib/auth-context'
import { listingsApi } from '@/lib/api/listings'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface Listing {
  id: string
  title: string
  price: number
  condition: string
  status: string
}

export default function DashboardPage() {
  const router = useRouter()
  const { user, logout, isInitializing } = useAuth()

  const [listings, setListings] = useState<Listing[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isInitializing && !user) {
      router.push('/login')
    }
  }, [isInitializing, user, router])

  useEffect(() => {
    const fetchMyListings = async () => {
      try {
        setIsLoading(true)
        const data = await listingsApi.myListings()
        setListings(data.content || [])
      } catch {
        setError('Gagal memuat listing Anda. Silakan coba lagi.')
      } finally {
        setIsLoading(false)
      }
    }
    if (user) fetchMyListings()
  }, [user])

  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    )
  }

  if (!user) return null

  const formatRupiah = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus listing ini?')) return
    try {
      await listingsApi.delete(id)
      setListings((prev) => prev.filter((item) => item.id !== id))
    } catch {
      alert('Gagal menghapus listing.')
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <nav className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <span className="font-display text-2xl font-bold tracking-tight text-primary">
              Vendly
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="hidden text-sm font-medium text-muted-foreground md:inline-block">
              {user.email}
            </span>
            <Button variant="ghost" size="icon" onClick={() => logout()} title="Logout">
              <LogOut className="h-5 w-5 text-muted-foreground hover:text-destructive transition-colors" />
            </Button>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-3xl font-display font-bold tracking-tight">
              Halo, {user.displayName}!
            </h1>
            <p className="text-muted-foreground mt-1">Selamat datang di dashboard penjual Anda.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button asChild variant="outline" className="gap-2">
              <Link href="/listings">
                <Search className="h-4 w-4" />
                Browse Semua Listing
              </Link>
            </Button>
            <Button asChild className="gap-2">
              <Link href="/listings/create">
                <Plus className="h-4 w-4" />
                Buat Listing Baru
              </Link>
            </Button>
          </div>
        </div>

        {error && (
          <Alert
            variant="destructive"
            className="mb-6 bg-destructive/10 text-destructive border-none"
          >
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="mb-8 grid gap-4 md:grid-cols-3">
          <Card className="bg-card/60 backdrop-blur-md border-primary/20 shadow-sm relative overflow-hidden">
            <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-primary/10 blur-2xl" />
            <CardHeader className="pb-2">
              <CardDescription className="font-medium text-foreground">
                Total Listing Saya
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-display font-bold text-primary">
                {isLoading ? <Skeleton className="h-10 w-16" /> : listings.length}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold tracking-tight border-b border-border/50 pb-4">
            Kelola Listing
          </h2>

          {isLoading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {[...Array(4)].map((_, i) => (
                <Card key={i} className="overflow-hidden border-border/50">
                  <div className="aspect-video w-full">
                    <Skeleton className="h-full w-full rounded-none" />
                  </div>
                  <CardContent className="p-4 space-y-3">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <div className="flex gap-2 pt-2">
                      <Skeleton className="h-5 w-16 rounded-full" />
                      <Skeleton className="h-5 w-16 rounded-full" />
                    </div>
                  </CardContent>
                  <CardFooter className="p-4 pt-0 flex justify-between">
                    <Skeleton className="h-9 w-[45%]" />
                    <Skeleton className="h-9 w-[45%]" />
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : listings.length === 0 ? (
            <Card className="border-dashed bg-transparent p-12 text-center text-muted-foreground mt-6">
              <Package className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-1">Tidak Ada Listing</h3>
              <p className="text-sm mb-6">Anda belum pernah membuat listing apapun.</p>
              <Button asChild>
                <Link href="/listings/create">Buat Listing Pertama Anda</Link>
              </Button>
            </Card>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 pt-4">
              {listings.map((item) => (
                <Card
                  key={item.id}
                  className="flex flex-col overflow-hidden bg-card/60 border-border/50 backdrop-blur-md transition-all hover:border-primary/30 hover:shadow-lg group"
                >
                  <div className="aspect-video w-full bg-muted/30 relative flex items-center justify-center overflow-hidden">
                    <Package className="h-10 w-10 text-muted-foreground/30 transition-transform group-hover:scale-110" />
                    <div className="absolute top-2 right-2">
                      <Badge variant={item.status === 'SOLD' ? 'secondary' : 'default'}>
                        {item.status}
                      </Badge>
                    </div>
                  </div>
                  <CardHeader className="p-4 pb-2">
                    <CardTitle className="line-clamp-1 text-lg" title={item.title}>
                      {item.title}
                    </CardTitle>
                    <div className="text-lg font-bold text-primary mt-1">
                      {formatRupiah(item.price)}
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 pt-0 flex-grow">
                    <Badge variant="outline" className="text-[10px] tracking-wider uppercase">
                      {item.condition}
                    </Badge>
                  </CardContent>
                  <CardFooter className="p-4 pt-0 gap-2 border-t border-border/30 mt-auto bg-card/40 flex">
                    <Button asChild variant="secondary" className="flex-1 gap-1 text-xs sm:text-sm">
                      <Link href={`/listings/edit/${item.id}`}>
                        <Edit className="h-3.5 w-3.5" />
                        Edit
                      </Link>
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => handleDelete(item.id)}
                      className="flex-1 gap-1 text-xs sm:text-sm"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Delete
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
