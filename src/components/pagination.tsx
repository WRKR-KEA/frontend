import React from "react";
import Pagination from "react-js-pagination";
import styled from "styled-components";

// Styled component for pagination
const StyledReactPaginate = styled(Pagination)`
  display: flex;
  flex-direction: row;
  gap: 5px;
  margin-top: 20px;
  cursor: pointer;
  list-style: none;

  .page-item {
    padding: 8px 12px;
    border-radius: 50px;
    color: black;
    font-size: 16px;
    text-align: center;
    transition: background-color 0.2s, color 0.2s;

    &:not(.active):hover {
      background-color: rgba(255, 255, 255, 0.6);
    }
  }

  .active {
    font-weight: bold;
    color: white;
    border-radius: 50px;
    background-color: #61d0d0;
  }

  .previous-item,
  .next-item {
    padding: 8px 12px;
    border-radius: 50px;
    font-size: 16px;
    color: #61d0d0;
    background-color: #ffffff;
    margin: 0px 10px;
  }
`;

type PaginationProps = {
  totalItemsCount: number;
  itemsCountPerPage: number;
  pageRangeDisplayed: number;
  onPageChange: (pageNumber: number) => void;
  previousLabel?: string;  // optional property
  nextLabel?: string;      // optional property
  breakLabel?: string;     // optional property
};

const PagePagination = ({
  totalItemsCount,
  itemsCountPerPage,
  pageRangeDisplayed,
  onPageChange,
  previousLabel = "<",    // default value
  nextLabel = ">",        // default value
  breakLabel = "...",     // default value
}: PaginationProps) => {
  return (
    <StyledReactPaginate
      activePage={1}
      itemsCountPerPage={itemsCountPerPage}
      totalItemsCount={totalItemsCount}
      pageRangeDisplayed={pageRangeDisplayed}
      onChange={onPageChange}
      previousLabel={previousLabel}
      nextLabel={nextLabel}
      breakLabel={breakLabel}
      containerClassName={"pagination"}
      pageClassName={"page-item"}
      pageLinkClassName={"page-link"}
      previousClassName={"previous-item"}
      nextClassName={"next-item"}
      activeClassName={"active"}
    />
  );
};

export default PagePagination;