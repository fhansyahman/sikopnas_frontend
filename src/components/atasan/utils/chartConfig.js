export const getWilayahColor = (wilayah) => {
  const colors = {
    'Cermee': 'rgba(59, 130, 246, 0.8)',
    'Botolinggo': 'rgba(168, 85, 247, 0.8)',
    'Prajekan': 'rgba(34, 197, 94, 0.8)',
    'Klabang': 'rgba(245, 158, 11, 0.8)',
    'Ijen': 'rgba(239, 68, 68, 0.8)',
  };
  return colors[wilayah] || 'rgba(156, 163, 175, 0.8)';
};

export const STATUS_COLORS = {
  hadir: 'rgba(34, 197, 94, 0.8)',
  terlambat: 'rgba(245, 158, 11, 0.8)',
  izin: 'rgba(168, 85, 247, 0.8)',
  tanpa_keterangan: 'rgba(239, 68, 68, 0.8)'
};

export const getStatusColorKinerja = (status) => {
  switch (status) {
    case 'tercapai_target': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    case 'hampir_tercapai': return 'bg-green-100 text-green-800 border-green-200';
    case 'sedang': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'tidak_tercapai': return 'bg-red-100 text-red-800 border-red-200';
    case 'tidak_ada_laporan': return 'bg-gray-100 text-gray-800 border-gray-200';
    default: return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

export const getStatusIconKinerja = (status) => {
  const icons = {
    tercapai_target: 'CheckCircle2',
    hampir_tercapai: 'CheckCircle2',
    sedang: 'AlertCircle',
    tidak_tercapai: 'XCircle',
    tidak_ada_laporan: 'FileQuestion',
  };
  return icons[status] || 'FileQuestion';
};

export const getStatusLabelKinerja = (status) => {
  switch (status) {
    case 'tercapai_target': return 'Tercapai Target';
    case 'hampir_tercapai': return 'Hampir Tercapai';
    case 'sedang': return 'Sedang';
    case 'tidak_tercapai': return 'Tidak Tercapai';
    case 'tidak_ada_laporan': return 'Tidak Ada Laporan';
    default: return status;
  }
};