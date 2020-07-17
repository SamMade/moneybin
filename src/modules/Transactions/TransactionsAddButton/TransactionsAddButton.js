import React, { useState } from 'react';
import PropTypes from 'prop-types';

import TransactionsAddForm from '../TransactionsAddForm/TransactionsAddForm';
import Button from '../../../shared/Button/Button';
import Modal from '../../../shared/Modal/Modal';

export default function TransactionsAddButton({ buttonType, className }) {
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
        Add Transaction</Button>
      {
        (isShown
          && (
            <Modal closeHandler={toggleModal}>
              <TransactionsAddForm />
            </Modal>
          ))
      }
    </>
  );
}

TransactionsAddButton.propTypes = {
  buttonType: PropTypes.string,
};
