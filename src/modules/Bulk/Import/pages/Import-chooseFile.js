import React, { useState } from "react";
import { uid } from "react-uid";
const { ipcRenderer } = window.require("electron");

export default function BulkImportChooseFile({ closeHandler, submitHandler }) {
  const [filePath, setFilePath] = useState();

  const openFileHandler = async () => {
    const response = await ipcRenderer.invoke("file-open");
    if (!response || response.canceled) {
      return;
    }

    setFilePath(response);
  };

  return (
    <div>
      <h1>Bulk Import</h1>

      <form className="pure-form pure-form-aligned" onSubmit={submitHandler}>
        <div className="pure-control-group">
          <label htmlFor={uid("file")}>File:</label>
          <button type="button" onClick={openFileHandler}>
            Choose File
          </button>{" "}
          {filePath || "No file chosen"}
        </div>

        <div className="pure-controls">
          <button type="button" className="pure-button" onClick={closeHandler}>
            Cancel
          </button>

          <button
            type="submit"
            className="pure-button pure-button-primary"
            disabled={!filePath}
          >
            Next
          </button>
        </div>
      </form>
    </div>
  );
}
