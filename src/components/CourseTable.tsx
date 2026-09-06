import type { Course } from '../catalog/schema';

interface CourseTableProps {
  courses: Course[];
}

const SLOT_LABEL: Record<Course['slot'], string> = {
  lunch: 'ランチ',
  dinner: 'ディナー',
  'all-day': '終日',
};

export function CourseTable({ courses }: CourseTableProps) {
  const notes = courses.map((c) => c.note).filter((n): n is string => Boolean(n));
  return (
    <div>
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="text-stone">
            <th scope="col" className="min-h-[44px] py-2 pr-2 font-normal">時間帯</th>
            <th scope="col" className="min-h-[44px] py-2 pr-2 font-normal">コース</th>
            <th scope="col" className="min-h-[44px] py-2 pr-2 text-right font-normal">税込</th>
            <th scope="col" className="min-h-[44px] py-2 text-right font-normal">制限時間</th>
          </tr>
        </thead>
        <tbody>
          {courses.map((c) => (
            <tr key={c.name} className="border-t border-stonedim/40 text-ivory">
              <td className="py-3 pr-2">{SLOT_LABEL[c.slot]}</td>
              <td className="py-3 pr-2">{c.name}</td>
              <td className="py-3 pr-2 text-right">¥{c.priceInclTax.toLocaleString('ja-JP')}</td>
              <td className="py-3 text-right">{c.minutes === null ? '無制限' : `${c.minutes}分`}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {notes.map((note) => (
        <p key={note} className="mt-1 text-xs text-stone">
          {note}
        </p>
      ))}
    </div>
  );
}
