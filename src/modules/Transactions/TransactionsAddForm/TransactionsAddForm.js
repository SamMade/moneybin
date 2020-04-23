import React, { useState, useEffect, useRef } from 'react';
import { uid } from 'react-uid';
import moment from 'moment';
import NodesServices from '../../../services/nodes';
import TransactionsServices from '../../../services/transactions';

import Autocomplete from '../../../shared/Autocomplete/Autocomplete';
import Calendar from '../../../shared/Calendar/Calendar';

import styles from './TransactionsAddForm.module.css';

const dateFormat = 'MM-DD-YYYY';

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
  const [transactionDatePretty, setTransactionDatePretty] = useState('');
  const [transactionDate, setTransactionDate] = useState('');
  const [transactionRecurring, setTransactionRecurring] = useState('');
  const [transactionAmount, setTransactionAmount] = useState('');
  const [transactionNotes, setTransactionNotes] = useState('');
  const [toggleCalendar, setToggleCalendar] = useState(false);
  const toggleCalendarTimeoutId = useRef();

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
        date: transactionDate,
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

  useEffect(() => {
    if (!transactionDate) { return; }
    setTransactionDatePretty(moment(transactionDate).format(dateFormat));
  }, [transactionDate])

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

        <div
          className={`pure-control-group ${styles['date-group']}`}
          onFocus={() => {
            clearTimeout(toggleCalendarTimeoutId.current);
            setToggleCalendar(true);
          }}
          onBlur={() => {
            toggleCalendarTimeoutId.current = setTimeout(() => {
              setToggleCalendar(false);
            }); 
          }}
        >
          <label htmlFor={uid('DatePretty')}>
            Date: 
          </label>
          <input
            id={uid('DatePretty')}
            type="text"
            value={transactionDatePretty}
            onChange={(event) => {setTransactionDate(moment(event.target.value, dateFormat).valueOf())}}
          />
          <input
            hidden
            readOnly
            id={uid('Date')}
            type="text"
            value={transactionDate}
          />
          {(toggleCalendar) && (
            <Calendar
              className={`${styles['date-calendar']}`}
              value={transactionDate}
              onChange={(date) => setTransactionDate(date)}
            />
          )}
        </div>

        <div className="pure-control-group">
          <label htmlFor={uid('Recurring')}>
            Recurring: 
          </label>
          <input id={uid('Recurring')} type="checkbox" checked={transactionRecurring} onChange={(event) => {setTransactionRecurring(event.target.checked)}} />
        </div>

        {(transactionRecurring && (
          <div className="pure-control-group">
            <fieldset>
              <label htmlFor={uid('RecurringFrequency')}>
                Frequency: 
              </label>
              <select id={uid('RecurringFrequency')} >
                <option>Daily</option>
                <option>Weekly</option>
                <option>Monthly</option>
                <option>Yearly</option>
              </select>
            </fieldset>
          </div>
        ))}

        <div className="pure-control-group">
          <label htmlFor={uid('Amount')}>
            Amount: 
          </label>
          <input
            id={uid('Amount')}
            type="text"
            value={transactionAmount}
            onChange={(event) => {
              const filter = /[^0-9.]/ig;
              setTransactionAmount(event.target.value.replace(filter, ''));
            }}
          />
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