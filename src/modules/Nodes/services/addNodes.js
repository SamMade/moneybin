import { uid } from 'react-uid';
const { ipcRenderer } = window.require('electron');

export default function addNodes(node) {
  if (!node.name) {
    throw new Error('addNode - missing (name)');
  }
  if (!node.type) {
    throw new Error('addNode - missing (type)');
  }

  const receipt = uid(node, Date.now());
  const payload = {
    ...node,
    uid: receipt,
  };

  ipcRenderer.send('nodes-add', payload);

  return receipt;
};
