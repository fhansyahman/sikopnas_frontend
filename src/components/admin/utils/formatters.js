export const formatNumber = (num) => {
  if (num === null || num === undefined) return '0';
  return new Intl.NumberFormat('id-ID').format(num);
};

export const formatPercentage = (num, total) => {
  if (!num || !total || total === 0) return '0.00%';
  const percentage = (num / total) * 100;
  return `${percentage.toFixed(2)}%`;
};

export const formatDate = (dateStr) => {
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  } catch {
    return dateStr;
  }
};

export const formatTime = (timeStr) => {
  if (!timeStr) return '';
  try {
    return new Date(timeStr).toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch {
    return timeStr;
  }
};

export const formatCompactNumber = (num) => {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'jt';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'rb';
  return num.toString();
};