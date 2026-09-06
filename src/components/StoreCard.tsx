import { Link } from 'react-router-dom';
import type { Store } from '../catalog/schema';
import { GenreImage } from './GenreImage';
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
  return (
    <article className="rounded-lg border border-stonedim/40 bg-ink p-4">
      <GenreImage genre={store.genres[0]} />
      <div className="mt-3 flex items-start justify-between gap-3">
        <Link to={detailTo} className="min-h-[44px] flex-1">
          <p className="text-xs text-stone">{genreLine}</p>
          <h2 className="mt-1 text-lg font-bold text-ivory">{store.name}</h2>
          <p className="mt-1 text-sm text-stone">{stationLine(lang, store.station, store.walkMinutes, store.facility)}</p>
        </Link>
        <button
          type="button"
          aria-label={dict.card.save}
          aria-pressed={saved}
          onClick={() => onToggleSave(store.id)}
          className="min-h-[44px] min-w-[44px] shrink-0 p-2 text-ivory transition-colors"
        >
          <svg viewBox="0 0 24 24" width="24" height="24" fill={saved ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>
      </div>
      <div className="mt-3 space-y-1 text-sm">
        <p className="text-ivory">{dict.card.lunch} {lunch ?? dict.card.noBuffet}</p>
        <p className="text-ivory">{dict.card.dinner} {dinner ?? dict.card.noBuffet}</p>
      </div>
      {store.highlights[0] ? <p className="mt-2 text-sm text-stone">{store.highlights[0]}</p> : null}
    </article>
  );
}
