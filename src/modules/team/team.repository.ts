import { getDb } from '../../config/database';

export interface TeamMember {
  id: number;
  name: string;
  role: string | null;
  bio: string | null;
  photo_url: string | null;
  sort_order: number;
  is_active: number;
  created_at: string;
}

export interface ReorderItem {
  id: number;
  order: number;
}

export function findAll(): TeamMember[] {
  return getDb().prepare('SELECT * FROM team_members ORDER BY sort_order ASC').all() as TeamMember[];
}

export function findActive(): TeamMember[] {
  return getDb().prepare('SELECT * FROM team_members WHERE is_active = 1 ORDER BY sort_order ASC').all() as TeamMember[];
}

export function findById(id: number): TeamMember | undefined {
  return getDb().prepare('SELECT * FROM team_members WHERE id = ?').get(id) as TeamMember | undefined;
}

export function create({ name, role, bio, photo_url, sort_order, is_active }: Partial<TeamMember> & { name: string }): TeamMember | undefined {
  const result = getDb()
    .prepare('INSERT INTO team_members (name, role, bio, photo_url, sort_order, is_active) VALUES (?, ?, ?, ?, ?, ?)')
    .run(name, role || null, bio || null, photo_url || null, sort_order || 0, is_active !== undefined ? (is_active ? 1 : 0) : 1);
  return findById(result.lastInsertRowid as number);
}

export function update(id: number, { name, role, bio, photo_url, sort_order, is_active }: Partial<TeamMember>): TeamMember | undefined {
  getDb()
    .prepare('UPDATE team_members SET name = ?, role = ?, bio = ?, photo_url = ?, sort_order = ?, is_active = ? WHERE id = ?')
    .run(name, role || null, bio || null, photo_url || null, sort_order || 0, is_active ? 1 : 0, id);
  return findById(id);
}

export function remove(id: number): void {
  getDb().prepare('DELETE FROM team_members WHERE id = ?').run(id);
}

export function reorder(items: ReorderItem[]): void {
  const stmt = getDb().prepare('UPDATE team_members SET sort_order = ? WHERE id = ?');
  const tx = getDb().transaction((list: ReorderItem[]) => {
    for (const { id, order } of list) {
      stmt.run(order, id);
    }
  });
  tx(items);
}
