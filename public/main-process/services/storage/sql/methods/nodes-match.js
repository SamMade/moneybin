const { promisify } = require('util');

const loggerContext = { service: 'Storage/sqlite/nodesMatch' };

module.exports = async function nodesGetNameAutocomplete({ logger, db, searchTerm }) {
  if (!searchTerm) { return null; }

  const breakWords = searchTerm.match(/"[^"]+"|\b[^\s]+\b|\+/g);

  const actualSearch = (!breakWords) ? searchTerm : glue(breakWords);

  const output = await promisify(db.all.bind(db))(
    `
      SELECT NodesAlias_fts.name, NodesAlias.node as id, NodesAlias_fts.rank as score
      FROM NodesAlias_fts 
      LEFT JOIN NodesAlias 
      ON NodesAlias_fts.rowid = NodesAlias.id
      WHERE NodesAlias_fts MATCH ?
      ORDER BY NodesAlias_fts.rank 
    `,
    [actualSearch]
  );

  logger.info(`Obtained ${output.length} nodes`, loggerContext);

  return output;
}

function glue(arr) {
  return arr.reduce((search, word, index) => {
    const sWord = sanitize(word);
    const prefix = (index === arr.length - 1) ? '*' : '';

    if (index === 0) { return `${sWord}${prefix}`; }

    if (sWord === '+' || sWord.toLowerCase() === 'and') {
      return `${search} AND`;
    }

    return `${search} OR ${sWord}${prefix}`;
  }, '');
}

function sanitize(word) {
  if (
    (
      (word.indexOf('.') !== -1)
      || (word.indexOf('/') !== -1)
    )
    && (word.charAt(0) !== '"')) {
    return `"${word}"`;
  }

  return word;
}