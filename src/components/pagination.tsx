import React from "react";
import Pagination from "react-js-pagination";
import styled from "styled-components";

// Styled component for pagination
const StyledReactPaginate = styled(Pagination as any)`
  display: flex;
  flex-direction: row;
  gap: 5px;
  margin-top: 20px;
  cursor: pointer;
  list-style: none;
  justify-content: center;  /* 중앙 정렬 */

  .page-item {
    padding: 8px 12px;
    border-radius: 50px;
    color: black;
    font-size: 16px;
    text-align: center;
    transition: background-color 0.2s, color 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .page-item:hover {
    background-color: rgba(255, 255, 255, 0.6);
  }

  .active {
    font-weight: bold;
    color: white;
    background-color: #252E66;  /* 현재 페이지 색상 */
    border-radius: 50%;
    width: 30px;
    height: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
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

  .previous-item:hover,
  .next-item:hover {
    background-color: rgba(255, 255, 255, 0.6);
  }
`;

type PaginationProps = {
  totalItemsCount: number;
  itemsCountPerPage: number;
  pageRangeDisplayed: number;
  onPageChange: (pageNumber: number) => void;
};

const PagePagination = ({
  totalItemsCount,
  itemsCountPerPage,
  pageRangeDisplayed,
  onPageChange,
}: PaginationProps) => {
  return (
    <StyledReactPaginate
      activePage={1}
      itemsCountPerPage={itemsCountPerPage}
      totalItemsCount={totalItemsCount}
      pageRangeDisplayed={pageRangeDisplayed}
      onChange={onPageChange}
      previousLabel="<"
      nextLabel=">"
      breakLabel="..."
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