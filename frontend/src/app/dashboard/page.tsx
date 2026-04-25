'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import {
  LogOut,
  Plus,
  Search,
  Edit,
  Trash2,
  Package,
  AlertCircle,
  Eye,
  FileBox,
  CheckCircle2,
  CheckCircle,
  Star,
  Users,
  ShoppingBag,
  Calendar,
  Shield,
} from 'lucide-react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import Image from 'next/image'
import { motion, Variants } from 'framer-motion'
import { getListingImage } from '@/lib/listing-image'

const FADE_UP_ANIMATION_VARIANTS: Variants = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', damping: 20, stiffness: 100 } }
}

const STAGGER_CHILDREN_VARIANTS: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

import { useAuth } from '@/lib/auth-context'
import { listingsApi } from '@/lib/api/listings'
import apiClient from '@/lib/api/client'

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
import { Progress } from '@/components/ui/progress'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { ThemeToggle } from '@/components/ThemeToggle'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'

const dummyMessages = [
  { id: 1, sender: 'Budi Santoso', username: 'budisantoso', avatar: 'budisantoso', message: 'Halo kak, apakah Honda Civic masih available? Bisa COD di Jakarta Selatan?', listing: 'Honda Civic Type R 2020', time: '5 menit lalu', unread: true },
  { id: 2, sender: 'Siti Rahayu', username: 'sitirahayu', avatar: 'sitirahayu', message: 'Kak boleh minta video kondisi keyboard-nya? Terutama bagian switches-nya', listing: 'Razer Huntsman V3 Pro', time: '23 menit lalu', unread: true },
  { id: 3, sender: 'Andi Wijaya', username: 'andiwijaya', avatar: 'andiwijaya', message: 'Deal kak! Kapan bisa ketemu untuk transaksi PS5-nya?', listing: 'PS5 Console Disc Edition', time: '1 jam lalu', unread: true },
  { id: 4, sender: 'Maya Putri', username: 'mayaputri', avatar: 'mayaputri', message: 'Nego dikit boleh gak kak? Budget saya 18 juta untuk iPhone-nya', listing: 'iPhone 15 Pro Max', time: '2 jam lalu', unread: false },
  { id: 5, sender: 'Rizky Pratama', username: 'rizkypratama', avatar: 'rizkypratama', message: 'Terima kasih kak, sudah transfer. Ditunggu pengirimannya ya!', listing: 'Air Jordan 1 Chicago', time: '3 jam lalu', unread: false },
  { id: 6, sender: 'Dewi Lestari', username: 'dewilestari', avatar: 'dewilestari', message: 'Kak Supreme hoodie size L masih ada? Mau beli langsung', listing: 'Supreme Box Logo Hoodie', time: 'Kemarin', unread: false },
]

interface Listing {
  id: string
  title: string
  price: number
  condition: string
  status: string
  sellerId: string
}

export default function DashboardPage() {
  const router = useRouter()
  const { user, logout, isInitializing } = useAuth()
  const pathname = usePathname()
  const [listings, setListings] = useState<Listing[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [deleteId, setDeleteId] = useState<string | null>(null) // reserved for future use
  const [showLogoutDialog, setShowLogoutDialog] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    if (!isInitializing && user) {
      setIsLoading(true)
    }
  }, [pathname])

  useEffect(() => {
    if (!isInitializing && !user) {
      router.push('/login')
    } else if (user) {
      apiClient.get(`/admin/users/${user.id}/is-admin`)
        .then(res => setIsAdmin(res.data.data))
        .catch(() => setIsAdmin(false))
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
    if (user) {
      fetchMyListings()
    } else if (!isInitializing) {
      setIsLoading(false)
    }
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
    try {
      await listingsApi.delete(id)
      setListings((prev) => prev.filter((item) => item.id !== id))
    } catch {
      alert('Gagal menghapus listing.')
    }
  }

  const activeCount = listings.filter((l) => l.status === 'ACTIVE').length
  const draftCount = listings.filter((l) => l.status === 'DRAFT').length
  const soldCount = listings.filter((l) => l.status === 'SOLD').length

  const chartData = [
    { name: 'Sen', dilihat: 12, keranjang: 4, terjual: 1, dibatalkan: 0 },
    { name: 'Sel', dilihat: 19, keranjang: 6, terjual: 2, dibatalkan: 1 },
    { name: 'Rab', dilihat: 15, keranjang: 3, terjual: 1, dibatalkan: 0 },
    { name: 'Kam', dilihat: 28, keranjang: 9, terjual: 3, dibatalkan: 1 },
    { name: 'Jum', dilihat: 35, keranjang: 12, terjual: 4, dibatalkan: 0 },
    { name: 'Sab', dilihat: 42, keranjang: 15, terjual: 5, dibatalkan: 2 },
    { name: 'Min', dilihat: 38, keranjang: 11, terjual: 3, dibatalkan: 1 },
  ]

  return (
    <div className="min-h-screen bg-background">
      <nav className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <span className="font-display text-2xl font-bold tracking-tight text-primary">
              Vendly
            </span>
          </Link>
          <div className="flex items-center gap-2">
            <span className="hidden text-sm font-medium text-muted-foreground md:inline-block">
              {user.email}
            </span>
            <ThemeToggle />
            <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="icon" title="Logout">
                  <LogOut className="h-5 w-5 text-muted-foreground hover:text-destructive transition-colors" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Keluar dari Vendly?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Anda akan keluar dari akun ini. Pastikan semua pekerjaan sudah tersimpan.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Batal</AlertDialogCancel>
                  <AlertDialogAction onClick={() => logout()} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                    Ya, Keluar
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </nav>

      <motion.main 
        className="container mx-auto px-4 py-8"
        initial="hidden"
        animate="show"
        variants={STAGGER_CHILDREN_VARIANTS}
      >
        <motion.div variants={FADE_UP_ANIMATION_VARIANTS} className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-3xl font-display font-bold tracking-tight">
              Halo, {user.displayName}!
            </h1>
            <p className="text-muted-foreground mt-1">Selamat datang di dashboard penjual Anda.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            {isAdmin && (
              <Button asChild variant="outline" className="gap-2 border-destructive/50 text-destructive hover:bg-destructive/10">
                <Link href="/admin">
                  <Shield className="h-4 w-4" />
                  Admin Panel
                </Link>
              </Button>
            )}
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
        </motion.div>

        {error && (
          <Alert
            variant="destructive"
            className="mb-6 bg-destructive/10 text-destructive border-none"
          >
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* PROFILE & STATS SECTIONS */}
        <motion.div variants={FADE_UP_ANIMATION_VARIANTS} className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* KOLOM KIRI (1/3) */}
          <div className="lg:col-span-1 space-y-6">
            {/* PROFILE CARD */}
            <Card className="border-primary/20 bg-card/60 backdrop-blur-md shadow-lg relative overflow-hidden">
              <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
              <CardContent className="pt-8 px-6 pb-6 flex flex-col justify-between">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="relative">
                    <div className="h-24 w-24 rounded-full border-2 border-primary/50 p-1 flex items-center justify-center bg-background overflow-hidden relative">
                      <img
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.displayName?.replace(/\s+/g, '') || user.email}`}
                        alt="Avatar"
                        className="w-full h-full object-cover rounded-full"
                      />
                    </div>
                    <Badge className="absolute -bottom-2 -right-4 shadow-sm border border-background shadow-emerald-500/20 bg-emerald-500 text-white hover:bg-emerald-600 gap-1 px-1.5 py-0.5">
                      <CheckCircle className="h-3 w-3" />
                      <span className="text-[10px] leading-none uppercase tracking-wide">
                        Verified Seller
                      </span>
                    </Badge>
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold font-display">{user.displayName}</h2>
                    <p className="text-sm text-muted-foreground">
                      @{user.displayName?.toLowerCase().replace(/\s+/g, '') || 'username'}
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/30 px-3 py-1.5 rounded-full border border-border/50">
                    <Calendar className="h-3.5 w-3.5" />
                    Member since{' '}
                    {(user as { createdAt?: string }).createdAt
                      ? new Intl.DateTimeFormat('id-ID', { month: 'long', year: 'numeric' }).format(
                          new Date((user as { createdAt?: string }).createdAt!)
                        )
                      : 'April 2026'}
                  </div>

                  {/* Credit Score logic */}
                  <div className="w-full pt-4 space-y-1.5">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-semibold text-foreground/80">Credit Score</span>
                      <span className="font-bold text-primary">100 / 100</span>
                    </div>
                    <Progress value={100} className="h-2 bg-primary/20" />
                  </div>

                  <div className="w-full bg-card/50 rounded-xl p-3 border border-border/50 flex flex-col items-center justify-center space-y-1">
                    <div className="flex text-yellow-500 mb-0.5">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} className="h-4 w-4 fill-current" />
                      ))}
                    </div>
                    <span className="text-sm font-semibold">
                      0.0 <span className="text-muted-foreground font-normal">(0 ulasan)</span>
                    </span>
                  </div>

                  <div className="grid grid-cols-3 w-full divide-x divide-border/50 border-t border-border/50 pt-4 mt-2">
                    <div className="flex flex-col items-center justify-center gap-1">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="text-lg font-bold leading-none">1</span>
                      <span className="text-[10px] text-muted-foreground uppercase text-center">
                        Komunitas
                      </span>
                    </div>
                    <div className="flex flex-col items-center justify-center gap-1">
                      <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                      <span className="text-lg font-bold leading-none">0</span>
                      <span className="text-[10px] text-muted-foreground uppercase text-center">
                        Transaksi
                      </span>
                    </div>
                    <div className="flex flex-col items-center justify-center gap-1">
                      <Eye className="h-4 w-4 text-muted-foreground" />
                      <span className="text-lg font-bold leading-none">0</span>
                      <span className="text-[10px] text-muted-foreground uppercase text-center">
                        Pengikut
                      </span>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    className="w-full mt-2 bg-transparent border-primary/20 hover:bg-primary/5"
                    asChild
                  >
                    <Link href="/profile/edit">Edit Profil</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* NEW STATS (Vertical) */}
            <div className="grid gap-3">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} transition={{ type: 'spring', stiffness: 400, damping: 25 }}>
              <Card className="bg-card/60 backdrop-blur-md border-primary/20 shadow-sm flex items-center justify-between p-4 cursor-default">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-2 rounded-lg">
                    <Package className="h-4 w-4 text-primary" />
                  </div>
                  <span className="font-medium text-foreground text-sm">Total Listing</span>
                </div>
                <div className="text-xl font-display font-bold text-primary">
                  {isLoading ? <Skeleton className="h-6 w-8" /> : listings.length}
                </div>
              </Card>
              </motion.div>

              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} transition={{ type: 'spring', stiffness: 400, damping: 25 }}>
              <Card className="bg-card/60 backdrop-blur-md border-emerald-500/20 shadow-sm flex items-center justify-between p-4 cursor-default">
                <div className="flex items-center gap-3">
                  <div className="bg-emerald-500/10 p-2 rounded-lg">
                    <Eye className="h-4 w-4 text-emerald-500" />
                  </div>
                  <span className="font-medium text-foreground text-sm">Aktif</span>
                </div>
                <div className="text-xl font-display font-bold text-emerald-500">
                  {isLoading ? <Skeleton className="h-6 w-8" /> : activeCount}
                </div>
              </Card>
              </motion.div>

              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} transition={{ type: 'spring', stiffness: 400, damping: 25 }}>
              <Card className="bg-card/60 backdrop-blur-md border-yellow-500/20 shadow-sm flex items-center justify-between p-4 cursor-default">
                <div className="flex items-center gap-3">
                  <div className="bg-yellow-500/10 p-2 rounded-lg">
                    <FileBox className="h-4 w-4 text-yellow-500" />
                  </div>
                  <span className="font-medium text-foreground text-sm">Draft</span>
                </div>
                <div className="text-xl font-display font-bold text-yellow-500">
                  {isLoading ? <Skeleton className="h-6 w-8" /> : draftCount}
                </div>
              </Card>
              </motion.div>

              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} transition={{ type: 'spring', stiffness: 400, damping: 25 }}>
              <Card className="bg-card/60 backdrop-blur-md border-blue-500/20 shadow-sm flex items-center justify-between p-4 cursor-default">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-500/10 p-2 rounded-lg">
                    <CheckCircle2 className="h-4 w-4 text-blue-500" />
                  </div>
                  <span className="font-medium text-foreground text-sm">Terjual</span>
                </div>
                <div className="text-xl font-display font-bold text-blue-500">
                  {isLoading ? <Skeleton className="h-6 w-8" /> : soldCount}
                </div>
              </Card>
              </motion.div>
            </div>
          </div>

          {/* KOLOM KANAN (2/3) - INBOX */}
          <div className="lg:col-span-2">
            <Card className="border-border/50 bg-card/60 backdrop-blur-md h-full flex flex-col">
              <CardHeader className="border-b border-border/40 pb-4 shrink-0">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      Pesan Masuk
                      <Badge className="bg-primary/20 text-primary hover:bg-primary/30 border-primary/20">3</Badge>
                    </CardTitle>
                    <CardDescription className="mt-1">Pesan dari pembeli terkait listing Anda</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-1 p-0 overflow-y-auto max-h-[600px] lg:max-h-[calc(100vh-22rem)]">
                <div className="divide-y divide-border/40">
                  {dummyMessages.map((msg) => (
                    <Link
                      key={msg.id}
                      href="#"
                      className="flex items-start gap-4 p-4 hover:bg-muted/30 transition-colors group relative"
                    >
                      <div className="relative shrink-0">
                        <img
                          src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${msg.username}`}
                          alt={msg.sender}
                          className="w-10 h-10 rounded-full object-cover flex-shrink-0 bg-muted border border-border/50"
                        />
                        {msg.unread && (
                          <div className="absolute -top-0.5 -right-0.5 h-3 w-3 rounded-full bg-primary border-2 border-card" />
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-baseline justify-between gap-2 mb-1">
                          <div className="flex items-baseline gap-2 truncate">
                            <span className="font-semibold text-sm truncate">{msg.sender}</span>
                            <span className="text-xs text-muted-foreground truncate">@{msg.username}</span>
                          </div>
                          <span className="text-[10px] text-muted-foreground whitespace-nowrap shrink-0">{msg.time}</span>
                        </div>
                        
                        <div className="mb-1.5">
                          <Badge variant="outline" className="text-[10px] truncate max-w-[200px] sm:max-w-xs font-normal border-border/60">
                            {msg.listing}
                          </Badge>
                        </div>
                        
                        <p className={`text-sm line-clamp-1 pr-6 ${msg.unread ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
                          {msg.message}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="border-t border-border/40 p-4 shrink-0">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="w-full">
                      <Button variant="outline" className="w-full text-muted-foreground" disabled>
                        Lihat Semua Pesan
                      </Button>
                    </span>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">Fitur akan hadir segera 🚀</TooltipContent>
                </Tooltip>
              </CardFooter>
            </Card>
          </div>
        </motion.div>

        {/* CHART SECTION */}
        <motion.div variants={FADE_UP_ANIMATION_VARIANTS}>
        <Card className="mb-8 bg-card/60 backdrop-blur-md border-border/50">
          <CardHeader>
            <div className="flex flex-col space-y-1">
              <CardTitle className="text-xl font-display">
                Performa Listing (7 Hari Terakhir)
              </CardTitle>
              <CardDescription>* Data simulasi untuk demonstrasi</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-[300px] w-full rounded-xl" />
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="hsl(var(--border))"
                  />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                    dy={10}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                    allowDecimals={false}
                  />
                  <RechartsTooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      borderColor: 'hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Legend wrapperStyle={{ paddingTop: '20px' }} />
                  <Line
                    type="monotone"
                    dataKey="dilihat"
                    name="Dilihat"
                    stroke="#10b981"
                    strokeWidth={3}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="keranjang"
                    name="Keranjang"
                    stroke="#3b82f6"
                    strokeWidth={3}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="terjual"
                    name="Terjual"
                    stroke="#22c55e"
                    strokeWidth={3}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="dibatalkan"
                    name="Dibatalkan"
                    stroke="#ef4444"
                    strokeWidth={3}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
        </motion.div>

        <motion.div variants={FADE_UP_ANIMATION_VARIANTS} className="space-y-4">
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
            <motion.div 
              variants={STAGGER_CHILDREN_VARIANTS} 
              initial="hidden" 
              animate="show" 
              className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 pt-4"
            >
              {listings.map((item) => (
                <motion.div
                  key={item.id}
                  variants={FADE_UP_ANIMATION_VARIANTS}
                  whileHover={{ y: -4, scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  className="h-full"
                >
                <Card
                  className="flex flex-col h-full overflow-hidden bg-card/60 border-border/50 backdrop-blur-md transition-all hover:border-primary/30 hover:shadow-xl group cursor-pointer"
                >
                  <div className="aspect-video w-full relative overflow-hidden bg-muted/30">
                    <Image
                      src={getListingImage(item.title)}
                      alt={item.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, 25vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />
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
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" className="flex-1 gap-1 text-xs sm:text-sm">
                          <Trash2 className="h-3.5 w-3.5" />
                          Delete
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Hapus Listing?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Listing &quot;{item.title}&quot; akan dihapus permanen dan tidak bisa dikembalikan.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Batal</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(item.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                            Ya, Hapus
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}
        </motion.div>
      </motion.main>
    </div>
  )
}
