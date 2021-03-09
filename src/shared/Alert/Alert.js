import React from 'react';
import PropTypes from 'prop-types';

import styles from './Alert.module.css';

export default function Alert({ type, children }) {
  return (
    <div className={`${styles.alert} ${styles[type]}`}>
      {children}
    </div>
  );
}

Alert.propTypes = {
  type: PropTypes.oneOf(['', 'error', 'warn']),
}