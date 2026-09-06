import type { Genre } from '../catalog/schema';

const GENRE_IMAGE: Record<Genre, string> = {
  焼肉: '/genre/yakiniku.svg',
  しゃぶしゃぶ: '/genre/shabu.svg',
  寿司: '/genre/sushi.svg',
  スイーツ: '/genre/sweets.svg',
  ピザ: '/genre/pizza.svg',
  串揚げ: '/genre/kushiage.svg',
  宴会食放: '/genre/enkai.svg',
  パン食べ放題: '/genre/bread.svg',
  お好み焼き: '/genre/okonomiyaki.svg',
  サラダバー: '/genre/salad.svg',
};

export function genreImageSrc(genre: Genre): string {
  return GENRE_IMAGE[genre];
}

interface GenreImageProps {
  genre: Genre;
}

export function GenreImage({ genre }: GenreImageProps) {
  return (
    <img
      src={genreImageSrc(genre)}
      alt={`${genre}のイラスト`}
      loading="lazy"
      className="h-28 w-full rounded-md object-contain md:h-40"
    />
  );
}
