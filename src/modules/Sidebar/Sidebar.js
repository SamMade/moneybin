import React from 'react';

import NodesAddEditButton from '../Nodes/NodesAddEditButton/NodesAddEditButton';
import TransactionsAddButton from '../Transactions/TransactionsAddButton/TransactionsAddButton';

export default function Sidebar() {

  return (
    <>
      <div className="pure-menu">
        <a className="pure-menu-heading" href="#">Company</a>

        <ul className="pure-menu-list">
            <li className="pure-menu-item"><a href="#" className="pure-menu-link">Home</a></li>
            <li className="pure-menu-item"><a href="#" className="pure-menu-link">About</a></li>

            <li className="pure-menu-item menu-item-divided pure-menu-selected">
              <a href="/import">Bulk Import</a>
            </li>

            <li className="pure-menu-item menu-item-divided">
              <TransactionsAddButton buttonType="transparent" className="pure-menu-link" />
            </li>
            <li className="pure-menu-item">
              <NodesAddEditButton buttonType="transparent" className="pure-menu-link" />
            </li>
        </ul>
      </div>
    </>
  )
}