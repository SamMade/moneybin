import React, { useState, useEffect, useCallback } from 'react';
import { uid } from 'react-uid';

import appRuntime from '../../../../services/appRuntime';

import Loading from '../../../../shared/Loading/Loading';
import MatchNode from '../components/matchNode';

export default function ConfirmTargetNodes({ hide, closeHandler, submitHandler }) {
  const [localState, setLocalState] = useState({
    isLoading: false,
    targetNames: [],
    targetActions: undefined,
    errors: [],
  });

  useEffect(() => {
    if (hide) {
      return;
    }

    setLocalState({ ...localState, isLoading: true });

    appRuntime
      .invoke('bulk-import-getTargets')
      .then((targetNames) => {
        setLocalState((prev) => ({
          ...prev,
          targetNames,
          targetActions: {},
          isLoading: false,
          errors: [],
        }));
      })
      .catch((err) => {
        const errors = [];

        if (
          err.message ===
          "Error invoking remote method 'transactions-import-requestTargets': Error: No Target Column"
        ) {
          errors.push('No To/From Column Specified');
        } else {
          errors.push(err.message);
        }

        setLocalState((prev) => ({
          ...prev,
          isLoading: false,
          errors,
        }));
      });
  }, [hide]);

  // On target to node change
  const addTargetAction = useCallback((action) => {
    if (!action.name || !action.target) { return; }

    setLocalState((prev) => {
      prev.targetActions[action.name] = {
        node: action.target,
        addAsAlias: !!action.targetAlias,
      }

      return {
        ...prev,
        targetActions: prev.targetActions,
      };
    });
  }, []);

  /**
   * Next Page
   */
  const onFormSubmit = (e) => {
    e.preventDefault();


    appRuntime.invoke('bulk-import-assignTargets', localState.targetActions)
      .then(() => {
        submitHandler();
      })
  };

  return (
    <div style={{ display: (hide) ? 'none' : undefined}}>
      <h1>To/From Nodes</h1>

      {!!localState.errors.length &&
        localState.errors.map((err) => <div key={uid(err)}>{err}</div>)}

      <form className="pure-form pure-form-aligned" onSubmit={onFormSubmit}>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Attach to Node</th>
            </tr>
          </thead>

          <tbody>
            {!!localState.targetNames.length &&
              localState.targetNames.map((targetName) => (
                <tr key={uid(targetName)}>
                  <td>{targetName}</td>

                  <td>
                    <MatchNode name={targetName} onChange={addTargetAction} />
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
            Create
          </button>
        </div>
      </form>
    </div>
  );
}
