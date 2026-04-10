export const daftarKegiatan = [
  "Pemeliharaan Jalan",
  "Pembersihan Saluran",
  "Penghijauan",
  "Pengecatan Marka Jalan",
  "Perbaikan Fasilitas Jalan",
  "Pengawasan Proyek",
  "Lainnya"
];

export const sections = [
  { height: 25, label: "Bahu Atas" },
  { height: 25, label: "Lap Atas" },
  { height: 80, label: "Badan Jalan" },
  { height: 25, label: "Lap Bawah" },
  { height: 25, label: "Bahu Bawah" },
];

export function calculateStats(data, setStats) {
  const totalLaporan = data.length;
  const totalPanjang = data.reduce((sum, item) => {
    const kr = parseFloat(item.panjang_kr?.toString().replace(' meter', '')) || 0;
    const kn = parseFloat(item.panjang_kn?.toString().replace(' meter', '')) || 0;
    return sum + kr + kn;
  }, 0);
  const avgPanjang = totalLaporan > 0 ? totalPanjang / totalLaporan : 0;

  setStats({
    total_laporan: totalLaporan,
    total_panjang: totalPanjang,
    avg_panjang: avgPanjang
  });
}

export function extractAvailableYears(data, setAvailableYears, selectedYear, setSelectedYear) {
  const years = new Set();
  
  const currentYear = new Date().getFullYear();
  years.add(currentYear);
  
  data.forEach(item => {
    if (item.tanggal) {
      try {
        const year = new Date(item.tanggal).getFullYear();
        years.add(year);
      } catch (e) {
        console.error('Error parsing date:', item.tanggal);
      }
    }
  });
  
  const sortedYears = Array.from(years)
    .sort((a, b) => b - a);
  
  setAvailableYears(sortedYears);
  
  if (!sortedYears.includes(parseInt(selectedYear))) {
    setSelectedYear(currentYear.toString());
  }
}

export function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('id-ID', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });
}