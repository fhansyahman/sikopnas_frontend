import { XCircle, Clock, FileText, MapPin } from "lucide-react";
import { useRouter } from "next/navigation";
import { formatDate, formatTime, formatNumber } from "../../utils/dashboard/formatters";

export function DetailModal({ employee, selectedDate, onClose }) {
  const router = useRouter();

  const getStatusConfig = (type) => {
    switch(type) {
      case 'belum-absen':
        return { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: Clock, label: 'Belum Absen' };
      case 'izin':
        return { bg: 'bg-purple-100', text: 'text-purple-800', icon: FileText, label: 'Izin' };
      case 'belum-lapor':
        return { bg: 'bg-red-100', text: 'text-red-800', icon: FileText, label: 'Belum Lapor Kinerja' };
      default:
        return { bg: 'bg-gray-100', text: 'text-gray-800', icon: FileText, label: 'Unknown' };
    }
  };

  const status = getStatusConfig(employee.type);
  const StatusIcon = status.icon;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full border border-gray-200 shadow-2xl">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Detail Pegawai</h2>
            <p className="text-sm text-blue-600">{formatDate(selectedDate)}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <XCircle size={20} className="text-gray-500 hover:text-gray-700" />
          </button>
        </div>

        <div className="p-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className={`flex h-16 w-16 items-center justify-center rounded-full ${status.bg} ${status.text}`}>
                <StatusIcon className="h-8 w-8" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">{employee.nama}</h3>
                <p className="text-sm text-gray-600">{employee.jabatan}</p>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mt-2 ${status.bg} ${status.text}`}>
                  {status.label}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-sm text-gray-500">NIP</p>
                <p className="font-medium text-gray-900">{employee.nip || '-'}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-sm text-gray-500">Wilayah</p>
                <div className="flex items-center gap-1">
                  <MapPin size={14} className="text-gray-500" />
                  <p className="font-medium text-gray-900">{employee.wilayah_penugasan || '-'}</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-sm text-gray-500">Status Kehadiran</p>
              <p className="font-medium text-gray-900">{status.label}</p>
            </div>

            {employee.waktu && (
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-sm text-gray-500">Waktu Terakhir Update</p>
                <p className="font-medium text-gray-900">{formatTime(employee.waktu)}</p>
              </div>
            )}

            {employee.keterangan && (
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-sm text-gray-500">Keterangan</p>
                <p className="font-medium text-gray-900">{employee.keterangan}</p>
              </div>
            )}

            {employee.total_kinerja && (
              <div className="bg-emerald-50 rounded-lg p-3">
                <p className="text-sm text-emerald-600">Total Kinerja Bulan Ini</p>
                <p className="font-bold text-emerald-900 text-lg">
                  {formatNumber(employee.total_kinerja)} meter
                </p>
              </div>
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-gray-200 flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-200"
            >
              Tutup
            </button>
            <button
              onClick={() => {
                if (employee.type === 'belum-absen' || employee.type === 'izin') {
                  router.push(`/admin/presensi?pegawai_id=${employee.id}&tanggal=${selectedDate}`);
                } else {
                  router.push(`/admin/kinerja?pegawai_id=${employee.id}&tanggal=${selectedDate}`);
                }
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
            >
              Lihat Detail Lengkap
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}