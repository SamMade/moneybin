import React, { useState } from 'react';
import PropTypes from 'prop-types';

import NodesAddForm from '../NodesAddEditForm/NodesAddEditForm';
import Button from '../../../shared/Button/Button';
import Modal from '../../../shared/Modal/Modal';

export default function NodesAddEditButton({ buttonType, editId, className, children }) {
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
        {children || 'Add Node'}
      </Button>
      {
        (isShown
          && (
            <Modal closeHandler={toggleModal}>
              <NodesAddForm editId={editId} closeHandler={toggleModal} />
            </Modal>
          ))
      }
    </>
  );
}

NodesAddEditButton.propTypes = {
  editId: PropTypes.number,
  children: PropTypes.node,
}
NodesAddEditButton.defaultProps = {
  editId: undefined,
  children: null,
}