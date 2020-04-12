import React, { useState, useEffect } from 'react';
import { uid } from 'react-uid';
import moment from 'moment';
import NodesServices from '../../../services/nodes';
import TransactionsServices from '../../../services/transactions';

import Autocomplete from '../../../shared/Autocomplete/Autocomplete';
import Calendar from '../../../shared/Calendar/Calendar';

// autocomplete names
const autocompleteName = async (name) => {
  console.log('autocomplete')
  const list = await NodesServices.getNameAutocomplete(name);
  if (!list) {
    return null;
  }

  return list.map((orig) => ({...orig, id: orig.rowid}));
};

export default function TransactionsAddForm() {
  const [isConfirmed, setIsConfirmed] = useState(null);
  const [transactionFrom, setTransactionFrom] = useState('');
  const [transactionTo, setTransactionTo] = useState('');
  const [transactionDate, setTransactionDate] = useState('');
  const [transactionAmount, setTransactionAmount] = useState('');
  const [transactionNotes, setTransactionNotes] = useState('');

  // reset form
  useEffect(() => {
    if (!isConfirmed || isConfirmed.error) {
      return;
    }

    setTransactionFrom('');
    setTransactionTo('');
    setTransactionDate('');
    setTransactionAmount('');
    setTransactionNotes('');
  }, [isConfirmed]);

  const clickHandler = async (event) => {
    event.preventDefault();
    console.info('TransactionsAddForm - clicked');

    setIsConfirmed(null);

    try {
      const receipt = await TransactionsServices.addTransactions({
        to: transactionTo,
        from: transactionFrom,
        amount: transactionAmount,
        date: moment.unix(transactionDate).valueOf(),
        notes: transactionNotes,
      });
    } catch (e) {
      console.error(e);
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
      <h1>Add Transaction</h1>
      <form className="pure-form pure-form-aligned" onSubmit={clickHandler}>
        <div className="pure-control-group">
          <label htmlFor={uid('From')}>
            From: 
          </label>
          <Autocomplete
            id={uid('From')}
            onOptions={autocompleteName}
            onChange={setTransactionFrom}
          />
        </div>

        <div className="pure-control-group">
          <label htmlFor={uid('To')}>
            To: 
          </label>
          <Autocomplete
            id={uid('To')}
            onOptions={autocompleteName}
            onChange={setTransactionTo}
          />
        </div>

        <div className="pure-control-group">
          <label htmlFor={uid('Date')}>
            Date: 
          </label>
          <input id={uid('Date')} type="text" value={transactionDate} onChange={(event) => {setTransactionDate(event.target.value)}} />
          <Calendar />
        </div>

        <div className="pure-control-group">
          <label htmlFor={uid('Amount')}>
            Amount: 
          </label>
          <input id={uid('Amount')} type="text" value={transactionAmount} onChange={(event) => {setTransactionAmount(event.target.value)}} />
        </div>

        <div className="pure-control-group">
          <label htmlFor={uid('Notes')}>
            Notes: 
          </label>
          <textarea id={uid('Notes')} type="text" value={transactionNotes} onChange={(event) => {setTransactionNotes(event.target.value)}} />
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