import type { Store } from '../schema';

// 串家物語 ダイバーシティ東京プラザ店（公式ページで料金・時間・駅・営業時間を確認）。
// 平日ランチ 2,500・90分、平日ディナー 3,600・90分。土日祝はランチ 2,600・70分、ディナー 3,800・90分。
export const KUSHI_STORES: Store[] = [
  {
    id: 'kushi-odaiba-diversity',
    name: '串家物語 ダイバーシティ東京プラザ店',
    nameEn: 'Kushiya Monogatari DiverCity Tokyo Plaza Branch',
    kana: 'くしやものがたり おだいば',
    chain: '串家物語',
    officialUrl: 'https://divercity-tokyo.kushi-ya.com/',
    prefecture: '東京',
    area: 'お台場',
    station: '東京テレポート',
    walkMinutes: 5,
    facility: 'ダイバーシティ東京プラザ6F',
    facilityEn: 'DiverCity Tokyo Plaza 6F',
    genres: ['串揚げ'],
    pick: 4,
    courses: [
      { slot: 'lunch', name: '串揚げ食べ放題（ランチ）', nameEn: 'Kushiage (lunch)', priceInclTax: 2500, minutes: 90, note: '土日祝ランチは2,600・70分の場合あり', noteEn: 'Weekend & holiday lunch may be ¥2,600 for 70 min.' },
      { slot: 'dinner', name: '串揚げ食べ放題（ディナー）', nameEn: 'Kushiage (dinner)', priceInclTax: 3600, minutes: 90, note: '土日祝ディナーは3,800の場合あり', noteEn: 'Weekend & holiday dinner may be ¥3,800.' },
    ],
    hours: '11:00–22:00',
    hoursEn: '11:00–22:00',
    highlights: ['自分で揚げる串揚げが食べ放題の目安', '東京テレポート駅から徒歩5分の目安'],
    highlightsEn: ['Fry-your-own kushiage, all-you-can-eat', '5-min walk from Tokyo Teleport Station'],
    notice:
      '料金・制限時間は2026年時点の公開情報の目安です。曜日で料金・分数が変わります。行く前に公式を確認してください。',
    noticeEn:
      'Prices and time limits are edited from public info as of 2026. Prices and durations vary by day. Check the official source before you go.',
    familyFriendly: true,
    kidsDiscount: true,
    reservationUrl: 'https://www.hotpepper.jp/strJ001044397/',
  },
];
