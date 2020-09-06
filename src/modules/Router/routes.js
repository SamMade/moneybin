import React from 'react';

import Overview from '../Overview/Overview';
import Welcome from '../Welcome/Welcome';
import BulkImport from '../Bulk/Import/Import';

export default [
  { path: '/', action: () => <Overview /> },
  { path: '/welcome', action: () => <Welcome /> },
  { path: '/import', action: () => <BulkImport /> },
];
