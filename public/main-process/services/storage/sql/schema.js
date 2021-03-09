module.exports = {
  create: [
    // Nodes
    `CREATE TABLE IF NOT EXISTS Nodes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      isDefault INTEGER,
      type TEXT
    );`,
    // Node Aliases
    `CREATE TABLE IF NOT EXISTS NodesAlias (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      node INTEGER NOT NULL,
      alias TEXT UNIQUE NOT NULL,
      isPrimary INTEGER DEFAULT 0,
      FOREIGN KEY(node) REFERENCES Nodes(id)
    );`,
    // Node Aliases FTS
    'CREATE VIRTUAL TABLE IF NOT EXISTS NodesAlias_fts USING fts5(name, tokenize=porter);',
    // Nodes Triggers
    `CREATE TRIGGER IF NOT EXISTS after_Nodes_insert AFTER INSERT ON Nodes BEGIN
      INSERT INTO NodesAlias (
        node,
        alias,
        isPrimary
      )
      VALUES(
        new.id,
        new.name,
        1
      );
    END;`,
    `CREATE TRIGGER IF NOT EXISTS after_Nodes_update UPDATE OF name ON Nodes BEGIN
      UPDATE NodesAlias SET alias = new.name WHERE node = old.id AND isPrimary = 1;
    END;`,
    `CREATE TRIGGER IF NOT EXISTS before_Nodes_delete BEFORE DELETE ON Nodes BEGIN
      DELETE FROM NodesAlias WHERE node = new.id;
    END;`,
    // Node Aliases FTS Trigger
    `CREATE TRIGGER IF NOT EXISTS after_NodesAlias_insert AFTER INSERT ON NodesAlias BEGIN
      INSERT INTO NodesAlias_fts (
        rowid,
        name
      )
      VALUES(
        new.id,
        new.alias
      );
    END;`,
    `CREATE TRIGGER IF NOT EXISTS after_NodesAlias_update UPDATE OF alias ON NodesAlias BEGIN
      UPDATE NodesAlias_fts SET name = new.alias WHERE rowid = old.id;
    END;`,
    `CREATE TRIGGER IF NOT EXISTS after_NodesAlias_delete AFTER DELETE ON NodesAlias BEGIN
      DELETE FROM NodesAlias_fts WHERE rowid = old.id;
    END;`,
    // Transactions
    `CREATE TABLE IF NOT EXISTS Transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      postDate INTEGER,
      notes TEXT,
      amount REAL,
      source INTEGER,
      target INTEGER,
      rrule TEXT
    );`,
    // Transactions FTS
    'CREATE VIRTUAL TABLE IF NOT EXISTS Transactions_fts USING fts5(notes, tokenize=porter);',
    `CREATE TRIGGER IF NOT EXISTS after_Transactions_insert AFTER INSERT ON Transactions BEGIN
      INSERT INTO Transactions_fts (
        rowid,
        notes
      )
      VALUES(
        new.id,
        new.notes
      );
    END;`,
    `CREATE TRIGGER IF NOT EXISTS after_Transactions_update UPDATE OF notes ON Transactions BEGIN
      UPDATE Transactions_fts SET notes = new.notes WHERE rowid = old.id;
    END;`,
    `CREATE TRIGGER IF NOT EXISTS after_Transactions_delete AFTER DELETE ON Transactions BEGIN
      DELETE FROM Transactions_fts WHERE rowid = old.id;
    END;`,
  ],
  // used to pre-populate date
  init: [],
};
