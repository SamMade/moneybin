const { promisify } = require('util');

const loggerContext = { service: 'Storage/sqlite/nodesRemove' };

module.exports = async function({ logger, db, id }) {
  await promisify(db.run.bind(db))(
    'DELETE FROM Nodes WHERE id=?',
    id,
  );

  logger.info(`Node removed (${id})`, loggerContext);

  return true;
}