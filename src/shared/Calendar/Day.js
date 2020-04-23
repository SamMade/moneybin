import React from 'react';

import styles from './Day.module.css';

export default function CalendarDay({
  number,
  clickHandler,
  className,
  selected,
}) {
  if (!number) {
    return (<div className={`${styles['day']} ${styles['day--disabled']} ${className}`}></div>);
  }
  const selectedClass = (selected) ? styles['day--selected'] : '';
  return (
    <button
      type="button"
      onClick={clickHandler}
      className={`${styles['day']} ${styles['day--enabled']} ${selectedClass} ${className}`}
    >
      {number}
    </button>
  )
}