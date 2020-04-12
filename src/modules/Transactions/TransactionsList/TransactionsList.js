import React, { useEffect, useState } from 'react';
import { uid } from 'react-uid';
import moment from 'moment';
import TransactionsServices from '../../../services/transactions';

export default function TransactionsList() {
  const [allTransactions, setAllTransactions] = useState([]);

  useEffect(() => {
    (async () => {
      const transactions = await TransactionsServices.getManyTransactions({
        max: 10,
      });
      setAllTransactions(transactions);
    })();
  }, []);

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