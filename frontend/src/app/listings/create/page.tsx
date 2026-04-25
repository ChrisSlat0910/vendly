'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { AlertCircle, ArrowLeft, Loader2, PackagePlus } from 'lucide-react'

import { listingsApi } from '@/lib/api/listings'
import { useAuth } from '@/lib/auth-context'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Alert, AlertDescription } from '@/components/ui/alert'
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

export default function CreateListingPage() {
  const router = useRouter()
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
  const [allowCod, setAllowCod] = useState(false)
  const [allowOffers, setAllowOffers] = useState(false)

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  if (isInitializing || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!title || price === '' || price < 0) {
      setError('Mohon lengkapi judul dan pastikan harga valid.')
      return
    }

    try {
      setIsLoading(true)
      
      const payload = {
        title,
        description,
        price: Number(price),
        condition,
        location,
        allowCod,
        allowOffers,
      }

      // 1. Buat listing (biasanya awalnya PENDING / DRAFT tergantung backend)
      const createdData = await listingsApi.create(payload)

      // 2. Apabila berhasil, langsung tembak update ke ACTIVE seperti requirement
      if (createdData && createdData.id) {
        await listingsApi.update(createdData.id, { status: 'ACTIVE' })
      }

      // 3. Redirect ke dashboard
      router.push('/dashboard')
    } catch (err: any) {
      console.error('Failed to create listing:', err)
      setError(err.response?.data?.message || 'Gagal membuat listing. Pastikan data yang diisi benar dan coba lagi.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background pb-12">
      {/* Navbar Minimalis */}
      <nav className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center px-4">
          <Link href="/" className="flex items-center gap-2">
            <span className="font-display text-2xl font-bold tracking-tight text-primary">
              Vendly
            </span>
          </Link>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="mb-6">
          <Button asChild variant="ghost" className="gap-2 -ml-4 hover:bg-transparent hover:text-primary">
            <Link href="/dashboard">
              <ArrowLeft className="h-4 w-4" />
              Kembali ke Dashboard
            </Link>
          </Button>
        </div>

        <Card className="border-border/50 bg-card/60 backdrop-blur-md shadow-lg">
          <CardHeader className="space-y-1 pb-6 border-b border-border/30">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-12 w-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                <PackagePlus className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-2xl font-display">Buat Listing Baru</CardTitle>
            </div>
            <CardDescription className="text-base ml-14">
              Silakan isi detail barang atau jasa yang ingin Anda tawarkan kepada komunitas.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-8">
            <form id="create-listing-form" onSubmit={handleSubmit} className="space-y-6">
              
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
                  placeholder="Contoh: Honda Civic Type R 2020, Kartu Charizard Holo"
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
                      <SelectItem value="NEW">Baru (New)</SelectItem>
                      <SelectItem value="LIKE_NEW">Seperti Baru (Like New)</SelectItem>
                      <SelectItem value="GOOD">Baik (Good)</SelectItem>
                      <SelectItem value="FAIR">Cukup (Fair)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Location */}
              <div className="space-y-2.5">
                <Label htmlFor="location" className="text-base">Lokasi (Opsional)</Label>
                <Input
                  id="location"
                  placeholder="Contoh: Jakarta Selatan, Surabaya..."
                  className="h-12 text-base bg-background/50"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>

              {/* Description */}
              <div className="space-y-2.5">
                <Label htmlFor="description" className="text-base">Deskripsi Tambahan (Opsional)</Label>
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
                        Pembeli bisa melakukan Cash on Delivery.
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
            <Button asChild variant="outline" className="w-full sm:w-auto h-12" disabled={isLoading}>
              <Link href="/dashboard">Batal</Link>
            </Button>
            <Button 
              type="submit" 
              form="create-listing-form" 
              className="w-full sm:w-auto h-12 hover:glow-primary" 
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                'Buat Listing Sekarang'
              )}
            </Button>
          </CardFooter>
        </Card>
      </main>
    </div>
  )
}
