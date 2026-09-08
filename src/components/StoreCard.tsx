import { Link } from 'react-router-dom';
import type { Store } from '../catalog/schema';
import { STATION_EN } from '../catalog/en-names';
import { GenreImage } from './GenreImage';
import { FoodImage } from './FoodImage';
import { dictionary, toEnPath, useLanguage } from '../i18n/language';
import type { Lang } from '../i18n/language';
import { durationLabel, priceCore, stationLine } from '../i18n/format';

interface StoreCardProps {
  store: Store;
  saved: boolean;
  onToggleSave: (id: string) => void;
}

function priceLine(store: Store, slot: 'lunch' | 'dinner', lang: Lang): string | null {
  const scoped = store.courses.filter((c) => c.slot === slot || c.slot === 'all-day');
  if (scoped.length === 0) return null;
  const cheapest = Math.min(...scoped.map((c) => c.priceInclTax));
  const shortest = scoped.find((c) => c.priceInclTax === cheapest) ?? scoped[0];
  const sep = lang === 'en' ? ' · ' : '・';
  return `${priceCore(lang, cheapest)}${sep}${durationLabel(lang, shortest.minutes)}`;
}

export function StoreCard({ store, saved, onToggleSave }: StoreCardProps) {
  const lang = useLanguage();
  const dict = dictionary(lang);
  const lunch = priceLine(store, 'lunch', lang);
  const dinner = priceLine(store, 'dinner', lang);
  const detailTo = lang === 'en' ? toEnPath(`/r/${store.id}`) : `/r/${store.id}`;
  const genreLine = store.genres.map((g) => dict.genres[g]).join(lang === 'en' ? ' · ' : '・');
  const shownName = lang === 'en' ? store.nameEn : store.name;
  const shownStation = lang === 'en' ? (STATION_EN[store.station] ?? store.station) : store.station;
  const shownFacility = lang === 'en' ? (store.facilityEn ?? store.facility) : store.facility;
  const shownHighlight = lang === 'en' ? (store.highlightsEn[0] ?? store.highlights[0]) : store.highlights[0];
  return (
    <article className="store-card">
      <div className="store-card-image">
        <FoodImage genre={store.genres[0]} fallback={<GenreImage genre={store.genres[0]} />} />
      </div>
      <div className="store-card-body">
        <div className="store-card-heading">
          <div>
            <p className="genre-label">{genreLine}</p>
            <Link to={detailTo} className="store-title-link">
              <h2>{shownName}</h2>
            </Link>
            <p className="station-line">{stationLine(lang, shownStation, store.walkMinutes, shownFacility)}</p>
          </div>
          <button type="button" aria-label={dict.card.save} aria-pressed={saved}
            onClick={() => onToggleSave(store.id)} className="save-button">
            <svg viewBox="0 0 24 24" width="21" height="21" fill={saved ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </button>
        </div>
        {shownHighlight ? <p className="store-highlight">{shownHighlight}</p> : null}
        <dl className="store-prices">
          <div><dt>{dict.card.lunch}</dt><dd>{lunch ?? dict.card.noBuffet}</dd></div>
          <div><dt>{dict.card.dinner}</dt><dd>{dinner ?? dict.card.noBuffet}</dd></div>
          <div><dt>{dict.card.walk}</dt><dd>{lang === 'en' ? `${store.walkMinutes} min` : `徒歩${store.walkMinutes}分`}</dd></div>
        </dl>
        <div className="store-card-footer">
          <span>{lang === 'en' ? 'Prices include tax · Weekday guide' : '税込・平日の目安'}</span>
          <Link to={detailTo}>{lang === 'en' ? 'View courses' : 'コース・詳細を見る'}<span aria-hidden="true"> →</span></Link>
        </div>
      </div>
    </article>
  );
}
