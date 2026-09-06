import type { Genre, Prefecture, Store, TimeSlot } from '../catalog/schema';

export type SlotCond = 'all' | 'lunch' | 'dinner';
export type TimeLimitCond = 'all' | 'unlimited' | 'le90' | 'le120';
export type SortCond = 'recommend' | 'cheap' | 'near' | 'short';

export interface FilterCond {
  prefecture: Prefecture;
  area?: string;
  freeword: string;
  genres: Genre[];
  slot: SlotCond;
  timeLimit: TimeLimitCond;
  budget?: number;
  sort: SortCond;
}

function slotHit(slot: TimeSlot, cond: SlotCond): boolean {
  if (cond === 'all') return true;
  return slot === cond || slot === 'all-day';
}

function norm(s: string): string {
  return s
    .normalize('NFKC')
    .toLowerCase()
    .replace(/[ァ-ン]/g, (ch) => String.fromCharCode(ch.charCodeAt(0) - 0x60));
}

export function coursesInScope(store: Store, cond: FilterCond) {
  return store.courses.filter((c) => slotHit(c.slot, cond.slot));
}

export function minPrice(courses: { priceInclTax: number }[]): number {
  return Math.min(...courses.map((c) => c.priceInclTax));
}

export function shortestFinite(courses: { minutes: number | null }[]): number {
  const finite = courses.map((c) => c.minutes).filter((m): m is number => m !== null);
  return finite.length === 0 ? 999 : Math.min(...finite);
}

export function filterStores(stores: Store[], cond: FilterCond): Store[] {
  const fw = norm(cond.freeword.trim());
  const out = stores.filter((s) => {
    if (s.prefecture !== cond.prefecture) return false;
    if (cond.area && s.area !== cond.area) return false;
    if (cond.genres.length > 0) {
      const all = [...s.genres, ...(s.subGenres ?? [])];
      if (!cond.genres.some((g) => all.includes(g))) return false;
    }
    if (fw) {
      const hay = norm([s.name, s.kana, s.chain, s.station, s.facility ?? ''].join(' '));
      if (!hay.includes(fw)) return false;
    }
    const scoped = coursesInScope(s, cond);
    if (scoped.length === 0) return false;
    if (cond.timeLimit === 'unlimited' && !scoped.some((c) => c.minutes === null)) return false;
    if (cond.timeLimit === 'le90' && !scoped.some((c) => c.minutes !== null && c.minutes <= 90)) return false;
    if (cond.timeLimit === 'le120' && !scoped.some((c) => c.minutes === null || (c.minutes !== null && c.minutes <= 120))) return false;
    if (cond.budget !== undefined && minPrice(scoped) > cond.budget) return false;
    return true;
  });
  const by = {
    recommend: (a: Store, b: Store) =>
      b.pick - a.pick || minPrice(coursesInScope(a, cond)) - minPrice(coursesInScope(b, cond)) || a.walkMinutes - b.walkMinutes,
    cheap: (a: Store, b: Store) => minPrice(coursesInScope(a, cond)) - minPrice(coursesInScope(b, cond)),
    near: (a: Store, b: Store) => a.walkMinutes - b.walkMinutes,
    short: (a: Store, b: Store) => shortestFinite(coursesInScope(a, cond)) - shortestFinite(coursesInScope(b, cond)),
  }[cond.sort];
  return [...out].sort(by);
}
