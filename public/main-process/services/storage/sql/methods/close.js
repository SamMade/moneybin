module.exports = async function close(db) {
  db.close.bind(db)();
}