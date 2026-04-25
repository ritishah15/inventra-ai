const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

let dbInstance;

async function getDb() {
  if (!dbInstance) {
    dbInstance = await open({
      filename: path.join(__dirname, 'inventra.sqlite'),
      driver: sqlite3.Database
    });
    
    // Auto-init DB
    const hasUsers = await dbInstance.get("SELECT name FROM sqlite_master WHERE type='table' AND name='users'");
    if (!hasUsers) {
      console.log('Initializing SQLite Database...');
      const initSql = fs.readFileSync(path.join(__dirname, 'init.sql'), 'utf-8');
      const seedSql = fs.readFileSync(path.join(__dirname, 'seed.sql'), 'utf-8');
      
      // SQLite exec strictly executes multiple statements if separated by semicolons
      await dbInstance.exec(initSql);
      await dbInstance.exec(seedSql);
      console.log('SQLite Database Initialized and Seeded!');
    }
  }
  return dbInstance;
}

// Dummy pool to act like pg adapter
const pool = {
  query: async (text, params = []) => {
    const db = await getDb();
    
    // Swap $1, $2 syntax for SQLite ? syntax
    const sqliteText = text.replace(/\$\d+/g, '?');
    const isReturning = sqliteText.toUpperCase().includes('RETURNING') || sqliteText.toUpperCase().trim().startsWith('SELECT');
    
    try {
      if (isReturning) {
        // Warning: SQLite handles RETURNING but db.all executes it successfully without problems
        const rows = await db.all(sqliteText, params);
        return { rows, rowCount: rows.length };
      } else {
        const result = await db.run(sqliteText, params);
        return { 
          rows: result.changes > 0 ? [{ id: result.lastID }] : [],
          rowCount: result.changes
        };
      }
    } catch (error) {
       console.error("SQL Error: ", sqliteText, params);
       throw error;
    }
  }
};

module.exports = pool;
