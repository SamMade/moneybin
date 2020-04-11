import React from 'react';

import Layout from '../Layout/SidebarMain';
import Sidebar from '../Sidebar/Sidebar';

import NodesAddButton from '../Nodes/NodesAddButton/NodesAddButton';
import NodesList from '../Nodes/NodesList/NodesList';

import TransactionsAddButton from '../Transactions/TransactionsAddButton/TransactionsAddButton';
import TransactionsList from '../Transactions/TransactionsList/TransactionsList';

export default function Overview() {

  const sidebar = (<Sidebar />);

  return (
    <Layout sidebar={sidebar}>
      <div className="pure-g">
        <div className="pure-u-1-2">
          <NodesAddButton />
        </div>
        <div className="pure-u-1-2">
          <TransactionsAddButton />
        </div>
        <div className="pure-u-1-2">
          <h2>Nodes</h2>
          <NodesList />
        </div>
        <div className="pure-u-1-2">
          <h2>Transactions</h2>
          <TransactionsList />
        </div>
      </div>
    </Layout>
  )
}