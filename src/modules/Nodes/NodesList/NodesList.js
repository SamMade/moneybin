import React, { useEffect, useState } from 'react';
import NodesServices from '../services';
import NodesRemoveButton from '../NodesRemoveButton/NodesRemoveButton'

import { uid } from 'react-uid';

const { ipcRenderer } = window.require('electron');

export default function NodesList() {
  const [allNodes, setAllNodes] = useState([]);

  const nodeListListener = (event, arg) => {
    setAllNodes(arg);
  };

  useEffect(() => {
    ipcRenderer.on('nodes-getAll-reply', nodeListListener);
    NodesServices.getAllNodes();
  
    return () => {
      ipcRenderer.removeListener('nodes-getAll-reply', nodeListListener);
    };
  }, []);

  return (
    <>
      <ul>
        {
          allNodes.map((node, index) => (
            <li key={uid(node, index)}>
              {node.name} - {node.type} <NodesRemoveButton id={node.id} />
            </li>
          ))
        }
      </ul>
    </>
  );
}