import React, { useEffect, useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { uid, useUID } from 'react-uid';
import get from 'lodash/get';
import uniqBy from 'lodash/uniqBy';

import appRuntime from '../../../../services/appRuntime';

import NodesContext from './nodeContext';
import Loading from '../../../../shared/Loading/Loading';

export default function MatchNode({ name, onChange }) {
  const componentUID = useUID();

  const nodes = useContext(NodesContext);

  const [localState, setLocalState] = useState({
    isLoading: true,
    selectedNode: 'skip',
    addAlias: false,
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
          selectedNode: get(nodeIds, '[0]') || 'skip',
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

  const onSelectChange = (evt) => {
    setLocalState((prevState) => ({ ...prevState, selectedNode: evt.target.value }));
  };

  const onAliasChange = (evt) => {
    setLocalState((prevState) => ({ ...prevState, addAlias: evt.target.checked }));
  };

  useEffect(() => {
    // save change to the whole
    onChange({
      name,
      target: localState.selectedNode,
      targetAlias: localState.addAlias,
    })
  }, [name, onChange, localState.selectedNode, localState.addAlias])

  if (localState.isLoading) {
    return (<Loading />);
  }

  const SkipOption = () => (<option value="skip">--skip--</option>);
  const CreateOption = () => (<option value="create">--create--</option>);

  return (
    <>
      <label htmlFor={`${componentUID}-node`}  className="sr-only">Action {localState.matchNodes.length}</label>
      <select id={`${componentUID}-node`} value={localState.selectedNode} onChange={onSelectChange}>
          <>
            <SkipOption />
            {
              nodes.map((node) => (
                <option key={uid(node)} value={node.id}>{node.name}</option>
              ))
            }
            <CreateOption />
          </>
      </select>

      {
        (
          localState.selectedNode !== get(localState, 'matchNodes[0]')
          && localState.selectedNode !== 'skip'
          && localState.selectedNode !== 'create'
          && (
            <div>
              <label htmlFor={`${componentUID}-alias`}>Add as alias?</label>
              <input type="checkbox" id={`${componentUID}-alias`} value={localState.addAlias} onChange={onAliasChange} />
            </div>
          )
        ) 
      }
    </>
  );
}

MatchNode.propTypes = {
  name: PropTypes.string,
  onChange: PropTypes.func,
}