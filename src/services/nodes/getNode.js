import appRuntime from '../../services/appRuntime';

export default async function getNode(request) {
  return appRuntime.invoke('nodes-get', request);
};
