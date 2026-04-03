import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const DB_PATH: string = path.join(__dirname, '..', '..', 'data.db');
const MIGRATIONS_DIR: string = path.join(__dirname, '..', 'database', 'migrations');

let db: Database.Database | null = null;

function getDb(): Database.Database {
  if (!db) {
    db = new Database(DB_PATH);
    db.pragma('journal_mode = WAL');
    db.pragma('foreign_keys = ON');
  }
  return db;
}

function runMigrations(): void {
  const conn = getDb();

  conn.exec(`
    CREATE TABLE IF NOT EXISTS migrations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      applied_at TEXT DEFAULT (datetime('now'))
    )
  `);

  const applied = new Set(
    conn.prepare('SELECT name FROM migrations').all().map((r: any) => r.name)
  );

  const files = fs
    .readdirSync(MIGRATIONS_DIR)
    .filter((f: string) => f.endsWith('.sql'))
    .sort();

  for (const file of files) {
    if (applied.has(file)) continue;
    const sql = fs.readFileSync(path.join(MIGRATIONS_DIR, file), 'utf-8');
    conn.exec(sql);
    conn.prepare('INSERT INTO migrations (name) VALUES (?)').run(file);
    console.log(`  ✓ Migration applied: ${file}`);
  }
}

export { getDb, runMigrations };
