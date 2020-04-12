import { uid } from 'react-uid';
const { ipcRenderer } = window.require('electron');

export default async function addNodes(node) {
  if (!node.name) {
    throw new Error('addNodes - missing (name)');
  }
  if (!node.type) {
    throw new Error('addNodes - missing (type)');
  }

  const receipt = uid(node, Date.now());
  const payload = {
    ...node,
    uid: receipt,
  };

  return await ipcRenderer.invoke('nodes-add', payload);
};
