import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { uid } from 'react-uid';

import styles from './Autocomplete.module.css';

export default function Autocomplete({ id, onOptions, onChange }) {
  const [inputValue, setInputValue] = useState('');
  const [options, setOptions] = useState([]);

  useEffect(() => {
    if (!onOptions || (!inputValue && options.length === 0)) {
      return;
    }

    if (!inputValue) {
      setOptions([]);
      return;
    }
  
    (async () => {
      const autocompleteList = await onOptions(inputValue);
      
      if (autocompleteList && autocompleteList.length > 0) {
        setOptions(autocompleteList);
        return;
      }
      setOptions([]);
    })();
  }, [inputValue, onOptions]);

  useEffect(() => {
    if (!onChange) {
      return;
    }

    onChange(inputValue);
  }, [inputValue])

  const selectItem = (id) => {
    setInputValue(id);
  }

  return (
    <div className={`${styles.wrapper}`}>
      <span role="combobox"
        aria-expanded={(options.length > 0)}
        aria-owns="ex1-listbox"
        aria-haspopup="listbox"
        id="ex1-combobox"
      >
        <input type="text"
          aria-autocomplete="list"
          aria-controls="ex1-listbox"
          id={id}
          value={inputValue}
          onChange={(event) => {setInputValue(event.target.value)}}
        />
      </span>
      <ul aria-labelledby={id}
        role="listbox"
        className={`${styles.listbox}`}
      >
        {
          options.map((item) => (
            <li key={uid(item)}
              onClick={()=>{selectItem(item.id)}}
            >
              {item.name}
            </li>
          ))
        }
      </ul>
    </div>
  );
}

Autocomplete.propTypes = {
  id: PropTypes.string.isRequired,
  onOptions: PropTypes.func,
  onChange: PropTypes.func,
};

Autocomplete.defaultProps = {
  options: () => {},
}
