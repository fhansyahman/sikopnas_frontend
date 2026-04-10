export const formatNumber = (num) => {
  if (num === null || num === undefined) return '0';
  return new Intl.NumberFormat('id-ID').format(num);
};

export const formatPercentage = (num, total) => {
  if (!num || !total || total === 0) return '0%';
  const percentage = (num / total) * 100;
  return `${percentage.toFixed(1)}%`;
};

export const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};

export const formatShortDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
};

export const formatTime = (timeStr) => {
  if (!timeStr) return '';
  return new Date(timeStr).toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit'
  });
};