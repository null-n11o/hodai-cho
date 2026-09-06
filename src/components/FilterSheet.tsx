import type { SlotCond, SortCond, TimeLimitCond } from '../filters/filter';

interface FilterSheetProps {
  open: boolean;
  slot: SlotCond;
  timeLimit: TimeLimitCond;
  budget: number | undefined;
  sort: SortCond;
  onChange: (patch: { slot?: SlotCond; timeLimit?: TimeLimitCond; budget?: number | undefined; sort?: SortCond }) => void;
  onClose: () => void;
}

const SLOTS: { value: SlotCond; label: string }[] = [
  { value: 'all', label: 'すべて' },
  { value: 'lunch', label: 'ランチ' },
  { value: 'dinner', label: 'ディナー' },
];

const TIME_LIMITS: { value: TimeLimitCond; label: string }[] = [
  { value: 'all', label: '指定なし' },
  { value: 'unlimited', label: '無制限' },
  { value: 'le90', label: '90分以内' },
  { value: 'le120', label: '120分以内' },
];

const SORTS: { value: SortCond; label: string }[] = [
  { value: 'recommend', label: 'おすすめ' },
  { value: 'cheap', label: '安い順' },
  { value: 'near', label: '近い順' },
  { value: 'short', label: '短い順' },
];

const BUDGETS: number[] = [];
for (let yen = 1000; yen <= 8000; yen += 500) BUDGETS.push(yen);

function chip(active: boolean): string {
  return `min-h-[44px] whitespace-nowrap rounded-full border px-4 py-2 text-sm transition-colors ${
    active ? 'border-aka bg-aka text-ivory' : 'border-stonedim/60 text-stone'
  }`;
}

export function FilterSheet({ open, slot, timeLimit, budget, sort, onChange, onClose }: FilterSheetProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50">
      <button type="button" aria-label="閉じる" onClick={onClose} className="absolute inset-0 min-h-[44px] w-full bg-black/60" />
      <div role="dialog" aria-modal="true" aria-label="詳細条件" className="absolute inset-x-0 bottom-0 mx-auto w-full max-w-lg rounded-t-2xl bg-ink p-5 pb-8">
        <h2 className="text-lg font-bold text-ivory">詳細条件</h2>
        <section className="mt-4" aria-label="時間帯">
          <h3 className="text-sm text-stone">時間帯</h3>
          <div className="mt-2 flex flex-wrap gap-2">
            {SLOTS.map((o) => (
              <button key={o.value} type="button" aria-pressed={slot === o.value} onClick={() => onChange({ slot: o.value })} className={chip(slot === o.value)}>
                {o.label}
              </button>
            ))}
          </div>
        </section>
        <section className="mt-4" aria-label="分数">
          <h3 className="text-sm text-stone">分数</h3>
          <div className="mt-2 flex flex-wrap gap-2">
            {TIME_LIMITS.map((o) => (
              <button key={o.value} type="button" aria-pressed={timeLimit === o.value} onClick={() => onChange({ timeLimit: o.value })} className={chip(timeLimit === o.value)}>
                {o.label}
              </button>
            ))}
          </div>
        </section>
        <section className="mt-4" aria-label="予算の上限">
          <h3 className="text-sm text-stone">予算の上限</h3>
          <select
            aria-label="予算の上限"
            value={budget ?? ''}
            onChange={(e) => onChange({ budget: e.target.value === '' ? undefined : Number(e.target.value) })}
            className="mt-2 min-h-[44px] w-full rounded-lg border border-stonedim/60 bg-ink px-3 text-ivory"
          >
            <option value="">指定なし</option>
            {BUDGETS.map((yen) => (
              <option key={yen} value={yen}>
                ¥{yen.toLocaleString('ja-JP')}まで
              </option>
            ))}
          </select>
        </section>
        <section className="mt-4" aria-label="並び">
          <h3 className="text-sm text-stone">並び</h3>
          <div className="mt-2 flex flex-wrap gap-2">
            {SORTS.map((o) => (
              <button key={o.value} type="button" aria-pressed={sort === o.value} onClick={() => onChange({ sort: o.value })} className={chip(sort === o.value)}>
                {o.label}
              </button>
            ))}
          </div>
        </section>
        <button type="button" onClick={onClose} className="mt-6 min-h-[44px] w-full rounded-lg bg-aka font-bold text-ivory">
          閉じる
        </button>
      </div>
    </div>
  );
}
