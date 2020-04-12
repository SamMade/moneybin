import React, { useState } from 'react';

import TransactionsAddForm from '../TransactionsAddForm/TransactionsAddForm';
import Button from '../../../shared/Button/Button';
import Modal from '../../../shared/Modal/Modal';

export default function TransactionsAddButton() {
  const [isShown, setIsShown] = useState(false);

  const toggleModal = () => {
    setIsShown(!isShown);
  }

  return (
    <div>
      <Button onClick={toggleModal}>Add Transaction</Button>
      {
        (isShown
          && (
            <Modal closeHandler={toggleModal}>
              <TransactionsAddForm />
            </Modal>
          ))
      }
    </div>
  );
}