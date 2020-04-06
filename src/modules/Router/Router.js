import React, { useState, useEffect, useRef } from 'react';
import history from '../../services/history/history';

import routes from './routes';

export default function Router({ children }) {
  const [locationComponent, setLocationComponent] = useState();
  const historyListener = useRef();

  const renderComponent = (path) => {
    const foundRoute = routes.find((route) => (route.path === path));
    
    if (foundRoute) {
      setLocationComponent(foundRoute.action);
    }
  };

  useEffect(() => {
    historyListener.current = history.listen((location, action) => {
      renderComponent(location.pathname);
    });
    renderComponent(history.location.pathname);

    return () => { historyListener.current() };
  }, []);

const clickHandler = (path) => {
  history.push(path);
}

return (<div>
  Bye Bye router
  <button onClick={() => clickHandler('/app')}>Click Me APP</button>
  <button onClick={() => clickHandler('/welcome')}>Click Me Welcome</button>

  {locationComponent}
</div>)
}