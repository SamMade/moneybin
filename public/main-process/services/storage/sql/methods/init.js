const Schema = require('../schema');

const loggerContext = { service: 'Storage/sqlite/init' };

module.exports = async function init({ logger, db }) {
  // sync
  db.serialize(() => {
    Schema.create.forEach((query) => {
      db.run(query);
    })
  });

  logger.info('Schema Created', loggerContext);
  return true;
}