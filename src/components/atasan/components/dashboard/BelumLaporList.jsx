"use client";

import { FileText, UserCheck } from "lucide-react";
import { EmployeeCard } from "./EmployeeCard";
import { formatDate, formatPercentage } from "../../utils/dashboard/formatters";

export function BelumLaporList({ 
  data, 
  sudahLaporData, 
  loading, 
  totalPegawai, 
  selectedDate, 
  onViewDetail 
}) {
  if (loading) {
    return (
      <div className="bg-white rounded-xl border shadow-sm p-4">
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-20 bg-gray-100 rounded-lg animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border shadow-sm">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <FileText className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">Belum Lapor Kinerja</h3>
              <p className="text-sm text-gray-500">
                {data.length} pegawai belum lapor kinerja harian
              </p>
            </div>
          </div>
          <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium">
            {formatPercentage(data.length, totalPegawai)}
          </span>
        </div>
        
        {/* Info yang sudah lapor */}
        {sudahLaporData && sudahLaporData.length > 0 && (
          <div className="mt-2 flex justify-between items-center">
            <div className="text-xs text-emerald-600 bg-emerald-50 p-2 rounded-lg flex-1 mr-2">
              ✅ {sudahLaporData.length} pegawai sudah lapor kinerja
            </div>
            <div className="text-xs bg-blue-50 p-2 rounded-lg">
              Total: {totalPegawai} pegawai
            </div>
          </div>
        )}
      </div>

      <div className="p-4">
        {data.length === 0 ? (
          <div className="text-center py-8">
            <UserCheck className="mx-auto h-12 w-12 text-green-500 opacity-50" />
            <p className="mt-2 text-gray-500">Semua pegawai sudah melaporkan kinerja</p>
            <p className="text-sm text-gray-400 mt-1">{formatDate(selectedDate)}</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
            {data.map((employee, index) => (
              <EmployeeCard
                key={employee.id || index}
                employee={employee}
                statusType="belum-lapor"
                onViewDetail={onViewDetail}
                showKinerja={true}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}