import { Bar } from 'react-chartjs-2';
import { LoadingSpinner } from "./LoadingSpinner";
import { EmptyState } from "./EmptyState";
import { BULAN_OPTIONS } from "../../utils/dashboard/constants";
import { BarChart3 } from "lucide-react";

export function GrafikPresensi({
  loading,
  chartData,
  selectedMonth,
  selectedYear,
  selectedWilayah,
  onRefresh
}) {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: { 
          usePointStyle: true, 
          padding: 20, 
          font: { size: 12, family: "'Inter', sans-serif" },
          color: '#374151'
        }
      },
      title: {
        display: true,
        text: `Grafik Kehadiran per Wilayah - ${BULAN_OPTIONS.find(b => b.value === selectedMonth.toString().padStart(2, '0'))?.label} ${selectedYear}`,
        font: { size: 16, weight: 'bold', family: "'Inter', sans-serif" },
        padding: { bottom: 30, top: 10 },
        color: '#111827'
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        titleColor: '#111827',
        bodyColor: '#374151',
        borderColor: '#E5E7EB',
        borderWidth: 1,
        boxPadding: 10,
        usePointStyle: true,
        callbacks: {
          label: (context) => `${context.dataset.label}: ${context.parsed.y}%`
        }
      }
    },
    scales: {
      x: { 
        grid: { display: false, drawBorder: false },
        title: {
          display: true,
          text: 'Wilayah',
          font: { size: 13, weight: '600' },
          color: '#374151',
          padding: { top: 20, bottom: 10 }
        },
        ticks: { font: { size: 11 }, color: '#6B7280' }
      },
      y: {
        beginAtZero: true,
        max: 100, // Maksimal 100%
        grid: { color: 'rgba(229, 231, 235, 0.5)', drawBorder: false },
        title: {
          display: true,
          text: 'Persentase (%)',
          font: { size: 13, weight: '600' },
          color: '#374151',
          padding: { top: 0, bottom: 20 }
        },
        ticks: { 
          stepSize: 10, 
          callback: (value) => value + '%',
          font: { size: 11 }, 
          color: '#6B7280',
          padding: 8
        }
      }
    }
  };

  const getTitle = () => {
    if (selectedWilayah !== 'all') {
      return `Wilayah: ${selectedWilayah} • Periode: ${BULAN_OPTIONS.find(b => b.value === selectedMonth.toString().padStart(2, '0'))?.label} ${selectedYear}`;
    }
    return `Semua Wilayah • Periode: ${BULAN_OPTIONS.find(b => b.value === selectedMonth.toString().padStart(2, '0'))?.label} ${selectedYear}`;
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden mb-8">
      <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Grafik Kehadiran per Wilayah</h2>
            <p className="text-sm text-gray-600">{getTitle()}</p>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-4 mt-3">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-emerald-500"></div>
            <span className="text-sm text-gray-600">Hadir</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-amber-500"></div>
            <span className="text-sm text-gray-600">Terlambat</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-purple-500"></div>
            <span className="text-sm text-gray-600">Izin</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-red-500"></div>
            <span className="text-sm text-gray-600">Tanpa Keterangan</span>
          </div>
        </div>
      </div>

      <div className="p-4 md:p-6 h-96" id="presensiChartContainer">
        {loading ? (
          <LoadingSpinner size="lg" text="Memuat data grafik..." />
        ) : chartData ? (
          <Bar data={chartData} options={options} />
        ) : (
          <EmptyState 
            icon={BarChart3}
            title="Tidak ada data untuk periode ini"
            message={`Tidak ada data presensi untuk ${getTitle()}`}
            onRefresh={onRefresh}
          />
        )}
      </div>
    </div>
  );
}