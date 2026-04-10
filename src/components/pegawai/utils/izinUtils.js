export function loadUserInfo() {
  try {
    const userData = localStorage.getItem('user');
    if (userData) {
      return JSON.parse(userData);
    }
  } catch (error) {
    console.error('Error loading user info:', error);
  }
  
  return {
    id: 4,
    name: "Nama Anda",
    email: "email@anda.com",
    role: "pegawai"
  };
}

export function getStatusColor(status) {
  switch (status) {
    case "Disetujui":
      return "bg-teal-100 text-teal-700 border-teal-200";
    case "Pending":
      return "bg-amber-100 text-amber-700 border-amber-200";
    case "Ditolak":
      return "bg-red-100 text-red-700 border-red-200";
    default:
      return "bg-slate-100 text-slate-500 border-slate-200";
  }
}

export function getJenisDisplay(jenis) {
  const map = {
    'Sakit': 'Sakit',
    'Izin': 'Izin',
    'Cuti': 'Cuti',
    'Cuti Tahunan': 'Cuti Tahunan',
    'Cuti Besar': 'Cuti Besar',
    'Cuti Sakit': 'Cuti Sakit',
    'Cuti Melahirkan': 'Cuti Melahirkan',
    'Tugas Luar': 'Tugas Luar',
    'Dinas Luar': 'Dinas Luar'
  };
  return map[jenis] || jenis || 'Izin';
}

export function formatDate(dateString) {
  try {
    if (!dateString) return '-';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '-';
    return date.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  } catch (error) {
    console.error('Error formatting date:', error, dateString);
    return '-';
  }
}

export function getAvailableMonths(izinList) {
  const months = new Set();
  izinList.forEach(izin => {
    if (izin.tanggal_mulai) {
      try {
        const date = new Date(izin.tanggal_mulai);
        if (!isNaN(date.getTime())) {
          const month = date.getMonth() + 1;
          months.add(month.toString());
        }
      } catch (error) {
        console.error('Error parsing date:', error);
      }
    }
  });
  
  return Array.from(months).sort((a, b) => parseInt(a) - parseInt(b));
}

export function getAvailableYears(izinList) {
  const years = new Set();
  izinList.forEach(izin => {
    if (izin.tanggal_mulai) {
      try {
        const date = new Date(izin.tanggal_mulai);
        if (!isNaN(date.getTime())) {
          const year = date.getFullYear();
          years.add(year.toString());
        }
      } catch (error) {
        console.error('Error parsing date:', error);
      }
    }
  });
  
  return Array.from(years).sort((a, b) => parseInt(b) - parseInt(a));
}

export function getMonthName(monthNumber) {
  const months = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];
  return months[parseInt(monthNumber) - 1] || '';
}