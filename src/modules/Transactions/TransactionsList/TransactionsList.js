import React, { useEffect, useState, useContext } from 'react';
import { uid } from 'react-uid';
import moment from 'moment';
import TransactionsServices from '../../../services/transactions';
import GlobalContext from '../../../services/globalContext/globalContext';

export default function TransactionsList() {
  const [globalState] = useContext(GlobalContext);
  const [allTransactions, setAllTransactions] = useState([]);

  useEffect(() => {
    (async () => {
      const transactions = await TransactionsServices.getManyTransactions({
        filter: `gte(postDate, ${globalState.timeframe.start}) and lte(postDate, ${globalState.timeframe.end})`,
        // max: 10,
      });
      setAllTransactions(transactions);
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
              - 
              <span>{transaction.from}</span> gave 
              <span>{transaction.amount}</span> to
              <span>{transaction.to}</span>
            </li>
          ))
        }
      </ul>
    </>
  );
}