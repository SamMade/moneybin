import React, { useState } from 'react';
import PropTypes from 'prop-types';

import Page1 from './pages/Import-chooseFile';
import Page2 from './pages/import-assignColumns';
import Page3 from './pages/import-confirmTargetNodes';

const Pages = [Page1, Page2, Page3];

export default function ImportPage({ closeHandler }) {
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <>
      {
        React.createElement(Pages[currentPage - 1], {
          closeHandler: () => {
            if (currentPage === 1) { 
              closeHandler();
              return; 
            }
            setCurrentPage(currentPage - 1);
          },
          submitHandler: (evt) => {
            if (evt) { evt.preventDefault(); }

            setCurrentPage(currentPage + 1);
          },
        })
      }
    </>
  );
}

ImportPage.propTypes = {
  closeHandler: PropTypes.func,
};

ImportPage.defaultProps = {
  closeHandler: () => {},
};
