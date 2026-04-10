"use client";

import { useState } from "react";
import { FilterKinerja } from "./FilterKinerja";
import { StatistikKinerja } from "./StatistikKinerja";
import { GrafikWilayahKinerja } from "./GrafikWilayahKinerja";
import { GrafikPerorangan } from "./GrafikPerorangan";
import { TabelWilayahKinerja } from "./TabelWilayahKinerja";
import { TabelPegawaiKinerja } from "./TabelPegawaiKinerja";
import { AnalisisKinerja } from "./AnalisisKinerja";
import { ExportButtonGroup } from "./ExportButton";

export function KinerjaTab(props) {
  const {
    // State
    activeChart,
    filterType,
    sortOrder,
    selectedMonth,
    selectedYear,
    chartData,
    wilayahChartData,
    statistikBulanan,
    statistikWilayah,
    loading,
    
    // Functions
    setActiveChart,
    setFilterType,
    setSortOrder,
    handleMonthChange,
    handleYearChange,
    processKinerjaChartData,
    handleExportKinerjaChart,
    handleExportWilayahChart,
    exportKinerjaPegawai,
    exportStatistikWilayah,
    exportRekapKinerja,
    exportAllData,
  } = props;

  const [viewType, setViewType] = useState('chart');

  return (
    <div className="space-y-6">
      {/* Header with Export Button */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Kinerja</h1>
          <p className="text-sm text-gray-500 mt-1">
            Monitoring kinerja pegawai per wilayah
          </p>
        </div>
        
        <ExportButtonGroup
          onExportPegawai={() => exportKinerjaPegawai?.('csv')}
          onExportWilayah={() => exportStatistikWilayah?.('csv')}
          onExportRekap={() => exportRekapKinerja?.('csv')}
          onExportAll={() => exportAllData?.('csv')}
          disabled={loading}
        />
      </div>

      {/* Filter Section */}
      <FilterKinerja
        selectedMonth={selectedMonth}
        selectedYear={selectedYear}
        loading={loading}
        onMonthChange={handleMonthChange}
        onYearChange={handleYearChange}
        onRefresh={processKinerjaChartData}
      />

      {/* Statistik Cards */}
      <StatistikKinerja 
        statistik={statistikBulanan} 
        chartData={chartData}
        selectedMonth={selectedMonth}
        selectedYear={selectedYear}
      />

      {/* Grafik Per Wilayah - dengan tombol export gambar */}
      <GrafikWilayahKinerja
        loading={loading}
        wilayahChartData={wilayahChartData}
        selectedMonth={selectedMonth}
        selectedYear={selectedYear}
        onRefresh={processKinerjaChartData}
        onExportImage={handleExportWilayahChart}
      />

      {/* Tabel Statistik Wilayah */}
      {statistikWilayah && statistikWilayah.length > 0 && (
        <TabelWilayahKinerja statistikWilayah={statistikWilayah} />
      )}


      {/* Grafik Perorangan dengan Pilihan Chart */}
      {viewType === 'chart' && (
        <GrafikPerorangan
          loading={loading}
          chartData={chartData}
          activeChart={activeChart}
          filterType={filterType}
          sortOrder={sortOrder}
          selectedMonth={selectedMonth}
          selectedYear={selectedYear}
          onChartChange={setActiveChart}
          onFilterTypeChange={setFilterType}
          onSortOrderChange={setSortOrder}
          onRefresh={processKinerjaChartData}
          onExport={() => exportKinerjaPegawai?.('csv')}
          onExportImage={handleExportKinerjaChart}
        />
      )}
      {/* Analisis Performa */}
      {chartData && (
        <AnalisisKinerja
          statistik={statistikBulanan}
          chartData={chartData}
        />
      )}
      {/* Tabel Detail Pegawai - SELALU DITAMPILKAN di bawah grafik */}
      {chartData?.labels && chartData.labels.length > 0 && (
        <div className="mt-8">
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Detail Data Pegawai</h2>
            <p className="text-sm text-gray-500 mt-1">
              Rincian kinerja per pegawai untuk bulan {getNamaBulan(selectedMonth)} {selectedYear}
            </p>
          </div>
          <TabelPegawaiKinerja
            chartData={chartData}
            onExport={() => exportKinerjaPegawai?.('csv')}
          />
        </div>
      )}


    </div>
  );
}

// Helper function untuk mendapatkan nama bulan
function getNamaBulan(month) {
  const bulan = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];
  return bulan[parseInt(month) - 1] || '';
}