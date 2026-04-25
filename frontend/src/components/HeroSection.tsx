"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Search, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import heroBg from "@/assets/hero-bg.jpg";

const HeroSection = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/listings?keyword=${encodeURIComponent(searchQuery)}`);
    } else {
      router.push("/listings");
    }
  };

  return (
    <section className="relative flex min-h-[85vh] items-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <Image src={heroBg} alt="" fill className="object-cover opacity-40" sizes="100vw" placeholder="blur" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 to-transparent" />
      </div>

      <div className="container relative z-10 mx-auto px-4 pt-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="max-w-2xl"
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
            The #1 Secure Community Market
          </div>

          <h1 className="mb-6 font-display text-5xl font-bold leading-tight tracking-tight md:text-7xl">
            Shop & Trade with{" "}
            <span className="text-gradient">Trusted</span>{" "}
            Communities
          </h1>

          <p className="mb-8 max-w-lg text-lg text-muted-foreground">
            Discover unique items from diverse communities—auto enthusiasts, card traders, gamers, and more. A safe, trusted marketplace for everyone.
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="mb-8 flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for items, communities, or vendors..."
                className="h-14 w-full rounded-xl border border-border bg-card pl-12 pr-4 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <button type="submit" className="flex h-14 items-center gap-2 rounded-xl bg-primary px-6 font-semibold text-primary-foreground transition-all hover:glow-primary">
              Search
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex flex-wrap gap-2">
              {["Auto", "Trading Cards", "Gaming", "Sneakers"].map((tag) => (
                <Link
                  href={`/listings?category=${tag.toLowerCase()}`}
                  key={tag}
                  className="cursor-pointer rounded-lg border border-border bg-secondary px-3 py-1.5 text-sm text-secondary-foreground transition-colors hover:border-primary/50 hover:text-primary"
                >
                  {tag}
                </Link>
              ))}
            </div>
            
            <div className="h-4 w-px bg-border hidden sm:block mx-1"></div>
            
            <Link 
              href="/listings" 
              className="mt-2 sm:mt-0 text-sm font-medium text-foreground underline-offset-4 hover:underline hover:text-primary transition-colors"
            >
              Lihat Semua Listing &rarr;
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
