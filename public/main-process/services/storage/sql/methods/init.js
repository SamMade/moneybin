const { promisify } = require('util');
const Schema = require('../model');

module.exports = async function init(db) {
  // // async
  // const createTables = Schema.create.map((query) =>
  //   promisify(db.run.bind(db))(query)
  // );
  // const promises = await Promise.all(createTables);

  // sync
  Schema.create.forEach((query) => {
    db.run(query);
  })

  console.log('schema created');
  return true;
}