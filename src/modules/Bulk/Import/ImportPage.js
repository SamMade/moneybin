import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import appRuntime from '../../../services/appRuntime';

import NodesContext from './components/nodeContext';

import Page1 from './pages/Import-page1';
import Page2 from './pages/import-page2';
import Page3 from './pages/import-page3';

export default function ImportPage({ closeHandler }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [nodes, setNodes] = useState([]);

  useEffect(() => {
    appRuntime.invoke('nodes-getMany')
      .then((data) => {
        setNodes(data);
      });
    return () => {
      appRuntime.invoke('bulk-import-destroy');
    }
  }, []);

  const backHandler = (evt) => {
    setCurrentPage(currentPage - 1);
  }

  const nextHandler = (evt) => {
    if (evt) { evt.preventDefault(); }

    setCurrentPage(currentPage + 1);
  }

  return (    
    <NodesContext.Provider value={nodes}>
      <Page1 hide={(currentPage !== 1)} closeHandler={closeHandler} submitHandler={nextHandler} />
      <Page2 hide={(currentPage !== 2)} closeHandler={backHandler} submitHandler={nextHandler}  />
      <Page3 hide={(currentPage !== 3)} closeHandler={backHandler} submitHandler={nextHandler}  />
    </NodesContext.Provider>
  );
}

ImportPage.propTypes = {
  closeHandler: PropTypes.func,
};

ImportPage.defaultProps = {
  closeHandler: () => {},
};
