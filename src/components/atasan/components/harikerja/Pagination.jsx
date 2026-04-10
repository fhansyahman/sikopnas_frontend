"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

export function Pagination({ 
  currentPage, 
  totalPages, 
  onPageChange, 
  totalItems, 
  itemsPerPage 
}) {
  const startItem = Math.min((currentPage - 1) * itemsPerPage + 1, totalItems);
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Menampilkan {startItem}-{endItem} dari {totalItems} data
        </p>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 text-gray-700 flex items-center gap-1"
          >
            <ChevronLeft size={14} />
            Sebelumnya
          </button>
          
          <PageNumbers 
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
          
          <button
            onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 text-gray-700 flex items-center gap-1"
          >
            Selanjutnya
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

function PageNumbers({ currentPage, totalPages, onPageChange }) {
  const pages = [];
  const maxVisible = 5;
  
  let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
  let end = Math.min(totalPages, start + maxVisible - 1);
  
  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1);
  }

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  return (
    <div className="flex items-center gap-1">
      {pages.map(page => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`w-8 h-8 rounded-lg text-sm ${
            currentPage === page
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
          }`}
        >
          {page}
        </button>
      ))}
      {totalPages > maxVisible && end < totalPages && (
        <span className="text-gray-500">...</span>
      )}
    </div>
  );
}