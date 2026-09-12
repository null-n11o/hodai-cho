import type { Genre } from '../catalog/schema';
import type { Lang } from '../i18n/language';
import './SearchHero.css';

const MOODS: { genre: Genre; image: string; ja: string; en: string }[] = [
  { genre: '焼肉', image: 'yakiniku', ja: 'お肉をがっつり', en: 'Craving a grill feast' },
  { genre: '寿司', image: 'sushi', ja: 'お寿司を好きなだけ', en: 'Sushi to your heart’s content' },
  { genre: 'スイーツ', image: 'sweets', ja: '甘いものは別腹', en: 'Room for dessert' },
];

interface Props {
  lang: Lang;
  genres: Genre[];
  onChoose: (genre: Genre) => void;
}

export function SearchHero({ lang, genres, onChoose }: Props) {
  const en = lang === 'en';
  return (
    <header className="appetite-hero">
      <div className="appetite-intro">
        <p className="appetite-eyebrow">TOKYO / KANAGAWA <span>ALL YOU CAN EAT</span></p>
        <h1>{en ? <>A big appetite.<br /><em>What’s on your menu?</em></> : <>お腹いっぱい、<br /><em>今日は何食べる？</em></>}</h1>
        <p className="appetite-description">{en ? 'Grilled meat, sushi, and a little room for dessert. Find your next feast in Tokyo and Kanagawa.' : <>焼肉も、お寿司も、食後の甘いものも。<br />東京・神奈川で、好きなものを好きなだけ。</>}</p>
        <a className="appetite-cta" href="#restaurant-search">{en ? 'Find a restaurant' : 'お店を探す'}<span aria-hidden="true">↗</span></a>
        <p className="appetite-guide">{en ? 'Compare prices, time limits, and locations.' : '料金・時間・場所で、ぴったりの一軒へ。'}</p>
      </div>

      <figure className="appetite-table">
        <div className="appetite-dish appetite-dish-main"><img src="/food/landing/yakiniku.webp" width="800" height="600" alt="" fetchPriority="high" /></div>
        <div className="appetite-dish appetite-dish-sushi"><img src="/food/landing/sushi.webp" width="480" height="360" alt="" /></div>
        <div className="appetite-dish appetite-dish-sweets"><img src="/food/landing/sweets.webp" width="480" height="360" alt="" /></div>
        <span className="appetite-stamp" aria-hidden="true">{en ? <>Go on.<br />One more!</> : <>もうひと皿、<br />いこう。</>}</span>
        <figcaption>{en ? 'Cuisine imagery · Illustrative only' : '写真はジャンルイメージです'}</figcaption>
      </figure>

      <div className="appetite-moods" role="group" aria-labelledby="appetite-moods-title">
        <p id="appetite-moods-title">{en ? 'Follow your appetite' : '今の気分で、ひとくち目。'}<span>{en ? 'Choose a craving' : '気になる料理から探す'}</span></p>
        <div className="appetite-mood-list">
          {MOODS.map((mood) => (
            <button key={mood.genre} type="button" className="appetite-mood" aria-pressed={genres.includes(mood.genre)} onClick={() => onChoose(mood.genre)}>
              <img src={`/food/landing/${mood.image}.webp`} width="80" height="64" alt="" />
              <span>{en ? mood.en : mood.ja}</span><span className="appetite-mood-arrow" aria-hidden="true">↗</span>
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}
