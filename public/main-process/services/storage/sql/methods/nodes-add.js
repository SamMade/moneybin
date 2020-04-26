const { promisify } = require('util');

module.exports = async function(db, {name, type, isDefault}) {
  await promisify(db.run.bind(db))(
    'INSERT INTO Nodes(name, type, isDefault) VALUES(?, ?, ?)',
    [name, type, (isDefault) ? 1 : 0]
  )
  const {
    "last_insert_rowid()": id,
  } = await promisify(db.get.bind(db))(
    'SELECT last_insert_rowid()'
  );

  return id;
}