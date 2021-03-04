import { uid } from 'react-uid';
import appRuntime from '../appRuntime';

export default async function removeNodes(nodeId) {
  if (!nodeId) {
    throw new Error('removeNodes - missing (id)');
  }

  const receipt = uid(nodeId, Date.now());
  const payload = {
    nodeId,
    uid: receipt,
  };

  return appRuntime.invoke('nodes-remove', payload);
};
