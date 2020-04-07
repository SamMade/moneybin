const { promisify } = require('util');

module.exports = async function(db, date, from, to, amount) {
  await promisify(db.run.bind(db))(
    'INSERT INTO Transactions(postDate, source, target, amount) VALUES(DATE(?), ?, ?, ?)',
    [date, from, to, amount]
  );

  const { 
    "last_insert_rowid()": id,
  } = await promisify(db.get.bind(db))(
    'SELECT last_insert_rowid()'
  );

  return id;
}