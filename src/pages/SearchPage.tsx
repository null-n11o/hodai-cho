import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import type { Genre, Prefecture } from '../catalog/schema';
import { BundledCatalogRepository } from '../catalog/repository';
import type { CatalogRepository } from '../catalog/repository';
import { filterStores } from '../filters/filter';
import type { FilterCond } from '../filters/filter';
import { areaPath, listAreas } from '../seo/meta';
import { StoreCard } from '../components/StoreCard';
import { FilterSheet } from '../components/FilterSheet';
import { EmptyState } from '../components/EmptyState';
import { LanguageToggle } from '../components/LanguageToggle';
import { loadFavorites, toggleFavorite } from '../favorites/storage';
import { dictionary, toEnPath, useLanguage } from '../i18n/language';
import { prefName, resultsCount } from '../i18n/format';
import { AREA_EN } from '../catalog/en-names';

const repository: CatalogRepository = new BundledCatalogRepository();

const GENRES: Genre[] = ['焼肉', 'しゃぶしゃぶ', '寿司', 'スイーツ', 'ピザ', '串揚げ', '宴会食放', 'パン食べ放題', 'お好み焼き', 'サラダバー', 'バイキング'];

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
  const lang = useLanguage();
  const dict = dictionary(lang);
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

  const prefectureAreas = useMemo(
    () => listAreas(allStores).filter((a) => a.prefecture === cond.prefecture),
    [allStores, cond.prefecture],
  );

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

  const areaLabel = (area: string): string => (lang === 'en' ? (AREA_EN[area] ?? area) : area);

  const areaLink = (prefecture: string, area: string): string => {
    const path = areaPath(prefecture, area);
    return lang === 'en' ? toEnPath(path) : path;
  };

  return (
    <main className="mx-auto w-full max-w-lg overflow-x-clip bg-ink px-4 pb-16 text-ivory md:max-w-3xl md:px-8 lg:max-w-5xl">
      <div className="flex justify-end pt-4">
        <LanguageToggle />
      </div>
      <header className="pt-4 text-center">
        <p className="text-xs tracking-widest text-stone">TOKYO / KANAGAWA</p>
        <h1 className="mt-2 text-3xl font-bold">放題帖</h1>
        <p className="mt-2 text-sm text-stone">{dict.hero.tagline}</p>
      </header>

      <div className="mt-6 flex gap-2" role="group" aria-label={dict.search.prefectureGroup}>
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
            {prefName(lang, p)}
          </button>
        ))}
      </div>

      <div className="mt-4 flex gap-2 overflow-x-auto pb-1" role="group" aria-label={dict.search.areaGroup}>
        <button
          type="button"
          aria-pressed={cond.area === undefined}
          onClick={() => setCond((prev) => ({ ...prev, area: undefined }))}
          className={chip(cond.area === undefined)}
        >
          {dict.search.all}
        </button>
        {areas.map((area) => (
          <button
            key={area}
            type="button"
            aria-pressed={cond.area === area}
            onClick={() => setCond((prev) => ({ ...prev, area }))}
            className={chip(cond.area === area)}
          >
            {areaLabel(area)}
          </button>
        ))}
      </div>

      <div className="mt-2 flex gap-2 overflow-x-auto pb-1" role="group" aria-label={dict.search.genreGroup}>
        {GENRES.map((genre) => (
          <button
            key={genre}
            type="button"
            aria-pressed={cond.genres.includes(genre)}
            onClick={() => toggleGenre(genre)}
            className={chip(cond.genres.includes(genre))}
          >
            {dict.genres[genre]}
          </button>
        ))}
      </div>

      <div className="mt-4 flex gap-2">
        <label className="flex-1">
          <span className="sr-only">{dict.search.keywordSr}</span>
          <input
            type="search"
            placeholder={dict.search.keywordPlaceholder}
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
          {dict.search.filters}
        </button>
        <button
          type="button"
          onClick={resetCond}
          className="min-h-[44px] shrink-0 rounded-lg border border-stonedim/60 px-4 text-stone transition-colors"
        >
          {dict.search.reset}
        </button>
      </div>

      <p className="mt-4 text-sm text-stone" aria-live="polite">
        {resultsCount(lang, results.length)}
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

      <nav className="mt-6" aria-label={dict.search.browseByArea}>
        <h2 className="text-lg font-bold">{dict.search.browseByArea}</h2>
        <ul className="mt-2 flex flex-wrap gap-2">
          {prefectureAreas.map((a) => (
            <li key={`${a.prefecture}/${a.area}`}>
              <Link
                to={areaLink(a.prefecture, a.area)}
                className="inline-block min-h-[44px] rounded-lg border border-stonedim/60 px-4 py-2 text-sm text-ivory"
              >
                {areaLabel(a.area)}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <footer className="mt-8 border-t border-stonedim/40 pt-4">
        <p className="text-xs leading-relaxed text-stone">{dict.disclaimer}</p>
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
