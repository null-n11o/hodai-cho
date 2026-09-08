import { dictionary, useLanguage } from '../i18n/language';
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
  バイキング: '/genre/viking.svg',
};

export function genreImageSrc(genre: Genre): string {
  return GENRE_IMAGE[genre];
}

interface GenreImageProps {
  genre: Genre;
}

export function GenreImage({ genre }: GenreImageProps) {
  const lang = useLanguage();
  const label = dictionary(lang).genres[genre];
  return (
    <img
      src={genreImageSrc(genre)}
      alt={lang === 'en' ? `${label} illustration` : `${genre}のイラスト`}
      loading="lazy"
      className="h-28 w-full rounded-md object-contain md:h-40"
    />
  );
}
