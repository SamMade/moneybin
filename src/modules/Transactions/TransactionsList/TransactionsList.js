import React, { useEffect, useState } from 'react';
import moment from 'moment';
import TransactionsServices from '../services';
// import TransactionsRemoveButton from '../TransactionsRemoveButton/TransactionsRemoveButton'

import { uid } from 'react-uid';

const { ipcRenderer } = window.require('electron');

export default function TransactionsList() {
  const [allTransactions, setAllTransactions] = useState([]);

  const transactionsListListener = (event, arg) => {
    setAllTransactions(arg);
  };

  useEffect(() => {
    ipcRenderer.on('transactions-getAll-reply', transactionsListListener);
    TransactionsServices.getAllTransactions();
  
    return () => {
      ipcRenderer.removeListener('transactions-getAll-reply', transactionsListListener);
    };
  }, []);

  return (
    <>
      <ul>
        {
          allTransactions.map((node, index) => (
            <li key={uid(node, index)}>
              <span title={moment(node.date).toString()}>{moment(node.date).fromNow()}</span>
               - 
              <span>{node.amount}</span>
            </li>
          ))
        }
      </ul>
    </>
  );
}