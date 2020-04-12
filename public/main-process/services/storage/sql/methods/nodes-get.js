const { promisify } = require('util');

module.exports = async function(db, id) {
  const node = await promisify(db.get.bind(db))(
    'SELECT * FROM Nodes WHERE id = ?',
    id,
  );

  if (!node) { return null; }

  return {
    name: node.name,
    id: node.id,
  };
}