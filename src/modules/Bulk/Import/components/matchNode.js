import React, { useEffect, useState, useContext } from 'react';
import { uid, useUID } from 'react-uid';
import get from 'lodash/get';
import uniqBy from 'lodash/uniqBy';

import appRuntime from '../../../../services/appRuntime';

import NodesContext from './nodeContext';
import Loading from '../../../../shared/Loading/Loading';

export default function MatchNode({ name }) {
  const componentUID = useUID();

  const nodes = useContext(NodesContext);

  const [localState, setLocalState] = useState({
    isLoading: true,
    matches: [],
    matchNodes: [],
    errors: [],
  });
  
  useEffect(() => {
    setLocalState({ ...localState, isLoading: true });

    (async () => {
      try {
        const matches = await appRuntime.invoke('nodes-getMatch', name);

        const nodeIds = uniqBy(matches, 'id').map((m) => m.id);

        setLocalState({
          ...localState,
          matches,
          matchNodes: nodeIds,
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
  }, [name]);

  if (localState.isLoading) {
    return (<Loading />);
  }

  const SkipOption = () => (<option value="skip">--skip--</option>);
  const CreateOption = () => (<option value="create">--create--</option>);

  return (
    <>
      <label htmlFor={`${componentUID}-target`} className="sr-only">Target Name</label>
      <input type="hidden" id={`${componentUID}-target`} />

      <label htmlFor={`${componentUID}-node`}  className="sr-only">Action {localState.matchNodes.length}</label>
      <select id={`${componentUID}-node`} defaultValue={get(localState, 'matchNodes[0]') || 'skip'}>
        {/* Not Found */}
        {(localState.matchNodes.length === 0 && (
          <>
            <SkipOption />
            <CreateOption />
          </>
        ))}

        {/* One Found */}
        {(localState.matchNodes.length >= 1 && (
          <>
            <SkipOption />
            {
              nodes.map((node) => (
                <option key={uid(node)} value={node.id}>{node.name}</option>
              ))
            }
            <CreateOption />
          </>
        ))}
      </select>
    </>
  );
}