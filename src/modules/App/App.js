import React, { useReducer, useMemo } from 'react';

import GlobalContext from '../../services/globalContext/globalContext';
import { appReducer, appReducerInit } from './App-reducer';
import Router from '../Router/Router';

function App() {
  const [state, dispatch] = useReducer(appReducer, appReducerInit);

  const contextValue = useMemo(() => {
    return { state, dispatch };
  }, [state, dispatch]);

  return (
    <div className="App">
      <GlobalContext.Provider value={contextValue}>
        <Router />
      </GlobalContext.Provider>
    </div>
  );
}

export default App;
