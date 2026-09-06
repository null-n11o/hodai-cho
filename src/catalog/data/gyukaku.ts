import type { Store } from '../schema';

// 新規開拓：牛角 新宿大ガード店（公式コースページで料金・分数・駅・営業時間を確認）。
// 牛角コース 4,158・90分。平日16時〜・土日12時〜のためディナーのみ掲載。
export const GYUKAKU_STORES: Store[] = [
  {
    id: 'gyukaku-shinjuku-oguard',
    name: '牛角 新宿大ガード店',
    officialUrl: 'https://gyukaku-shijukuogard.owst.jp/',
    kana: 'ぎゅうかく しんじゅく',
    chain: '牛角',
    prefecture: '東京',
    area: '新宿',
    station: '新宿',
    walkMinutes: 1,
    facility: '小滝橋パシフィカビルB1F',
    genres: ['焼肉'],
    pick: 4,
    courses: [
      { slot: 'dinner', name: 'お気軽コース食べ放題', priceInclTax: 3058, minutes: 90 },
      { slot: 'dinner', name: '牛角コース食べ放題', priceInclTax: 4158, minutes: 90 },
    ],
    hours: '月〜金・祝・祝前16:00–23:00、土日12:00–23:00',
    highlights: ['定番カルビ・ハラミが食べ放題の目安', '新宿駅から徒歩1分の目安'],
    notice:
      '土日は昼営業あり。ランチコースの有無・料金は公式を確認してください。料金は2026年時点の公開情報の目安です。行く前に公式を確認してください。',
    familyFriendly: true,
    reservationUrl: 'https://www.hotpepper.jp/strJ003365961/',
  },
];
