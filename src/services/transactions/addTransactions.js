import { uid } from 'react-uid';
import appRuntime from '../../services/appRuntime';

export default async function addTransactions(transaction) {
  if (!transaction.to) {
    throw new Error('addTransactions - missing (to)');
  }
  if (!transaction.from) {
    throw new Error('addTransactions - missing (from)');
  }
  if (!transaction.amount) {
    throw new Error('addTransactions - missing (amount)');
  }
  if (!transaction.postDate) {
    throw new Error('addTransactions - missing (date)');
  }

  const receipt = uid(transaction, Date.now());
  const payload = {
    ...transaction,
    uid: receipt,
  };

  return appRuntime.invoke('transactions-add', payload);
};
