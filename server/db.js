import Database from 'better-sqlite3';
import { readFileSync } from 'fs';

const db = new Database('db/data.db');
db.exec(readFileSync('db/schema.sql', 'utf8'));

const stmt = db.prepare('INSERT INTO upload_rows (col_a, col_b, col_c) VALUES (?, ?, ?)');

export function bulkInsert(rows) {
  const insertMany = db.transaction((data) => {
    for (const r of data) stmt.run(r.col_a, r.col_b, r.col_c);
  });
  insertMany(rows);
}