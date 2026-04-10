import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// Status Kinerja helpers
export const getStatusLabelKinerja = (status) => {
  switch (status) {
    case 'tercapai_target': return 'Tercapai Target';
    case 'hampir_tercapai': return 'Hampir Tercapai';
    case 'sedang': return 'Sedang';
    case 'tidak_tercapai': return 'Tidak Tercapai';
    case 'tidak_ada_laporan': return 'Tidak Ada Laporan';
    default: return status;
  }
};

export const getStatusColorKinerja = (status) => {
  switch (status) {
    case 'tercapai_target': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    case 'hampir_tercapai': return 'bg-green-100 text-green-800 border-green-200';
    case 'sedang': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'tidak_tercapai': return 'bg-red-100 text-red-800 border-red-200';
    case 'tidak_ada_laporan': return 'bg-gray-100 text-gray-800 border-gray-200';
    default: return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

export const getStatusIconKinerja = (status) => {
  const icons = {
    'tercapai_target': '✅',
    'hampir_tercapai': '👍',
    'sedang': '⚠️',
    'tidak_tercapai': '❌',
    'tidak_ada_laporan': '📋'
  };
  return icons[status] || '❓';
};

// Chart options generators
export const getBarChartOptions = (title, yAxisLabel) => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { 
      position: 'top', 
      labels: { usePointStyle: true, padding: 20, font: { size: 12 }, color: '#374151' } 
    },
    title: {
      display: true,
      text: title,
      font: { size: 16, weight: 'bold' },
      padding: { bottom: 30, top: 10 },
      color: '#111827'
    },
    tooltip: {
      mode: 'index', intersect: false,
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      titleColor: '#111827', bodyColor: '#374151',
      borderColor: '#E5E7EB', borderWidth: 1,
      boxPadding: 10, usePointStyle: true,
    }
  },
  scales: {
    x: { grid: { display: false }, ticks: { maxRotation: 45, minRotation: 45, font: { size: 11 } } },
    y: {
      beginAtZero: true,
      title: { display: true, text: yAxisLabel, font: { size: 13, weight: '600' }, color: '#374151' },
      ticks: { font: { size: 11 }, color: '#6B7280', padding: 8 }
    }
  }
});

export const getLineChartOptions = (title) => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { position: 'top', labels: { usePointStyle: true, padding: 20, font: { size: 12 } } },
    title: {
      display: true,
      text: title,
      font: { size: 16, weight: 'bold' },
      padding: { bottom: 30, top: 10 }
    },
    tooltip: {
      mode: 'index', intersect: false,
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      titleColor: '#111827', bodyColor: '#374151',
      borderColor: '#E5E7EB', borderWidth: 1,
      boxPadding: 10, usePointStyle: true,
    }
  },
  scales: {
    x: { grid: { display: false }, ticks: { maxRotation: 45, minRotation: 45, font: { size: 11 } } },
    y: {
      beginAtZero: true,
      title: { display: true, text: 'Persentase Pencapaian (%)', font: { size: 13, weight: '600' } },
      ticks: { callback: (value) => `${value}%` }
    }
  }
});

export const getPieChartOptions = (title) => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { 
      position: 'right', 
      labels: { usePointStyle: true, padding: 20, font: { size: 12 } } 
    },
    title: {
      display: true,
      text: title,
      font: { size: 16, weight: 'bold' },
      padding: { bottom: 30, top: 10 }
    },
    tooltip: {
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      titleColor: '#111827', bodyColor: '#374151',
      borderColor: '#E5E7EB', borderWidth: 1,
      boxPadding: 10, usePointStyle: true,
      callbacks: {
        label: (context) => {
          const label = context.label || '';
          const value = context.raw || 0;
          const total = context.dataset.data.reduce((a, b) => a + b, 0);
          const percentage = Math.round((value / total) * 100);
          return `${label}: ${value} pegawai (${percentage}%)`;
        }
      }
    }
  }
});