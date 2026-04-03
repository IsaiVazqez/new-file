import { getDb } from '../../config/database';

export interface Image {
  id: number;
  project_id: number;
  url: string;
  filename: string;
  size_bytes: number;
  sort_order: number;
  created_at: string;
}

export interface ReorderItem {
  id: number;
  order: number;
}

export function findByProject(projectId: number): Image[] {
  return getDb().prepare('SELECT * FROM images WHERE project_id = ? ORDER BY sort_order ASC').all(projectId) as Image[];
}

export function findById(id: number): Image | undefined {
  return getDb().prepare('SELECT * FROM images WHERE id = ?').get(id) as Image | undefined;
}

export function create({ project_id, url, filename, size_bytes, sort_order }: Omit<Image, 'id' | 'created_at'>): Image | undefined {
  const result = getDb()
    .prepare('INSERT INTO images (project_id, url, filename, size_bytes, sort_order) VALUES (?, ?, ?, ?, ?)')
    .run(project_id, url, filename, size_bytes || 0, sort_order || 0);
  return findById(result.lastInsertRowid as number);
}

export function remove(id: number): void {
  getDb().prepare('DELETE FROM images WHERE id = ?').run(id);
}

export function reorder(items: ReorderItem[]): void {
  const stmt = getDb().prepare('UPDATE images SET sort_order = ? WHERE id = ?');
  const tx = getDb().transaction((list: ReorderItem[]) => {
    for (const { id, order } of list) {
      stmt.run(order, id);
    }
  });
  tx(items);
}
