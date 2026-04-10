"use client";

import { Database, Users } from "lucide-react";
import { TableHeader } from "./TableHeader";
import { TableRow } from "./TableRow";
import { Pagination } from "./Pagination";
import { EmptyState } from "./EmptyState";

export function DataTable({
  currentItems,
  filteredUsers,
  statistik,
  selectedItems,
  isAllSelected,
  onToggleSelectAll,
  onToggleSelectItem,
  onViewDetail,
  onActivate,
  onDeactivate,
  getStatusBadge,
  getAktivasiBadge,
  formatDate,
  pagination
}) {
  if (filteredUsers.length === 0) {
    return <EmptyState 
      icon={<Users className="w-8 h-8 text-gray-400" />}
      message="Tidak ada data pegawai yang ditemukan"
    />;
  }

  return (
    <div>
      <TableInfo 
        statistik={statistik}
        filteredCount={filteredUsers.length}
      />
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <TableHeader 
            isAllSelected={isAllSelected}
            onToggleSelectAll={onToggleSelectAll}
          />
          <tbody className="divide-y divide-gray-200">
            {currentItems.map((user) => (
              <TableRow
                key={user.id}
                user={user}
                isSelected={selectedItems.includes(user.id)}
                onToggleSelect={() => onToggleSelectItem(user.id)}
                onViewDetail={() => onViewDetail(user)}
                onActivate={() => onActivate(user)}
                onDeactivate={() => onDeactivate(user)}
                getStatusBadge={getStatusBadge}
                getAktivasiBadge={getAktivasiBadge}
                formatDate={formatDate}
              />
            ))}
          </tbody>
        </table>
      </div>

      <Pagination {...pagination} />
    </div>
  );
}

function TableInfo({ statistik, filteredCount }) {
  return (
    <div className="mb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div className="text-sm text-gray-600">
        <span className="inline-flex items-center gap-1 mr-3">
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
          Aktif: {statistik.aktif}
        </span>
        <span className="inline-flex items-center gap-1 mr-3">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          Nonaktif: {statistik.nonaktif}
        </span>
      </div>
    </div>
  );
}