import React from 'react';
import PropTypes from 'prop-types';

export default function Button({ children, className, type, ...props }) {
  return (
    <button
      className={`pure-button button-${type} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

Button.propTypes = {
  type: PropTypes.string,
  children: PropTypes.node.isRequired,
};

Button.defaultProps = {
  type: 'primary'
};
