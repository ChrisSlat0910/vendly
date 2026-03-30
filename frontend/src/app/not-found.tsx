export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background">
      <h1 className="font-display text-6xl font-bold text-primary">404</h1>
      <p className="mt-4 text-xl text-muted-foreground">Halaman tidak ditemukan</p>
      <a
        href="/"
        className="mt-6 rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:glow-primary"
      >
        Kembali ke Beranda
      </a>
    </div>
  );
}
