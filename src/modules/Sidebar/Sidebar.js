import React from 'react';

import NodesAddButton from '../Nodes/NodesAddButton/NodesAddButton';
import TransactionsAddButton from '../Transactions/TransactionsAddButton/TransactionsAddButton';

export default function Sidebar() {

  return (
    <>
      Sidebar menu

      <div className="pure-menu">
        <a className="pure-menu-heading" href="#">Company</a>

        <ul className="pure-menu-list">
            <li className="pure-menu-item"><a href="#" className="pure-menu-link">Home</a></li>
            <li className="pure-menu-item"><a href="#" className="pure-menu-link">About</a></li>

            <li className="pure-menu-item menu-item-divided pure-menu-selected">
                <a href="#" className="pure-menu-link">Services</a>
            </li>

            <li className="pure-menu-item menu-item-divided">
              <TransactionsAddButton className="pure-menu-link" />
            </li>
            <li className="pure-menu-item">
              <NodesAddButton className="pure-menu-link" />
            </li>
        </ul>
      </div>
    </>
  )
}