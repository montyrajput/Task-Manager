
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const { promisify } = require('util');

const DB_PATH = path.join(__dirname, '..', 'database.sqlite');

const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error('Failed to connect to SQLite DB', err);
    process.exit(1);
  }
});

db.serialize(() => {
  
  db.run('PRAGMA foreign_keys = ON;');

  
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT,
    role TEXT DEFAULT 'user'
  )`);

  
  db.run(`CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'pending',
    createdBy INTEGER,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(createdBy) REFERENCES users(id) ON DELETE CASCADE
  )`);
});


const run = function (sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) return reject(err);
      
      resolve({ lastID: this.lastID, changes: this.changes });
    });
  });
};

const get = promisify(db.get.bind(db));
const all = promisify(db.all.bind(db));

module.exports = {
  db,
  run,
  get,
  all
};
