"use client";

import { ChevronDown, FileText, MapPin, TrendingUp } from "lucide-react";

export function PresensiItem({
  presensi,
  statusAkhir,
  isExpanded,
  onToggleDetail,
  getStatusColor,
  getStatusIcon,
  formatDate,
  formatDayOnly,
  formatDayName,
  formatTime
}) {
  const isPemutihan = presensi.isPemutihan;

  return (
    <div className="p-4 hover:bg-gray-50 transition-colors duration-200">
      <div className="flex items-start space-x-4">
        {/* Tanggal Box */}
        <DateBox
          date={presensi.tanggal}
          isExpanded={isExpanded}
          onToggle={() => onToggleDetail(presensi.id)}
          formatDayOnly={formatDayOnly}
          formatDayName={formatDayName}
        />
        
        {/* Informasi Utama */}
        <div className="flex-1">
          <MainInfo
            tanggal={presensi.tanggal}
            statusAkhir={statusAkhir}
            isPemutihan={isPemutihan}
            getStatusColor={getStatusColor}
            getStatusIcon={getStatusIcon}
            formatDate={formatDate}
          />
          
          <TimeInfo
            jamMasuk={presensi.jam_masuk}
            jamPulang={presensi.jam_pulang}
            statusMasuk={presensi.status_masuk}
            statusPulang={presensi.status_pulang}
            formatTime={formatTime}
            getStatusColor={getStatusColor}
          />
          
          {/* Detail Expanded */}
          {isExpanded && (
            <ExpandedDetail
              keterangan={presensi.keterangan}
              wilayah={presensi.wilayah_penugasan}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function DateBox({ date, isExpanded, onToggle, formatDayOnly, formatDayName }) {
  return (
    <div className="flex flex-col items-center">
      <div className="w-12 h-12 bg-indigo-50 rounded-lg flex flex-col items-center justify-center">
        <span className="text-indigo-600 font-semibold text-lg">
          {formatDayOnly(date)}
        </span>
        <span className="text-xs text-indigo-500 mt-[-2px]">
          {formatDayName(date)}
        </span>
      </div>
      <button
        onClick={onToggle}
        className="mt-2 text-xs text-gray-500 hover:text-gray-700 flex items-center"
      >
        Detail
        <ChevronDown className={`w-3 h-3 ml-1 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
      </button>
    </div>
  );
}

function MainInfo({ tanggal, statusAkhir, isPemutihan, getStatusColor, getStatusIcon, formatDate }) {
  return (
    <>
      <p className="font-semibold text-gray-800">
        {formatDate(tanggal)}
      </p>
      
      <div className="mt-2">
        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(statusAkhir)}`}>
          <span>{getStatusIcon(statusAkhir)}</span>
          {statusAkhir}
          {isPemutihan && <span className="ml-1">📝</span>}
        </span>
      </div>
    </>
  );
}

function TimeInfo({ jamMasuk, jamPulang, statusMasuk, statusPulang, formatTime, getStatusColor }) {
  return (
    <div className="mt-3 space-y-2">
      <TimeRow
        label="Masuk"
        time={jamMasuk}
        status={statusMasuk}
        formatTime={formatTime}
        getStatusColor={getStatusColor}
      />
      
      <TimeRow
        label="Pulang"
        time={jamPulang}
        status={statusPulang}
        formatTime={formatTime}
        getStatusColor={getStatusColor}
      />
    </div>
  );
}

function TimeRow({ label, time, status, formatTime, getStatusColor }) {
  return (
    <div className="flex items-center space-x-3">
      <div className="w-24">
        <p className="text-sm text-gray-600">{label}</p>
      </div>
      <div className="flex-1">
        <p className="font-medium text-gray-800">
          {formatTime(time) || "—"}
        </p>
        {status && status !== 'Tepat Waktu' && status !== 'Belum Presensi' && status !== 'Belum Pulang' && (
          <span className={`mt-1 inline-block px-2 py-0.5 rounded text-xs ${getStatusColor(status)}`}>
            {status}
          </span>
        )}
      </div>
    </div>
  );
}

function ExpandedDetail({ keterangan, wilayah, isLembur }) {
  return (
    <div className="mt-4 p-3 bg-gray-50 rounded-lg space-y-2">
      {keterangan && (
        <div className="flex items-start">
          <FileText className="w-4 h-4 text-gray-400 mr-2 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-gray-700">Keterangan:</p>
            <p className="text-sm text-gray-600">{keterangan}</p>
          </div>
        </div>
      )}
      
      {wilayah && (
        <div className="flex items-center">
          <MapPin className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />
          <p className="text-sm text-gray-600">{wilayah}</p>
        </div>
      )}
      
      {isLembur && (
        <div className="flex items-center text-blue-600 text-sm">
          <TrendingUp className="w-4 h-4 mr-2" />
          <span>Ada lembur</span>
        </div>
      )}
    </div>
  );
}