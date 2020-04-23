import React, { useContext } from 'react';

import Layout from '../Layout/SidebarMain';
import Sidebar from '../Sidebar/Sidebar';

import GlobalContext from '../../services/globalContext/globalContext';
import NodesList from '../Nodes/NodesList/NodesList';
import TransactionsList from '../Transactions/TransactionsList/TransactionsList';

export default function Overview() {
  const [globalState, globalDispatch] = useContext(GlobalContext);

  const sidebar = (<Sidebar />);

  return (
    <Layout sidebar={sidebar}>
      <div>
        {globalState.timeframe.start} - {globalState.timeframe.end} 
      </div>
      <div className="pure-g">
        <div className="pure-u-1-2">
          <h2>Transactions</h2>
          <TransactionsList />
        </div>
        <div className="pure-u-1-2">
          <h2>Nodes</h2>
          <NodesList />
        </div>
      </div>
      <div>

      </div>
    </Layout>
  )
}