import { getDb } from '../../config/database';

export interface Service {
  id: number;
  title: string;
  description: string | null;
  icon_name: string | null;
  image_url: string | null;
  link_url: string | null;
  sort_order: number;
  is_active: number;
  created_at: string;
}

export interface ReorderItem {
  id: number;
  order: number;
}

export function findAll(): Service[] {
  return getDb().prepare('SELECT * FROM services ORDER BY sort_order ASC').all() as Service[];
}

export function findActive(): Service[] {
  return getDb().prepare('SELECT * FROM services WHERE is_active = 1 ORDER BY sort_order ASC').all() as Service[];
}

export function findById(id: number): Service | undefined {
  return getDb().prepare('SELECT * FROM services WHERE id = ?').get(id) as Service | undefined;
}

export function create({ title, description, icon_name, image_url, link_url, sort_order, is_active }: Partial<Service> & { title: string }): Service | undefined {
  const result = getDb()
    .prepare('INSERT INTO services (title, description, icon_name, image_url, link_url, sort_order, is_active) VALUES (?, ?, ?, ?, ?, ?, ?)')
    .run(title, description || null, icon_name || null, image_url || '', link_url || '', sort_order || 0, is_active !== undefined ? (is_active ? 1 : 0) : 1);
  return findById(result.lastInsertRowid as number);
}

export function update(id: number, { title, description, icon_name, image_url, link_url, sort_order, is_active }: Partial<Service>): Service | undefined {
  getDb()
    .prepare('UPDATE services SET title = ?, description = ?, icon_name = ?, image_url = ?, link_url = ?, sort_order = ?, is_active = ? WHERE id = ?')
    .run(title, description || null, icon_name || null, image_url || '', link_url || '', sort_order || 0, is_active ? 1 : 0, id);
  return findById(id);
}

export function remove(id: number): void {
  getDb().prepare('DELETE FROM services WHERE id = ?').run(id);
}

export function reorder(items: ReorderItem[]): void {
  const stmt = getDb().prepare('UPDATE services SET sort_order = ? WHERE id = ?');
  const tx = getDb().transaction((list: ReorderItem[]) => {
    for (const { id, order } of list) {
      stmt.run(order, id);
    }
  });
  tx(items);
}
