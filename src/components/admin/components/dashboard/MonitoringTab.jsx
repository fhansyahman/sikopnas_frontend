"use client";

import { useState } from "react";
import { FilterMonitoring } from "./FilterMonitoring";
import { StatistikMonitoring } from "./StatistikMonitoring";
import { BelumAbsenList } from "./BelumAbsenList";
import { IzinList } from "./IzinList";
import { BelumLaporList } from "./BelumLaporList";
import { DetailModal } from "./DetailModal";

export function MonitoringTab(props) {
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const {
    selectedDate,
    dataBelumAbsen,
    dataBelumLapor,
    dataSudahLapor,
    dataIzin,
    dataSakit,
    dataCuti,
    stats,
    loading,
    handleDateChange,
    fetchMonitoringData,
    handleExportData
  } = props;

  const handleViewDetail = (employee) => {
    setSelectedEmployee(employee);
    setShowDetailModal(true);
  };

  const handleCloseDetail = () => {
    setShowDetailModal(false);
    setSelectedEmployee(null);
  };

  // Gabungkan izin, sakit, cuti untuk ditampilkan di satu list
  const semuaIzin = [...dataIzin, ...dataSakit, ...dataCuti];

  return (
    <div>
      <FilterMonitoring
        selectedDate={selectedDate}
        onDateChange={handleDateChange}
        onRefresh={() => fetchMonitoringData(selectedDate)}
        onExport={handleExportData}
        hasData={dataBelumAbsen.length > 0 || dataBelumLapor.length > 0 || semuaIzin.length > 0}
      />

      <StatistikMonitoring stats={stats} loading={loading.stats} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <BelumAbsenList
          data={dataBelumAbsen}
          loading={loading.data}
          totalPegawai={stats.totalPegawai}
          selectedDate={selectedDate}
          onViewDetail={handleViewDetail}
        />
        
        <IzinList
          data={semuaIzin}
          loading={loading.data}
          totalPegawai={stats.totalPegawai}
          selectedDate={selectedDate}
          onViewDetail={handleViewDetail}
        />
        
        <BelumLaporList
          data={dataBelumLapor}
          sudahLaporData={dataSudahLapor}
          loading={loading.data}
          totalPegawai={stats.totalPegawai}
          selectedDate={selectedDate}
          onViewDetail={handleViewDetail}
        />
      </div>

      {showDetailModal && selectedEmployee && (
        <DetailModal
          employee={selectedEmployee}
          selectedDate={selectedDate}
          onClose={handleCloseDetail}
        />
      )}
    </div>
  );
}