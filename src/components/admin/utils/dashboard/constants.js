export const WILAYAH_LIST = ['Cermee', 'Botolinggo', 'Prajekan', 'Klabang', 'Ijen'];
export const TARGET_KR_HARIAN = 50;
export const TARGET_KN_HARIAN = 50;

export const BULAN_OPTIONS = [
  { value: '01', label: 'Januari' },
  { value: '02', label: 'Februari' },
  { value: '03', label: 'Maret' },
  { value: '04', label: 'April' },
  { value: '05', label: 'Mei' },
  { value: '06', label: 'Juni' },
  { value: '07', label: 'Juli' },
  { value: '08', label: 'Agustus' },
  { value: '09', label: 'September' },
  { value: '10', label: 'Oktober' },
  { value: '11', label: 'November' },
  { value: '12', label: 'Desember' }
];

export const STATUS_KINERJA = {
  tercapai_target: { label: 'Tercapai Target', color: 'bg-emerald-100 text-emerald-800' },
  hampir_tercapai: { label: 'Hampir Tercapai', color: 'bg-green-100 text-green-800' },
  sedang: { label: 'Sedang', color: 'bg-yellow-100 text-yellow-800' },
  tidak_tercapai: { label: 'Tidak Tercapai', color: 'bg-red-100 text-red-800' },
  tidak_ada_laporan: { label: 'Tidak Ada Laporan', color: 'bg-gray-100 text-gray-800' }
};

export const getTahunOptions = () => {
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let i = currentYear; i >= currentYear - 5; i--) {
    years.push(i.toString());
  }
  return years;
};

export const getNamaBulan = (month) => {
  const bulan = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];
  return bulan[parseInt(month) - 1] || '';
};

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