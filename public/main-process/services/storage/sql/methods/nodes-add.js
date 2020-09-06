const { promisify } = require("util");

module.exports = async function (db, nodes) {
  const allNodes = nodes.map(async (node) => {
    const { id, name, type, alias, isDefault } = node;

    await promisify(db.run.bind(db))(
      `INSERT or REPLACE INTO Nodes(id, name, type, isDefault) 
      VALUES(
      (SELECT ID from Nodes where id = ?),
      ?,
      ?,
      ?)`,
      [id, name, type, isDefault ? 1 : 0]
    );
  
    const { "last_insert_rowid()": resultId } = await promisify(db.get.bind(db))(
      "SELECT last_insert_rowid()"
    );
  
    if (Array.isArray(alias) && alias.length) {
      for (let i = 0; i < alias.length; i += 1) {
        await promisify(db.run.bind(db))(
          "INSERT or IGNORE INTO NodesAlias (node, alias) VALUES (?, ?)",
          resultId,
          alias[i]
        );
      }
    }
  
    return resultId;
  });

  return Promise.all(allNodes);
};
