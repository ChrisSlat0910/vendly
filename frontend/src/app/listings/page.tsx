'use client'

import { useEffect, useState, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Search, MapPin, Package, ArrowRight, User, Truck, Handshake, Loader2 } from 'lucide-react'
import Image from 'next/image'
import { motion, Variants } from 'framer-motion'
import { getListingImage } from '@/lib/listing-image'
import { ThemeToggle } from '@/components/ThemeToggle'

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', damping: 22, stiffness: 120 } }
}

const stagger: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.07 } }
}

import { listingsApi } from '@/lib/api/listings'
import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'

interface Listing {
  id: string
  title: string
  price: number
  condition: string
  status: string
  location: string
  allowCod: boolean
  allowOffers: boolean
  sellerUsername: string
  description: string
}

const CONDITION_FILTERS = [
  { value: 'ALL', label: 'Semua' },
  { value: 'NEW', label: 'Baru' },
  { value: 'LIKE_NEW', label: 'Seperti Baru' },
  { value: 'GOOD', label: 'Bagus' },
  { value: 'FAIR', label: 'Cukup' },
]

function BrowseListingsContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, isInitializing } = useAuth()

  const [listings, setListings] = useState<Listing[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const initialKeyword = searchParams.get('keyword') || ''
  const initialCondition = searchParams.get('condition') || 'ALL'

  const [searchKeyword, setSearchKeyword] = useState(initialKeyword)
  const [currentKeyword, setCurrentKeyword] = useState(initialKeyword)
  const [currentCondition, setCurrentCondition] = useState(initialCondition)

  const fetchListings = async (keyword: string, condition: string) => {
    try {
      setIsLoading(true)
      const data = await listingsApi.browse({
        keyword: keyword || undefined,
        condition: condition !== 'ALL' ? condition : undefined,
      })
      setListings(data.content || data || [])
    } catch (err) {
      console.error('Failed to fetch listings:', err)
      setListings([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const keyword = searchParams.get('keyword') || ''
    const condition = searchParams.get('condition') || 'ALL'
    setCurrentKeyword(keyword)
    setSearchKeyword(keyword)
    setCurrentCondition(condition)
    fetchListings(keyword, condition)
  }, [searchParams])

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    updateUrlParams(searchKeyword, currentCondition)
  }

  const handleConditionSelect = (conditionValue: string) => {
    updateUrlParams(currentKeyword, conditionValue)
  }

  const updateUrlParams = (keyword: string, condition: string) => {
    const params = new URLSearchParams()
    if (keyword) params.set('keyword', keyword)
    if (condition && condition !== 'ALL') params.set('condition', condition)
    const category = searchParams.get('category')
    if (category) params.set('category', category)
    router.push(`/listings?${params.toString()}`)
  }

  const formatRupiah = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price)
  }

  return (
    <motion.div className="min-h-screen bg-background" initial="hidden" animate="show" variants={stagger}>
      <nav className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <span className="font-display text-2xl font-bold tracking-tight text-primary">
              Vendly
            </span>
          </Link>
          <div className="flex items-center gap-2 sm:gap-4">
            <ThemeToggle />
            {isInitializing ? (
              <div className="flex gap-2">
                <Skeleton className="h-9 w-20 rounded-md" />
                <Skeleton className="h-9 w-24 rounded-md" />
              </div>
            ) : user ? (
              <>
                <Button
                  asChild
                  variant="ghost"
                  className="text-muted-foreground hidden sm:inline-flex"
                >
                  <Link href="/dashboard">Dashboard</Link>
                </Button>
                <Button asChild>
                  <Link href="/listings/create">Buat Listing</Link>
                </Button>
              </>
            ) : (
              <>
                <Button
                  asChild
                  variant="ghost"
                  className="text-muted-foreground hidden sm:inline-flex"
                >
                  <Link href="/login">Sign In</Link>
                </Button>
                <Button asChild>
                  <Link href="/register">Daftar</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        <motion.div variants={fadeUp} className="mb-8 space-y-6">
          <div className="text-center md:text-left">
            <h1 className="text-4xl font-display font-bold tracking-tight">Browse Listing</h1>
            <div className="mt-2 text-muted-foreground max-w-2xl text-lg">
              Temukan barang menarik dari komunitas! Gunakan pencarian di bawah untuk mencari
              berdasarkan kata kunci.
            </div>
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

          <div className="flex flex-wrap gap-2 pt-2">
            {CONDITION_FILTERS.map((filter) => {
              const isActive = currentCondition === filter.value
              return (
                <button
                  key={filter.value}
                  onClick={() => handleConditionSelect(filter.value)}
                  className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                  }`}
                >
                  {filter.label}
                </button>
              )
            })}
          </div>
        </motion.div>

        <motion.div variants={fadeUp} className="mb-6 flex flex-col sm:flex-row justify-between text-muted-foreground font-medium">
          <div>
            {isLoading ? (
              <Skeleton className="h-5 w-40" />
            ) : (
              `Menampilkan ${listings.length} listing`
            )}
          </div>
          {currentKeyword && !isLoading && (
            <div>
              hasil untuk:{' '}
              <span className="font-bold text-foreground">&quot;{currentKeyword}&quot;</span>
            </div>
          )}
        </motion.div>

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
                    <Skeleton className="h-5 w-16" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </CardContent>
                <CardFooter className="p-4 pt-0 mt-3">
                  <Skeleton className="h-10 w-full" />
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : listings.length === 0 ? (
          <Card className="border-dashed bg-transparent p-12 text-center text-muted-foreground mt-6">
            <Package className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
            <h3 className="text-xl font-medium text-foreground mb-2">
              Tidak ada listing ditemukan
            </h3>
            <div className="text-sm mb-6 max-w-md mx-auto">
              Maaf, kami tidak dapat menemukan barang yang sesuai dengan pencarian Anda. Silakan
              coba kata kunci atau filter lain.
            </div>
            {(currentKeyword || currentCondition !== 'ALL') && (
              <Button variant="outline" onClick={() => updateUrlParams('', 'ALL')}>
                Hapus Filter Pencarian
              </Button>
            )}
          </Card>
        ) : (
          <motion.div variants={stagger} initial="hidden" animate="show" className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {listings.map((item) => (
              <motion.div
                key={item.id}
                variants={fadeUp}
                whileHover={{ y: -5, scale: 1.01 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: 'spring', stiffness: 280, damping: 20 }}
              >
              <Card
                className="flex flex-col h-full overflow-hidden bg-card/60 border-border/50 backdrop-blur-md transition-all hover:border-primary/30 hover:shadow-xl group"
              >
                <div className="aspect-square sm:aspect-video w-full relative overflow-hidden bg-muted/20">
                  <Image
                    src={getListingImage(item.title)}
                    alt={item.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
                  <div className="absolute top-3 right-3 flex flex-col gap-1.5 items-end">
                    <Badge
                      variant={item.status === 'SOLD' ? 'secondary' : 'default'}
                      className="shadow-sm"
                    >
                      {item.status || 'AVAILABLE'}
                    </Badge>
                  </div>
                </div>


                <CardHeader className="p-4 pb-2">
                  <div className="mb-2 flex flex-wrap gap-1.5">
                    <Badge
                      variant="outline"
                      className="text-[10px] tracking-wider uppercase border-primary/20 text-primary bg-primary/5"
                    >
                      {item.condition}
                    </Badge>
                    {item.allowCod && (
                      <Badge
                        variant="outline"
                        className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[10px]"
                      >
                        <Truck className="mr-1 h-3 w-3" /> COD
                      </Badge>
                    )}
                    {item.allowOffers && (
                      <Badge
                        variant="outline"
                        className="bg-blue-500/10 text-blue-600 border-blue-500/20 text-[10px]"
                      >
                        <Handshake className="mr-1 h-3 w-3" /> NEGO
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="line-clamp-2 text-lg leading-tight" title={item.title}>
                    {item.title}
                  </CardTitle>
                  <div className="text-xl font-bold text-primary mt-2">
                    {formatRupiah(item.price)}
                  </div>
                </CardHeader>

                <CardContent className="p-4 pt-0 flex-grow space-y-2">
                  <div className="flex items-center text-xs text-muted-foreground font-medium">
                    <User className="mr-1.5 h-3.5 w-3.5" />
                    <span className="truncate">{item.sellerUsername || 'Anonim'}</span>
                  </div>
                  {item.location && (
                    <div className="flex items-center text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3 mr-1" />
                      <span className="truncate max-w-[150px]">{item.location}</span>
                    </div>
                  )}
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
              </motion.div>
            ))}
          </motion.div>
        )}
      </main>
    </motion.div>
  )
}

export default function BrowseListingsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-background">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }
    >
      <BrowseListingsContent />
    </Suspense>
  )
}
