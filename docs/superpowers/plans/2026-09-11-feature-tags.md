# こだわり条件タグ（1人歓迎・幼児無料/子供料金・平日時間無制限） 実装計画

- 日付: 2026-09-11
- 設計書: `docs/superpowers/specs/2026-09-11-feature-tags-design.md`
- 目的: 食べ放題特有のリアルな利用シチュエーションに応えるため、「1人歓迎」「幼児無料・子供料金」「平日時間無制限」の3タグを導入し、データ構造・フィルタ・検索UI・カード/詳細バッジを完全日英対応で実装する。

---

## タスク一覧

### Task 1: スキーマ拡張とバリデーション
- **対象ファイル**: `src/catalog/schema.ts`, `tests/feature-tags.test.ts`
- **作業内容**:
  - `src/catalog/schema.ts` の `Store` インターフェースに `soloFriendly?: boolean`, `kidsDiscount?: boolean`, `weekdayUnlimited?: boolean` を追加
  - `tests/feature-tags.test.ts` を作成し、スキーマ定義とカタログバリデーションを検証（RED -> GREEN）
- **検証**: `npx vitest run tests/feature-tags.test.ts`
- **コミット**: `feat: StoreスキーマにsoloFriendly・kidsDiscount・weekdayUnlimitedを追加`

### Task 2: フィルタロジックの拡張 (TDD)
- **対象ファイル**: `src/filters/filter.ts`, `tests/filter.test.ts`
- **作業内容**:
  - `tests/filter.test.ts` に各こだわり条件の絞り込み、および複数タグの複合（AND）絞り込みのテストケースを追加（RED）
  - `src/filters/filter.ts` の `FilterCond` にフラグを追加し、`filterStores` での絞り込みを実装（GREEN）
- **検証**: `npx vitest run tests/filter.test.ts`
- **コミット**: `feat: フィルタ条件にこだわり条件タグの絞り込みロジックを追加`

### Task 3: カタログデータへのこだわり条件フラグ付与
- **対象ファイル**: `src/catalog/data/*.ts`
- **作業内容**:
  - 主要チェーンおよび既存店舗に正確なこだわりフラグを付与
    - 1人歓迎 (`soloFriendly: true`): 定食おかわりチェーン（ねぎし、寅福、やよい軒）、一人鍋/一人焼肉対応店
    - 幼児無料・子供料金 (`kidsDiscount: true`): シズラー、シェーキーズ、すたみな太郎、モーモーパラダイス、温野菜等
    - 平日時間無制限 (`weekdayUnlimited: true`): 平日ランチ無制限コースを持つ店舗
  - `validateCatalog` が全店舗エラーなしで通過することを確認
- **検証**: `npx vitest run tests/feature-tags.test.ts tests/repository.test.ts`
- **コミット**: `feat: カタログ店舗にこだわり条件タグのデータを付与`

### Task 4: UI対応（日英翻訳・バッジ表示・検索UI）
- **対象ファイル**:
  - `src/i18n/ja.ts`, `src/i18n/en.ts`
  - `src/components/StoreCard.tsx`
  - `src/pages/DetailPage.tsx`
  - `src/components/FilterSheet.tsx`
  - `src/pages/SearchPage.tsx`
  - `tests/feature-tags-ui.test.tsx`
- **作業内容**:
  - 日英辞書にこだわり条件の文言を追加
    - 1人歓迎 / `Solo friendly`
    - 幼児無料・子供料金 / `Kids discount`
    - 平日時間無制限 / `Weekday unlimited`
  - `StoreCard` と `DetailPage` に条件バッジを表示（「食卓の新聞」の世界観・絵文字なし・落ち着いたライン枠）
  - `SearchPage` のチップ列および `FilterSheet` にこだわり条件のトグルを追加（タップ面44px以上確保）
  - `tests/feature-tags-ui.test.tsx` でUIの描画・フィルタリング・日英切り替えを検証
- **検証**: `npx vitest run tests/feature-tags-ui.test.tsx tests/search.test.tsx`
- **コミット**: `feat: 検索画面と店舗カード・詳細にこだわり条件タグのUIと日英表示を追加`

### Task 5: 全体検証とPR作成
- **作業内容**:
  - `npm test`（全テスト通過）
  - `npm run lint`（oxlint通過）
  - `npm run build`（ビルド通過）
  - `npm run build:ssg`（SSGプリレンダ生成正常）
  - 作業ブランチ `feature/m1-feature-tags` から GitHub PR を作成
- **検証**: 全チェック正常通過
- **コミット/PR**: PR作成・URL提出
