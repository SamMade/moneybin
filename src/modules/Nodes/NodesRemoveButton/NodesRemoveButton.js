import React, { useEffect, useState, useRef } from 'react';
import NodesServices from '../services';

const { ipcRenderer } = window.require('electron');

export default function NodesRemoveButton({ id }) {
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

  const removeNodeListener = (event, confirmation) => {
    console.info(`Confirmation received for ${confirmation}`);
    confirmOrAdd('received', confirmation);
  };

  useEffect(() => {
    // ipcRenderer.on('nodes-remove-reply', removeNodeListener);

    return () => {
      ipcRenderer.removeListener('nodes-remove-reply', removeNodeListener);
    };
  }, []);

  const clickHandler = () => {
    console.info('NodesRemoveButton - clicked');
    setIsConfirmed(false);
    const receipt = NodesServices.removeNodes(id);
    confirmOrAdd('sent', receipt);
  }

  return (
    <>
      <button onClick={clickHandler}>[x]</button>
      { (isConfirmed) && <span>...Removed</span>}
    </>
  );
}