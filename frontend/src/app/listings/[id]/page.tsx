'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, MapPin, Clock, User, Handshake, Truck, AlertCircle } from 'lucide-react'
import Image from 'next/image'
import { motion, Variants } from 'framer-motion'
import { getListingImage } from '@/lib/listing-image'
import { ThemeToggle } from '@/components/ThemeToggle'

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', damping: 22, stiffness: 120 } },
}

const slideLeft: Variants = {
  hidden: { opacity: 0, x: -24 },
  show: {
    opacity: 1,
    x: 0,
    transition: { type: 'spring', damping: 22, stiffness: 120, delay: 0.1 },
  },
}

const slideRight: Variants = {
  hidden: { opacity: 0, x: 24 },
  show: {
    opacity: 1,
    x: 0,
    transition: { type: 'spring', damping: 22, stiffness: 120, delay: 0.2 },
  },
}

const stagger: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.12 } },
}

import { listingsApi } from '@/lib/api/listings'
import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
  sellerId: string
  allowCod: boolean
  allowOffers: boolean
  createdAt: string
}

export default function ListingDetailPage() {
  const router = useRouter()
  const params = useParams()
  const id = params?.id as string
  const { user } = useAuth()

  const [listing, setListing] = useState<ListingDetail | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchListing = async () => {
      if (!id) return
      try {
        setIsLoading(true)
        setError('')
        console.log('Fetching listing:', id)
        const data = await listingsApi.getById(id)
        console.log('Listing data:', data)
        setListing(data)
      } catch (err: unknown) {
        const e = err as { response?: { data?: { message?: string } } }
        console.error('Error fetching:', e)
        setError(
          e.response?.data?.message || 'Listing tidak ditemukan atau terjadi kesalahan server.'
        )
      } finally {
        setIsLoading(false)
      }
    }
    fetchListing()
  }, [id])

  const formatRupiah = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price)
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return '-'
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(new Date(dateString))
  }

  const handleContactSeller = () => {
    if (!user) {
      router.push(`/login?redirect=/listings/${id}`)
      return
    }
  }

  const isOwner = user && listing && user.id === listing.sellerId

  return (
    <div className="min-h-screen bg-background pb-12">
      <nav className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <span className="font-display text-2xl font-bold tracking-tight text-primary">
              Vendly
            </span>
          </Link>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            {user ? (
              <Button asChild variant="ghost">
                <Link href="/dashboard">Dashboard</Link>
              </Button>
            ) : (
              <Button asChild>
                <Link href="/login">Sign In</Link>
              </Button>
            )}
          </div>
        </div>
      </nav>

      <motion.main
        className="container mx-auto px-4 py-8"
        initial="hidden"
        animate="show"
        variants={stagger}
      >
        <motion.div variants={fadeUp} className="mb-6">
          <Button
            asChild
            variant="ghost"
            className="gap-2 -ml-4 hover:bg-transparent hover:text-primary"
          >
            <Link href="/listings">
              <ArrowLeft className="h-4 w-4" />
              Kembali ke Browse
            </Link>
          </Button>
        </motion.div>

        {error ? (
          <div className="max-w-2xl mx-auto mt-12">
            <Alert variant="destructive" className="bg-destructive/10 text-destructive border-none">
              <AlertCircle className="h-5 w-5" />
              <AlertTitle className="text-lg">Oh tidak!</AlertTitle>
              <AlertDescription className="text-base mt-2">{error}</AlertDescription>
            </Alert>
            <div className="mt-6 text-center">
              <Button asChild>
                <Link href="/listings">Kembali ke Daftar Listing</Link>
              </Button>
            </div>
          </div>
        ) : isLoading ? (
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
              </Card>
            </div>
            <div>
              <Card>
                <CardHeader>
                  <Skeleton className="h-6 w-1/2 mb-2" />
                </CardHeader>
              </Card>
            </div>
          </div>
        ) : listing ? (
          <div className="max-w-4xl mx-auto grid gap-8 md:grid-cols-3">
            <motion.div
              variants={slideLeft}
              initial="hidden"
              animate="show"
              className="md:col-span-2 space-y-6"
            >
              <Card className="overflow-hidden border-border/50 bg-card/60 backdrop-blur-md shadow-lg">
                <div className="relative w-full aspect-video overflow-hidden rounded-t-xl bg-muted/20 border-b border-border/50">
                  <Image
                    src={getListingImage(listing.title)}
                    alt={listing.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 60vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
                  <div className="absolute top-4 right-4 flex gap-2 z-10">
                    <Badge variant={listing.status === 'SOLD' ? 'secondary' : 'default'}>
                      {listing.status}
                    </Badge>
                  </div>
                </div>
                <CardHeader className="pb-4">
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    <Badge
                      variant="outline"
                      className="border-primary/20 text-primary bg-primary/5 uppercase tracking-wider text-xs"
                    >
                      {listing.condition}
                    </Badge>
                    {listing.allowCod && (
                      <Badge
                        variant="outline"
                        className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-xs"
                      >
                        <Truck className="mr-1 h-3 w-3" /> COD
                      </Badge>
                    )}
                    {listing.allowOffers && (
                      <Badge
                        variant="outline"
                        className="bg-blue-500/10 text-blue-600 border-blue-500/20 text-xs"
                      >
                        <Handshake className="mr-1 h-3 w-3" /> NEGO
                      </Badge>
                    )}
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
                  <h3 className="text-lg font-semibold mb-2">Deskripsi Produk</h3>
                  <p className="whitespace-pre-line text-muted-foreground text-base leading-relaxed">
                    {listing.description || 'Tidak ada deskripsi.'}
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              variants={slideRight}
              initial="hidden"
              animate="show"
              className="space-y-6"
            >
              <Card className="border-border/50 bg-card/60 backdrop-blur-md shadow-md sticky top-24">
                <CardHeader className="pb-4 border-b border-border/30">
                  <CardTitle className="text-lg">Informasi Penjual</CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-5">
                  <div className="flex items-center gap-4">
                    <div className="h-16 w-16 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                      <User className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-lg">{listing.sellerUsername || 'Anonim'}</p>
                      {listing.location && (
                        <div className="flex items-center text-sm text-muted-foreground mt-1">
                          <MapPin className="mr-1.5 h-4 w-4 shrink-0" />
                          <span>{listing.location}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-3 pt-4 border-t border-border/30">
                    <div className="flex items-center gap-3 text-sm">
                      <div
                        className={`h-8 w-8 rounded-full flex items-center justify-center ${listing.allowOffers ? 'bg-emerald-500/10 text-emerald-500' : 'bg-muted text-muted-foreground'}`}
                      >
                        <Handshake className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-medium">
                          {listing.allowOffers ? 'Nego Diperbolehkan' : 'Harga Pas'}
                        </p>
                        <p className="text-xs text-muted-foreground">Opsi tawar-menawar</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <div
                        className={`h-8 w-8 rounded-full flex items-center justify-center ${listing.allowCod ? 'bg-emerald-500/10 text-emerald-500' : 'bg-muted text-muted-foreground'}`}
                      >
                        <Truck className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-medium">
                          {listing.allowCod ? 'Menerima COD' : 'Tidak COD'}
                        </p>
                        <p className="text-xs text-muted-foreground">Metode pengiriman</p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 space-y-2">
                    {isOwner ? (
                      <>
                        <Button asChild className="w-full" variant="outline">
                          <Link href={`/listings/edit/${listing.id}`}>Edit Listing</Link>
                        </Button>
                        <Button asChild className="w-full" variant="ghost">
                          <Link href="/dashboard">Kembali ke Dashboard</Link>
                        </Button>
                      </>
                    ) : (
                      <Button
                        className="w-full h-12 text-base font-semibold"
                        disabled={listing.status === 'SOLD'}
                        onClick={handleContactSeller}
                      >
                        {listing.status === 'SOLD' ? 'Barang Terjual' : 'Hubungi Penjual'}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        ) : null}
      </motion.main>
    </div>
  )
}
