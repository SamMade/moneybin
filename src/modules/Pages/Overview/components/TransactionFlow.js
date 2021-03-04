
import React, { useEffect, useState, useContext } from 'react';

import NodesServices from '../../../../services/nodes';
import TransactionsServices from '../../../../services/transactions';
import GlobalContext from '../../../../services/globalContext/globalContext';

import SankeyGraph from '../../../../shared/Charts/Sankey/Sankey';

async function getData(start, end) {
  const transactionsApi = TransactionsServices.getManyTransactions({
    filter: `gte(postDate, ${start}) and lte(postDate, ${end})`,
  });
  const nodesApi = NodesServices.getManyNodes();

  const [transactions, nodes] = await Promise.all([transactionsApi, nodesApi]);

  const sankeyNodes = nodes
    // filter because https://github.com/tomshanley/d3-sankey-circular/issues/40
    .filter((node) => 
      transactions.some((transaction) => 
        (node.id === transaction.from || node.id === transaction.to)))
    .map((node) => ({
      id: node.id.toString(),
      name: node.name,
    }));

  const sankeyLinks = transactions.map((transaction) => ({
    source: transaction.from.toString(),
    target: transaction.to.toString(),
    value: transaction.amount.toString(),
  }));

  return [sankeyNodes, sankeyLinks];
}

export default function TransactionFlow() {
  const [globalState] = useContext(GlobalContext);
  const [allTransactions, setAllTransactions] = useState([[], []]);

  useEffect(() => {
    (async () => {
      const [sankeyNodes, sankeyLinks] = await getData(globalState.timeframe.start, globalState.timeframe.end);
      setAllTransactions([sankeyNodes, sankeyLinks]);
    })();
  }, [globalState.refreshTrigger, globalState.timeframe]);

  return (
    <div>
      <SankeyGraph 
        nodes={allTransactions[0]}
        links={allTransactions[1]}
      />
    </div>
  );
}