import { uid } from 'react-uid';
import appRuntime from '../../services/appRuntime';

export default async function postNodes(nodes) {
  const requests = nodes.map((node) => {
    if (!node.name) {
      throw new Error('postNodes - missing (name)');
    }
    if (!node.type) {
      throw new Error('postNodes - missing (type)');
    }
  
    const receipt = uid(node, Date.now());
  
    const payload = {
      ...node,
      uid: receipt,
    };
  
    return appRuntime.invoke('nodes-post', payload);
  });

  return Promise.all(requests);
};
