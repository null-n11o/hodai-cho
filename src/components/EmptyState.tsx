import type { ReactNode } from 'react';

interface EmptyStateProps {
  title?: string;
  advice?: string[];
  action?: ReactNode;
}

const DEFAULT_ADVICE = [
  'エリアを「すべて」に戻してみる',
  '予算の上限を上げてみる',
  '分数の条件を緩めてみる',
];

export function EmptyState({ title = 'その条件の店はない', advice = DEFAULT_ADVICE, action }: EmptyStateProps) {
  return (
    <div className="rounded-lg border border-stonedim/40 p-6 text-center">
      <p className="text-lg font-bold text-ivory">{title}</p>
      <ul className="mt-3 space-y-1 text-sm text-stone">
        {advice.map((line) => (
          <li key={line}>{line}</li>
        ))}
      </ul>
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}
