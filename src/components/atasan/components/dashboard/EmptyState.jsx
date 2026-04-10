import { BarChart3 } from "lucide-react";
import { RefreshButton } from "./RefreshButton";

export function EmptyState({ 
  icon: Icon = BarChart3, 
  title = 'Tidak ada data', 
  message = 'Tidak ada data untuk ditampilkan',
  onRefresh 
}) {
  return (
    <div className="h-full flex items-center justify-center">
      <div className="text-center">
        <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
          <Icon className="w-10 h-10 text-gray-400" />
        </div>
        <p className="text-gray-500 mb-2">{title}</p>
        <p className="text-sm text-gray-400 mb-6">{message}</p>
        {onRefresh && (
          <RefreshButton onClick={onRefresh} label="Coba Lagi" />
        )}
      </div>
    </div>
  );
}