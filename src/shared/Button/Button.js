import React from 'react';
import PropTypes from 'prop-types';

export default function Button({ clickHandler, children, ...props }) {

  return (
    <button
      className="pure-button pure-button-primary"
      // onClick={clickHandler}
      {...props}
    >
      {children}
    </button>
  );
}

Button.propTypes = {
  clickHandler: PropTypes.func,
  children: PropTypes.node.isRequired,
}