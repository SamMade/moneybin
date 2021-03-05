import React, { useState, useEffect } from 'react';
import { uid } from 'react-uid';

import appRuntime from '../../../../services/appRuntime';

import Loading from '../../../../shared/Loading/Loading';
import NodesContext from '../components/nodeContext';
import MatchNode from '../components/matchNode';

export default function ConfirmTargetNodes({
  closeHandler,
  submitHandler,
}) {
  const [localState, setLocalState] = useState({
    isLoading: false,
    targets: [],
    nodes: [],
    errors: [],
    actions: [],
  });

  useEffect(() => {
    setLocalState({ ...localState, isLoading: true });

    // Get all nodes
    const allNodesPromise = appRuntime.invoke('nodes-getMany');
    const transactionsTargetPromise = appRuntime.invoke('transactions-import-requestTargets');

    Promise.all([allNodesPromise, transactionsTargetPromise])
      .then(([nodes, targets]) => {
        setLocalState({
          ...localState,
          targets,
          nodes,
          isLoading: false,
          errors: [],
        });
      })
      .catch((err) => {
        const errors = [];
  
        if (err.message === "Error invoking remote method 'transactions-import-requestTargets': Error: No Target Column") {
          errors.push('No To/From Column Specified');
        } else {
          errors.push(err.message)
        }

        setLocalState({
          ...localState,
          isLoading: false,
          errors,
        });
      });
  }, []);

  const onSubmit = (e) => {
    e.preventDefault();

  }

  if (localState.isLoading) {
    return (<Loading />);
  }

  return (
    <NodesContext.Provider value={localState.nodes}>
      <div>
        <h1>To/From Nodes</h1>

        { !!localState.errors.length && localState.errors.map((err) => (
          <div key={uid(err)}>
            {err}
          </div>
        )) }

        <form className="pure-form pure-form-aligned" onSubmit={submitHandler}>
          <table>
            <thead>
              <tr>
                <th>
                  Name
                </th>
                <th>
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {!!localState.targets.length && localState.targets.map((targetName) => (
                <tr key={uid(targetName)}>
                  <td>
                    {targetName}
                  </td>

                  <td>
                    <MatchTarget name={targetName} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="pure-controls">
            <button type="button" className="pure-button" onClick={closeHandler}>
              Back
            </button>

            <button type="submit" className="pure-button pure-button-primary">
              Next
            </button>
          </div>
        </form>
      </div>
    </NodesContext.Provider>
  );
}

function MatchTarget({ name }) {
  const [localState, setLocalState] = useState({
    isLoading: true,
    matches: [],
    errors: [],
  });
  
  useEffect(() => {
    setLocalState({ ...localState, isLoading: true });

    (async () => {
      try {
        const matches = await appRuntime.invoke('nodes-getMatch', name);

        setLocalState({
          ...localState,
          matches,
          isLoading: false,
          errors: [],
        });
      } catch(err) {
        const errors = [];

        if (err.message === "Error invoking remote method 'transactions-import-requestTargets': Error: No Target Column") {
          errors.push('No To/From Column Specified');
        } else {
          errors.push(err.message);
        }

        setLocalState({
          ...localState,
          isLoading: false,
          errors,
        });
      }
    })();
  }, []);

  if (localState.isLoading) {
    return (<Loading />);
  }

  return (
    <MatchNode name={name} matches={localState.matches} />
  );
}
