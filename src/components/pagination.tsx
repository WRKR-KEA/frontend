import React from "react";

interface PagePaginationProps {
  totalItemsCount: number;
  itemsCountPerPage: number;
  pageRangeDisplayed: number;
  currentPage: number;
  totalPages: number;
  onPageChange: (pageNumber: number) => void;
}

const PagePagination: React.FC<PagePaginationProps> = ({
  pageRangeDisplayed,
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const handleClick = (pageNumber: number) => {
    onPageChange(pageNumber);
  };

  const getStartAndEndPages = () => {
    const startPage = Math.max(1, currentPage - Math.floor(pageRangeDisplayed / 2));
    const endPage = Math.min(totalPages, startPage + pageRangeDisplayed - 1);
    return { startPage, endPage };
  };

  // Render the page numbers with dynamic range based on the current page
  const renderPageNumbers = () => {
    const { startPage, endPage } = getStartAndEndPages();
    const pages: number[] = [];

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages.map((pageNumber) => (
      <button
        key={pageNumber}
        onClick={() => handleClick(pageNumber)}
        className={`mx-1 w-8 h-8 flex items-center justify-center rounded-full ${
          currentPage === pageNumber
            ? "bg-[#4F507F] text-white"
            : "text-black hover:bg-[#9192AE]"
        }`}
      >
        {pageNumber}
      </button>
    ));
  };

  const goToFirstPage = () => handleClick(1);
  const goToLastPage = () => handleClick(totalPages);
  const goToPreviousPage = () => handleClick(Math.max(1, currentPage - 1));
  const goToNextPage = () => handleClick(Math.min(totalPages, currentPage + 1));

  return (
    <div className="flex items-center">
      <button
        onClick={goToFirstPage}
        disabled={currentPage === 1}
        className={`mx-1 w-8 h-8 flex items-center justify-center rounded-full ${
          currentPage === 1
            ? "text-zinc-300"
            : "text-zinc-700 hover:bg-[#9192AE]"
        }`}

      >
        {"<<"}
      </button>
      <button
        onClick={goToPreviousPage}
        disabled={currentPage === 1}
        className={`mx-1 w-8 h-8 flex items-center justify-center rounded-full ${
          currentPage === 1
            ? "text-zinc-300"
            : "text-zinc-700 hover:bg-[#9192AE]"
        }`}

      >
        {"<"}
      </button>
      {renderPageNumbers()}
      <button
        onClick={goToNextPage}
        disabled={currentPage === totalPages}
        className={`mx-1 w-8 h-8 flex items-center justify-center rounded-full ${
          currentPage === totalPages
            ? "text-zinc-300"
            : "text-zinc-700 hover:bg-[#9192AE]"
        }`}
      >
        {">"}
      </button>
      <button
        onClick={goToLastPage}
        disabled={currentPage === totalPages}
        className={`mx-1 w-8 h-8 flex items-center justify-center rounded-full ${
          currentPage === totalPages
            ? "text-zinc-300"
            : "text-zinc-700 hover:bg-[#9192AE]"
        }`}
      >
        {">>"}
      </button>
    </div>
  );
};

export default PagePagination;