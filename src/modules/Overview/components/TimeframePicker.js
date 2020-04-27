import React, { useContext } from 'react';
import moment from 'moment';

import GlobalContext from '../../../services/globalContext/globalContext';

import Button from '../../../shared/Button/Button';

export default function Overview() {
  const [globalState, globalDispatch] = useContext(GlobalContext);

  const timeframePick = (monthsBack, text) => {
    const start = moment().startOf('month').subtract(monthsBack, 'month').valueOf();
    const end = moment().endOf('day').valueOf();

    globalDispatch({
      type: 'change-timeframe',
      start,
      end,
      text,
    });
  }

  return (
    <div>
      <Button onClick={() => timeframePick(0, 'This month')}>This Month</Button>
      <Button onClick={() => timeframePick(3, 'Past 3 months')}>Past 3 Months</Button>
      <Button onClick={() => timeframePick(6, 'Past 6 months')}>Past 6 Months</Button>
      <Button onClick={() => timeframePick(12, 'Past 12 months')}>Past 12 Months</Button>
    </div>
  )
}