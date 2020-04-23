import React, { useContext } from 'react';

import GlobalContext from '../../services/globalContext/globalContext';

export default function Announcement() {
  const [globalState, globalDispatch] = useContext(GlobalContext);

  return (
    <div>
      {
        globalState.accouncement.map((announcement) => (
        <p>{}</p>
        ))
      }
    </div>
  );
}