import catOtomotif from '@/assets/cat-otomotif.jpg'
import catTrading from '@/assets/cat-trading.jpg'
import catGame from '@/assets/cat-game.jpg'
import catSport from '@/assets/cat-sport.jpg'
import catElektronik from '@/assets/cat-elektronik.jpg'
import catFashion from '@/assets/cat-fashion.jpg'
import heroBg from '@/assets/hero-bg.jpg'
import { StaticImageData } from 'next/image'

const keywordMap: { keywords: string[]; image: StaticImageData }[] = [
  { keywords: ['honda', 'toyota', 'mobil', 'motor', 'civic', 'car', 'automotive', 'bmw', 'nissan', 'suzuki', 'yamaha', 'kawasaki'], image: catOtomotif },
  { keywords: ['pokemon', 'card', 'kartu', 'charizard', 'trading', 'yugioh', 'yu-gi-oh', 'tcg', 'psa'], image: catTrading },
  { keywords: ['gaming', 'game', 'ps5', 'playstation', 'xbox', 'nintendo', 'keyboard', 'mouse', 'razer', 'gpu', 'rtx', 'pc'], image: catGame },
  { keywords: ['jordan', 'sneaker', 'sepatu', 'basket', 'bola', 'sport', 'nike', 'adidas', 'spalding', 'olahraga'], image: catSport },
  { keywords: ['iphone', 'samsung', 'hp', 'laptop', 'elektronik', 'electronic', 'airpods', 'macbook', 'phone', 'tablet', 'acer'], image: catElektronik },
  { keywords: ['hoodie', 'baju', 'kaos', 'fashion', 'supreme', 'shirt', 'jacket', 'celana', 'tas', 'pakaian'], image: catFashion },
]

export function getListingImage(title: string): StaticImageData {
  const lower = title.toLowerCase()
  for (const entry of keywordMap) {
    if (entry.keywords.some(k => lower.includes(k))) {
      return entry.image
    }
  }
  return heroBg
}
