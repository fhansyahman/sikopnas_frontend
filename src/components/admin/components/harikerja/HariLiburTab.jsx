"use client";

import { 
  Search, Plus, Edit, Trash2, Calendar, PartyPopper, 
  Settings, RefreshCw, ChevronLeft, ChevronRight 
} from "lucide-react";
import { FilterControls } from "./FilterControls";
import { Pagination } from "./Pagination";
import { EmptyState } from "./EmptyState";

export function HariLiburTab({
  data,
  filteredData,
  search,
  onSearchChange,
  tahunFilter,
  onTahunChange,
  currentPage,
  totalPages,
  onPageChange,
  itemsPerPage,
  onRefresh,
  onAdd,
  onEdit,
  onDelete,
  tahunOptions,
  formatDate
}) {
  return (
    <div>
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between mb-6">
        <div className="flex flex-wrap gap-3 w-full lg:w-auto">
          <FilterControls
            tahunFilter={tahunFilter}
            onTahunChange={onTahunChange}
            showBulan={false}
            tahunOptions={tahunOptions}
          />

          <SearchInput value={search} onChange={onSearchChange} />
        </div>
        
        <div className="flex flex-wrap gap-3 w-full lg:w-auto">
          <button
            onClick={onRefresh}
                    className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 border border-gray-300 text-white-700 rounded-lg hover:bg-gray-200 text-sm font-medium shadow-sm flex-1 md:flex-none"
          >
            <RefreshCw size={16} />
            Refresh
          </button>
          <button
            onClick={onAdd}
            className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 text-sm font-medium shadow-sm"
          >
            <Plus size={16} />
            Tambah Hari Libur
          </button>
        </div>
      </div>

      <DataTable
        data={data}
        filteredData={filteredData}
        search={search}
        onEdit={onEdit}
        onDelete={onDelete}
        formatDate={formatDate}
      />

      {filteredData.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
          totalItems={filteredData.length}
          itemsPerPage={itemsPerPage}
        />
      )}
    </div>
  );
}

function SearchInput({ value, onChange }) {
  return (
    <div className="flex-1">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Cari berdasarkan tanggal atau nama libur..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-gray-800 placeholder-gray-500"
        />
      </div>
    </div>
  );
}

function DataTable({ data, filteredData, search, onEdit, onDelete, formatDate }) {
  if (filteredData.length === 0) {
    return (
      <EmptyState
        icon={<PartyPopper className="w-8 h-8 text-gray-400" />}
        message={search ? 'Tidak ada data hari libur yang sesuai dengan pencarian' : 'Belum ada data hari libur'}
      />
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <TableHeader icon={<Calendar size={14} />} label="Tanggal" />
              <TableHeader icon={<PartyPopper size={14} />} label="Nama Libur" />
              <TableHeader icon={<Calendar size={14} />} label="Jenis" />
              <TableHeader icon={<Calendar size={14} />} label="Periode" />
              <TableHeader icon={<Settings size={14} />} label="Aksi" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {data.map((hari) => (
              <TableRow
                key={hari.id}
                hari={hari}
                onEdit={onEdit}
                onDelete={onDelete}
                formatDate={formatDate}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function TableHeader({ icon, label }) {
  return (
    <th className="py-4 px-6 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
      <div className="flex items-center gap-2">
        <span className="text-gray-500">{icon}</span>
        <span>{label}</span>
      </div>
    </th>
  );
}

function TableRow({ hari, onEdit, onDelete, formatDate }) {
  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="py-4 px-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-red-50 to-pink-50 rounded-lg flex items-center justify-center">
            <PartyPopper className="w-5 h-5 text-red-600" />
          </div>
          <p className="font-medium text-gray-900">
            {formatDate(hari.tanggal)}
          </p>
        </div>
      </td>
      <td className="py-4 px-6">
        <p className="font-medium text-gray-900">{hari.nama_libur}</p>
      </td>
      <td className="py-4 px-6">
        <JenisBadge isTahunan={hari.is_tahunan === 1} />
      </td>
      <td className="py-4 px-6">
        <p className="text-sm text-gray-600">
          {hari.is_tahunan === 1 ? 'Setiap Tahun' : (hari.tahun || '-')}
        </p>
      </td>
      <td className="py-4 px-6">
        <ActionButtons
          onEdit={() => onEdit(hari)}
          onDelete={() => onDelete(hari.id, hari.nama_libur, hari.tanggal)}
        />
      </td>
    </tr>
  );
}

function JenisBadge({ isTahunan }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
      isTahunan 
        ? 'bg-purple-100 text-purple-800' 
        : 'bg-blue-100 text-blue-800'
    }`}>
      {isTahunan ? '🟣 Tahunan' : '🔵 Sekali'}
    </span>
  );
}

function ActionButtons({ onEdit, onDelete }) {
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={onEdit}
        className="p-2 text-gray-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
        title="Edit Data"
      >
        <Edit size={18} />
      </button>
      <button
        onClick={onDelete}
        className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        title="Hapus Data"
      >
        <Trash2 size={18} />
      </button>
    </div>
  );
}