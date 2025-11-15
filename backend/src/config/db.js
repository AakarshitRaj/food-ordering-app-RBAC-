const Database = require('better-sqlite3');
const path = require('path');
require('dotenv').config();

const dbPath = path.join(__dirname, '../../foodapp.db');
const db = new Database(dbPath);

console.log('✅ SQLite database initialized');

// Helper to convert PostgreSQL queries to SQLite
const pool = {
  query: async (text, params = []) => {
    try {
      // Convert PostgreSQL $1, $2 to SQLite ? placeholders
      let sqliteQuery = text;
      if (params.length > 0) {
        for (let i = params.length; i > 0; i--) {
          sqliteQuery = sqliteQuery.replace(`$${i}`, '?');
        }
      }

      if (sqliteQuery.trim().toUpperCase().startsWith('SELECT')) {
        const stmt = db.prepare(sqliteQuery);
        const rows = params.length ? stmt.all(...params) : stmt.all();
        return { rows };
      } else if (sqliteQuery.includes('RETURNING')) {
        // Handle INSERT/UPDATE with RETURNING
        const actualQuery = sqliteQuery.replace(/RETURNING \*/g, '').trim();
        const tableName = actualQuery.match(/INTO\s+(\w+)/i)?.[1] || 
                         actualQuery.match(/UPDATE\s+(\w+)/i)?.[1];
        
        const stmt = db.prepare(actualQuery);
        const info = params.length ? stmt.run(...params) : stmt.run();
        
        // Get the inserted/updated row
        const lastId = info.lastInsertRowid;
        const selectStmt = db.prepare(`SELECT * FROM ${tableName} WHERE id = ?`);
        const rows = [selectStmt.get(lastId)];
        return { rows };
      } else {
        // INSERT, UPDATE, DELETE
        const stmt = db.prepare(sqliteQuery);
        const info = params.length ? stmt.run(...params) : stmt.run();
        return { rows: [], rowCount: info.changes };
      }
    } catch (error) {
      console.error('Database query error:', error);
      console.error('Query:', text);
      console.error('Params:', params);
      throw error;
    }
  }
};

module.exports = pool;