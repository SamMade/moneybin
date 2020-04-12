import { uid } from 'react-uid';
const { ipcRenderer } = window.require('electron');

export default async function removeNodes(nodeId) {
  if (!nodeId) {
    throw new Error('removeNodes - missing (id)');
  }

  const receipt = uid(nodeId, Date.now());
  const payload = {
    nodeId,
    uid: receipt,
  };

  return await ipcRenderer.invoke('nodes-remove', payload);
};
