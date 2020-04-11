import React, { useState } from 'react';
import { uid } from 'react-uid';
import moment from 'moment';
import TransactionsServices from '../services';

export default function TransactionsAddButton() {
  const [isConfirmed, setIsConfirmed] = useState(null);
  const [transactionFrom, setTransactionFrom] = useState('');
  const [transactionTo, setTransactionTo] = useState('');
  const [transactionDate, setTransactionDate] = useState('');
  const [transactionAmount, setTransactionAmount] = useState('');

  const clickHandler = async (event) => {
    event.preventDefault();
    console.info('TransactionsAddButton - clicked');
    setIsConfirmed(null);
    try {
      const receipt = await TransactionsServices.addTransactions({
        to: transactionTo,
        from: transactionFrom,
        amount: transactionAmount,
        date: moment(transactionDate).valueOf(),
      });
    } catch (e) {
      console.log(e);
      setIsConfirmed({
        error: true,
        errorMessage: e.message,
      });
      return;
    }
    setIsConfirmed({
      success: true,
      error: false,
    });
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
      { (isConfirmed && isConfirmed.success) && <span>...Added</span>}
      { (isConfirmed && isConfirmed.error) && <span>{isConfirmed.errorMessage}</span>}
    </div>
  );
}