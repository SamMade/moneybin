import React, { useState, useContext, useEffect } from 'react';
import { uid, useUID } from 'react-uid';
import appRuntime from '../../../../services/appRuntime';

import NodesContext from '../components/nodeContext';

export default function BulkImportChooseFile({ hide, closeHandler, submitHandler }) {
  const componentUID = useUID();
  const [sourceNode, setSourceNode] = useState();
  const [filePath, setFilePath] = useState();

  const nodes = useContext(NodesContext);

  useEffect(() => {
    appRuntime.invoke('bulk-import-setSource', sourceNode);
  }, [sourceNode]);

  const openFileHandler = async () => {
    const response = await appRuntime.invoke('bulk-import-setFile');
    if (!response || response.canceled) {
      return;
    }

    setFilePath(response);
  };

  return (
    <div style={{ display: (hide) ? 'none' : undefined}}>
      <h1>Bulk Import</h1>

      <form className="pure-form pure-form-aligned" onSubmit={submitHandler}>
        <div className="pure-control-group">
          <label htmlFor={`${componentUID}-node`}>Source node:</label>
          <select
            id={`${componentUID}-node`}
            value={sourceNode}
            onChange={(e) => setSourceNode(e.target.value)}
            required
          >
            <option value=''>--Please select--</option>
            {
              nodes.map((node) => (
                <option key={uid(node)} value={node.id}>{node.name}</option>
              ))
            }
          </select>
        </div>
        
        <div className="pure-control-group">
          <label htmlFor={uid('file')}>File:</label>
          <button type="button" onClick={openFileHandler}>
            Choose File
          </button>{' '}
          {filePath || 'No file chosen'}
        </div>

        <div className="pure-controls">
          <button type="button" className="pure-button" onClick={closeHandler}>
            Cancel
          </button>

          <button
            type="submit"
            className="pure-button pure-button-primary"
            disabled={!filePath || !sourceNode}
          >
            Next
          </button>
        </div>
      </form>
    </div>
  );
}
