import React from 'react';

import Overview from '../Pages/Overview/Overview';
import Welcome from '../Pages/Welcome/Welcome';

export default [
  { path: '/', action: () => <Overview /> },
  { path: '/welcome', action: () => <Welcome /> },
];
