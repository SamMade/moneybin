import appRuntime from '../appRuntime';

export default async function getTransaction(id) {
  await appRuntime.send('transactions-get', id);
};
