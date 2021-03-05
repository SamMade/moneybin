/**
 * key = api produced
 * value = sql field
 */
const transactionsMap = Object.freeze({
  Transaction: 'Transactions',
  id: 'id',
  to: 'target',
  from: 'source',
  amount: 'amount',
  postDate: 'postDate',
  isRecurring: 'isRecurring',
  notes: 'notes',
})
export default transactionsMap;
