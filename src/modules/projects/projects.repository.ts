import { getDb } from '../../config/database';

export interface Project {
  id: number;
  title: string;
  description: string | null;
  category: string | null;
  cover_image_url: string | null;
  is_published: number;
  sort_order: number;
  grid_w: number;
  grid_h: number;
  created_at: string;
}

export interface ReorderItem {
  id: number;
  order: number;
}

export function findAll(): Project[] {
  return getDb().prepare('SELECT * FROM projects ORDER BY sort_order ASC, created_at DESC').all() as Project[];
}

export function findPublished(): Project[] {
  return getDb().prepare('SELECT * FROM projects WHERE is_published = 1 ORDER BY sort_order ASC').all() as Project[];
}

export function findPublishedPaginated(limit: number, offset: number): { projects: Project[]; total: number } {
  const projects = getDb()
    .prepare('SELECT * FROM projects WHERE is_published = 1 ORDER BY sort_order ASC LIMIT ? OFFSET ?')
    .all(limit, offset) as Project[];
  const { total } = getDb()
    .prepare('SELECT COUNT(*) as total FROM projects WHERE is_published = 1')
    .get() as { total: number };
  return { projects, total };
}

export function findById(id: number): Project | undefined {
  return getDb().prepare('SELECT * FROM projects WHERE id = ?').get(id) as Project | undefined;
}

export function create({ title, description, category, cover_image_url, is_published, sort_order, grid_w, grid_h }: Partial<Project>): Project | undefined {
  const result = getDb()
    .prepare(
      'INSERT INTO projects (title, description, category, cover_image_url, is_published, sort_order, grid_w, grid_h) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
    )
    .run(title, description || null, category || null, cover_image_url || null, is_published ? 1 : 0, sort_order || 0, grid_w || 1, grid_h || 1);
  return findById(result.lastInsertRowid as number);
}

export function update(id: number, { title, description, category, cover_image_url, is_published, sort_order, grid_w, grid_h }: Partial<Project>): Project | undefined {
  getDb()
    .prepare(
      'UPDATE projects SET title = ?, description = ?, category = ?, cover_image_url = ?, is_published = ?, sort_order = ?, grid_w = ?, grid_h = ? WHERE id = ?'
    )
    .run(title, description || null, category || null, cover_image_url || null, is_published ? 1 : 0, sort_order || 0, grid_w || 1, grid_h || 1, id);
  return findById(id);
}

export function remove(id: number): void {
  getDb().prepare('DELETE FROM projects WHERE id = ?').run(id);
}

export function reorder(items: ReorderItem[]): void {
  const stmt = getDb().prepare('UPDATE projects SET sort_order = ? WHERE id = ?');
  const tx = getDb().transaction((list: ReorderItem[]) => {
    for (const { id, order } of list) {
      stmt.run(order, id);
    }
  });
  tx(items);
}
