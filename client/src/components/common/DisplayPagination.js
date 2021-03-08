import React from "react";

import Pagination from "template/components/Pagination/Pagination";
import PropTypes from "prop-types";

const DisplayPagination = ({ pagesNumber, currentPage, onChangePage }) => {
  let pages = [];
  for (let i = 0; i < pagesNumber; i++) {
    if (i === 0) {
      if (currentPage === 1) {
        pages.push({ text: 1, active: true, onClick: onChangePage });
      } else {
        pages.push({ text: "PREV", onClick: onChangePage });
        pages.push({ text: i + 1, onClick: onChangePage });
      }
    } else if (i === pagesNumber - 1) {
      if (currentPage === i + 1) {
        pages.push({ text: i + 1, active: true, onClick: onChangePage });
      } else {
        pages.push({ text: i + 1, onClick: onChangePage });
        pages.push({ text: "NEXT", onClick: onChangePage });
      }
    } else {
      if (currentPage === i + 1)
        pages.push({ text: i + 1, active: true, onClick: onChangePage });
      else pages.push({ text: i + 1, onClick: onChangePage });
    }
  }

  return pagesNumber > 1 ? <Pagination pages={pages} color="info" /> : null;
};

DisplayPagination.propTypes = {
  pagesNumber: PropTypes.number.isRequired,
  currentPage: PropTypes.number.isRequired,
  onChangePage: PropTypes.func.isRequired,
};

export default DisplayPagination;
