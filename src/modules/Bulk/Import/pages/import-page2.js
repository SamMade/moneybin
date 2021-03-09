import { get } from 'lodash';
import React, { useState, useEffect } from 'react';
import { uid } from 'react-uid';

import appRuntime from '../../../../services/appRuntime';

import Alert from '../../../../shared/Alert/Alert';

export default function BulkImportAssignColumns({
  hide,
  closeHandler,
  submitHandler,
}) {
  const [localState, setLocalState] = useState({
    isLoading: false,
    header: [],
    headerMap: [],
    body: [],
    errors: [],
  });

  useEffect(() => {
    if (hide) {
      return;
    }

    setLocalState({ ...localState, isLoading: true });

    (async () => {
      const mappingsPromise = appRuntime.invoke('bulk-import-getColumns');
      const fileDataPromise = appRuntime.invoke('bulk-import-preview');

      const [mappings, fileData] = await Promise.all([mappingsPromise, fileDataPromise]);

      setLocalState((prev) => ({
        ...prev,
        ...fileData,
        headerMap: fileData.header.map((_, headerIndex) => get(mappings, `[${headerIndex}]`) || ''),
        isLoading: false,
      }));
    })();
  }, [hide]);

  /**
   * Next Page
   */
  const onSubmit = (e) => {
    e.preventDefault();

    // If nothing was mapped
    if (!localState.headerMap.some((colType) => !!colType)) {
      setLocalState((prev) => ({
        ...prev,
        errors: [{ type: 'error', message: 'Mappings Required'}],
      }));
      return;
    }

    // TODO: if duplicate mappings

    (async () => {
      await appRuntime.invoke('bulk-import-assignColumns', localState.headerMap);
      submitHandler();
    })();
  }

  const ColumnMapField = ({ colIndex }) => {
    return (
      <select
        id={uid(`col_${colIndex}`)}
        value={localState.headerMap[colIndex]}
        onChange={(event) => {
          const tempHeader = [...localState.headerMap];
          tempHeader[colIndex] = event.target.value;
          setLocalState((prev) => ({
            ...prev,
            errors: [],
            headerMap: tempHeader,
          }));
        }}
      >
        <FieldMapOptions />
      </select>
    );
  };

  return (
    <div style={{ display: (hide) ? 'none' : undefined}}>
      <h1>Bulk Import</h1>

      { localState.errors.map((err) => (
        <Alert key={uid(err)} type={err.type}>{ err.message }</Alert>
      ))}

      <form className="pure-form pure-form-aligned" onSubmit={onSubmit}>
        <table>
          <thead>
            <tr>
              {localState.header.map((head, colIndex) => (
                <th key={uid(head)}>
                  <span>{head}</span>
                  <br />

                  <label htmlFor={uid(`col_${colIndex}`)} className="sr-only">
                    Field:
                  </label>
                  <ColumnMapField colIndex={colIndex} />
                </th>
              ))}
            </tr>
          </thead>
          
          <tbody>
            {
              localState.body.map((line, rowIndex) => (
                <tr key={uid(line, rowIndex)}>
                  {
                    line.map((cell, cellIndex) => (
                      <td key={uid(cell, cellIndex)}>
                        {cell}
                      </td>
                    ))
                  }
                </tr>
              ))
            }
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
  );
}

function FieldMapOptions() {
  return (
    <>
      <option value="">--Ignore--</option>
      <option value="target">To/From</option>
      <option value="amount">Amount</option>
      <option value="postDate">Date</option>
      <option value="notes">Notes</option>
    </>
  );
}
