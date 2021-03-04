import appRuntime from '../appRuntime';

export default async function getManyTransactions(request) {
  return appRuntime.invoke('transactions-getMany', request);
};
