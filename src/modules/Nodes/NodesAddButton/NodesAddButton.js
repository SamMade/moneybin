import React, { useState } from 'react';

import NodesAddForm from '../NodesAddForm/NodesAddForm';
import Button from '../../../shared/Button/Button';
import Modal from '../../../shared/Modal/Modal';

export default function NodesAddButton({ className }) {
  const [isShown, setIsShown] = useState(false);

  const toggleModal = () => {
    setIsShown(!isShown);
  }

  return (
    <>
      <Button className={className} onClick={toggleModal}>Add Node</Button>
      {
        (isShown
          && (
            <Modal closeHandler={toggleModal}>
              <NodesAddForm />
            </Modal>
          ))
      }
    </>
  );
}