import React, { useEffect, useState, useContext } from 'react';
import { uid } from 'react-uid';
import moment from 'moment';
import TransactionsServices from '../../../services/transactions';
import NodesServices from '../../../services/nodes';
import GlobalContext from '../../../services/globalContext/globalContext';

async function getData(start, end) {
  const transactionsApi = TransactionsServices.getManyTransactions({
    filter: `gte(postDate, ${start}) and lte(postDate, ${end})`,
  });
  const nodesApi = NodesServices.getManyNodes();

  return await Promise.all([nodesApi, transactionsApi]);
}

export default function TransactionsList() {
  const [globalState] = useContext(GlobalContext);
  const [allTransactions, setAllTransactions] = useState([]);

  useEffect(() => {
    (async () => {
      const [nodes, transactions] = await getData(globalState.timeframe.start, globalState.timeframe.end);

      setAllTransactions(transactions.map((transaction) => ({
        ...transaction,
        from: nodes.find((node) => node.id === transaction.from).name,
        to: nodes.find((node) => node.id === transaction.to).name,
      })));
    })();
  }, [globalState.refreshTrigger, globalState.timeframe]);

  return (
    <>
      <h2>Recent Transactions</h2>
      <ul>
        {
          allTransactions.map((transaction, index) => (
            <li key={uid(transaction, index)}>
              <span title={moment(transaction.date).toString()}>{moment(transaction.date).fromNow()}</span>
              &nbsp;-&nbsp;
              <span>{transaction.from}</span>
              &nbsp;gave&nbsp;
              <span>${transaction.amount}</span>
              &nbsp;to&nbsp;
              <span>{transaction.to}</span>
            </li>
          ))
        }
      </ul>
    </>
  );
}