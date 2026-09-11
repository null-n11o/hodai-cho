export const CATALOG_VERSION = '2026-09-11+features.0';

export type Prefecture = '東京' | '神奈川';
export type TimeSlot = 'lunch' | 'dinner' | 'all-day';
export type Genre = '焼肉' | 'しゃぶしゃぶ' | '寿司' | 'スイーツ' | 'ピザ' | '串揚げ' | '宴会食放' | 'パン食べ放題' | 'お好み焼き' | 'サラダバー' | 'バイキング' | '定食おかわり自由';
export type AffiliateProvider = 'valuecommerce' | 'linkshare' | 'a8';

export interface Course {
  slot: TimeSlot;
  name: string;
  nameEn: string;
  priceInclTax: number;
  minutes: number | null; // null は時間無制限
  note?: string;
  noteEn?: string;
  banquet?: boolean; // 宴会コース由来なら true
}

export interface Store {
  id: string;
  name: string;
  nameEn: string;
  kana: string;
  chain: string;
  prefecture: Prefecture;
  area: string;
  station: string;
  walkMinutes: number;
  facility?: string;
  facilityEn?: string;
  genres: Genre[];
  subGenres?: Genre[];
  pick: 1 | 2 | 3 | 4 | 5; // 編集ピック。外部点数ではない
  courses: Course[];
  hours: string;
  hoursEn: string;
  closed?: string; // データは持つが画面では出さない
  highlights: string[];
  highlightsEn: string[];
  notice: string; // 行く前に
  noticeEn: string;
  familyFriendly: boolean; // データは持つが画面では出さない
  soloFriendly?: boolean; // 1人利用歓迎
  kidsDiscount?: boolean; // 幼児無料・子供料金あり
  weekdayUnlimited?: boolean; // 平日時間無制限コースあり
  reservationUrl?: string; // 予約の正規URL。アフィリエイト未設定時のフォールバック
  reservationAffiliateUrl?: string; // 予約CTA用の任意アフィリエイトURL。あれば予約CTAに使う
  reservationAffiliateProvider?: AffiliateProvider; // 監査用。画面では使わない
  officialUrl?: string; // 公式サイトの外部素リンク
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
    if (!s.nameEn) errors.push(`missing nameEn: ${s.id}`);
    if (!s.hoursEn) errors.push(`missing hoursEn: ${s.id}`);
    if (!s.noticeEn) errors.push(`missing noticeEn: ${s.id}`);
    if (s.highlightsEn.length !== s.highlights.length) errors.push(`highlightsEn length: ${s.id}`);
    for (const h of s.highlightsEn) {
      if (!h) errors.push(`empty highlightsEn: ${s.id}`);
    }
    if (s.facility && !s.facilityEn) errors.push(`missing facilityEn: ${s.id}`);
    if (!s.facility && s.facilityEn) errors.push(`stray facilityEn: ${s.id}`);
    for (const c of s.courses) {
      if (!c.nameEn) errors.push(`missing course nameEn: ${s.id}/${c.name}`);
      if (c.note && !c.noteEn) errors.push(`missing course noteEn: ${s.id}/${c.name}`);
      if (!c.note && c.noteEn) errors.push(`stray course noteEn: ${s.id}/${c.name}`);
    }
  }
  return errors;
}
