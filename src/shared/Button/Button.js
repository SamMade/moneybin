import React from 'react';
import PropTypes from 'prop-types';

export default function Button({ children, ...props }) {

  return (
    <button
      className="pure-button pure-button-primary"
      {...props}
    >
      {children}
    </button>
  );
}

Button.propTypes = {
  children: PropTypes.node.isRequired,
}