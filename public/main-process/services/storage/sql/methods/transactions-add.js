const { promisify } = require('util');

module.exports = async function(db, {postDate, from, to, amount, notes}) {
  await promisify(db.run.bind(db))(
    'INSERT INTO Transactions(postDate, source, target, amount, notes) VALUES(?, ?, ?, ?, ?)',
    [postDate, from, to, amount, notes]
  );

  const { 
    "last_insert_rowid()": id,
  } = await promisify(db.get.bind(db))(
    'SELECT last_insert_rowid()'
  );

  return id;
}