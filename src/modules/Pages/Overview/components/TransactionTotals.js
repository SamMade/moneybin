import React, { useEffect, useState, useContext } from "react";
import isEmpty from "lodash/isEmpty";

import NodesServices from "../../../../services/nodes";
import TransactionsServices from "../../../../services/transactions";
import GlobalContext from "../../../../services/globalContext/globalContext";
import { uid } from "react-uid";

async function getData(start, end) {
  const nodesApi = await NodesServices.getManyNodes({
    filter: "eq(isDefault, 1)",
  });

  if (!nodesApi || isEmpty(nodesApi)) {
    return [[], []];
  }

  const transactionsApi = await TransactionsServices.getManyTransactions({
    filter: [
      `gte(postDate, ${start}) and lte(postDate, ${end})`,
      "and (",
      `in(source, ${nodesApi.map((node) => node.id).join(", ")})`,
      "or",
      `in(target, ${nodesApi.map((node) => node.id).join(", ")})`,
      ")",
    ].join(" "),
  });

  return [nodesApi, transactionsApi];
}

export default function TransactionTotals() {
  const [globalState] = useContext(GlobalContext);
  const [totals, setAllTransactions] = useState([]);

  useEffect(() => {
    (async () => {
      const [nodes, transactions] = await getData(
        globalState.timeframe.start,
        globalState.timeframe.end
      );

      const totals = nodes.map((node) => ({
        id: node.id,
        name: node.name,
        amount: transactions.reduce((total, transaction) => {
          if (node.id === transaction.from && node.id === transaction.to) {
            return total;
          }
          if (node.id === transaction.from) {
            return total - transaction.amount;
          }
          if (node.id === transaction.to) {
            return total + transaction.amount;
          }
          return total;
        }, 0),
      }));
      setAllTransactions(totals);
    })();
  }, [globalState.refreshTrigger, globalState.timeframe]);

  return (
    <div className="pure-g">
      {totals.map((person) => (
        <div key={uid(person)} className="pure-u">
          {person.amount}
          <br />
          {person.name}
        </div>
      ))}
    </div>
  );
}
