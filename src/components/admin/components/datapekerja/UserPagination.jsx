"use client";

export function UserPagination({
  currentPage,
  totalPages,
  startIndex,
  endIndex,
  totalItems,
  onPageChange
}) {
  return (
    <div className="mt-4 bg-white rounded-xl border border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Menampilkan {startIndex + 1}-{endIndex} dari {totalItems} pengguna
        </p>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onPageChange(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 text-gray-700"
          >
            Sebelumnya
          </button>
          <div className="flex items-center gap-1">
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => onPageChange(i + 1)}
                className={`w-8 h-8 rounded-lg text-sm ${
                  currentPage === i + 1
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
          <button
            onClick={() => onPageChange(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 text-gray-700"
          >
            Selanjutnya
          </button>
        </div>
      </div>
    </div>
  );
}