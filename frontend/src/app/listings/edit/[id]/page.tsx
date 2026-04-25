'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { AlertCircle, ArrowLeft, Loader2, PackagePlus, Package, MapPin, Truck, Handshake, User, Edit3 } from 'lucide-react'
import { motion, Variants } from 'framer-motion'
import { ThemeToggle } from '@/components/ThemeToggle'

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', damping: 22, stiffness: 120 } }
}

const slideLeft: Variants = {
  hidden: { opacity: 0, x: -28 },
  show: { opacity: 1, x: 0, transition: { type: 'spring', damping: 22, stiffness: 120, delay: 0.05 } }
}

const slideRight: Variants = {
  hidden: { opacity: 0, x: 28 },
  show: { opacity: 1, x: 0, transition: { type: 'spring', damping: 22, stiffness: 120, delay: 0.15 } }
}

const stagger: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
}

import { listingsApi } from '@/lib/api/listings'
import { useAuth } from '@/lib/auth-context'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export default function EditListingPage() {
  const router = useRouter()
  const params = useParams()
  const id = params?.id as string

  const { user, isInitializing } = useAuth()

  // Validasi user auth
  useEffect(() => {
    if (!isInitializing && !user) {
      router.push('/login')
    }
  }, [user, isInitializing, router])

  // Form states
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState<number | ''>('')
  const [condition, setCondition] = useState('NEW')
  const [location, setLocation] = useState('')
  const [status, setStatus] = useState('DRAFT')
  const [allowCod, setAllowCod] = useState(false)
  const [allowOffers, setAllowOffers] = useState(false)

  // Status & Fetch
  const [isFetching, setIsFetching] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [notFound, setNotFound] = useState(false)

  // Ambil data listing
  useEffect(() => {
    if (!id || !user) return

    const fetchListing = async () => {
      try {
        setIsFetching(true)
        setError('')
        const data = await listingsApi.getById(id)
        
        // Pengecekan otorisasi
        if (data.sellerId !== user.id) {
          router.push('/dashboard')
          return
        }

        setTitle(data.title || '')
        setDescription(data.description || '')
        setPrice(data.price || '')
        setCondition(data.condition || 'NEW')
        setLocation(data.location || '')
        setStatus(data.status || 'DRAFT')
        setAllowCod(data.allowCod ?? false)
        setAllowOffers(data.allowOffers ?? false)
      } catch (err: any) {
        console.error('Failed to fetch listing for edit:', err)
        setNotFound(true)
        setError(err.response?.data?.message || 'Listing tidak ditemukan atau terjadi kesalahan server.')
      } finally {
        setIsFetching(false)
      }
    }

    fetchListing()
  }, [id, user, router])

  if (isInitializing || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  const formatRupiah = (p: number | string) => {
    if (!p) return 'Rp 0'
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(Number(p))
  }

  const getConditionLabel = (cond: string) => {
    switch (cond) {
      case 'NEW': return 'Baru'
      case 'LIKE_NEW': return 'Seperti Baru'
      case 'GOOD': return 'Bagus'
      case 'FAIR': return 'Cukup'
      default: return cond
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!title || price === '' || price < 0) {
      setError('Mohon lengkapi judul dan pastikan harga valid.')
      return
    }

    try {
      setIsSubmitting(true)
      
      const payload = {
        title,
        description,
        price: Number(price),
        condition,
        location,
        status,
        allowCod,
        allowOffers,
      }

      await listingsApi.update(id, payload)
      router.push('/dashboard')
    } catch (err: any) {
      console.error('Failed to update listing:', err)
      setError(err.response?.data?.message || 'Gagal menyimpan perubahan. Coba lagi nanti.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isFetching) {
    return (
      <div className="min-h-screen bg-background pb-12">
        <nav className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container mx-auto flex h-16 items-center px-4">
            <Link href="/" className="flex items-center gap-2">
              <span className="font-display text-2xl font-bold tracking-tight text-primary">Vendly</span>
            </Link>
          </div>
        </nav>
        <main className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <Skeleton className="h-10 w-32" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            <div className="lg:col-span-3 space-y-6">
              <Skeleton className="h-64 w-full rounded-xl" />
              <Skeleton className="h-[400px] w-full rounded-xl" />
            </div>
            <div className="lg:col-span-2 space-y-4">
              <Skeleton className="h-10 w-48" />
              <Skeleton className="h-[500px] w-full rounded-xl" />
            </div>
          </div>
        </main>
      </div>
    )
  }

  if (notFound) {
    return (
      <div className="min-h-screen bg-background pb-12 flex flex-col items-center justify-center">
        <div className="max-w-md text-center p-6 border border-border/50 bg-card rounded-xl shadow-lg">
          <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Listing Tidak Ditemukan</h2>
          <p className="text-muted-foreground mb-6">{error}</p>
          <Button asChild>
            <Link href="/dashboard">Kembali ke Dashboard</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background pb-12">
      {/* Navbar Minimalis */}
      <nav className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <span className="font-display text-2xl font-bold tracking-tight text-primary">
              Vendly
            </span>
          </Link>
          <ThemeToggle />
        </div>
      </nav>

      <motion.main
        className="container mx-auto px-4 py-8"
        initial="hidden"
        animate="show"
        variants={stagger}
      >
        <motion.div variants={fadeUp} className="mb-6">
          <Button asChild variant="ghost" className="gap-2 -ml-4 hover:bg-transparent hover:text-primary">
            <Link href="/dashboard">
              <ArrowLeft className="h-4 w-4" />
              Kembali ke Dashboard
            </Link>
          </Button>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          
          {/* KOLOM KIRI: FORM CONFIG (60%) */}
          <motion.div variants={slideLeft} className="lg:col-span-3">
            <Card className="border-border/50 bg-card/60 backdrop-blur-md shadow-lg">
              <CardHeader className="space-y-1 pb-6 border-b border-border/30">
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-12 w-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                    <Edit3 className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-2xl font-display">Edit Listing</CardTitle>
                </div>
                <CardDescription className="text-base ml-14">
                  Perbarui informasi barang atau jasa Anda untuk tetap relevan.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-8">
                <form id="edit-listing-form" onSubmit={handleSubmit} className="space-y-6">
                  
                  {error && (
                    <Alert variant="destructive" className="bg-destructive/10 text-destructive border-none">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  {/* Title */}
                  <div className="space-y-2.5">
                    <Label htmlFor="title" className="text-base">Judul / Nama Barang <span className="text-destructive">*</span></Label>
                    <Input
                      id="title"
                      placeholder="Contoh: Honda Civic Type R 2020..."
                      className="h-12 text-base bg-background/50"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Price */}
                    <div className="space-y-2.5">
                      <Label htmlFor="price" className="text-base">Harga (Rp) <span className="text-destructive">*</span></Label>
                      <Input
                        id="price"
                        type="number"
                        min="0"
                        step="1"
                        placeholder="Contoh: 1500000"
                        className="h-12 text-base bg-background/50"
                        value={price}
                        onChange={(e) => setPrice(e.target.value ? Number(e.target.value) : '')}
                        required
                      />
                    </div>

                    {/* Condition */}
                    <div className="space-y-2.5">
                      <Label htmlFor="condition" className="text-base">Kondisi Barang <span className="text-destructive">*</span></Label>
                      <Select value={condition} onValueChange={setCondition} required>
                        <SelectTrigger id="condition" className="h-12 text-base bg-background/50">
                          <SelectValue placeholder="Pilih kondisi..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="NEW">Baru</SelectItem>
                          <SelectItem value="LIKE_NEW">Seperti Baru</SelectItem>
                          <SelectItem value="GOOD">Bagus</SelectItem>
                          <SelectItem value="FAIR">Cukup</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Status */}
                    <div className="space-y-2.5">
                      <Label htmlFor="status" className="text-base">Status Listing</Label>
                      <Select value={status} onValueChange={setStatus} required>
                        <SelectTrigger id="status" className="h-12 text-base bg-background/50">
                          <SelectValue placeholder="Pilih status..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="DRAFT">Draft</SelectItem>
                          <SelectItem value="ACTIVE">Aktif (Tampil)</SelectItem>
                          <SelectItem value="SOLD">Terjual</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Location */}
                    <div className="space-y-2.5">
                      <Label htmlFor="location" className="text-base">Lokasi</Label>
                      <Input
                        id="location"
                        placeholder="Contoh: Jakarta Selatan, Surabaya..."
                        className="h-12 text-base bg-background/50"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Description */}
                  <div className="space-y-2.5">
                    <Label htmlFor="description" className="text-base">Deskripsi Tambahan</Label>
                    <Textarea
                      id="description"
                      placeholder="Jelaskan detail barang, kelengkapan, minus, atau alasan dijual secara spesifik..."
                      className="min-h-[120px] text-base resize-y bg-background/50"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </div>

                  {/* Switches Container */}
                  <div className="space-y-4 pt-4 border-t border-border/30">
                    <h3 className="text-lg font-medium">Pengaturan Ekstra</h3>
                    <div className="grid sm:grid-cols-2 gap-4">
                      {/* Allow Offers Toggle */}
                      <div className="flex flex-row items-center justify-between rounded-xl border border-border/50 bg-background/40 p-4">
                        <div className="space-y-1">
                          <Label htmlFor="allowOffers" className="text-base cursor-pointer">Bisa Nego</Label>
                          <p className="text-sm text-muted-foreground mr-2">
                            Izinkan pembeli untuk menawar.
                          </p>
                        </div>
                        <Switch
                          id="allowOffers"
                          checked={allowOffers}
                          onCheckedChange={setAllowOffers}
                        />
                      </div>

                      {/* Allow COD Toggle */}
                      <div className="flex flex-row items-center justify-between rounded-xl border border-border/50 bg-background/40 p-4">
                        <div className="space-y-1">
                          <Label htmlFor="allowCod" className="text-base cursor-pointer">Terima COD</Label>
                          <p className="text-sm text-muted-foreground mr-2">
                            Pembeli bisa bayar di tempat.
                          </p>
                        </div>
                        <Switch
                          id="allowCod"
                          checked={allowCod}
                          onCheckedChange={setAllowCod}
                        />
                      </div>
                    </div>
                  </div>

                </form>
              </CardContent>
              <CardFooter className="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t border-border/30 bg-card/40 mt-2 p-6">
                <Button asChild variant="outline" className="w-full sm:w-auto h-12" disabled={isSubmitting}>
                  <Link href="/dashboard">Batal</Link>
                </Button>
                <Button 
                  type="submit" 
                  form="edit-listing-form" 
                  className="w-full sm:w-auto h-12 hover:glow-primary" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Memperbarui...
                    </>
                  ) : (
                    'Simpan Perubahan'
                  )}
                </Button>
              </CardFooter>
            </Card>
          </motion.div>

          {/* KOLOM KANAN: LIVE PREVIEW (40%) */}
          <motion.div variants={slideRight} className="lg:col-span-2 space-y-4 lg:sticky lg:top-24 h-fit">
            <div className="flex items-center justify-between pl-1">
              <h2 className="text-xl font-display font-semibold text-foreground/80">Preview Listing</h2>
            </div>
            
            <Tabs defaultValue="card" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="card">Card View</TabsTrigger>
                <TabsTrigger value="detail">Detail View</TabsTrigger>
              </TabsList>
              
              <TabsContent value="card" className="mt-4">
                {/* PREVIEW BROWSE CARD */}
                <Card className="flex flex-col overflow-hidden bg-card/60 border-border/50 backdrop-blur-md shadow-lg group">
                  <div className="aspect-square sm:aspect-video w-full bg-muted/20 relative flex items-center justify-center overflow-hidden">
                    <Package className="h-12 w-12 text-muted-foreground/30 transition-transform group-hover:scale-110" />
                    <div className="absolute top-3 right-3 flex flex-col items-end gap-1.5">
                      <Badge variant={status === 'SOLD' ? 'secondary' : 'default'} className="shadow-sm">
                        {status || 'DRAFT'}
                      </Badge>
                    </div>
                  </div>
                  
                  <CardHeader className="p-4 pb-2">
                    <div className="mb-2 flex flex-wrap gap-1.5">
                      <Badge variant="outline" className="text-[10px] tracking-wider uppercase border-primary/20 text-primary bg-primary/5">
                        {getConditionLabel(condition)}
                      </Badge>
                      {allowCod && (
                        <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 border-emerald-500/20 text-[10px]">
                          <Truck className="mr-1 h-3 w-3" /> COD
                        </Badge>
                      )}
                      {allowOffers && (
                        <Badge variant="outline" className="bg-blue-500/10 text-blue-600 hover:bg-blue-500/20 border-blue-500/20 text-[10px]">
                          <Handshake className="mr-1 h-3 w-3" /> NEGO
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="line-clamp-2 text-lg leading-tight">
                      {title || 'Judul Listing...'}
                    </CardTitle>
                    <div className="text-xl font-bold text-primary mt-2">
                      {formatRupiah(price)}
                    </div>
                  </CardHeader>
                  
                  <CardContent className="p-4 pt-0 flex-grow space-y-3">
                    <div className="flex items-center text-xs text-muted-foreground font-medium">
                      <User className="mr-1.5 h-3.5 w-3.5" />
                      <span className="truncate">{user?.displayName || 'Anonim'}</span>
                    </div>
                    {(location || !title) && (
                      <div className="flex items-center text-xs text-muted-foreground">
                        <MapPin className="h-3 w-3 mr-1" />
                        <span className="truncate max-w-[150px]">{location || 'Lokasi...'}</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="detail" className="mt-4">
                {/* PREVIEW DETAIL PORTION */}
                <div className="space-y-4">
                  <Card className="overflow-hidden border-border/50 bg-card/60 backdrop-blur-md shadow-lg">
                    <div className="aspect-video w-full bg-muted/20 relative flex items-center justify-center border-b border-border/50">
                      <Package className="h-16 w-16 text-muted-foreground/30" />
                      <div className="absolute top-3 right-3 flex flex-col items-end gap-1.5">
                        <Badge variant={status === 'SOLD' ? 'secondary' : 'default'} className="text-xs shadow-md">
                          {status || 'DRAFT'}
                        </Badge>
                      </div>
                    </div>
                    <CardHeader className="p-4">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <Badge variant="outline" className="border-primary/20 text-primary bg-primary/5 uppercase tracking-wider text-[10px]">
                          {getConditionLabel(condition)}
                        </Badge>
                      </div>
                      <CardTitle className="text-xl font-display font-bold leading-tight">
                        {title || 'Judul Listing...'}
                      </CardTitle>
                      <div className="text-xl font-bold text-primary mt-2 flex flex-col gap-1">
                        {formatRupiah(price)}
                      </div>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <div className="prose prose-sm dark:prose-invert max-w-none">
                        <h3 className="text-sm font-semibold mb-1">Deskripsi Produk</h3>
                        <p className="whitespace-pre-line text-muted-foreground text-xs leading-relaxed max-h-40 overflow-y-auto pr-1 scrollbar-thin">
                          {description || 'Deskripsi listing akan tampil di sini...'}
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-border/50 bg-card/60 backdrop-blur-md shadow-md">
                    <CardHeader className="p-3 pb-2 border-b border-border/30">
                      <CardTitle className="text-sm">Informasi Penjual</CardTitle>
                    </CardHeader>
                    <CardContent className="p-3 space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                          <User className="h-5 w-5 text-primary" />
                        </div>
                        <div className="space-y-0.5 mt-1">
                          <p className="font-semibold text-sm leading-none">{user?.displayName || 'Anonim'}</p>
                          <div className="flex items-center text-xs text-muted-foreground mt-1">
                            <MapPin className="mr-1 h-3 w-3 shrink-0" />
                            <span>{location || 'Lokasi...'}</span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2 pt-3 border-t border-border/30">
                        <div className="flex items-center gap-2 text-xs">
                          <div className={`h-6 w-6 rounded-full flex items-center justify-center ${allowOffers ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20' : 'bg-muted text-muted-foreground border border-border'}`}>
                            <Handshake className="h-3 w-3" />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">{allowOffers ? 'Nego Diperbolehkan' : 'Harga Pas (No Nego)'}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                          <div className={`h-6 w-6 rounded-full flex items-center justify-center ${allowCod ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-muted text-muted-foreground border border-border'}`}>
                            <Truck className="h-3 w-3" />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">{allowCod ? 'Menerima COD' : 'Tidak Menerima COD'}</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </motion.div>

        </div>
      </motion.main>
    </div>
  )
}
