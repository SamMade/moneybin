import { uid } from 'react-uid';
const { ipcRenderer } = window.require('electron');

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
  if (!transaction.date) {
    throw new Error('addTransactions - missing (date)');
  }

  console.log(transaction.date)

  const receipt = uid(transaction, Date.now());
  const payload = {
    ...transaction,
    uid: receipt,
  };

  return await ipcRenderer.invoke('transactions-add', payload);
};
