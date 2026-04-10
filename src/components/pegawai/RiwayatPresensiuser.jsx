"use client";
import { useRouter } from "next/navigation";
import { Header } from "./components/riwayatpresensi/Header";
import { StatsCard } from "./components/riwayatpresensi/StatsCard";
import { FilterSection } from "./components/riwayatpresensi/FilterSection";
import { PresensiList } from "./components/riwayatpresensi/PresensiList";
import { LoadingState } from "./components/riwayatpresensi/LoadingState";
import { ErrorState } from "./components/riwayatpresensi/ErrorState";
import { usePresensiData } from "./hooks/riwayatpresensi/usePresensiData";

export default function RiwayatPresensiPage() {
  const router = useRouter();
  const {
    loading,
    error,
    allPresensi,
    filteredData,
    stats,
    presentase,
    selectedMonth,
    selectedYear,
    availableMonths,
    availableYears,
    expandedDays,
    setSelectedMonth,
    setSelectedYear,
    resetFilter,
    setToCurrentMonth,
    toggleDayDetail,
    fetchDataPresensi,
    getStatusAkhir,
    getStatusColor,
    getStatusIcon,
    formatDate,
    formatDayOnly,
    formatDayName,
    formatTime,
    getMonthName,
    months
  } = usePresensiData();

  if (loading && allPresensi.length === 0) {
    return <LoadingState />;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header 
        onBack={() => router.push("/pegawai/dashboard")}
        onRefresh={fetchDataPresensi}
        isLoading={loading}
      />

      <div className="max-w-4xl mx-auto p-4 space-y-5">
        {error && (
          <ErrorState 
            error={error} 
            onRetry={fetchDataPresensi} 
          />
        )}

        <StatsCard 
          stats={stats}
          presentase={presentase}
          totalData={allPresensi.length}
          filteredCount={filteredData.length}
          selectedMonth={selectedMonth}
          selectedYear={selectedYear}
          getMonthName={getMonthName}
        />

        <FilterSection
          selectedMonth={selectedMonth}
          selectedYear={selectedYear}
          availableMonths={availableMonths}
          availableYears={availableYears}
          months={months}
          onMonthChange={setSelectedMonth}
          onYearChange={setSelectedYear}
          onReset={resetFilter}
          onSetCurrentMonth={setToCurrentMonth}
          totalData={allPresensi.length}
          filteredCount={filteredData.length}
        />

        <PresensiList
          loading={loading}
          allPresensi={allPresensi}
          filteredData={filteredData}
          expandedDays={expandedDays}
          selectedMonth={selectedMonth}
          selectedYear={selectedYear}
          stats={stats}
          onRefresh={fetchDataPresensi}
          onSetCurrentMonth={setToCurrentMonth}
          onToggleDetail={toggleDayDetail}
          getStatusAkhir={getStatusAkhir}
          getStatusColor={getStatusColor}
          getStatusIcon={getStatusIcon}
          formatDate={formatDate}
          formatDayOnly={formatDayOnly}
          formatDayName={formatDayName}
          formatTime={formatTime}
          getMonthName={getMonthName}
        />
      </div>
    </div>
  );
}