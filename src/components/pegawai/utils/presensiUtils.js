// Fungsi-fungsi yang sudah ada
export function getTodayDate() {
  return new Date().toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function getStatusKehadiran(presensi) {
  if (!presensi.masuk) return "Belum Absen";
  if (!presensi.pulang) return "Sedang Bekerja";
  return "Selesai Bekerja";
}

// Fungsi baru untuk riwayat presensi
export function getStatusAkhir(presensi) {
  if (presensi.status_akhir) return presensi.status_akhir;
  
  if (presensi.keterangan?.includes('PEMUTIHAN') || 
      presensi.keterangan?.includes('pemutihan') ||
      presensi.keterangan?.includes('Jangan lupa presensi')) {
    return 'Hadir (Pemutihan)';
  }
  
  if (presensi.izin_id) {
    return presensi.jenis_izin === 'sakit' ? 'Sakit' : 'Izin';
  } else if (presensi.status_masuk === 'Tanpa Keterangan' || presensi.status_pulang === 'Tanpa Keterangan') {
    return 'Tanpa Keterangan';
  } else if (presensi.status_masuk === 'Tepat Waktu' && presensi.jam_pulang) {
    return 'Hadir';
  } else if (presensi.status_masuk && presensi.status_masuk.includes('Terlambat')) {
    return 'Terlambat';
  } else if (presensi.jam_masuk && !presensi.jam_pulang) {
    return 'Belum Pulang';
  } else if (!presensi.jam_masuk && !presensi.jam_pulang) {
    return 'Tanpa Keterangan';
  }
  return 'Tidak Diketahui';
}

export function calculateStats(filteredData) {
  const stats = {
    total: filteredData.length,
    hadir: 0,
    hadir_pemutihan: 0,
    tepat_waktu: 0,
    terlambat: 0,
    terlambat_berat: 0,
    izin: 0,
    sakit: 0,
    tanpa_keterangan: 0,
    lembur: 0,
    belum_pulang: 0,
  };

  filteredData.forEach(p => {
    const statusAkhir = getStatusAkhir(p);
    
    switch (statusAkhir) {
      case 'Hadir':
        stats.hadir++;
        if (p.status_masuk === 'Tepat Waktu') {
          stats.tepat_waktu++;
        }
        if (p.is_lembur) {
          stats.lembur++;
        }
        break;
      case 'Hadir (Pemutihan)':
        stats.hadir++;
        stats.hadir_pemutihan++;
        if (p.status_masuk === 'Tepat Waktu') {
          stats.tepat_waktu++;
        }
        break;
      case 'Terlambat':
        stats.hadir++;
        stats.terlambat++;
        if (p.status_masuk === 'Terlambat Berat') {
          stats.terlambat_berat++;
        }
        break;
      case 'Izin':
        stats.izin++;
        break;
      case 'Sakit':
        stats.sakit++;
        break;
      case 'Tanpa Keterangan':
        stats.tanpa_keterangan++;
        break;
      case 'Belum Pulang':
        stats.belum_pulang++;
        stats.hadir++;
        break;
    }
  });

  return stats;
}

export function getStatusColor(status) {
  switch (status) {
    case "Hadir":
      return "bg-green-100 text-green-700 border-green-200";
    case "Hadir (Pemutihan)":
      return "bg-emerald-100 text-emerald-700 border-emerald-200";
    case "Terlambat":
      return "bg-amber-100 text-amber-700 border-amber-200";
    case "Tanpa Keterangan":
      return "bg-gray-100 text-gray-700 border-gray-200";
    case "Izin":
      return "bg-purple-100 text-purple-700 border-purple-200";
    case "Sakit":
      return "bg-pink-100 text-pink-700 border-pink-200";
    case "Belum Pulang":
      return "bg-yellow-100 text-yellow-700 border-yellow-200";
    default:
      return "bg-gray-100 text-gray-700 border-gray-200";
  }
}

export function getStatusIcon(status) {
  switch (status) {
    case "Hadir":
    case "Hadir (Pemutihan)":
      return "✓";
    case "Terlambat":
      return "⏰";
    case "Tanpa Keterangan":
      return "✗";
    case "Izin":
    case "Sakit":
      return "📄";
    case "Lembur":
      return "📈";
    case "Belum Pulang":
      return "⚠️";
    default:
      return "❓";
  }
}

export function formatDate(dateString) {
  try {
    return new Date(dateString).toLocaleDateString("id-ID", {
      weekday: "long",
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  } catch (error) {
    return dateString || "Tanggal tidak valid";
  }
}

export function formatDayOnly(dateString) {
  try {
    return new Date(dateString).getDate();
  } catch (error) {
    const day = dateString ? dateString.split('-')[2] : "?";
    return day;
  }
}

export function formatDayName(dateString) {
  try {
    return new Date(dateString).toLocaleDateString("id-ID", { weekday: "short" });
  } catch (error) {
    return "";
  }
}

export function formatTime(timeString) {
  if (!timeString) return "—";
  return timeString.split(':').slice(0, 2).join(':');
}

export function getMonthName(monthValue, availableMonths = []) {
  if (availableMonths.length > 0) {
    const month = availableMonths.find(m => m.value === monthValue);
    return month ? month.label : monthValue;
  }
  
  const months = [
    "", "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];
  const monthNum = parseInt(monthValue);
  return months[monthNum] || monthValue;
}