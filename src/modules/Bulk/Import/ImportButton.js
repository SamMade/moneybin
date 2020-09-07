import React, { useState } from 'react';
import PropTypes from 'prop-types';

import ImportForm from './ImportPage';
import Button from '../../../shared/Button/Button';
import Modal from '../../../shared/Modal/Modal';

export default function ImportButton({ buttonType, className, children }) {
  const [isShown, setIsShown] = useState(false);

  const toggleModal = () => {
    setIsShown(!isShown);
  }

  return (
    <>
      <Button
        className={className}
        onClick={toggleModal}
        type={buttonType}
      >
        {children || 'Bulk Import'}
      </Button>
      {
        (isShown
          && (
            <Modal closeHandler={toggleModal}>
              <ImportForm closeHandler={toggleModal} />
            </Modal>
          ))
      }
    </>
  );
}

ImportButton.propTypes = {
  editId: PropTypes.number,
  children: PropTypes.node,
}
ImportButton.defaultProps = {
  editId: undefined,
  children: null,
}