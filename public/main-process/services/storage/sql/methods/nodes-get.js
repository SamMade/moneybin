const { promisify } = require('util');

const loggerContext = { service: 'Storage/sqlite/nodesGet' };

/**
 * @param {object} params
 * @param {*} params.logger 
 * @param {*} params.db 
 * @param {string} params.id id of node
 * @param {string[]} [params.select] fields to return back
 */
module.exports = async function ({ logger, db, id, select }) {
  if (!id) {
    throw new Error('Empty id');
  }

  const node = await promisify(db.get.bind(db))(
    'SELECT * FROM Nodes WHERE id = ?',
    id
  );

  if (!node) {
    logger.warn(`Node (${id}) not found`, loggerContext);
    return null;
  }

  // Add alias
  let alias = [];
  if (!select || select.indexOf('alias') !== -1) {
    const aliasFields = await promisify(db.all.bind(db))(
      'SELECT alias FROM NodesAlias WHERE node = ? AND isPrimary <> 1',
      id
    );
    alias = aliasFields.map((obj) => obj.alias);
  }

  // filter fields
  if (select && Array.isArray(select) && select.length > 0) {
    const output = {};
    select.forEach((field) => {
      output[field] = node[field];
    });
    return output;
  }

  logger.info(`Node get (${id}) found`, loggerContext);

  return {
    id: node.id,
    name: node.name,
    type: node.type,
    alias,
  };
};
