import { WILAYAH_COLORS, STATUS_COLORS, KINERJA_STATUS } from './constants';

// Get wilayah color
export const getWilayahColor = (wilayah) => {
  return WILAYAH_COLORS[wilayah] || 'rgba(156, 163, 175, 0.8)';
};

// Get status color
export const getStatusColor = (status) => {
  return STATUS_COLORS[status] || 'rgba(156, 163, 175, 0.8)';
};

// Get kinerja status label
export const getKinerjaStatusLabel = (status) => {
  return KINERJA_STATUS[status]?.label || status;
};

// Get kinerja status color
export const getKinerjaStatusColor = (status) => {
  return KINERJA_STATUS[status]?.color || 'bg-gray-100 text-gray-800 border-gray-200';
};

// Get kinerja status icon
export const getKinerjaStatusIcon = (status) => {
  return KINERJA_STATUS[status]?.icon || 'FileQuestion';
};

// Get kinerja status bg color
export const getKinerjaStatusBgColor = (status) => {
  return KINERJA_STATUS[status]?.bgColor || 'rgba(156, 163, 175, 0.8)';
};

// Chart options for presensi
export const getPresensiChartOptions = (title, yAxisLabel = 'Jumlah Presensi') => {
  return {
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
        text: title,
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
      }
    },
    scales: {
      x: {
        grid: { display: false, drawBorder: false },
        ticks: { maxRotation: 45, minRotation: 45, font: { size: 11 }, color: '#6B7280' }
      },
      y: {
        beginAtZero: true,
        grid: { color: 'rgba(229, 231, 235, 0.5)', drawBorder: false },
        title: {
          display: true,
          text: yAxisLabel,
          font: { size: 13, weight: '600', family: "'Inter', sans-serif" },
          color: '#374151',
          padding: { top: 0, bottom: 20 }
        },
        ticks: { font: { size: 11 }, color: '#6B7280', padding: 8 }
      }
    }
  };
};

// Chart options for kinerja
export const getKinerjaChartOptions = (title, yAxisLabel = 'Panjang (meter)', isPercentage = false) => {
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
        text: title,
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
          label: (context) => {
            const value = context.parsed.y;
            return `${context.dataset.label || ''}: ${isPercentage ? value.toFixed(1) + '%' : value.toLocaleString('id-ID') + 'm'}`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: { display: false, drawBorder: false },
        ticks: { maxRotation: 45, minRotation: 45, font: { size: 11 }, color: '#6B7280' }
      },
      y: {
        beginAtZero: true,
        ...(isPercentage && { min: 0, max: 120 }),
        grid: { color: 'rgba(229, 231, 235, 0.5)', drawBorder: false },
        title: {
          display: true,
          text: yAxisLabel,
          font: { size: 13, weight: '600', family: "'Inter', sans-serif" },
          color: '#374151',
          padding: { top: 0, bottom: 20 }
        },
        ticks: {
          callback: (value) => isPercentage ? `${value}%` : `${value.toLocaleString('id-ID')}m`,
          font: { size: 11 },
          color: '#6B7280',
          padding: 8
        }
      }
    }
  };

  return options;
};