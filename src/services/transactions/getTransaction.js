const { ipcRenderer } = window.require('electron');

export default async function getTransaction(id) {
  await ipcRenderer.send('transactions-get', id);
};
