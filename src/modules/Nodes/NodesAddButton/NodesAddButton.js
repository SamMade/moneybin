import React, { useEffect, useState, useRef } from 'react';
import { uid } from 'react-uid';
import NodesServices from '../services';

const { ipcRenderer } = window.require('electron');

export default function NodesAddButton() {
  const receipts = useRef([]);
  const [isConfirmed, setIsConfirmed] = useState(false);

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

  const clickHandler = () => {
    console.info('NodesAddButton - clicked');
    setIsConfirmed(false);
    const receipt = NodesServices.addNodes({
      name: 'Sam',
      type: 'Person',
    });
    confirmOrAdd('sent', receipt);
  }

  return (
    <>
      <div>
        <button onClick={clickHandler}>Add Node</button>
        { (isConfirmed) && <span>...Added</span>}
      </div>
    </>
  );
}