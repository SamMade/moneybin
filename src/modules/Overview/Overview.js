import React from 'react';

import Layout from '../Layout/SidebarMain';
import Sidebar from '../Sidebar/Sidebar';

import NodesAddButton from '../Nodes/NodesAddButton/NodesAddButton';
import NodesList from '../Nodes/NodesList/NodesList';

export default function Overview() {

  const sidebar = (<Sidebar />);

  return (
    <Layout sidebar={sidebar}>
      <div className="pure-g">
        <div className="pure-u-1">
          <NodesAddButton />
        </div>
        <div className="pure-u-1">
          <NodesList />
        </div>
      </div>
    </Layout>
  )
}