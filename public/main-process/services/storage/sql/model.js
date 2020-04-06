module.exports = {
  create: [
    `CREATE TABLE IF NOT EXISTS Nodes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      type TEXT
    );`,
    `CREATE TABLE IF NOT EXISTS Transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      postDate TEXT,
      notes TEXT,
      amount REAL,
      source INTEGER,
      target INTEGER
    );`,
  ],
  init: [],
};
