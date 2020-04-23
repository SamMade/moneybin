import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { uid } from 'react-uid';

import styles from './Autocomplete.module.css';

export default function Autocomplete({ id, onOptions, onChange }) {
  const [inputValue, setInputValue] = useState('');
  const [hoverItem, setHoverItem] = useState(-1);
  const [options, setOptions] = useState([]);

  const callAutocomplete = async () => {
    if (!onOptions || (!inputValue && options.length === 0)) {
      return;
    }

    if (!inputValue) {
      setOptions([]);
      return;
    }
  
    const autocompleteList = await onOptions(inputValue);
      
    if (autocompleteList && autocompleteList.length > 0) {
      setOptions(autocompleteList);
      return;
    }
    setOptions([]);
  };

  // set autocomplete triggering onOptions handler
  useEffect(() => {
    callAutocomplete();
  }, [inputValue, onOptions]);

  // onChange handler triggered
  useEffect(() => {
    if (!onChange) {
      return;
    }

    onChange(inputValue);
  }, [inputValue])

  const selectItem = (id) => {
    setInputValue(id);
  }

  // keyboard accessibility
  const hoverOption = (event) => {
    if (!options || options.length === 0) {
      if (hoverItem !== -1) { setHoverItem(-1); }
      return;
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault();

      if (hoverItem >= options.length - 1) {
        setHoverItem(0);
      } else {
        setHoverItem(hoverItem + 1);
      }
      return;
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      if (hoverItem <= 0) {
        setHoverItem(options.length - 1);
      } else {
        setHoverItem(hoverItem - 1);
      }
      return;
    }

    if (event.key === 'Enter' && hoverItem >= 0 && hoverItem < options.length) {
      event.preventDefault();
      selectItem(options[hoverItem].id);
      return;
    }
  }

  return (
    <div className={`${styles.wrapper}`}
      onKeyDown={hoverOption}
      onBlur={() => {setOptions([]);}}
      onFocus={() => {callAutocomplete();}}
    >
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
          options.map((item, optionsIndex) => (
            <li key={uid(item)}
              onClick={()=>{selectItem(item.id)}}
              className={(optionsIndex === hoverItem) ? styles.highlight : ''}
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
