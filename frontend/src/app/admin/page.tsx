'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { getListingImage } from '@/lib/listing-image'
import { useAuth } from '@/lib/auth-context'
import apiClient from '@/lib/api/client'
import { ThemeToggle } from '@/components/ThemeToggle'
import { LogOut, Trash2, User } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

interface UserData {
  id: string
  username: string
  email: string
  displayName: string
  creditScore: number
  emailVerified: boolean
  createdAt: string
}

interface ListingData {
  id: string
  sellerId: string
  title: string
  price: number
  condition: string
  status: string
  location: string
  sellerUsername?: string
  createdAt: string
}

export default function AdminPage() {
  const { user, isInitializing, logout } = useAuth()
  const router = useRouter()
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null)

  useEffect(() => {
    if (!isInitializing) {
      if (!user) {
        router.push('/login')
        return
      }
      console.log('User ID:', user.id)
      apiClient
        .get(`/admin/users/${user.id}/is-admin`)
        .then((res) => {
          if (res.data.data) {
            setIsAdmin(true)
          } else {
            router.push('/dashboard')
          }
        })
        .catch(() => {
          router.push('/dashboard')
        })
    }
  }, [user, isInitializing, router])

  if (isInitializing || isAdmin === null) {
    return (
      <div className="flex justify-center items-center h-screen space-x-2">
        <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-primary" />
        <span className="text-muted-foreground animate-pulse">Memuat Panel Admin...</span>
      </div>
    )
  }

  if (isAdmin === false) return null

  return (
    <div className="min-h-screen bg-background">
      <nav className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2">
              <span className="font-display text-2xl font-bold tracking-tight text-primary">
                Vendly
              </span>
            </Link>
            <Badge variant="destructive" className="uppercase tracking-widest text-[10px]">
              Admin Panel
            </Badge>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <span className="hidden text-sm font-medium text-muted-foreground md:inline-block">
              {user?.email}
            </span>
            <ThemeToggle />
            <Button asChild variant="outline" size="sm" className="hidden md:flex">
              <Link href="/dashboard">Kembali ke Dashboard</Link>
            </Button>
            <Button variant="ghost" size="icon" onClick={logout} title="Logout">
              <LogOut className="h-5 w-5 text-destructive" />
            </Button>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="users" className="w-full">
          <TabsList className="mb-8 p-1 bg-muted/50 w-full max-w-sm grid grid-cols-2">
            <TabsTrigger value="users">Manajemen User</TabsTrigger>
            <TabsTrigger value="listings">Manajemen Listing</TabsTrigger>
          </TabsList>

          <TabsContent value="users">
            <UsersManager currentAdminId={user!.id} />
          </TabsContent>

          <TabsContent value="listings">
            <ListingsManager />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

function UsersManager({ currentAdminId }: { currentAdminId: string }) {
  const [users, setUsers] = useState<UserData[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchUsers = async () => {
    try {
      setIsLoading(true)
      const res = await apiClient.get('/admin/users')
      setUsers(res.data.data.content)
    } catch (e) {
      console.error(e)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  return (
    <Card className="bg-card/60 backdrop-blur-md border-border/50">
      <CardHeader>
        <CardTitle>Daftar Pengguna</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : (
          <div className="rounded-md border border-border/50 bg-background/50 overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama</TableHead>
                  <TableHead>Email & Username</TableHead>
                  <TableHead className="text-center">Credit Score</TableHead>
                  <TableHead>Verifikasi</TableHead>
                  <TableHead>Hak Akses</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((u) => (
                  <UserRow key={u.id} user={u} currentAdminId={currentAdminId} />
                ))}
                {users.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                      Tidak ada data pengguna.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function UserRow({ user, currentAdminId }: { user: UserData; currentAdminId: string }) {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const res = await apiClient.get(`/admin/users/${user.id}/is-admin`)
        setIsAdmin(res.data.data)
      } catch {
        setIsAdmin(false)
      }
    }
    checkStatus()
  }, [user.id])

  const handleToggleAdmin = async () => {
    setIsProcessing(true)
    try {
      if (isAdmin) {
        await apiClient.delete(`/admin/users/${user.id}/revoke-admin`)
      } else {
        await apiClient.post(`/admin/users/${user.id}/grant-admin`)
      }
      setIsAdmin(!isAdmin)
    } catch (e) {
      console.error(e)
    } finally {
      setIsProcessing(false)
      setShowConfirm(false)
    }
  }

  const isSelf = user.id === currentAdminId

  return (
    <TableRow>
      <TableCell className="font-medium whitespace-nowrap">{user.displayName || '-'}</TableCell>
      <TableCell className="whitespace-nowrap">
        <div className="flex flex-col">
          <span>{user.email}</span>
          <span className="text-xs text-muted-foreground">@{user.username}</span>
        </div>
      </TableCell>
      <TableCell className="text-center font-bold text-primary">{user.creditScore}</TableCell>
      <TableCell>
        {user.emailVerified ? (
          <Badge
            variant="outline"
            className="text-emerald-500 bg-emerald-500/10 border-none whitespace-nowrap"
          >
            Verified
          </Badge>
        ) : (
          <Badge variant="outline" className="text-muted-foreground border-none whitespace-nowrap">
            Unverified
          </Badge>
        )}
      </TableCell>
      <TableCell>
        {isAdmin === null ? (
          <Skeleton className="h-5 w-16" />
        ) : isAdmin ? (
          <Badge
            variant="default"
            className="bg-primary text-primary-foreground border-none whitespace-nowrap"
          >
            Admin
          </Badge>
        ) : (
          <Badge variant="secondary" className="border-none whitespace-nowrap">
            User
          </Badge>
        )}
      </TableCell>
      <TableCell className="text-right">
        {!isSelf && isAdmin !== null && (
          <>
            <Button
              variant={isAdmin ? 'destructive' : 'default'}
              size="sm"
              onClick={() => setShowConfirm(true)}
              disabled={isProcessing}
              className="whitespace-nowrap"
            >
              {isAdmin ? 'Revoke Admin' : 'Grant Admin'}
            </Button>
            <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Konfirmasi Tindakan</AlertDialogTitle>
                  <AlertDialogDescription>
                    Anda yakin ingin{' '}
                    {isAdmin
                      ? 'mencabut hak akses admin dari'
                      : 'memberikan hak akses admin kepada'}{' '}
                    <strong>{user.username}</strong>?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel disabled={isProcessing}>Batal</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={(e) => {
                      e.preventDefault()
                      handleToggleAdmin()
                    }}
                    disabled={isProcessing}
                    className={
                      isAdmin
                        ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90'
                        : ''
                    }
                  >
                    {isProcessing ? 'Memproses...' : 'Ya, Lanjutkan'}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </>
        )}
      </TableCell>
    </TableRow>
  )
}

function ListingsManager() {
  const [listings, setListings] = useState<ListingData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const fetchListings = async () => {
    try {
      setIsLoading(true)
      const res = await apiClient.get('/admin/listings')
      setListings(res.data.data.content)
    } catch (e) {
      console.error(e)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchListings()
  }, [])

  const handleDelete = async () => {
    if (!deleteId) return
    setIsDeleting(true)
    try {
      await apiClient.delete(`/admin/listings/${deleteId}`)
      await fetchListings() // Refresh data
    } catch (e) {
      console.error(e)
    } finally {
      setIsDeleting(false)
      setDeleteId(null)
    }
  }

  const formatRupiah = (p: number) =>
    new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(p)

  return (
    <div className="space-y-6">
      {isLoading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[1, 2, 3, 4].map((k) => (
            <Skeleton key={k} className="h-[320px] w-full rounded-xl" />
          ))}
        </div>
      ) : listings.length === 0 ? (
        <Card className="flex flex-col items-center justify-center py-20 text-muted-foreground bg-card/60 backdrop-blur-md border-border/50">
          <p className="text-lg">Database kosong. Tidak ada listing yang terdaftar.</p>
        </Card>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {listings.map((item) => (
            <Card
              key={item.id}
              className="flex flex-col h-full overflow-hidden bg-card/60 border-border/50 backdrop-blur-md transition-all hover:border-primary/30 group"
            >
              <Link
                href={`/listings/${item.id}`}
                className="block relative aspect-video w-full overflow-hidden bg-muted/20 cursor-pointer"
              >
                <Image
                  src={getListingImage(item.title)}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute top-3 right-3 flex gap-2">
                  <Badge
                    variant={item.status === 'SOLD' ? 'secondary' : 'default'}
                    className="shadow-lg backdrop-blur-md bg-background/80"
                  >
                    {item.status}
                  </Badge>
                </div>
              </Link>
              <CardHeader className="p-4 pb-0 flex-1">
                <div className="flex justify-between items-start mb-2">
                  <Badge variant="outline" className="text-[10px] uppercase font-semibold">
                    {item.condition}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {new Intl.DateTimeFormat('id-ID', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    }).format(new Date(item.createdAt))}
                  </span>
                </div>
                <Link href={`/listings/${item.id}`}>
                  <CardTitle className="line-clamp-2 text-base group-hover:text-primary transition-colors cursor-pointer">
                    {item.title}
                  </CardTitle>
                </Link>
                <div className="font-bold text-lg text-primary mt-2">
                  {formatRupiah(item.price)}
                </div>
              </CardHeader>
              <CardFooter className="p-4 pt-4 border-t border-border/40 mt-4 flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-muted-foreground truncate">
                  <User className="h-4 w-4 shrink-0 transition-colors group-hover:text-primary" />
                  <span className="truncate">
                    {item.sellerUsername || item.sellerId.substring(0, 8)}
                  </span>
                </div>
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => setDeleteId(item.id)}
                  title="Delete Listing"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Listing Secara Permanen?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak dapat dibatalkan. Listing akan dihapus sepenuhnya dari database
              aplikasi.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault()
                handleDelete()
              }}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? 'Menghapus...' : 'Ya, Hapus'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
