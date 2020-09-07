import React, { useState, useEffect } from "react";
import { uid } from "react-uid";
const { ipcRenderer } = window.require("electron");

export default function BulkImportAssignColumns({
  closeHandler,
  submitHandler,
}) {
  const [localState, setLocalState] = useState({
    isLoading: false,
    header: [],
    headerMap: [],
    body: [],
  });

  useEffect(() => {
    const getPreview = async () => {
      const fileData = await ipcRenderer.invoke("file-preview");

      setLocalState({
        ...localState,
        ...fileData,
        headerMap: fileData.header.map(() => ""),
        isLoading: false,
      });
    };

    setLocalState({ ...localState, isLoading: true });
    getPreview();
  }, []);

  const ColumnMap = ({ colIndex }) => {
    return (
      <select
        id={uid(`col_${colIndex}`)}
        value={localState.headerMap[colIndex]}
        onChange={(event) => {
          const tempHeader = [...localState.headerMap];
          tempHeader[colIndex] = event.target.value;
          setLocalState({
            ...localState,
            headerMap: tempHeader,
          });
        }}
      >
        <FieldMapOptions />
      </select>
    );
  };

  return (
    <div>
      <h1>Bulk Import</h1>

      <form className="pure-form pure-form-aligned" onSubmit={submitHandler}>
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
                  <ColumnMap colIndex={colIndex} />
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
      <option value="to">To</option>
      <option value="from">From</option>
      <option value="amount">Amount</option>
      <option value="date">Date</option>
      <option value="notes">Notes</option>
    </>
  );
}
