import React from 'react';
import PropTypes from 'prop-types';

import ReactModal from 'react-modal';

export default function Modal({ closeHandler, children }) {

  return (
    <ReactModal
      isOpen={true}
      appElement={document.querySelector('#root')}
      onRequestClose={closeHandler}
      contentLabel="Example Modal"
    >
      {children}
    </ReactModal>
  );
}

Modal.propTypes = {
  closeHandler: PropTypes.func,
  children: PropTypes.node,
}