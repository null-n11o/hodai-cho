import { Link } from 'react-router-dom';
import type { Store } from '../catalog/schema';

interface StoreCardProps {
  store: Store;
  saved: boolean;
  onToggleSave: (id: string) => void;
}

function formatMinutes(minutes: number | null): string {
  return minutes === null ? '無制限' : `${minutes}分`;
}

function priceLine(store: Store, slot: 'lunch' | 'dinner'): string | null {
  const scoped = store.courses.filter((c) => c.slot === slot || c.slot === 'all-day');
  if (scoped.length === 0) return null;
  const cheapest = Math.min(...scoped.map((c) => c.priceInclTax));
  const shortest = scoped.find((c) => c.priceInclTax === cheapest) ?? scoped[0];
  return `¥${cheapest.toLocaleString('ja-JP')}〜・${formatMinutes(shortest.minutes)}`;
}

export function StoreCard({ store, saved, onToggleSave }: StoreCardProps) {
  const lunch = priceLine(store, 'lunch');
  const dinner = priceLine(store, 'dinner');
  const station = `${store.station}駅 徒歩${store.walkMinutes}分${store.facility ? `・${store.facility}` : ''}`;
  return (
    <article className="rounded-lg border border-stonedim/40 bg-ink p-4">
      <div className="flex items-start justify-between gap-3">
        <Link to={`/r/${store.id}`} className="min-h-[44px] flex-1">
          <p className="text-xs text-stone">{store.genres.join('・')}</p>
          <h2 className="mt-1 text-lg font-bold text-ivory">{store.name}</h2>
          <p className="mt-1 text-sm text-stone">{station}</p>
        </Link>
        <button
          type="button"
          aria-label="保存する"
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
        <p className="text-ivory">ランチ {lunch ?? '食べ放題なし'}</p>
        <p className="text-ivory">ディナー {dinner ?? '食べ放題なし'}</p>
      </div>
      {store.highlights[0] ? <p className="mt-2 text-sm text-stone">{store.highlights[0]}</p> : null}
    </article>
  );
}
