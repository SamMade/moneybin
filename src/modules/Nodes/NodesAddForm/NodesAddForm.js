import React, { useState, useEffect } from 'react';
import { uid } from 'react-uid';
import NodesServices from '../../../services/nodes';

const defaultType = 'Person';

export default function NodesAddForm() {
  const [isConfirmed, setIsConfirmed] = useState(null);
  const [addName, setAddName] = useState('');
  const [addType, setAddType] = useState(defaultType);
  
  // reset
  useEffect(() => {
    if (!isConfirmed || isConfirmed.error) {
      return;
    }

    setAddName('');
    setAddType(defaultType);
  }, [isConfirmed]);

  const clickHandler = async (event) => {
    event.preventDefault();
    console.info('NodesAddForm - clicked');

    setIsConfirmed(null);
    
    try {
      const receipt = await NodesServices.addNodes({
        name: addName,
        type: addType,
      });
    } catch(e) {
      console.error(e);
      setIsConfirmed({
        error: true,
        errorMessage: e.message,
      });
      return;
    }
    
    setIsConfirmed({
      success: true,
      error: false,
    });
  }

  return (
    <div>
      <h1>Add Node</h1>
      <form className="pure-form pure-form-aligned" onSubmit={clickHandler}>
        <div className="pure-control-group">
          <label htmlFor={uid('name')}>
            Name: 
          </label>
          <input id={uid('name')} type="text" value={addName} onChange={(event) => {setAddName(event.target.value)}} />
        </div>
        
        <div className="pure-control-group">
          <label htmlFor={uid('type')}>
            Type: 
          </label>
          <select id={uid('type')} value={addType} onChange={(event) => {setAddType(event.target.value)}}>
            <option value="Person">Person</option>
            <option value="Bank">Bank</option>
            <option value="Credit Card">Credit Card</option>
          </select>
        </div>

        <div className="pure-controls">
          <button type="submit" className="pure-button pure-button-primary">Add Node</button>
        </div>
      </form>
      { (isConfirmed) && <span>...Added</span>}
    </div>
  );
}