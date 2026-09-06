import { Link, useParams } from 'react-router-dom';
import { BundledCatalogRepository } from '../catalog/repository';
import type { CatalogRepository } from '../catalog/repository';
import { StoreCard } from '../components/StoreCard';
import { EmptyState } from '../components/EmptyState';
import { loadFavorites, toggleFavorite } from '../favorites/storage';
import { useState } from 'react';

const repository: CatalogRepository = new BundledCatalogRepository();

export function AreaPage() {
  const { prefecture, area } = useParams();
  const [savedIds, setSavedIds] = useState<string[]>(() => loadFavorites());

  const stores = repository
    .listStores()
    .filter((s) => s.prefecture === prefecture && s.area === area);

  const onToggleSave = (id: string) => {
    setSavedIds(toggleFavorite(id));
  };

  if (stores.length === 0) {
    return (
      <main className="mx-auto w-full max-w-lg overflow-x-clip bg-ink px-4 pb-24 pt-8 text-ivory md:max-w-3xl md:px-8 lg:max-w-5xl">
        <EmptyState
          title="そのエリアの店はない"
          advice={['エリア名が変わったか、掲載が終わった可能性があります']}
          action={
            <Link to="/" className="inline-block min-h-[44px] rounded-lg bg-aka px-6 py-3 font-bold text-ivory">
              探すへ戻る
            </Link>
          }
        />
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-lg overflow-x-clip bg-ink px-4 pb-24 pt-8 text-ivory md:max-w-3xl md:px-8 lg:max-w-5xl">
      <p className="text-xs tracking-widest text-stone">
        {prefecture} / AREA
      </p>
      <h1 className="mt-2 text-2xl font-bold md:text-3xl">{area}の食べ放題</h1>
      <p className="mt-2 text-sm text-stone" aria-live="polite">
        {stores.length}件・料金と時間で切る
      </p>
      <div data-testid="results" className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {stores.map((store) => (
          <StoreCard key={store.id} store={store} saved={savedIds.includes(store.id)} onToggleSave={onToggleSave} />
        ))}
      </div>
      <div className="mt-6">
        <Link to="/" className="inline-block min-h-[44px] rounded-lg border border-stonedim/60 px-6 py-3 font-bold text-ivory">
          条件を変えて探す
        </Link>
      </div>
    </main>
  );
}
