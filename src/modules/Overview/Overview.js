import React, { useContext } from 'react';

import Layout from '../Layout/SidebarMain';
import Sidebar from '../Sidebar/Sidebar';

import NodesList from '../Nodes/NodesList/NodesList';
import TimeframePicker from './components/TimeframePicker';
import TransactionsList from './components/TransactionsList';
import TransactionsFlow from './components/TransactionFlow';
import TransactionTotals from './components/TransactionTotals';

export default function Overview() {

  const sidebar = (<Sidebar />);

  return (
    <Layout sidebar={sidebar}>
      <div className="align--right">
        <TimeframePicker />
      </div>

      <div>
        <TransactionsFlow />
      </div>

      <div>
        <TransactionTotals />
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
    </Layout>
  )
}