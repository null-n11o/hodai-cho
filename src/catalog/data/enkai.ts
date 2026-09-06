import type { Store } from '../schema';

// 新規開拓：宴会食放。肉ヤロー 新宿東口店（公式・コースページで料金・駅・営業時間を確認）。
// 炙り肉寿司の宴会食べ放題コース 3,700・180分（3時間飲み放題付きプラン）。時期限定の特別価格あり。
export const ENKAI_STORES: Store[] = [
  {
    id: 'nikuyaro-shinjuku-east',
    name: '肉ヤロー 新宿東口店',
    nameEn: 'Niku Yaro Shinjuku East Exit Branch',
    kana: 'にくやろー しんじゅく',
    chain: '肉ヤロー',
    officialUrl: 'https://nikuyaro.owst.jp/',
    prefecture: '東京',
    area: '新宿',
    station: '新宿',
    walkMinutes: 2,
    facility: 'ウイングスビル2F',
    facilityEn: 'Wings Bldg. 2F',
    genres: ['宴会食放'],
    pick: 4,
    courses: [
      {
        slot: 'dinner',
        name: '炙り肉寿司宴会食べ放題コース',
        nameEn: 'Seared meat sushi banquet (all-you-can-eat)',
        priceInclTax: 3700,
        minutes: 180,
        banquet: true,
        note: '3時間飲み放題付きプランの目安。時期限定の特別価格あり',
        noteEn: 'Plan with 3-hour free drinks (estimate). Seasonal special pricing available.',
      },
    ],
    hours: '11:00–24:00',
    hoursEn: '11:00–24:00',
    highlights: ['炙り肉寿司の宴会食べ放題の目安', '新宿駅から徒歩2分の目安'],
    highlightsEn: ['Seared meat sushi banquet, all-you-can-eat', '2-min walk from Shinjuku Station'],
    notice:
      '宴会コースのため内容・料金は時期で変わります。料金は2026年時点の公開情報の目安です。行く前に公式を確認してください。',
    noticeEn:
      'Banquet course: items and prices change seasonally. Prices are edited from public info as of 2026. Check the official source before you go.',
    familyFriendly: false,
    reservationUrl: 'https://www.hotpepper.jp/strJ001135472/',
  },
];
