import React from 'react';

import Overview from '../Overview/Overview';
import Welcome from '../Welcome/Welcome';
import App from '../App/App';

export default [
  { path: '/', action: () => <Overview /> },
  { path: '/welcome', action: () => <Welcome /> },
  { path: '/app', action: () => <App /> },
];
