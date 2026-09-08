import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import type { Genre, Prefecture } from '../catalog/schema';
import { BundledCatalogRepository } from '../catalog/repository';
import type { CatalogRepository } from '../catalog/repository';
import { filterStores } from '../filters/filter';
import type { FilterCond, SlotCond, SortCond } from '../filters/filter';
import { areaPath, listAreas } from '../seo/meta';
import { StoreCard } from '../components/StoreCard';
import { FilterSheet } from '../components/FilterSheet';
import { EmptyState } from '../components/EmptyState';
import { loadFavorites, toggleFavorite } from '../favorites/storage';
import { dictionary, toEnPath, useLanguage } from '../i18n/language';
import { budgetLabel, prefName, resultsCount } from '../i18n/format';
import { AREA_EN } from '../catalog/en-names';

const repository: CatalogRepository = new BundledCatalogRepository();

const GENRES: Genre[] = ['焼肉', 'しゃぶしゃぶ', '寿司', 'スイーツ', 'ピザ', '串揚げ', '宴会食放', 'パン食べ放題', 'お好み焼き', 'サラダバー', 'バイキング', '定食おかわり自由'];

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

const BUDGETS = Array.from({ length: 15 }, (_, index) => 1000 + index * 500);
const WALK_MAXES = [3, 5, 10, 15];
const SLOTS: SlotCond[] = ['all', 'lunch', 'dinner'];
const SORTS: SortCond[] = ['recommend', 'cheap', 'near', 'short'];

function chip(active: boolean): string {
  return `filter-chip${active ? ' is-active' : ''}`;
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
    cond.slot !== 'all' || cond.timeLimit !== 'all' || cond.budget !== undefined || cond.walkMax !== undefined || cond.sort !== 'recommend';

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

  const quickGenre = cond.genres.length > 1 ? '__multiple__' : (cond.genres[0] ?? '');

  const areaLink = (prefecture: string, area: string): string => {
    const path = areaPath(prefecture, area);
    return lang === 'en' ? toEnPath(path) : path;
  };

  return (
    <main className="site-main search-page">
      <header className="search-hero">
        <div className="search-hero-copy">
          <p className="eyebrow">TOKYO / KANAGAWA</p>
          <h1>{lang === 'en' ? 'Find your next all-you-can-eat.' : '今日の食べ放題を、見つけよう。'}</h1>
          <p>{lang === 'en' ? 'Compare prices, time limits and locations across Tokyo and Kanagawa.' : '東京・神奈川の食べ放題を、料金・時間・場所で探せます。'}</p>
        </div>
        <img className="search-hero-image" src="/food/hero-all-day.png" alt="" />
      </header>

      <section className="search-panel" aria-label={lang === 'en' ? 'Search restaurants' : 'お店を検索'}>
        <div className="search-panel-heading">
          <div>
            <p className="search-panel-kicker">{lang === 'en' ? 'TODAY’S TABLE' : '今日の食卓'}</p>
            <h2>{lang === 'en' ? 'Start with area and cuisine.' : 'エリアとジャンルから、まず絞る。'}</h2>
          </div>
          <p>{lang === 'en' ? 'Then compare price and distance to find a table that fits.' : '料金と駅からの距離を見比べて、今日の候補を探せます。'}</p>
        </div>
        <div className="search-fields">
          <label className="keyword-field">
            <span>{dict.search.keywordSr}</span>
            <input
              type="search"
              placeholder={dict.search.keywordPlaceholder}
              value={cond.freeword}
              onChange={(e) => setCond((prev) => ({ ...prev, freeword: e.target.value }))}
            />
          </label>
          <label className="select-field">
            <span>{lang === 'en' ? 'Region' : '都県'}</span>
            <select
              aria-label={lang === 'en' ? 'Region' : '都県'}
              value={cond.prefecture}
              onChange={(e) => switchPrefecture(e.target.value as Prefecture)}
            >
              {PREFECTURES.map((prefecture) => <option key={prefecture} value={prefecture}>{prefName(lang, prefecture)}</option>)}
            </select>
          </label>
          <label className="select-field">
            <span>{lang === 'en' ? 'Area' : 'エリア'}</span>
            <select
              aria-label={lang === 'en' ? 'Area' : 'エリア'}
              value={cond.area ?? ''}
              onChange={(e) => setCond((prev) => ({ ...prev, area: e.target.value || undefined }))}
            >
              <option value="">{lang === 'en' ? `All ${prefName(lang, cond.prefecture)}` : `${prefName(lang, cond.prefecture)}すべて`}</option>
              {areas.map((area) => <option key={area} value={area}>{areaLabel(area)}</option>)}
            </select>
          </label>
          <label className="select-field">
            <span>{lang === 'en' ? 'Cuisine' : '料理ジャンル'}</span>
            <select
              aria-label={lang === 'en' ? 'Cuisine' : '料理ジャンル'}
              value={quickGenre}
              onChange={(e) => setCond((prev) => ({ ...prev, genres: e.target.value ? [e.target.value as Genre] : [] }))}
            >
              <option value="">{lang === 'en' ? 'All cuisines' : 'すべて'}</option>
              {cond.genres.length > 1 && <option value="__multiple__" disabled>{lang === 'en' ? 'Multiple selected' : '複数選択中'}</option>}
              {GENRES.map((genre) => <option key={genre} value={genre}>{dict.genres[genre]}</option>)}
            </select>
          </label>
          <label className="select-field">
            <span>{lang === 'en' ? 'Time' : '時間帯'}</span>
            <select
              aria-label={lang === 'en' ? 'Time' : '時間帯'}
              value={cond.slot}
              onChange={(e) => setCond((prev) => ({ ...prev, slot: e.target.value as SlotCond }))}
            >
              {SLOTS.map((slot) => <option key={slot} value={slot}>{dict.sheet.slots[slot]}</option>)}
            </select>
          </label>
          <label className="select-field">
            <span>{dict.sheet.budget}</span>
            <select
              aria-label={dict.sheet.budget}
              value={cond.budget ?? ''}
              onChange={(e) => setCond((prev) => ({ ...prev, budget: e.target.value === '' ? undefined : Number(e.target.value) }))}
            >
              <option value="">{budgetLabel(lang, undefined)}</option>
              {BUDGETS.map((yen) => <option key={yen} value={yen}>{budgetLabel(lang, yen)}</option>)}
            </select>
          </label>
          <label className="select-field">
            <span>{lang === 'en' ? 'Walk from station' : '駅からの徒歩時間'}</span>
            <select
              aria-label={lang === 'en' ? 'Walk from station' : '駅からの徒歩時間'}
              value={cond.walkMax ?? ''}
              onChange={(e) => setCond((prev) => ({ ...prev, walkMax: e.target.value === '' ? undefined : Number(e.target.value) }))}
            >
              <option value="">{lang === 'en' ? 'No preference' : '指定なし'}</option>
              {WALK_MAXES.map((minutes) => <option key={minutes} value={minutes}>{lang === 'en' ? `Within ${minutes} min` : `徒歩${minutes}分以内`}</option>)}
            </select>
          </label>
          <button type="button" aria-pressed={sheetActive} onClick={() => setSheetOpen(true)} className={`filter-button${sheetActive ? ' is-active' : ''}`}>
            {dict.search.filters}
          </button>
          <button type="button" onClick={resetCond} className="reset-button">{dict.search.reset}</button>
        </div>
      </section>

      <div className="search-layout">
        <aside className="search-sidebar" aria-label={lang === 'en' ? 'Location and cuisine' : 'エリア・ジャンルで絞り込み'}>
          <section className="sidebar-section">
            <h2>{lang === 'en' ? 'Location' : 'エリアから探す'}</h2>
            <div className="prefecture-tabs" role="group" aria-label={dict.search.prefectureGroup}>
              {PREFECTURES.map((p) => (
                <button key={p} type="button" aria-pressed={cond.prefecture === p} onClick={() => switchPrefecture(p)} className={chip(cond.prefecture === p)}>
                  {prefName(lang, p)}
                </button>
              ))}
            </div>
            <div className="filter-chip-list area-filters" role="group" aria-label={dict.search.areaGroup}>
              <button type="button" aria-pressed={cond.area === undefined} onClick={() => setCond((prev) => ({ ...prev, area: undefined }))} className={chip(cond.area === undefined)}>
                {dict.search.all}
              </button>
              {areas.map((area) => (
                <button key={area} type="button" aria-pressed={cond.area === area} onClick={() => setCond((prev) => ({ ...prev, area }))} className={chip(cond.area === area)}>
                  {areaLabel(area)}
                </button>
              ))}
            </div>
          </section>
          <section className="sidebar-section">
            <h2>{lang === 'en' ? 'Cuisine' : 'ジャンルから探す'}</h2>
            <div className="filter-chip-list genre-filters" role="group" aria-label={dict.search.genreGroup}>
              {GENRES.map((genre) => (
                <button key={genre} type="button" aria-pressed={cond.genres.includes(genre)} onClick={() => toggleGenre(genre)} className={chip(cond.genres.includes(genre))}>
                  {dict.genres[genre]}
                </button>
              ))}
            </div>
          </section>
        </aside>

        <section className="search-results" aria-label={lang === 'en' ? 'Search results' : '検索結果'}>
          <div className="results-toolbar">
            <div>
              <h2>{lang === 'en' ? `All-you-can-eat in ${cond.area ? areaLabel(cond.area) : prefName(lang, cond.prefecture)}` : `${cond.area ?? cond.prefecture}の食べ放題`}</h2>
              <p className="results-count" aria-live="polite">{resultsCount(lang, results.length)}</p>
            </div>
            <label className="sort-field">
              <span>{dict.sheet.sort}</span>
              <select aria-label={dict.sheet.sort} value={cond.sort} onChange={(e) => setCond((prev) => ({ ...prev, sort: e.target.value as SortCond }))}>
                {SORTS.map((sort) => <option key={sort} value={sort}>{dict.sheet.sorts[sort]}</option>)}
              </select>
            </label>
          </div>
          <div data-testid="results" className="results-list">
            {results.length === 0 ? (
              <EmptyState action={<button type="button" className="primary-button" onClick={resetCond}>{lang === 'en' ? 'Reset all filters' : 'すべての条件をリセット'}</button>} />
            ) : (
              results.map((store) => <StoreCard key={store.id} store={store} saved={savedIds.includes(store.id)} onToggleSave={toggleSave} />)
            )}
          </div>
          <nav className="browse-areas" aria-label={dict.search.browseByArea}>
            <h2>{dict.search.browseByArea}</h2>
            <ul>
              {prefectureAreas.map((a) => (
                <li key={`${a.prefecture}/${a.area}`}><Link to={areaLink(a.prefecture, a.area)}>{areaLabel(a.area)}</Link></li>
              ))}
            </ul>
          </nav>
        </section>
      </div>
      <footer className="site-disclaimer"><p>{dict.disclaimer}</p></footer>
      <FilterSheet
        open={sheetOpen}
        slot={cond.slot}
        timeLimit={cond.timeLimit}
        budget={cond.budget}
        walkMax={cond.walkMax}
        sort={cond.sort}
        onChange={(patch) => setCond((prev) => ({ ...prev, ...patch }))}
        onClose={() => setSheetOpen(false)}
      />
    </main>
  );
}
