import React, { useState, useEffect } from 'react';
import { uid } from 'react-uid';

import appRuntime from '../../../../services/appRuntime';

export default function ConfirmTargetNodes({
  closeHandler,
  submitHandler,
}) {
  const [localState, setLocalState] = useState({
    isLoading: false,
    targets: {},
    errors: [],
    actions: [],
  });

  useEffect(() => {
    setLocalState({ ...localState, isLoading: true });

    (async () => {
      try {
        const targets = await appRuntime.invoke('transactions-import-requestTargets');

        setLocalState({
          ...localState,
          targets,
          isLoading: false,
          errors: [],
        });
      } catch(err) {
        if (err.message === "Error invoking remote method 'transactions-import-requestTargets': Error: No Target Column") {
          setLocalState({
            ...localState,
            isLoading: false,
            errors: ['No To/From Column Specified'],
          });
        }
      }
    })();
  }, []);

  const onSubmit = (e) => {
    e.preventDefault();

    
  }

  return (
    <div>
      <h1>To/From Nodes</h1>

      { !!localState.errors.length && localState.errors.map((err) => (
        <div key={uid(err)}>
          {err}
        </div>
      )) }

      <form className="pure-form pure-form-aligned" onSubmit={submitHandler}>
        <ul>
          {localState.targets && Object.keys(localState.targets).map((targetName) => (
            <li key={uid(targetName)}>
              <span>{targetName}</span>

              { !localState.targets[targetName] && (<span>Will Create</span>) }

              { localState.targets[targetName] === '?' && (<span>Wild Guess</span>) }

              { localState.targets[targetName] && localState.targets[targetName] !== '?' && (<span>Found</span>) }
            </li>
          ))}
        </ul>

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
  );
}

function FieldMapOptions() {
  return (
    <>
      <option value="">--Ignore--</option>
      <option value="toFrom">To/From</option>
      <option value="amount">Amount</option>
      <option value="date">Date</option>
      <option value="notes">Notes</option>
    </>
  );
}
