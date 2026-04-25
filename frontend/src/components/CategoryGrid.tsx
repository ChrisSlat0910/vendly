'use client'

import { motion } from 'framer-motion'
import { Car, Gamepad2, Trophy, Smartphone, Shirt, Layers } from 'lucide-react'
import Image, { StaticImageData } from 'next/image'
import Link from 'next/link'
import catOtomotif from '@/assets/cat-otomotif.jpg'
import catTrading from '@/assets/cat-trading.jpg'
import catGame from '@/assets/cat-game.jpg'
import catSport from '@/assets/cat-sport.jpg'
import catElektronik from '@/assets/cat-elektronik.jpg'
import catFashion from '@/assets/cat-fashion.jpg'

const categories: {
  name: string
  icon: React.ElementType
  image: StaticImageData
  count: string
  colorVar: string
  gradient: string
  keyword: string
}[] = [
  {
    name: 'Automotive',
    icon: Car,
    image: catOtomotif,
    count: '2.4K+',
    colorVar: '--cat-otomotif',
    gradient: 'from-[hsl(200,90%,50%)]',
    keyword: 'automotive',
  },
  {
    name: 'Trading Cards',
    icon: Layers,
    image: catTrading,
    count: '1.8K+',
    colorVar: '--cat-trading',
    gradient: 'from-[hsl(35,95%,55%)]',
    keyword: 'trading cards',
  },
  {
    name: 'Gaming',
    icon: Gamepad2,
    image: catGame,
    count: '3.1K+',
    colorVar: '--cat-game',
    gradient: 'from-[hsl(280,70%,55%)]',
    keyword: 'gaming',
  },
  {
    name: 'Sports',
    icon: Trophy,
    image: catSport,
    count: '1.5K+',
    colorVar: '--cat-sport',
    gradient: 'from-[hsl(160,84%,45%)]',
    keyword: 'sports',
  },
  {
    name: 'Electronics',
    icon: Smartphone,
    image: catElektronik,
    count: '2.9K+',
    colorVar: '--cat-elektronik',
    gradient: 'from-[hsl(340,75%,55%)]',
    keyword: 'electronics',
  },
  {
    name: 'Fashion',
    icon: Shirt,
    image: catFashion,
    count: '2.2K+',
    colorVar: '--cat-fashion',
    gradient: 'from-[hsl(15,85%,55%)]',
    keyword: 'fashion',
  },
]

const CategoryGrid = () => {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="mb-12 flex items-end justify-between">
          <div>
            <h2 className="mb-2 font-display text-3xl font-bold md:text-4xl">Explore Categories</h2>
            <p className="text-muted-foreground">Find the perfect items that match your passions</p>
          </div>
          <Link
            href="/listings"
            className="hidden text-sm font-medium text-primary hover:underline md:block"
          >
            View All →
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, type: 'spring', stiffness: 100 }}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
            >
              <Link
                href={`/listings?keyword=${encodeURIComponent(cat.keyword)}`}
                className="group relative overflow-hidden rounded-xl border border-border bg-card block"
                style={{ boxShadow: `0 0 0px hsl(var(${cat.colorVar}) / 0)` }}
                onMouseEnter={(e) => {
                  ;(e.currentTarget as HTMLElement).style.boxShadow =
                    `0 8px 40px -8px hsl(var(${cat.colorVar}) / 0.4)`
                  ;(e.currentTarget as HTMLElement).style.borderColor =
                    `hsl(var(${cat.colorVar}) / 0.5)`
                }}
                onMouseLeave={(e) => {
                  ;(e.currentTarget as HTMLElement).style.boxShadow =
                    `0 0 0px hsl(var(${cat.colorVar}) / 0)`
                  ;(e.currentTarget as HTMLElement).style.borderColor = ''
                }}
              >
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div
                    className={`absolute inset-0 bg-gradient-to-t ${cat.gradient}/70 via-transparent to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-100`}
                  />
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${cat.gradient}/20 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100`}
                  />

                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex items-center gap-3">
                      <motion.div
                        className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/20 backdrop-blur-md border border-white/20"
                        whileHover={{ rotate: 10, scale: 1.1 }}
                      >
                        <cat.icon className="h-5 w-5 text-white" />
                      </motion.div>
                      <div>
                        <h3 className="font-display text-lg font-bold text-white">{cat.name}</h3>
                        <p className="text-sm text-white/70">{cat.count} active listings</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default CategoryGrid
