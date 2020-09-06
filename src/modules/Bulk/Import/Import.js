import React, { useState, useRef } from 'react';
import { uid } from "react-uid";
const { ipcRenderer } = window.require('electron');

export default function BulkImportForm() {
  const [isLoading, setIsLoading] = useState(false);
  const fileInput = useRef();

  const submitHandler = async (event) => {
    event.preventDefault();
    console.info("Import - clicked");

    setIsLoading(true);

    try{
      await ipcRenderer.invoke('bulk-import', fileInput.current.value);
    } catch(e) { console.log(e)}

    setIsLoading(false);
  };

  const openFileHandler = async () => {
    const response = await ipcRenderer.invoke('open-file');
    if (response.canceled) { return; }

    fileInput.current.value = response.filePaths[0];
  }

  return (
    <form className="pure-form pure-form-aligned" onSubmit={submitHandler}>
      <div className="pure-control-group">
        <label htmlFor={uid("file")}>File:</label>
        <input
          id={uid("file")}
          type="text"
          ref={fileInput}
          disabled
        />
        <button type="button" onClick={openFileHandler}>Choose File</button>
      </div>
      
      <div className="pure-controls">
        <button
          type="submit"
          className="pure-button pure-button-primary"
        >
          Submit
        </button>
      </div>
    </form>
  )
}