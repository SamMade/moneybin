const { ipcRenderer } = window.require('electron');

export default async function getManyTransactions(request) {
  return await ipcRenderer.invoke('transactions-getMany', request);
};
