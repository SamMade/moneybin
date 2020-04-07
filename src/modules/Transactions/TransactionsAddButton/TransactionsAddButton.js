import React, { useState } from 'react';
import { uid } from 'react-uid';
import TransactionsServices from '../services';

export default function TransactionsAddButton() {
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [transactionFrom, setTransactionFrom] = useState('');
  const [transactionTo, setTransactionTo] = useState('');
  const [transactionDate, setTransactionDate] = useState('');
  const [transactionAmount, setTransactionAmount] = useState('');

  const clickHandler = async (event) => {
    event.preventDefault();
    console.info('TransactionsAddButton - clicked');
    setIsConfirmed(false);
    const receipt = await TransactionsServices.addTransactions({
      to: transactionTo,
      from: transactionFrom,
      amount: transactionAmount,
      date: transactionDate,
    });
    setIsConfirmed(true);
  }

  return (
    <div>
      <form className="pure-form pure-form-aligned" onSubmit={clickHandler}>
        <div className="pure-control-group">
          <label htmlFor={uid('from')}>
            From: 
          </label>
          <input id={uid('from')} type="text" value={transactionFrom} onChange={(event) => {setTransactionFrom(event.target.value)}} />
        </div>

        <div className="pure-control-group">
          <label htmlFor={uid('to')}>
            To: 
          </label>
          <input id={uid('to')} type="text" value={transactionTo} onChange={(event) => {setTransactionTo(event.target.value)}} />
        </div>

        <div className="pure-control-group">
          <label htmlFor={uid('amount')}>
            Amount: 
          </label>
          <input id={uid('amount')} type="text" value={transactionAmount} onChange={(event) => {setTransactionAmount(event.target.value)}} />
        </div>

        <div className="pure-control-group">
          <label htmlFor={uid('date')}>
            Date: 
          </label>
          <input id={uid('date')} type="text" value={transactionDate} onChange={(event) => {setTransactionDate(event.target.value)}} />
        </div>

        <div className="pure-controls">
          <button type="submit" className="pure-button pure-button-primary">Add Transaction</button>
        </div>
      </form>
      { (isConfirmed) && <span>...Added</span>}
    </div>
  );
}