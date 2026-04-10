"use client";

export function StatusBadge({ status, type = 'default' }) {
  const styles = {
    default: 'bg-gray-100 text-gray-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-amber-100 text-amber-800',
    danger: 'bg-red-100 text-red-800',
    info: 'bg-blue-100 text-blue-800'
  };

  const getStyle = () => {
    if (type !== 'default') return styles[type];
    
    // Auto-detect berdasarkan nilai status
    if (status?.toLowerCase().includes('aktif')) return styles.success;
    if (status?.toLowerCase().includes('nonaktif')) return styles.danger;
    if (status?.toLowerCase().includes('proses')) return styles.warning;
    return styles.default;
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStyle()}`}>
      {status}
    </span>
  );
}