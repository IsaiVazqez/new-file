import { getDb } from '../../config/database';

export interface Setting {
  key: string;
  value: string;
  label: string | null;
  category: string;
  updated_at: string;
}

export function findAll(): Setting[] {
  return getDb().prepare('SELECT * FROM settings ORDER BY category, key').all() as Setting[];
}

export function findByCategory(category: string): Setting[] {
  return getDb().prepare('SELECT * FROM settings WHERE category = ? ORDER BY key').all(category) as Setting[];
}

export function findByKey(key: string): Setting | undefined {
  return getDb().prepare('SELECT * FROM settings WHERE key = ?').get(key) as Setting | undefined;
}

export function upsert(key: string, value: string): void {
  getDb().prepare("UPDATE settings SET value = ?, updated_at = datetime('now') WHERE key = ?").run(value, key);
}

export function bulkUpdate(items: { key: string; value: string }[]): void {
  const stmt = getDb().prepare("UPDATE settings SET value = ?, updated_at = datetime('now') WHERE key = ?");
  const tx = getDb().transaction((list: { key: string; value: string }[]) => {
    for (const { key, value } of list) {
      stmt.run(value, key);
    }
  });
  tx(items);
}
