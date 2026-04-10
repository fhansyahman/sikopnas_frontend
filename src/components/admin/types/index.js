/**
 * @typedef {Object} PresensiData
 * @property {string} id
 * @property {string} tanggal
 * @property {string} jam_masuk
 * @property {string} jam_pulang
 * @property {string} status_masuk
 * @property {string} status_pulang
 * @property {string} keterangan
 * @property {string} wilayah_penugasan
 * @property {string} pegawai_id
 * @property {string} nama
 * @property {string} izin_id
 * @property {string} jenis_izin
 * @property {boolean} is_lembur
 * @property {string} status_akhir
 */

/**
 * @typedef {Object} KinerjaData
 * @property {string} id
 * @property {string} tanggal
 * @property {string} nama
 * @property {string} nip
 * @property {string} jabatan
 * @property {string} wilayah_penugasan
 * @property {number} panjang_kr
 * @property {number} panjang_kn
 * @property {string} status
 * @property {string} keterangan
 */

/**
 * @typedef {Object} PegawaiData
 * @property {string} id
 * @property {string} nama
 * @property {string} nip
 * @property {string} jabatan
 * @property {string} wilayah_penugasan
 * @property {string} status
 * @property {string} role
 */

/**
 * @typedef {Object} PresensiStats
 * @property {number} totalPegawai
 * @property {number} totalHadir
 * @property {number} totalTerlambat
 * @property {number} totalIzin
 * @property {number} totalTanpaKeterangan
 * @property {number} persenHadir
 * @property {number} persenTerlambat
 * @property {number} persenIzin
 * @property {number} persenTanpaKeterangan
 */

/**
 * @typedef {Object} KinerjaStats
 * @property {number} total_pegawai
 * @property {number} total_sudah_lapor
 * @property {number} total_belum_lapor
 * @property {number} total_tercapai_target
 * @property {number} total_hampir_tercapai
 * @property {number} total_sedang
 * @property {number} total_tidak_tercapai
 * @property {number} rata_kr
 * @property {number} rata_kn
 * @property {number} rata_pencapaian_kr
 * @property {number} rata_pencapaian_kn
 * @property {number} persen_sudah_lapor
 * @property {number} persen_tercapai_target
 * @property {number} hari_kerja
 * @property {number} target_kr_bulanan
 * @property {number} target_kn_bulanan
 */

/**
 * @typedef {Object} MonitoringStats
 * @property {number} totalPegawai
 * @property {number} hadir
 * @property {number} terlambat
 * @property {number} izin
 * @property {number} belumAbsen
 * @property {number} belumLapor
 * @property {number} sudahLapor
 */