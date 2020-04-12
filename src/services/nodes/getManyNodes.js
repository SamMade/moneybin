const { ipcRenderer } = window.require('electron');

export default async function getManyNodes(request) {
  return await ipcRenderer.invoke('nodes-getMany', request);
};
