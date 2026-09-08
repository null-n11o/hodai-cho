import type { Genre, Prefecture } from '../catalog/schema';
import type { SlotCond, SortCond, TimeLimitCond } from '../filters/filter';

export interface Dict {
  nav: {
    search: string;
    saved: string;
    contact: string;
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
  contact: {
    title: string;
    lead: string;
    intro: string;
    formTitle: string;
    requestType: string;
    requestTypes: {
      correction: string;
      addition: string;
      closed: string;
      other: string;
    };
    store: string;
    storePlaceholder: string;
    storeSearchHint: string;
    storeNoMatches: string;
    details: string;
    detailsPlaceholder: string;
    sourceUrl: string;
    sourceUrlHint: string;
    visitedAt: string;
    visitedAtHint: string;
    replyTo: string;
    replyToHint: string;
    submit: string;
    submitted: string;
    githubNote: string;
    processTitle: string;
    process: string[];
    goodReportTitle: string;
    goodReports: string[];
    directLink: string;
    backToSearch: string;
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
    contact: '情報提供',
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
  contact: {
    title: 'みんなで更新する、食べ放題の条件帳',
    lead: '掲載内容の違い・新しいお店を教えてください。',
    intro: '放題帖は、食べ放題を探す人の情報で少しずつ更新していきます。送っていただいた内容は運営が確認してから掲載します。',
    formTitle: '情報を送る',
    requestType: '送る内容',
    requestTypes: {
      correction: '掲載内容を修正したい',
      addition: '新しい店を知らせたい',
      closed: '閉店・提供終了を知らせたい',
      other: 'その他の問い合わせ',
    },
    store: '店名・エリア',
    storePlaceholder: '店名・エリアを検索（例：蔵部 銀座）',
    storeSearchHint: '候補にない店は、店名・エリアをそのまま入力できます。',
    storeNoMatches: '候補がありません。そのまま入力して送れます。',
    details: '内容',
    detailsPlaceholder: '価格、食べ放題の対象、制限時間、提供曜日など、分かる範囲で書いてください。',
    sourceUrl: '公式ページ・参考URL（任意）',
    sourceUrlHint: 'お店の公式ページやメニューがあると確認が早くなります。',
    visitedAt: '確認した時期（任意）',
    visitedAtHint: '実際に行った日や、情報を見た時期を書いてください。',
    replyTo: '返信先（任意）',
    replyToHint: '返信が必要なときだけ。GitHubの公開プロフィールなどでも構いません。',
    submit: 'GitHubの投稿画面を開く',
    submitted: '投稿内容をGitHubの下書きにしました。内容を確認して送信してください。',
    githubNote: 'このサイトはデータベースを持たないため、GitHub Issuesの新規投稿画面を使います。GitHubアカウントが必要です。',
    processTitle: '送ってから掲載まで',
    process: ['あなたが情報を送る', '運営が公式情報や訪問情報を確認する', '確認できた内容をカタログへ反映する'],
    goodReportTitle: '確認しやすい情報',
    goodReports: ['税込価格と対象メニュー', 'ご飯・味噌汁など、何がおかわり自由か', 'ランチ・曜日・制限時間の条件', '公式ページ、メニュー写真、訪問日'],
    directLink: 'GitHubで直接投稿する',
    backToSearch: '店を探す',
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
    定食おかわり自由: '定食おかわり自由',
  },
  prefs: {
    東京: '東京',
    神奈川: '神奈川',
  },
};
