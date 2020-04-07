import React, { useState } from 'react';
import { uid } from 'react-uid';
import NodesServices from '../services';

export default function NodesAddButton() {
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [addName, setAddName] = useState('');
  const [addType, setAddType] = useState('Person');

  const clickHandler = async (event) => {
    event.preventDefault();
    console.info('NodesAddButton - clicked');
    setIsConfirmed(false);
    const receipt = await NodesServices.addNodes({
      name: addName,
      type: addType,
    });
    setIsConfirmed(true);
  }

  return (
    <div>
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