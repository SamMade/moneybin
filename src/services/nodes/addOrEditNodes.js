import { uid } from 'react-uid';
import appRuntime from '../../services/appRuntime';

export default async function addOrEditNodes(nodes) {
  const requests = nodes.map((node) => {
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
  
    return appRuntime.invoke('nodes-addOrEdit', payload);
  });

  return Promise.all(requests);
};
