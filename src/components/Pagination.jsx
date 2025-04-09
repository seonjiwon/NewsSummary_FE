import React from "react";

function Pagination({ currentPage, totalPages, onPageChange }) {
  // 페이지 번호 배열 생성 (최대 5개 표시)
  const getPageNumbers = () => {
    const pageNumbers = [];
    if (totalPages <= 5) {
      // 5페이지 이하면 모든 페이지 표시
      for (let i = 0; i < totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // 5페이지 초과일 경우 현재 페이지 중심으로 표시
      if (currentPage <= 2) {
        // 처음 3페이지에서는 0~4 표시
        for (let i = 0; i < 5; i++) {
          pageNumbers.push(i);
        }
      } else if (currentPage >= totalPages - 3) {
        // 마지막 3페이지에서는 마지막 5페이지 표시
        for (let i = totalPages - 5; i < totalPages; i++) {
          pageNumbers.push(i);
        }
      } else {
        // 그 외 경우는 현재 페이지를 중심으로 표시
        for (let i = currentPage - 2; i <= currentPage + 2; i++) {
          pageNumbers.push(i);
        }
      }
    }
    return pageNumbers;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex justify-center items-center space-x-2 mt-6">
      {/* 이전 페이지 버튼 */}
      <button
        onClick={() => onPageChange(Math.max(0, currentPage - 1))}
        disabled={currentPage === 0}
        className={`px-3 py-1 rounded ${
          currentPage === 0
            ? "bg-gray-200 text-gray-500 cursor-not-allowed"
            : "bg-blue-500 text-white hover:bg-blue-600"
        }`}
      >
        이전
      </button>

      {/* 페이지 번호 */}
      {pageNumbers.map((pageNumber) => (
        <button
          key={pageNumber}
          onClick={() => onPageChange(pageNumber)}
          className={`px-3 py-1 rounded ${
            currentPage === pageNumber
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          {pageNumber + 1}
        </button>
      ))}

      {/* 다음 페이지 버튼 */}
      <button
        onClick={() => onPageChange(Math.min(totalPages - 1, currentPage + 1))}
        disabled={currentPage >= totalPages - 1}
        className={`px-3 py-1 rounded ${
          currentPage >= totalPages - 1
            ? "bg-gray-200 text-gray-500 cursor-not-allowed"
            : "bg-blue-500 text-white hover:bg-blue-600"
        }`}
      >
        다음
      </button>
    </div>
  );
}

export default Pagination;
