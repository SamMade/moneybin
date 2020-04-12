import React, { useEffect, useState } from 'react';
import { uid } from 'react-uid';
import NodesServices from '../../../services/nodes';

import NodesRemoveButton from '../NodesRemoveButton/NodesRemoveButton'

export default function NodesList() {
  const [allNodes, setAllNodes] = useState([]);
  const [filter, setFilter] = useState(null);
  const [filteredNodes, setFilteredNodes] = useState(null);

  useEffect(() => {
    (async () => {
      const nodes = await NodesServices.getManyNodes();
      setAllNodes(nodes)
    })();
  }, []);

  // filter
  useEffect(() => {
    if (filter === null) {
      return;
    }

    (async function() {
      const list = await NodesServices.getNameAutocomplete(filter);
      if (list && list.length) {
        setFilteredNodes(list.map((orig) => ({...orig, id: orig.rowid})));
      } else {
        setFilteredNodes(null);
      }
      console.log(list);
    })()
  }, [filter])

  return (
    <>
      <input id={uid('name-filter')} type="text" onChange={(event) => {setFilter(event.target.value)}} />
      <ul>
        {
          (filteredNodes)
          ? filteredNodes.map((node, index) => (<ListItem key={(node, index)} node={node} />))
          : allNodes.map((node, index) => (<ListItem key={(node, index)} node={node} />))
        }
      </ul>
    </>
  );
}

function ListItem({node}) {
  return (
    <li>
      {node.name} ({node.id}) - {node.type} <NodesRemoveButton id={node.id} />
    </li>
  );
}