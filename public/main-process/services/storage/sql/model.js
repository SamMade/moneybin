module.exports = {
  create: [
    // Nodes
    `CREATE TABLE IF NOT EXISTS Nodes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      type TEXT
    );`,
    `CREATE VIRTUAL TABLE IF NOT EXISTS Nodes_index USING fts5(name);`,
    `CREATE TRIGGER IF NOT EXISTS after_Nodes_insert AFTER INSERT ON Nodes BEGIN
      INSERT INTO Nodes_index (
        rowid,
        name
      )
      VALUES(
        new.id,
        new.name
      );
    END;`,
    `CREATE TRIGGER IF NOT EXISTS after_Nodes_update UPDATE OF name ON Nodes BEGIN
      UPDATE Nodes_index SET name = new.name WHERE rowid = old.id;
    END;`,
    `CREATE TRIGGER IF NOT EXISTS after_Nodes_delete AFTER DELETE ON Nodes BEGIN
      DELETE FROM Nodes_index WHERE rowid = old.id;
    END;`,
    // Transactions
    `CREATE TABLE IF NOT EXISTS Transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      postDate TEXT,
      notes TEXT,
      amount REAL,
      source INTEGER,
      target INTEGER
    );`,
    `CREATE VIRTUAL TABLE IF NOT EXISTS Transactions_index USING fts5(notes, tokenize=porter);`,
    `CREATE TRIGGER IF NOT EXISTS after_Transactions_insert AFTER INSERT ON Transactions BEGIN
      INSERT INTO Transactions_index (
        rowid,
        notes
      )
      VALUES(
        new.id,
        new.notes
      );
    END;`,
    `CREATE TRIGGER IF NOT EXISTS after_Transactions_update UPDATE OF notes ON Transactions BEGIN
      UPDATE Transactions_index SET notes = new.notes WHERE rowid = old.id;
    END;`,
    `CREATE TRIGGER IF NOT EXISTS after_Transactions_delete AFTER DELETE ON Transactions BEGIN
      DELETE FROM Transactions_index WHERE rowid = old.id;
    END;`,
  ],
  // used to pre-populate date
  init: [],
};
