import React, { useEffect, useState, useContext } from 'react';
import { uid } from 'react-uid';
import NodesServices from '../../../services/nodes';
import GlobalContext from '../../../services/globalContext/globalContext';

import NodesAddEditButton from '../NodesAddEditButton/NodesAddEditButton';

export default function NodesList() {
  const [globalState] = useContext(GlobalContext);
  const [allNodes, setAllNodes] = useState([]);
  const [filter, setFilter] = useState(null);
  const [filteredNodes, setFilteredNodes] = useState(null);

  useEffect(() => {
    (async () => {
      const nodes = await NodesServices.getManyNodes();
      setAllNodes(nodes)
    })();
  }, [globalState.refreshTrigger, globalState.timeframe]);

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
      <NodesAddEditButton editId={node.id}>{node.name} ({node.id}) - {node.type}</NodesAddEditButton>
    </li>
  );
}