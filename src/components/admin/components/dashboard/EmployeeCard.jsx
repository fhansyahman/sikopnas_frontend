import { Clock, FileText, User, MapPin, Eye } from "lucide-react";
import { formatTime } from "../../utils/dashboard/formatters";

export function EmployeeCard({ employee, statusType, onViewDetail, showKinerja = false }) {
  const getStatusColor = (type) => {
    switch(type) {
      case 'tidak-hadir': return 'bg-red-100 text-red-700 border-red-200';
      case 'belum-absen': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'belum-lapor': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'izin': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'sakit': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'terlambat': return 'bg-orange-100 text-orange-700 border-orange-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusIcon = (type) => {
    switch(type) {
      case 'belum-absen': return <Clock className="h-5 w-5" />;
      case 'belum-lapor': return <FileText className="h-5 w-5" />;
      case 'terlambat': return <Clock className="h-5 w-5" />;
      case 'izin': return <FileText className="h-5 w-5" />;
      default: return <User className="h-5 w-5" />;
    }
  };

  const getStatusText = (employee) => {
    if (employee.status_kehadiran) return employee.status_kehadiran;
    if (employee.keterangan) return employee.keterangan;
    if (employee.jabatan) return employee.jabatan;
    if (employee.divisi) return employee.divisi;
    return 'Tidak ada informasi';
  };

  return (
    <div className={`rounded-lg border p-4 hover:shadow-md transition-shadow ${getStatusColor(statusType)}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3 flex-1">
          <div className={`flex h-12 w-12 items-center justify-center rounded-full ${
            statusType === 'belum-absen' ? 'bg-yellow-100 text-yellow-600' : 
            statusType === 'belum-lapor' ? 'bg-orange-100 text-orange-600' : 
            statusType === 'izin' ? 'bg-purple-100 text-purple-600' :
            'bg-blue-100 text-blue-600'
          }`}>
            {getStatusIcon(statusType)}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-gray-900 truncate">{employee.nama || `Pegawai ${employee.id}`}</h4>
              {showKinerja && employee.total_kinerja && (
                <span className="ml-2 text-sm font-medium text-green-600">
                  {employee.total_kinerja.toLocaleString('id-ID')} m
                </span>
              )}
            </div>
            
            <p className="text-sm text-gray-600 mt-1">{getStatusText(employee)}</p>
            
            <div className="flex items-center justify-between mt-2">
              {employee.nip && (
                <span className="text-xs text-gray-500">NIP: {employee.nip}</span>
              )}
              
              {employee.wilayah_penugasan && (
                <div className="flex items-center text-xs text-gray-500">
                  <MapPin className="mr-1 h-3 w-3" />
                  <span>{employee.wilayah_penugasan}</span>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="ml-4 flex flex-col items-end space-y-2">
          {employee.waktu && (
            <span className="text-xs text-gray-500">
              {formatTime(employee.waktu)}
            </span>
          )}
          
          <button
            onClick={() => onViewDetail(employee)}
            className="flex items-center text-sm text-blue-600 hover:text-blue-800"
          >
            <Eye className="h-4 w-4 mr-1" />
            Detail
          </button>
        </div>
      </div>
    </div>
  );
}