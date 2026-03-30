"use client";

import { motion } from "framer-motion";
import { Heart, MapPin, Shield } from "lucide-react";
import Image, { StaticImageData } from "next/image";
import catOtomotif from "@/assets/cat-otomotif.jpg";
import catTrading from "@/assets/cat-trading.jpg";
import catGame from "@/assets/cat-game.jpg";
import catSport from "@/assets/cat-sport.jpg";
import catElektronik from "@/assets/cat-elektronik.jpg";
import catFashion from "@/assets/cat-fashion.jpg";

const products: {
  title: string;
  price: string;
  location: string;
  category: string;
  image: StaticImageData;
  verified: boolean;
}[] = [
  { title: "Nissan GT-R R34 Nismo Diecast 1:18", price: "$195", location: "Jakarta", category: "Automotive", image: catOtomotif, verified: true },
  { title: "Charizard VMAX Rainbow Rare PSA 10", price: "$1,060", location: "Surabaya", category: "Trading Cards", image: catTrading, verified: true },
  { title: "Razer Huntsman V3 Pro TKL", price: "$219", location: "Bandung", category: "Gaming", image: catGame, verified: false },
  { title: "Air Jordan 1 Retro High OG Chicago", price: "$325", location: "Yogyakarta", category: "Sports", image: catSport, verified: true },
  { title: "iPhone 15 Pro Max 256GB", price: "$1,290", location: "Jakarta", category: "Electronics", image: catElektronik, verified: true },
  { title: "Supreme Box Logo Hoodie FW23", price: "$445", location: "Bali", category: "Fashion", image: catFashion, verified: false },
  { title: "Rays Engineering RPF1 17x9 +35", price: "$820", location: "Medan", category: "Automotive", image: catOtomotif, verified: true },
  { title: "Yu-Gi-Oh! Blue-Eyes White Dragon LOB", price: "$560", location: "Semarang", category: "Trading Cards", image: catTrading, verified: true },
];

const TrendingSection = () => {
  return (
    <section className="border-t border-border py-20">
      <div className="container mx-auto px-4">
        <div className="mb-12 flex items-end justify-between">
          <div>
            <h2 className="mb-2 font-display text-3xl font-bold md:text-4xl">🔥 Trending Now</h2>
            <p className="text-muted-foreground">Most sought-after items on Vendly</p>
          </div>
          <a href="#" className="hidden text-sm font-medium text-primary hover:underline md:block">
            View All →
          </a>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="group cursor-pointer overflow-hidden rounded-xl border border-border bg-card transition-all hover:border-primary/30 hover:glow-card"
            >
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <button className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-background/50 text-muted-foreground backdrop-blur-md transition-colors hover:bg-destructive/20 hover:text-destructive">
                  <Heart className="h-4 w-4" />
                </button>
                <span className="absolute left-3 top-3 rounded-md bg-background/50 px-2 py-0.5 text-xs font-medium text-foreground backdrop-blur-md">
                  {item.category}
                </span>
              </div>
              <div className="p-4">
                <h3 className="mb-1 line-clamp-2 text-sm font-medium text-foreground group-hover:text-primary">
                  {item.title}
                </h3>
                <p className="mb-3 font-display text-lg font-bold text-primary">{item.price}</p>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    {item.location}
                  </span>
                  {item.verified && (
                    <span className="flex items-center gap-1 text-xs text-primary">
                      <Shield className="h-3 w-3" />
                      Verified
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrendingSection;
