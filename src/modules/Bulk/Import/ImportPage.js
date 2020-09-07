import React, { useState } from "react";

import Page1 from "./pages/Import-chooseFile";
import Page2 from "./pages/import-assignColumns";

export default function ImportPage({ closeHandler }) {
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <>
      {currentPage === 1 && (
        <Page1
          closeHandler={closeHandler}
          submitHandler={(event) => {
            event.preventDefault();
            setCurrentPage(2);
          }}
        />
      )}
      {currentPage === 2 && (
        <Page2
          closeHandler={() => {
            setCurrentPage(1);
          }}
          submitHandler={(event) => {
            event.preventDefault();
            setCurrentPage(3);
          }}
        />
      )}
    </>
  );
}
