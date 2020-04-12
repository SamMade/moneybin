const { ipcRenderer } = window.require('electron');

export default async function getAllNodes() {
  await ipcRenderer.send('nodes-get');
};
