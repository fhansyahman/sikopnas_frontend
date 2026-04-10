"use client";

import { PresensiRow } from "./PresensiRow";
import { EmptyState } from "./EmptyState";
import { Calendar, Users, MapPin, Clock, Activity, Settings } from "lucide-react";

export function PresensiTable({ 
  data, 
  totalData, 
  statistik, 
  tanggalFilter,
  onViewDetail,
  onEdit,
  onDelete,
  loading 
}) {
  
  if (data.length === 0) {
    return (
      <EmptyState
        type={totalData === 0 ? "empty" : "no-filter"}
        message={totalData === 0 
          ? "Belum ada data presensi" 
          : "Tidak ada data presensi yang sesuai dengan filter"
        }
        actionLabel={totalData === 0 ? "Tampilkan hari ini" : "Reset filter"}
        onAction={() => {
          if (totalData === 0) {
            const today = new Date().toISOString().split('T')[0];
            window.location.reload();
          }
        }}
      />
    );
  }

  return (
    <div>
      <TableHeader 
        displayedData={data.length}
        totalData={totalData}
        tanggalFilter={tanggalFilter}
        statistik={statistik}
      />
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <TableHead />
          <tbody className="divide-y divide-gray-200">
            {data.map((presensi) => (
              <PresensiRow
                key={presensi.id}
                presensi={presensi}
                onViewDetail={onViewDetail}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* Info filter */}
      {data.length < totalData && (
        <div className="mt-4 p-3 bg-blue-50 rounded-lg text-sm text-blue-700">
          Menampilkan {data.length} dari {totalData} data yang sesuai dengan filter
        </div>
      )}
    </div>
  );
}

function TableHeader({ displayedData, totalData, tanggalFilter, statistik }) {
  return (
    <div className="mb-4 flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-600">
          Menampilkan {displayedData} dari {totalData} data
          {tanggalFilter && ` untuk tanggal ${tanggalFilter}`}
        </p>
      </div>
      <div className="text-sm text-gray-600">
        <span className="inline-flex items-center gap-1 mr-3">
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
          Hadir: {statistik.total_hadir}
        </span>
        <span className="inline-flex items-center gap-1 mr-3">
          <div className="w-3 h-3 rounded-full bg-purple-500"></div>
          Izin: {statistik.total_izin}
        </span>
        <span className="inline-flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-gray-500"></div>
          Tanpa Keterangan: {statistik.total_tanpa_keterangan}
        </span>
      </div>
    </div>
  );
}

function TableHead() {
  const columns = [
    { icon: Calendar, label: "Tanggal" },
    { icon: Users, label: "Pegawai" },
    { icon: MapPin, label: "Wilayah" },
    { icon: Clock, label: "Jam Masuk" },
    { icon: Clock, label: "Jam Pulang" },
    { icon: Activity, label: "Status" },
    { icon: Settings, label: "Aksi" }
  ];

  return (
    <thead className="bg-gray-50 border-b border-gray-200">
      <tr>
        {columns.map((col, index) => (
          <th key={index} className="py-4 px-6 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
            <div className="flex items-center gap-2">
              <col.icon size={14} className="text-gray-500" />
              <span>{col.label}</span>
            </div>
          </th>
        ))}
      </tr>
    </thead>
  );
}