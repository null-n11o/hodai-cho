import type { Genre, Prefecture } from '../catalog/schema';
import type { SlotCond, SortCond, TimeLimitCond } from '../filters/filter';

export interface Dict {
  nav: {
    search: string;
    saved: string;
    main: string;
  };
  lang: {
    toEnglish: string;
    toEnglishLabel: string;
    toJapanese: string;
    toJapaneseLabel: string;
  };
  hero: {
    tagline: string;
  };
  search: {
    prefectureGroup: string;
    areaGroup: string;
    genreGroup: string;
    all: string;
    keywordSr: string;
    keywordPlaceholder: string;
    filters: string;
    reset: string;
    browseByArea: string;
  };
  sheet: {
    title: string;
    dialogLabel: string;
    closeLabel: string;
    time: string;
    duration: string;
    budget: string;
    sort: string;
    close: string;
    slots: Record<SlotCond, string>;
    limits: Record<TimeLimitCond, string>;
    sorts: Record<SortCond, string>;
  };
  card: {
    lunch: string;
    dinner: string;
    noBuffet: string;
    save: string;
  };
  course: {
    time: string;
    course: string;
    price: string;
    limit: string;
    slots: Record<'lunch' | 'dinner' | 'all-day', string>;
    noLimit: string;
  };
  detail: {
    back: string;
    courses: string;
    highlights: string;
    beforeYouGo: string;
    maps: string;
    official: string;
    reserve: string;
    similar: string;
    notFound: string;
    notFoundAdvice: string;
    backToSearch: string;
  };
  saved: {
    title: string;
    emptyTitle: string;
    emptyAdvice: string;
    backToSearch: string;
  };
  area: {
    emptyTitle: string;
    emptyAdvice: string;
    backToSearch: string;
    changeFilters: string;
  };
  empty: {
    title: string;
    advice: string[];
  };
  disclaimer: string;
  genres: Record<Genre, string>;
  prefs: Record<Prefecture, string>;
}

export const ja: Dict = {
  nav: {
    search: '探す',
    saved: '保存',
    main: 'メイン',
  },
  lang: {
    toEnglish: 'English',
    toEnglishLabel: 'Switch to English',
    toJapanese: '日本語',
    toJapaneseLabel: '日本語に切り替える',
  },
  hero: {
    tagline: '食べ放題だけを、料金と時間で切る',
  },
  search: {
    prefectureGroup: '都県',
    areaGroup: 'エリア',
    genreGroup: 'ジャンル',
    all: 'すべて',
    keywordSr: 'フリーワード',
    keywordPlaceholder: '店名・駅名で探す',
    filters: '条件',
    reset: 'リセット',
    browseByArea: 'エリアから探す',
  },
  sheet: {
    title: '詳細条件',
    dialogLabel: '詳細条件',
    closeLabel: '閉じる',
    time: '時間帯',
    duration: '分数',
    budget: '予算の上限',
    sort: '並び',
    close: '閉じる',
    slots: { all: 'すべて', lunch: 'ランチ', dinner: 'ディナー' },
    limits: { all: '指定なし', unlimited: '無制限', le90: '90分以内', le120: '120分以内' },
    sorts: { recommend: 'おすすめ', cheap: '安い順', near: '近い順', short: '短い順' },
  },
  card: {
    lunch: 'ランチ',
    dinner: 'ディナー',
    noBuffet: '食べ放題なし',
    save: '保存する',
  },
  course: {
    time: '時間帯',
    course: 'コース',
    price: '税込',
    limit: '制限時間',
    slots: { lunch: 'ランチ', dinner: 'ディナー', 'all-day': '終日' },
    noLimit: '無制限',
  },
  detail: {
    back: '戻る',
    courses: 'コース',
    highlights: 'ポイント',
    beforeYouGo: '行く前に',
    maps: '地図で探す',
    official: '公式サイト',
    reserve: '予約する',
    similar: '近い・同じ系列',
    notFound: '店が見つからない',
    notFoundAdvice: '条件が変わったか、掲載が終わった可能性があります',
    backToSearch: '探すへ戻る',
  },
  saved: {
    title: '保存した店',
    emptyTitle: 'まだ保存した店はない',
    emptyAdvice: '気になる店のハートを押すとここに残ります',
    backToSearch: '探すへ戻る',
  },
  area: {
    emptyTitle: 'そのエリアの店はない',
    emptyAdvice: 'エリア名が変わったか、掲載が終わった可能性があります',
    backToSearch: '探すへ戻る',
    changeFilters: '条件を変えて探す',
  },
  empty: {
    title: 'その条件の店はない',
    advice: ['エリアを「すべて」に戻してみる', '予算の上限を上げてみる', '分数の条件を緩めてみる'],
  },
  disclaimer:
    '掲載は東京・神奈川の食べ放題店に限った目安です。料金・制限時間は2026年時点の公開情報を編集したもので、店舗・曜日・フェアで変わります。行く前に公式を確認してください。',
  genres: {
    焼肉: '焼肉',
    しゃぶしゃぶ: 'しゃぶしゃぶ',
    寿司: '寿司',
    スイーツ: 'スイーツ',
    ピザ: 'ピザ',
    串揚げ: '串揚げ',
    宴会食放: '宴会食放',
    パン食べ放題: 'パン食べ放題',
    お好み焼き: 'お好み焼き',
    サラダバー: 'サラダバー',
    バイキング: 'バイキング',
  },
  prefs: {
    東京: '東京',
    神奈川: '神奈川',
  },
};
