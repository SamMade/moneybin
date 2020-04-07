const { promisify } = require('util');

module.exports = async function(db, name, type) {
  await promisify(db.run.bind(db))(
    'INSERT INTO Nodes(name, type) VALUES(?, ?)',
    [name, type]
  )
  const {
    "last_insert_rowid()": id,
  } = await promisify(db.get.bind(db))(
    'SELECT last_insert_rowid()'
  );

  return id;
}