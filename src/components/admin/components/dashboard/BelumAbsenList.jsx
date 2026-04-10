import { Clock, CheckCircle } from "lucide-react";
import { EmployeeCard } from "./EmployeeCard";
import { formatDate, formatPercentage } from "../../utils/dashboard/formatters";

export function BelumAbsenList({ data, loading, totalPegawai, selectedDate, onViewDetail }) {
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
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">Belum Absen</h3>
              <p className="text-sm text-gray-500">
                {data.length} pegawai belum melakukan absensi
              </p>
            </div>
          </div>
          <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium">
            {formatPercentage(data.length, totalPegawai)}
          </span>
        </div>
      </div>

      <div className="p-4">
        {data.length === 0 ? (
          <div className="text-center py-8">
            <CheckCircle className="mx-auto h-12 w-12 text-green-500 opacity-50" />
            <p className="mt-2 text-gray-500">Semua pegawai sudah melakukan absen</p>
            <p className="text-sm text-gray-400 mt-1">{formatDate(selectedDate)}</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
            {data.map((employee, index) => (
              <EmployeeCard
                key={employee.id || index}
                employee={employee}
                statusType="belum-absen"
                onViewDetail={onViewDetail}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}