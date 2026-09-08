# 食べ放題検索UI刷新 実装計画

設計: ../specs/2026-09-08-search-redesign-design.md

## Task 1: 全画面の検索サイトUIへの統一（単一コミット）
対象: src/pages/*、src/components/*、src/index.css、tailwind.config.js、日英辞書、index.html、tests/search.test.tsx、設計正本とAGENTS.md。

- [x] 常時表示の時間帯・予算、並び替え、条件リセットの動作テストを追加しREDを確認。
- [x] 共通ヘッダー、検索レイアウト、比較しやすい店舗カード、詳細・保存・エリア画面を実装。
- [x] 必要なフォーカス管理と狭い画面への対応を実装。
- [x] 個別テストでGREENを確認し、重複と翻訳漏れを整理。
- [x] サブエージェントによる仕様準拠レビュー、その後品質レビューを実施し指摘を修正。
- [x] 全テスト・lint・SSGビルドとPC/モバイルのブラウザ検証。
- [x] 完了チェックを記録しコミット。

掲載追加、依存更新、公開は含まない。視覚制約の変更はユーザー回答で確定する。

検証: 98 tests PASS、lintは既存のGenreImage fast-refresh警告1件のみ、build:ssg成功（292 URL）。ブラウザで320/375/1280px・日英・保存・0件・パネル開閉を確認。白ベース案は保留し既存配色で完了。
