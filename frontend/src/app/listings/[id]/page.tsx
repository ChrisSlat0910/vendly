'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { 
  ArrowLeft, 
  MapPin, 
  Clock, 
  User, 
  Handshake, 
  Truck, 
  AlertCircle,
  Package
} from 'lucide-react'

import { listingsApi } from '@/lib/api/listings'
import { useAuth } from '@/lib/auth-context'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

interface ListingDetail {
  id: string
  title: string
  description: string
  price: number
  condition: string
  status: string
  location: string
  sellerUsername: string
  allowCod: boolean
  allowOffers: boolean
  createdAt: string
}

export default function ListingDetailPage() {
  const router = useRouter()
  const params = useParams()
  const id = params?.id as string

  const { user, isInitializing } = useAuth()

  const [listing, setListing] = useState<ListingDetail | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchListing = async () => {
      if (!id) return

      try {
        setIsLoading(true)
        setError('')
        const data = await listingsApi.getById(id)
        setListing(data)
      } catch (err: any) {
        console.error('Failed to fetch listing detail:', err)
        setError(
          err.response?.data?.message || 'Listing tidak ditemukan atau terjadi kesalahan server.'
        )
      } finally {
        setIsLoading(false)
      }
    }

    fetchListing()
  }, [id])

  useEffect(() => {
    if (!isInitializing && !user && listing) {
      router.push(`/login?redirect=/listings/${id}`)
    }
  }, [isInitializing, user, listing, id, router])

  const formatRupiah = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price)
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return '-'
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(date)
  }

  return (
    <div className="min-h-screen bg-background pb-12">
      {/* Simple Navbar */}
      <nav className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center px-4">
          <Link href="/" className="flex items-center gap-2">
            <span className="font-display text-2xl font-bold tracking-tight text-primary">
              Vendly
            </span>
          </Link>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button asChild variant="ghost" className="gap-2 -ml-4 hover:bg-transparent hover:text-primary">
            <Link href="/listings">
              <ArrowLeft className="h-4 w-4" />
              Kembali ke Browse
            </Link>
          </Button>
        </div>

        {isInitializing ? (
          <div className="flex h-64 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary" />
          </div>
        ) : error ? (
          <div className="max-w-2xl mx-auto mt-12">
            <Alert variant="destructive" className="bg-destructive/10 text-destructive border-none">
              <AlertCircle className="h-5 w-5" />
              <AlertTitle className="text-lg">Oh tidak!</AlertTitle>
              <AlertDescription className="text-base mt-2">
                {error}
              </AlertDescription>
            </Alert>
            <div className="mt-6 text-center">
              <Button asChild>
                <Link href="/listings">Kembali ke Daftar Listing</Link>
              </Button>
            </div>
          </div>
        ) : isLoading ? (
          /* Loading Skeleton */
          <div className="max-w-4xl mx-auto grid gap-8 md:grid-cols-3">
            <div className="md:col-span-2 space-y-6">
              <Card>
                <div className="aspect-video w-full bg-muted/50 rounded-t-lg">
                  <Skeleton className="h-full w-full rounded-none" />
                </div>
                <CardHeader>
                  <Skeleton className="h-10 w-3/4 mb-4" />
                  <Skeleton className="h-8 w-1/3" />
                </CardHeader>
                <CardContent className="space-y-4">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                  <Skeleton className="h-4 w-4/6" />
                </CardContent>
              </Card>
            </div>
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <Skeleton className="h-6 w-1/2 mb-2" />
                  <Skeleton className="h-10 w-full" />
                </CardHeader>
                <CardContent className="space-y-3">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                </CardContent>
              </Card>
            </div>
          </div>
        ) : listing ? (
          /* Listing Details */
          <div className="max-w-4xl mx-auto grid gap-8 md:grid-cols-3">
            {/* Bagian Kiri: Gambar, Detail, Deskripsi */}
            <div className="md:col-span-2 space-y-6">
              <Card className="overflow-hidden border-border/50 bg-card/60 backdrop-blur-md shadow-lg">
                <div className="aspect-video w-full bg-muted/20 relative flex items-center justify-center border-b border-border/50">
                  <Package className="h-20 w-20 text-muted-foreground/30" />
                  <div className="absolute top-4 right-4 flex gap-2">
                    <Badge variant={listing.status === 'SOLD' ? 'secondary' : 'default'} className="text-sm shadow-md">
                      {listing.status || 'AVAILABLE'}
                    </Badge>
                  </div>
                </div>
                <CardHeader className="pb-4">
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    <Badge variant="outline" className="border-primary/20 text-primary bg-primary/5 uppercase tracking-wider text-xs">
                      {listing.condition}
                    </Badge>
                    <span className="flex items-center text-sm text-muted-foreground">
                      <Clock className="mr-1.5 h-3.5 w-3.5" />
                      Dibuat {formatDate(listing.createdAt)}
                    </span>
                  </div>
                  <CardTitle className="text-3xl lg:text-4xl font-display font-bold leading-tight">
                    {listing.title}
                  </CardTitle>
                  <div className="text-3xl font-bold text-primary mt-4">
                    {formatRupiah(listing.price)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    <h3 className="text-lg font-semibold mb-2">Deskripsi Produk</h3>
                    <p className="whitespace-pre-line text-muted-foreground text-base leading-relaxed">
                      {listing.description || 'Tidak ada deskripsi.'}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Bagian Kanan: Seller Info & Actions */}
            <div className="space-y-6">
              <Card className="border-border/50 bg-card/60 backdrop-blur-md shadow-md sticky top-24">
                <CardHeader className="pb-4 border-b border-border/30">
                  <CardTitle className="text-lg">Informasi Penjual</CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-5 flex flex-col items-center sm:items-start text-center sm:text-left">
                  
                  <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 w-full">
                    <div className="h-16 w-16 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                      <User className="h-8 w-8 text-primary" />
                    </div>
                    <div className="space-y-1">
                      <p className="font-semibold text-lg">{listing.sellerUsername || 'Anonim'}</p>
                      <div className="flex items-center justify-center sm:justify-start text-sm text-muted-foreground">
                        <MapPin className="mr-1.5 h-4 w-4 shrink-0" />
                        <span>{listing.location || 'Tidak ada lokasi'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="w-full space-y-3 pt-4 border-t border-border/30">
                    <div className="flex items-center gap-3 text-sm">
                      <div className={`h-8 w-8 rounded-full flex items-center justify-center ${listing.allowOffers ? 'bg-emerald-500/10 text-emerald-500' : 'bg-muted text-muted-foreground'}`}>
                        <Handshake className="h-4 w-4" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{listing.allowOffers ? 'Nego Diperbolehkan' : 'Harga Pas (No Nego)'}</p>
                        <p className="text-xs text-muted-foreground">Opsi tawar-menawar</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <div className={`h-8 w-8 rounded-full flex items-center justify-center ${listing.allowCod ? 'bg-emerald-500/10 text-emerald-500' : 'bg-muted text-muted-foreground'}`}>
                        <Truck className="h-4 w-4" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{listing.allowCod ? 'Menerima COD' : 'Tidak Menerima COD'}</p>
                        <p className="text-xs text-muted-foreground">Metode pengiriman</p>
                      </div>
                    </div>
                  </div>

                  <div className="w-full pt-4">
                    <Button className="w-full h-12 text-base font-semibold hover:glow-primary" disabled={listing.status === 'SOLD'}>
                      {listing.status === 'SOLD' ? 'Barang Terjual' : 'Hubungi Penjual'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : null}
      </main>
    </div>
  )
}
