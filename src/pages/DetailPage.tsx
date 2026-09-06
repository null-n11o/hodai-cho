import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { BundledCatalogRepository } from '../catalog/repository';
import type { CatalogRepository } from '../catalog/repository';
import type { Store } from '../catalog/schema';
import { CourseTable } from '../components/CourseTable';
import { EmptyState } from '../components/EmptyState';
import { GenreImage } from '../components/GenreImage';
import { loadFavorites, toggleFavorite } from '../favorites/storage';

const repository: CatalogRepository = new BundledCatalogRepository();

function similarStores(store: Store, all: Store[]): Store[] {
  const sameChain = all.filter((s) => s.id !== store.id && s.prefecture === store.prefecture && s.chain === store.chain);
  const sameArea = all.filter(
    (s) => s.id !== store.id && s.prefecture === store.prefecture && s.chain !== store.chain && s.area === store.area,
  );
  return [...sameChain, ...sameArea].slice(0, 4);
}

export function DetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [savedIds, setSavedIds] = useState<string[]>(() => loadFavorites());

  const store = id ? repository.getStore(id) : undefined;

  if (!store) {
    return (
      <main className="mx-auto w-full max-w-lg overflow-x-clip bg-ink px-4 pb-24 pt-8 text-ivory">
        <EmptyState
          title="店が見つからない"
          advice={['条件が変わったか、掲載が終わった可能性があります']}
          action={
            <Link to="/" className="inline-block min-h-[44px] rounded-lg bg-aka px-6 py-3 font-bold text-ivory">
              探すへ戻る
            </Link>
          }
        />
      </main>
    );
  }

  const all = repository.listStores();
  const similar = similarStores(store, all);
  const saved = savedIds.includes(store.id);
  const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${store.name} ${store.station}`)}`;

  const onToggleSave = () => {
    setSavedIds(toggleFavorite(store.id));
  };

  return (
    <main className="mx-auto w-full max-w-lg overflow-x-clip bg-ink px-4 pb-24 text-ivory">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="mt-4 min-h-[44px] text-sm text-stone"
      >
        戻る
      </button>

      <div className="mt-2">
        <GenreImage genre={store.genres[0]} />
      </div>

      <div className="mt-2 flex items-start justify-between gap-3">
        <div>
          <p className="text-xs text-stone">
            {store.prefecture}・{store.area}・{store.genres.join('・')}
          </p>
          <h1 className="mt-1 text-2xl font-bold">{store.name}</h1>
          <p className="mt-1 text-sm text-stone">
            {store.station}駅 徒歩{store.walkMinutes}分{store.facility ? `・${store.facility}` : ''}
          </p>
          <p className="mt-1 text-sm text-stone">{store.hours}</p>
        </div>
        <button
          type="button"
          aria-label="保存する"
          aria-pressed={saved}
          onClick={onToggleSave}
          className="min-h-[44px] min-w-[44px] shrink-0 p-2 text-ivory transition-colors"
        >
          <svg viewBox="0 0 24 24" width="24" height="24" fill={saved ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>
      </div>

      <section className="mt-6" aria-label="コース">
        <h2 className="text-lg font-bold">コース</h2>
        <div className="mt-2">
          <CourseTable courses={store.courses} />
        </div>
      </section>

      <section className="mt-6" aria-label="ポイント">
        <h2 className="text-lg font-bold">ポイント</h2>
        <ul className="mt-2 space-y-1 text-sm text-ivory">
          {store.highlights.map((h) => (
            <li key={h}>{h}</li>
          ))}
        </ul>
      </section>

      <section className="mt-6" aria-label="行く前に">
        <h2 className="text-lg font-bold">行く前に</h2>
        <p className="mt-2 text-sm leading-relaxed text-stone">{store.notice}</p>
      </section>

      <div className="mt-6 flex flex-col gap-2">
        <a
          href={mapUrl}
          target="_blank"
          rel="noreferrer"
          className="min-h-[44px] rounded-lg border border-stonedim/60 px-4 py-3 text-center font-bold text-ivory"
        >
          地図で探す
        </a>
        {store.officialUrl ? (
          <a
            href={store.officialUrl}
            target="_blank"
            rel="noreferrer"
            className="min-h-[44px] rounded-lg border border-stonedim/60 px-4 py-3 text-center font-bold text-ivory"
          >
            公式サイト
          </a>
        ) : null}
        {store.reservationUrl ? (
          <a
            href={store.reservationUrl}
            target="_blank"
            rel="noreferrer"
            className="min-h-[44px] rounded-lg bg-aka px-4 py-3 text-center font-bold text-ivory"
          >
            予約する
          </a>
        ) : null}
      </div>

      {similar.length > 0 ? (
        <section className="mt-8" aria-label="近い・同じ系列">
          <h2 className="text-lg font-bold">近い・同じ系列</h2>
          <ul className="mt-2 space-y-2">
            {similar.map((s) => (
              <li key={s.id}>
                <Link
                  to={`/r/${s.id}`}
                  className="block min-h-[44px] rounded-lg border border-stonedim/40 px-4 py-3 text-sm text-ivory"
                >
                  {s.name}（{s.station}駅 徒歩{s.walkMinutes}分）
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </main>
  );
}
