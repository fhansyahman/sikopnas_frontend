"use client";

import { TableHeader } from "./TableHeader";
import { TableRow } from "./TableRow";
import { EmptyTable } from "./EmptyTable";

export function JamKerjaTable({
  paginatedJamKerja,
  filteredJamKerja,
  onViewDetail,
  onEdit,
  onDelete,
  formatTime,
  calculateTotalHours
}) {
  if (filteredJamKerja.length === 0) {
    return <EmptyTable />;
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full">
          <TableHeader />
          <tbody className="divide-y divide-gray-200">
            {paginatedJamKerja.map((jk, index) => (
              <TableRow
                key={jk.id}
                jamKerja={jk}
                onViewDetail={onViewDetail}
                onEdit={onEdit}
                onDelete={onDelete}
                formatTime={formatTime}
                calculateTotalHours={calculateTotalHours}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}