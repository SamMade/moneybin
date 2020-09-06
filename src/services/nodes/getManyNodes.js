const { ipcRenderer } = window.require('electron');

export default async function getManyNodes(request) {
  const output = await ipcRenderer.invoke('nodes-getMany', request);
  return output;
};
