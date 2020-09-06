const { promisify } = require("util");

module.exports = async function (db, { id, select }) {
  const node = await promisify(db.get.bind(db))(
    `SELECT * FROM Nodes WHERE id = ?`,
    id
  );

  if (!node) {
    return null;
  }

  // Add alias
  let alias = [];
  if (!select || select.indexOf('alias') !== -1) {
    const aliasFields = await promisify(db.all.bind(db))(
      `SELECT alias FROM NodesAlias WHERE node = ?`,
      id
    );
    alias = aliasFields.map((obj) => obj.alias);
  }

  // filter fields
  if (select && Array.isArray(select) && select.length > 0) {
    const output = {};
    select.forEach((field) => {
      output[field] = node[field];
    });
    return output;
  }

  return {
    id: node.id,
    name: node.name,
    type: node.type,
    alias,
  };
};
