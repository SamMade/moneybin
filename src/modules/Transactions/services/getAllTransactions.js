const { ipcRenderer } = window.require('electron');

export default async function getAllTransactions() {
  await ipcRenderer.send('transactions-getAll');
};
