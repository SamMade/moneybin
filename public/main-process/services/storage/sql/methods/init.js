const Schema = require('../schema');

module.exports = async function init(db) {
  // sync
  db.serialize(() => {
    Schema.create.forEach((query) => {
      db.run(query);
    })
  });

  console.log('schema created');
  return true;
}