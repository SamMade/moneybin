import React, {useState, useEffect} from 'react';
import moment from 'moment';
import {uid} from 'react-uid';

import Button from '../Button/Button';

import style from './Calendar.module.css';

export default function Calendar() {
  const [theDate, setTheDate] = useState(moment().valueOf());
  const [calendarInfo, setCalendarInfo] = useState();

  useEffect(() => {
    const today = moment(theDate);
    const monthFirstDay = parseInt(today.startOf('month').format('d'), 10);
    const daysInMonth = today.daysInMonth();
    const howManyWeeks = Math.ceil((monthFirstDay + daysInMonth) / 7);
  
    const weeks = [];
  
    // title
    const headerDays = [];
    for (let day=0; day<7; day++) {
      headerDays.push(
        <div key={uid('headerDay', day)} className={style.dayOfWeek}>
          {today.day(day).format('dd')}
        </div>
      );
    }
    weeks.push(
      <div key={uid('headerWeek')} className={style.week}>
        {headerDays}
      </div>
    );
  
    for (let week=0; week<howManyWeeks; week++) {
      const days = [];
      for (let day=1; day<=7; day++) {
        const dayOfMonth = ((7 * week) + day - monthFirstDay);
        days.push(
          <div key={uid('day', dayOfMonth)} className={style.dayOfWeek}>
            {((dayOfMonth > 0) && (dayOfMonth <= daysInMonth)) && dayOfMonth}
          </div>
        );
      }
      weeks.push(
        <div key={uid('week', week)} className={style.week}>
          {days}
        </div>
      )      
    }

    setCalendarInfo({
      elements: weeks,
    })
  }, [theDate]);

  const changeMonth = (reference) => {
    if (reference === -1) {
      setTheDate(moment(theDate).subtract(1, 'months').valueOf());
      return;
    }
    if (reference === 1) {
      setTheDate(moment(theDate).add(1, 'months').valueOf());
      return;
    }
    if (reference === 0) {
      setTheDate(moment().valueOf());
      return;
    }
  };

  return (
    <div>
      <div>
        <Button onClick={() => changeMonth(-1)}>{moment(theDate).subtract(1, 'months').format('MMMM')}</Button>
        {moment(theDate).format('MMMM')}
        <Button onClick={() => changeMonth(1)}>{moment(theDate).add(1, 'months').format('MMMM')}</Button>
      </div>
      <div>
        {(calendarInfo && <>{calendarInfo.elements}</>)}
      </div>
    </div>
  )
}
