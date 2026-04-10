"use client";

import { Bar } from 'react-chartjs-2';
import { Building2, Download } from "lucide-react";
import { LoadingSpinner } from "./LoadingSpinner";
import { EmptyState } from "./EmptyState";
import { getNamaBulan } from "../../utils/dashboard/constants";

export function GrafikWilayahKinerja({
  loading,
  wilayahChartData,
  selectedMonth,
  selectedYear,
  onRefresh,
  onExportImage
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
          font: { size: 12 },
          generateLabels: (chart) => {
            const labels = chart.data.datasets.map((dataset, i) => ({
              text: dataset.label,
              fillStyle: dataset.backgroundColor,
              strokeStyle: dataset.borderColor,
              lineWidth: 2,
              hidden: !chart.isDatasetVisible(i),
              index: i
            }));
            return labels;
          }
        }
      },
      title: {
        display: true,
        text: `Perbandingan Kinerja per Wilayah - ${getNamaBulan(selectedMonth)} ${selectedYear}`,
        font: { size: 16, weight: 'bold', family: "'Inter', sans-serif" },
        padding: { bottom: 30, top: 10 },
        color: '#111827'
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.dataset.label || '';
            const value = context.raw;
            return `${label}: ${value.toLocaleString('id-ID')}m`;
          }
        }
      }
    },
    scales: {
      x: { 
        grid: { display: false, drawBorder: false }, 
        ticks: { font: { size: 11 }, color: '#6B7280' } 
      },
      y: {
        beginAtZero: true,
        grid: { color: 'rgba(229, 231, 235, 0.5)', drawBorder: false },
        title: { 
          display: true, 
          text: 'Panjang (meter)', 
          font: { size: 13, weight: '600' }, 
          color: '#374151', 
          padding: { top: 0, bottom: 20 } 
        },
        ticks: { 
          callback: (value) => `${value.toLocaleString('id-ID')}m`, 
          font: { size: 11 }, 
          color: '#6B7280', 
          padding: 8 
        }
      }
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden mb-8">
      <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-red-50 to-green-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-red-100 to-green-100 flex items-center justify-center">
              <Building2 className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Grafik Kinerja per Wilayah vs Target</h2>
              <p className="text-sm text-gray-600">
                Perbandingan total kinerja KR dan KN dengan target per wilayah
              </p>
            </div>
          </div>
          
          {onExportImage && (
            <button
              onClick={onExportImage}
              disabled={loading}
              className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-all disabled:opacity-50"
              title="Export sebagai gambar"
            >
              <Download size={16} className="text-green-600" />
              <span className="text-sm">Export Grafik</span>
            </button>
          )}
        </div>
        
        <div className="flex flex-wrap gap-4 mt-3">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-green-600"></div>
            <span className="text-sm text-gray-600">KR Dikerjakan</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-red-600"></div>
            <span className="text-sm text-gray-600">Target KR</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-green-300"></div>
            <span className="text-sm text-gray-600">KN Dikerjakan</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-red-300"></div>
            <span className="text-sm text-gray-600">Target KN</span>
          </div>
        </div>
      </div>
      
      <div className="p-4 md:p-6 h-96 wilayah-chart-container" id="wilayahChartContainer">
        {loading ? (
          <LoadingSpinner size="lg" text="Memuat data..." />
        ) : wilayahChartData && wilayahChartData.labels && wilayahChartData.labels.length > 0 ? (
          <Bar data={wilayahChartData} options={options} />
        ) : (
          <EmptyState 
            icon={Building2}
            title="Tidak ada data wilayah"
            message="Tidak ada data kinerja untuk periode ini"
            onRefresh={onRefresh}
          />
        )}
      </div>
    </div>
  );
}