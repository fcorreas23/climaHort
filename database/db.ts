// database.ts
import { openDatabaseAsync, type SQLiteDatabase } from 'expo-sqlite';

let db: SQLiteDatabase;

export const initDB = async () => {
  db = await openDatabaseAsync('greenhouses.db');

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS greenhouses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      type TEXT NOT NULL,
      cover_material TEXT,
      length REAL,
      width REAL,
      gutter_height REAL,
      roof_height REAL,
      has_windows INTEGER,
      window_count INTEGER,
      window_width REAL,
      window_height REAL,
      has_skylights INTEGER,
      skylight_count INTEGER,
      skylight_width REAL,
      skylight_height REAL,
      ventilation_area REAL,
      ventilation_percent REAL
    );
  `);
};

export const getDB = (): SQLiteDatabase => {
  if (!db) throw new Error('DB not initialized. Call initDB() first.');
  return db;
};
