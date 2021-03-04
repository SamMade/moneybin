import appRuntime from '../../services/appRuntime';

export default async function getManyNodes(request) {
  return appRuntime.invoke('nodes-getMany', request);
};
