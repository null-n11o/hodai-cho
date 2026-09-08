import type { ReactNode } from 'react';
import type { Genre } from '../catalog/schema';

const FOOD_IMAGE: Partial<Record<Genre, string>> = {
  焼肉: '/food/yakiniku.png',
  しゃぶしゃぶ: '/food/shabu.png',
  寿司: '/food/sushi.png',
  スイーツ: '/food/sweets.png',
  ピザ: '/food/pizza.png',
  パン食べ放題: '/food/bread.png',
  串揚げ: '/food/kushikatsu.png',
  宴会食放: '/food/banquet.png',
  お好み焼き: '/food/okonomiyaki.png',
  サラダバー: '/food/salad.png',
  バイキング: '/food/banquet.png',
  定食おかわり自由: '/food/banquet.png',
};

export function foodImageSrc(genre: Genre): string | null {
  return FOOD_IMAGE[genre] ?? null;
}

interface FoodImageProps {
  genre: Genre;
  fallback: ReactNode;
}

export function FoodImage({ genre, fallback }: FoodImageProps) {
  const src = foodImageSrc(genre);
  if (!src) return fallback;
  return <img src={src} alt="" loading="lazy" className="store-photo" />;
}
