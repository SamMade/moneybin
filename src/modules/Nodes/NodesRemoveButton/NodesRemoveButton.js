import React, { useState } from 'react';
import NodesServices from '../../../services/nodes';

export default function NodesRemoveButton({ id, children }) {
  const [isConfirmed, setIsConfirmed] = useState(false);

  const clickHandler = async (e) => {
    e.preventDefault();
  
    console.info('NodesRemoveButton - clicked');
    setIsConfirmed(false);
    
    await NodesServices.removeNodes(id);
    
    setIsConfirmed(true);
  }

  return (
    <>
      <button onClick={clickHandler}>{children || '[x]'}</button>
      { (isConfirmed) && <span>...Removed</span>}
    </>
  );
}