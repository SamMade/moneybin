import React, { useReducer, useMemo, useEffect } from 'react';

import GlobalContext from '../../services/globalContext/globalContext';
import { appReducer, appReducerInit } from './App-reducer';
import Router from '../Router/Router';

const { ipcRenderer } = window.require('electron');

function App() {
  const [state, dispatch] = useReducer(appReducer, appReducerInit);

  const contextValue = useMemo(() => {
    return [state, dispatch];
  }, [state, dispatch]);

  const dispatchEvent = (event, messageType) => {
    dispatch({
      type: 'server-event',
      code: messageType,
    })
  };

  useEffect(() => {
    ipcRenderer.on('server-event', dispatchEvent);

    return () => {
      ipcRenderer.removeListener('server-event', dispatchEvent);
    };
  }, []);

  return (
    <div className="App">
      <GlobalContext.Provider value={contextValue}>
        <Router />
      </GlobalContext.Provider>
    </div>
  );
}

export default App;
