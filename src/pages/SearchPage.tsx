import { useMemo, useState } from 'react';
import type { Genre, Prefecture } from '../catalog/schema';
import { BundledCatalogRepository } from '../catalog/repository';
import type { CatalogRepository } from '../catalog/repository';
import { filterStores } from '../filters/filter';
import type { FilterCond } from '../filters/filter';
import { StoreCard } from '../components/StoreCard';
import { FilterSheet } from '../components/FilterSheet';
import { EmptyState } from '../components/EmptyState';
import { loadFavorites, toggleFavorite } from '../favorites/storage';

const repository: CatalogRepository = new BundledCatalogRepository();

const GENRES: Genre[] = ['焼肉', 'しゃぶしゃぶ', '寿司', 'スイーツ', 'ピザ', '串揚げ', '宴会食放'];

const DISCLAIMER =
  '掲載は東京・神奈川の食べ放題店に限った目安です。料金・制限時間は2026年時点の公開情報を編集したもので、店舗・曜日・フェアで変わります。行く前に公式を確認してください。';

const INITIAL: FilterCond = {
  prefecture: '東京',
  area: undefined,
  freeword: '',
  genres: [],
  slot: 'all',
  timeLimit: 'all',
  budget: undefined,
  sort: 'recommend',
};

const PREFECTURES: Prefecture[] = ['東京', '神奈川'];

function chip(active: boolean): string {
  return `min-h-[44px] shrink-0 whitespace-nowrap rounded-full border px-4 py-2 text-sm transition-colors ${
    active ? 'border-aka bg-aka text-ivory' : 'border-stonedim/60 text-stone'
  }`;
}

export function SearchPage() {
  const [cond, setCond] = useState<FilterCond>(INITIAL);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [savedIds, setSavedIds] = useState<string[]>(() => loadFavorites());

  const allStores = useMemo(() => repository.listStores(), []);
  const areas = useMemo(() => {
    const set = new Set<string>();
    for (const s of allStores) {
      if (s.prefecture === cond.prefecture) set.add(s.area);
    }
    return [...set].sort((a, b) => a.localeCompare(b, 'ja'));
  }, [allStores, cond.prefecture]);

  const results = useMemo(() => filterStores(allStores, cond), [allStores, cond]);

  const sheetActive =
    cond.slot !== 'all' || cond.timeLimit !== 'all' || cond.budget !== undefined || cond.sort !== 'recommend';

  const switchPrefecture = (prefecture: Prefecture) => {
    setCond({ ...INITIAL, prefecture });
  };

  const resetCond = () => {
    setCond({ ...INITIAL, prefecture: cond.prefecture });
  };

  const toggleGenre = (genre: Genre) => {
    setCond((prev) => ({
      ...prev,
      genres: prev.genres.includes(genre) ? prev.genres.filter((g) => g !== genre) : [...prev.genres, genre],
    }));
  };

  const toggleSave = (id: string) => {
    setSavedIds(toggleFavorite(id));
  };

  return (
    <main className="mx-auto w-full max-w-lg overflow-x-clip bg-ink px-4 pb-16 text-ivory md:max-w-3xl md:px-8 lg:max-w-5xl">
      <header className="pt-8 text-center">
        <p className="text-xs tracking-widest text-stone">TOKYO / KANAGAWA</p>
        <h1 className="mt-2 text-3xl font-bold">放題帖</h1>
        <p className="mt-2 text-sm text-stone">食べ放題だけを、料金と時間で切る</p>
      </header>

      <div className="mt-6 flex gap-2" role="group" aria-label="都県">
        {PREFECTURES.map((p) => (
          <button
            key={p}
            type="button"
            aria-pressed={cond.prefecture === p}
            onClick={() => switchPrefecture(p)}
            className={`min-h-[44px] flex-1 rounded-lg border font-bold transition-colors ${
              cond.prefecture === p ? 'border-aka bg-aka text-ivory' : 'border-stonedim/60 text-stone'
            }`}
          >
            {p}
          </button>
        ))}
      </div>

      <div className="mt-4 flex gap-2 overflow-x-auto pb-1" role="group" aria-label="エリア">
        <button
          type="button"
          aria-pressed={cond.area === undefined}
          onClick={() => setCond((prev) => ({ ...prev, area: undefined }))}
          className={chip(cond.area === undefined)}
        >
          すべて
        </button>
        {areas.map((area) => (
          <button
            key={area}
            type="button"
            aria-pressed={cond.area === area}
            onClick={() => setCond((prev) => ({ ...prev, area }))}
            className={chip(cond.area === area)}
          >
            {area}
          </button>
        ))}
      </div>

      <div className="mt-2 flex gap-2 overflow-x-auto pb-1" role="group" aria-label="ジャンル">
        {GENRES.map((genre) => (
          <button
            key={genre}
            type="button"
            aria-pressed={cond.genres.includes(genre)}
            onClick={() => toggleGenre(genre)}
            className={chip(cond.genres.includes(genre))}
          >
            {genre}
          </button>
        ))}
      </div>

      <div className="mt-4 flex gap-2">
        <label className="flex-1">
          <span className="sr-only">フリーワード</span>
          <input
            type="search"
            placeholder="店名・駅名で探す"
            value={cond.freeword}
            onChange={(e) => setCond((prev) => ({ ...prev, freeword: e.target.value }))}
            className="min-h-[44px] w-full rounded-lg border border-stonedim/60 bg-ink px-3 text-ivory placeholder:text-stonedim"
          />
        </label>
        <button
          type="button"
          aria-pressed={sheetActive}
          onClick={() => setSheetOpen(true)}
          className={`min-h-[44px] shrink-0 rounded-lg border px-4 font-bold transition-colors ${
            sheetActive ? 'border-aka bg-aka text-ivory' : 'border-stonedim/60 text-stone'
          }`}
        >
          条件
        </button>
        <button
          type="button"
          onClick={resetCond}
          className="min-h-[44px] shrink-0 rounded-lg border border-stonedim/60 px-4 text-stone transition-colors"
        >
          リセット
        </button>
      </div>

      <p className="mt-4 text-sm text-stone" aria-live="polite">
        {results.length}件
      </p>

      <div data-testid="results" className="mt-2 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {results.length === 0 ? (
          <EmptyState />
        ) : (
          results.map((store) => (
            <StoreCard key={store.id} store={store} saved={savedIds.includes(store.id)} onToggleSave={toggleSave} />
          ))
        )}
      </div>

      <footer className="mt-8 border-t border-stonedim/40 pt-4">
        <p className="text-xs leading-relaxed text-stone">{DISCLAIMER}</p>
      </footer>

      <FilterSheet
        open={sheetOpen}
        slot={cond.slot}
        timeLimit={cond.timeLimit}
        budget={cond.budget}
        sort={cond.sort}
        onChange={(patch) => setCond((prev) => ({ ...prev, ...patch }))}
        onClose={() => setSheetOpen(false)}
      />
    </main>
  );
}
