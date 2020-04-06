import React, { useEffect, useState, useRef } from 'react';
import NodesServices from '../services';

const { ipcRenderer } = window.require('electron');

export default function NodesAddButton() {
  const receipts = useRef([]);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [addName, setAddName] = useState('');
  const [addType, setAddType] = useState('Person');

  const confirmOrAdd = (type, uid) => {
    const isFound = receipts.current.findIndex((receipt) => receipt === uid);
    
    if (isFound !== -1) {
      receipts.current = [].concat(receipts.current, [uid]);
      return;
    }

    const copyArray = Array.from(receipts.current);
    copyArray.splice(isFound, 1);
    receipts.current = copyArray;
    setIsConfirmed(true);
  }

  const addListener = (event, confirmation) => {
    console.info(`Confirmation received for ${confirmation}`);
    confirmOrAdd('received', confirmation);
  };

  useEffect(() => {
    ipcRenderer.on('nodes-add-reply', addListener);

    return () => {
      ipcRenderer.removeListener('nodes-add-reply', addListener);
    };
  }, []);

  const clickHandler = (event) => {
    event.preventDefault();
    console.info('NodesAddButton - clicked');
    setIsConfirmed(false);
    const receipt = NodesServices.addNodes({
      name: addName,
      type: addType,
    });
    confirmOrAdd('sent', receipt);
  }

  return (
    <>
      <div>
        <form onSubmit={clickHandler}>
          <label>
            Name: <input type="text" value={addName} onChange={(event) => {setAddName(event.target.value)}} />
          </label>
          <label>
            Type: 
            <select value={addType} onChange={(event) => {setAddType(event.target.value)}}>
              <option value="Person">Person</option>
              <option value="Bank">Bank</option>
              <option value="Credit Card">Credit Card</option>
            </select>
            
          </label>
          <button type="submit">Add Node</button>
        </form>
        { (isConfirmed) && <span>...Added</span>}
      </div>
    </>
  );
}