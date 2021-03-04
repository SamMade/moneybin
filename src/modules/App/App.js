import React, { useReducer, useMemo, useEffect } from 'react';

import GlobalContext from '../../services/globalContext/globalContext';
import { appReducer, appReducerInit } from './App-reducer';
import Router from '../Router/Router';

import appRuntime from '../../services/appRuntime';

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
    const subscription = appRuntime.subscribe('server-event', dispatchEvent);

    return () => {
      subscription();
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
