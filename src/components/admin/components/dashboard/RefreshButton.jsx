import { RefreshCw } from "lucide-react";

export function RefreshButton({ onClick, loading, label = 'Refresh' }) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
      <span>{label}</span>
    </button>
  );
}