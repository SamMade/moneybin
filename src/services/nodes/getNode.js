const { ipcRenderer } = window.require('electron');

export default async function getNode(request) {
  const output = await ipcRenderer.invoke('nodes-get', request);
  return output;
};
