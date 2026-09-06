export const CATALOG_VERSION = '2026-09-06+enkaibanquet.1';

export type Prefecture = '東京' | '神奈川';
export type TimeSlot = 'lunch' | 'dinner' | 'all-day';
export type Genre = '焼肉' | 'しゃぶしゃぶ' | '寿司' | 'スイーツ' | 'ピザ' | '串揚げ' | '宴会食放';

export interface Course {
  slot: TimeSlot;
  name: string;
  priceInclTax: number;
  minutes: number | null; // null は時間無制限
  note?: string;
  banquet?: boolean; // 宴会コース由来なら true
}

export interface Store {
  id: string;
  name: string;
  kana: string;
  chain: string;
  prefecture: Prefecture;
  area: string;
  station: string;
  walkMinutes: number;
  facility?: string;
  genres: Genre[];
  subGenres?: Genre[];
  pick: 1 | 2 | 3 | 4 | 5; // 編集ピック。外部点数ではない
  courses: Course[];
  hours: string;
  closed?: string; // データは持つが画面では出さない
  highlights: string[];
  notice: string; // 行く前に
  familyFriendly: boolean; // データは持つが画面では出さない
  reservationUrl?: string; // 外部素リンク
}

export function validateCatalog(stores: Store[]): string[] {
  const errors: string[] = [];
  const ids = new Set<string>();
  for (const s of stores) {
    if (ids.has(s.id)) errors.push(`duplicate id: ${s.id}`);
    ids.add(s.id);
    if (s.courses.length === 0) errors.push(`no courses: ${s.id}`);
    for (const c of s.courses) {
      if (!Number.isInteger(c.priceInclTax) || c.priceInclTax <= 0) errors.push(`bad price: ${s.id}/${c.name}`);
      if (c.minutes !== null && (!Number.isInteger(c.minutes) || c.minutes <= 0)) errors.push(`bad minutes: ${s.id}/${c.name}`);
    }
    if (s.pick < 1 || s.pick > 5) errors.push(`bad pick: ${s.id}`);
  }
  return errors;
}
