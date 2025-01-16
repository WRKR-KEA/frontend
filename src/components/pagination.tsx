import React from "react";

interface PagePaginationProps {
  totalItemsCount: number;
  itemsCountPerPage: number;
  pageRangeDisplayed: number;
  onPageChange: (pageNumber: number) => void;
}

const PagePagination: React.FC<PagePaginationProps> = ({
  totalItemsCount,
  itemsCountPerPage,
  pageRangeDisplayed,
  onPageChange,
}) => {
  const totalPages = Math.ceil(totalItemsCount / itemsCountPerPage);
  const [currentPage, setCurrentPage] = React.useState(1);

  const handleClick = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    onPageChange(pageNumber);
  };

  const renderPageNumbers = () => {
    const pages: number[] = [];
    const startPage = Math.max(1, currentPage - Math.floor(pageRangeDisplayed / 2));
    const endPage = Math.min(totalPages, startPage + pageRangeDisplayed - 1);

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages.map((page) => (
      <button
        key={page}
        onClick={() => handleClick(page)}
        className={`mx-1 w-8 h-8 flex items-center justify-center rounded-full ${
          currentPage === page
            ? "bg-[#4F507F] text-white"
            : "text-black hover:bg-[#9192AE]"
        }`}
      >
        {page}
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
        className="mx-1 text-black hover:bg-[#9192AE] w-8 h-8 flex items-center justify-center rounded-full"
      >
        {"<<"}
      </button>
      <button
        onClick={goToPreviousPage}
        className="mx-1 text-black hover:bg-[#9192AE] w-8 h-8 flex items-center justify-center rounded-full"
      >
        {"<"}
      </button>
      {renderPageNumbers()}
      <button
        onClick={goToNextPage}
        className="mx-1 text-black hover:bg-[#9192AE] w-8 h-8 flex items-center justify-center rounded-full"
      >
        {">"}
      </button>
      <button
        onClick={goToLastPage}
        className="mx-1 text-black hover:bg-[#9192AE] w-8 h-8 flex items-center justify-center rounded-full"
      >
        {">>"}
      </button>
    </div>
  );
};

export default PagePagination;