import React, {useState, useEffect, useRef} from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import {uid} from 'react-uid';

import CalendarDay from './Day';
import Button from '../Button/Button';

import styles from './Calendar.module.css';

export default function Calendar({
  className,
  value,
  onChange,
}) {
  const [selectedDate, setSelectedDate] = useState(moment().valueOf());
  const [calendarInfo, setCalendarInfo] = useState();
  const [error, setError] = useState();

  const getSelectedUnixDate = (theDay) => {
    return moment(selectedDate).startOf('month').add(theDay - 1, 'days').valueOf();
  };

  const dateSelectedHandler = (theDay) => {
    onChange(getSelectedUnixDate(theDay));
  };

  // set the date from user typing in 
  useEffect(() => {
    if (!moment(value).isValid() || moment(value).valueOf() === selectedDate) { 
      setError('Invalid Date');
      return;
    }

    setError(null);
    setSelectedDate(moment(value).valueOf());
  }, [value])

  // set selectedDate from user picking from calendar
  useEffect(() => {
    const today = moment(selectedDate);
    const monthFirstDay = parseInt(today.startOf('month').format('d'), 10);
    const daysInMonth = today.daysInMonth();
    const howManyWeeks = Math.ceil((monthFirstDay + daysInMonth) / 7);
  
    const weeks = [];
  
    // title
    const headerDays = [];
    for (let day=0; day<7; day++) {
      headerDays.push(
        <div key={uid('headerDay', day)} className={styles.dayOfWeek}>
          {today.day(day).format('dd')}
        </div>
      );
    }
    weeks.push(
      <div key={uid('headerWeek')} className={`${styles['week-header']} ${styles.week}`}>
        {headerDays}
      </div>
    );
  
    for (let week=0; week<howManyWeeks; week++) {
      const days = [];
      for (let day=1; day<=7; day++) {
        const dayOfMonth = ((7 * week) + day - monthFirstDay);
        const theDay = ((dayOfMonth > 0) && (dayOfMonth <= daysInMonth)) && dayOfMonth;
 
        days.push(
          <CalendarDay
            key={uid('day', dayOfMonth)}
            number={theDay}
            selected={getSelectedUnixDate(theDay) === moment(value).startOf('day').valueOf()}
            className={`${styles.dayOfWeek}`}
            clickHandler={() => {
              dateSelectedHandler(theDay);
            }}
          />
        );
      }
      weeks.push(
        <div key={uid('week', week)} className={styles.week}>
          {days}
        </div>
      )      
    }

    setCalendarInfo({
      elements: weeks,
    })
  }, [selectedDate]);

  const changeMonthHandler = (reference) => {
    if (reference === -1) {
      setSelectedDate(moment(selectedDate).subtract(1, 'months').valueOf());
      return;
    }
    if (reference === 1) {
      setSelectedDate(moment(selectedDate).add(1, 'months').valueOf());
      return;
    }
    if (reference === 0) {
      setSelectedDate(moment().valueOf());
      return;
    }
  };

  return (
    <div className={`${className} ${styles['calendar']}`}>
      <div className={`${styles['calendar-header']}`}>
        <Button type="button" onClick={() => changeMonthHandler(-1)}>{moment(selectedDate).subtract(1, 'months').format('MMMM')}</Button>
        {moment(selectedDate).format('MMMM')}
        <Button type="button" onClick={() => changeMonthHandler(1)}>{moment(selectedDate).add(1, 'months').format('MMMM')}</Button>
      </div>
      <div className={`${styles['calendar-month']}`}>
        {(calendarInfo && <>{calendarInfo.elements}</>)}
      </div>
    </div>
  )
}

Calendar.propTypes = {
  getDate: PropTypes.func,
};
