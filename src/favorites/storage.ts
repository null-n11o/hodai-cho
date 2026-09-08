const KEY = 'tabeho';
const LEGACY_KEY = 'hodai-cho';

function parseIds(raw: string | null): string[] {
  try {
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((x): x is string => typeof x === 'string') : [];
  } catch {
    return [];
  }
}

function readRawWithMigration(): string | null {
  try {
    const current = localStorage.getItem(KEY);
    if (current !== null) return current;
    const legacy = localStorage.getItem(LEGACY_KEY);
    if (legacy === null) return null;
    localStorage.setItem(KEY, legacy);
    localStorage.removeItem(LEGACY_KEY);
    return legacy;
  } catch {
    return null;
  }
}

export function loadFavorites(): string[] {
  return parseIds(readRawWithMigration());
}

export function toggleFavorite(id: string): string[] {
  const cur = loadFavorites();
  const next = cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id];
  localStorage.setItem(KEY, JSON.stringify(next));
  return next;
}
