"use client";

import { TableRow } from "./TableRow";
import { Calendar, MapPin, Ruler, CalendarDays, Settings } from "lucide-react";

export function KinerjaTable({
  filteredKinerja,
  selectedItems,
  onToggleSelect,
  onSelectAll,
  onViewDetail,
  onDownload,
  onEdit,
  onDelete
}) {
  return (
    <div className="overflow-x-auto -mx-4 md:mx-0">
      <div className="min-w-full">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="py-3 px-4 md:py-4 md:px-6 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                <div className="flex items-center gap-2">
                  <Calendar size={14} className="text-gray-500" />
                  <span className="hidden md:inline">Tanggal</span>
                </div>
              </th>
              <th className="py-3 px-4 md:py-4 md:px-6 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                <div className="flex items-center gap-2">
                  <MapPin size={14} className="text-gray-500" />
                  <span className="hidden md:inline">Ruas Jalan & Kegiatan</span>
                  <span className="md:hidden">Lokasi</span>
                </div>
              </th>
              <th className="py-3 px-4 md:py-4 md:px-6 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                <div className="flex items-center gap-2">
                  <Ruler size={14} className="text-gray-500" />
                  <span className="hidden md:inline">Pengukuran</span>
                  <span className="md:hidden">Ukur</span>
                </div>
              </th>
              <th className="py-3 px-4 md:py-4 md:px-6 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                <div className="flex items-center gap-2">
                  <CalendarDays size={14} className="text-gray-500" />
                  <span className="hidden md:inline">Dibuat</span>
                </div>
              </th>
              <th className="py-3 px-4 md:py-4 md:px-6 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                <div className="flex items-center gap-2">
                  <Settings size={14} className="text-gray-500" />
                  <span className="hidden md:inline">Aksi</span>
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredKinerja.map((kinerja) => (
              <TableRow
                key={kinerja.id}
                kinerja={kinerja}
                isSelected={selectedItems.includes(kinerja.id)}
                onToggleSelect={() => onToggleSelect(kinerja.id)}
                onViewDetail={() => onViewDetail(kinerja)}
                onDownload={() => onDownload(kinerja)}
                onEdit={() => onEdit(kinerja)}
                onDelete={() => onDelete(kinerja.id)}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}