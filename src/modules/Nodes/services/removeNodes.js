import { uid } from 'react-uid';
const { ipcRenderer } = window.require('electron');

export default function removeNodes(nodeId) {
  if (!nodeId) {
    throw new Error('removeNodes - missing (id)');
  }

  const receipt = uid(nodeId, Date.now());
  const payload = {
    nodeId,
    uid: receipt,
  };

  ipcRenderer.send('nodes-remove', payload);

  return receipt;
};
