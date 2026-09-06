import type { Lang } from './language';
import { AREA_EN } from '../catalog/en-names';

function localeOf(lang: Lang): string {
  return lang === 'en' ? 'en-US' : 'ja-JP';
}

/** 料金の核表示。¥を保ち数値はカタログ値をそのまま桁区切りする。 */
export function priceCore(lang: Lang, n: number): string {
  return `¥${n.toLocaleString(localeOf(lang))}〜`;
}

export function durationLabel(lang: Lang, minutes: number | null): string {
  if (minutes === null) return lang === 'en' ? 'No time limit' : '無制限';
  return lang === 'en' ? `${minutes} min` : `${minutes}分`;
}

export function resultsCount(lang: Lang, n: number): string {
  if (lang === 'en') return n === 1 ? '1 result' : `${n} results`;
  return `${n}件`;
}

/** 駅名自体は変えず前後の助詞だけ訳す。 */
export function stationLine(lang: Lang, station: string, walkMinutes: number, facility?: string): string {
  if (lang === 'en') return `${station} Sta. ${walkMinutes}-min walk${facility ? ` · ${facility}` : ''}`;
  return `${station}駅 徒歩${walkMinutes}分${facility ? `・${facility}` : ''}`;
}

export function areaCountLine(lang: Lang, n: number): string {
  return lang === 'en' ? `${n} results · by price and time` : `${n}件・料金と時間で切る`;
}

export function areaTitle(lang: Lang, area: string): string {
  if (lang === 'en') return `All-you-can-eat in ${AREA_EN[area] ?? area}`;
  return `${area}の食べ放題`;
}

export function prefName(lang: Lang, prefecture: string): string {
  if (lang === 'en') {
    if (prefecture === '東京') return 'Tokyo';
    if (prefecture === '神奈川') return 'Kanagawa';
  }
  return prefecture;
}

export function budgetLabel(lang: Lang, yen: number | undefined): string {
  if (yen === undefined) return lang === 'en' ? 'No limit' : '指定なし';
  const shown = `¥${yen.toLocaleString(localeOf(lang))}`;
  return lang === 'en' ? `Up to ${shown}` : `${shown}まで`;
}
