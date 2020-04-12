import React, { useState } from 'react';
import NodesServices from '../../../services/nodes';

export default function NodesRemoveButton({ id }) {
  const [isConfirmed, setIsConfirmed] = useState(false);

  const clickHandler = async () => {
    console.info('NodesRemoveButton - clicked');
    setIsConfirmed(false);
    const receipt = await NodesServices.removeNodes(id);
    setIsConfirmed(true);
  }

  return (
    <>
      <button onClick={clickHandler}>[x]</button>
      { (isConfirmed) && <span>...Removed</span>}
    </>
  );
}