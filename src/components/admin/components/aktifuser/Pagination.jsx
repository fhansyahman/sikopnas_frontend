"use client";

import { ChevronRight } from "lucide-react";

export function Pagination({
  currentPage,
  totalPages,
  indexOfFirstItem,
  indexOfLastItem,
  totalItems,
  onPageChange,
  onNext,
  onPrev
}) {
  if (totalPages <= 1) return null;

  const pageNumbers = [];
  const maxVisiblePages = 5;
  
  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
  
  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }
  
  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 pt-4 border-t border-gray-200">
      <PaginationInfo
        start={indexOfFirstItem + 1}
        end={Math.min(indexOfLastItem, totalItems)}
        total={totalItems}
      />
      
      <PaginationControls
        currentPage={currentPage}
        totalPages={totalPages}
        pageNumbers={pageNumbers}
        startPage={startPage}
        endPage={endPage}
        onPageChange={onPageChange}
        onPrev={onPrev}
        onNext={onNext}
      />
    </div>
  );
}

function PaginationInfo({ start, end, total }) {
  return (
    <div className="text-sm text-gray-600">
      Menampilkan {start} - {end} dari {total} pegawai
    </div>
  );
}

function PaginationControls({
  currentPage,
  totalPages,
  pageNumbers,
  startPage,
  endPage,
  onPageChange,
  onPrev,
  onNext
}) {
  return (
    <div className="flex items-center gap-2">
      <PrevButton currentPage={currentPage} onPrev={onPrev} />
      
      <PageNumbers
        currentPage={currentPage}
        totalPages={totalPages}
        pageNumbers={pageNumbers}
        startPage={startPage}
        endPage={endPage}
        onPageChange={onPageChange}
      />
      
      <NextButton currentPage={currentPage} totalPages={totalPages} onNext={onNext} />
    </div>
  );
}

function PrevButton({ currentPage, onPrev }) {
  return (
    <button
      onClick={onPrev}
      disabled={currentPage === 1}
      className={`flex items-center gap-1 px-3 py-2 text-sm rounded-lg ${
        currentPage === 1
          ? 'text-gray-400 bg-gray-100 cursor-not-allowed'
          : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
      }`}
    >
      <ChevronRight className="w-4 h-4 rotate-180" />
      Sebelumnya
    </button>
  );
}

function NextButton({ currentPage, totalPages, onNext }) {
  return (
    <button
      onClick={onNext}
      disabled={currentPage === totalPages}
      className={`flex items-center gap-1 px-3 py-2 text-sm rounded-lg ${
        currentPage === totalPages
          ? 'text-gray-400 bg-gray-100 cursor-not-allowed'
          : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
      }`}
    >
      Berikutnya
      <ChevronRight className="w-4 h-4" />
    </button>
  );
}

function PageNumbers({
  currentPage,
  totalPages,
  pageNumbers,
  startPage,
  endPage,
  onPageChange
}) {
  return (
    <div className="flex items-center gap-1">
      {startPage > 1 && (
        <>
          <PageButton page={1} currentPage={currentPage} onPageChange={onPageChange} />
          {startPage > 2 && <span className="px-2 text-gray-400">...</span>}
        </>
      )}
      
      {pageNumbers.map(number => (
        <PageButton
          key={number}
          page={number}
          currentPage={currentPage}
          onPageChange={onPageChange}
        />
      ))}
      
      {endPage < totalPages && (
        <>
          {endPage < totalPages - 1 && <span className="px-2 text-gray-400">...</span>}
          <PageButton page={totalPages} currentPage={currentPage} onPageChange={onPageChange} />
        </>
      )}
    </div>
  );
}

function PageButton({ page, currentPage, onPageChange }) {
  return (
    <button
      onClick={() => onPageChange(page)}
      className={`w-9 h-9 flex items-center justify-center text-sm rounded-lg ${
        currentPage === page
          ? 'bg-blue-600 text-white'
          : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
      }`}
    >
      {page}
    </button>
  );
}