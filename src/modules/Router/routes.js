import React from 'react';

import Overview from '../Overview/Overview';
import Welcome from '../Welcome/Welcome';

export default [
  { path: '/', action: () => <Overview /> },
  { path: '/welcome', action: () => <Welcome /> },
];
