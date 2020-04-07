const { promisify } = require('util');
const Schema = require('../model');

module.exports = async function init(db) {
  const createTables = Schema.create.map((query) =>
    promisify(db.run.bind(db))(query)
  );
  console.log('schema create');
  const promises = await Promise.all(createTables);
  console.log(promises)
  return promises;
}