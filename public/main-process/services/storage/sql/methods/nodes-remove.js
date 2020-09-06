const { promisify } = require('util');

module.exports = async function(db, id) {
  await promisify(db.run.bind(db))(
    'DELETE FROM Nodes WHERE id=?',
    id,
  );

  await promisify(db.run.bind(db))(
    'DELETE FROM NodesAlias WHERE node=?',
    id,
  );

  return true;
}