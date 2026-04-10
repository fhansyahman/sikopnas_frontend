"use client";

import { IzinTableRow } from "./IzinTableRow";
import { TableHeader } from "./TableHeader";

export function IzinTable({
  filteredIzin,
  selectedItems,
  onToggleSelect,
  onToggleSelectAll,
  onViewDetail,
  onUpdateStatus
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <TableHeader
          onToggleSelectAll={onToggleSelectAll}
          isAllSelected={filteredIzin.length > 0 && selectedItems.length === filteredIzin.length}
          isIndeterminate={selectedItems.length > 0 && selectedItems.length < filteredIzin.length}
        />
        <tbody className="divide-y divide-gray-200">
          {filteredIzin.map((izin) => (
            <IzinTableRow
              key={izin.id}
              izin={izin}
              isSelected={selectedItems.includes(izin.id)}
              onToggleSelect={() => onToggleSelect(izin.id)}
              onViewDetail={() => onViewDetail(izin)}
              onUpdateStatus={onUpdateStatus}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}