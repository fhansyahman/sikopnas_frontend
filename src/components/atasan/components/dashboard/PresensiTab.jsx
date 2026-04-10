import { FilterPresensi } from "./FilterPresensi";
import { StatistikPresensi } from "./StatistikPresensi";
import { GrafikPresensi } from "./GrafikPresensi";
import { TabelWilayahPresensi } from "./TabelWilayahPresensi";
import { AnalisisPresensi } from "./AnalisisPresensi";

export function PresensiTab(props) {
  const {
    selectedMonth,
    selectedYear,
    selectedWilayah,
    loading,
    chartData,
    statistik,
    wilayahStatistik,
    handleMonthChange,
    handleYearChange,
    handleWilayahChange,
    loadPresensiData,
    handleExportChart,
    handleExportData,
    bulanOptions,
    tahunOptions
  } = props;

  return (
    <div>
      <FilterPresensi
        selectedMonth={selectedMonth}
        selectedYear={selectedYear}
        selectedWilayah={selectedWilayah}
        loading={loading}
        bulanOptions={bulanOptions}
        tahunOptions={tahunOptions}
        onMonthChange={handleMonthChange}
        onYearChange={handleYearChange}
        onWilayahChange={handleWilayahChange}
        onRefresh={loadPresensiData}
        onExportChart={handleExportChart}
        onExportData={handleExportData}
        chartData={chartData}
      />

      <StatistikPresensi statistik={statistik} />

      <GrafikPresensi
        loading={loading}
        chartData={chartData}
        selectedMonth={selectedMonth}
        selectedYear={selectedYear}
        selectedWilayah={selectedWilayah}
        onRefresh={loadPresensiData}
      />

      {Object.keys(wilayahStatistik).length > 0 && (
        <TabelWilayahPresensi
          wilayahStatistik={wilayahStatistik}
          statistik={statistik}
        />
      )}

      <AnalisisPresensi statistik={statistik} />
    </div>
  );
}