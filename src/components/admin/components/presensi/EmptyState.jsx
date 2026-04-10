"use client";

import { Calendar, Filter } from "lucide-react";

export function EmptyState({ type = "empty", message, actionLabel, onAction }) {
  const icons = {
    empty: <Calendar className="w-8 h-8 text-gray-400" />,
    "no-filter": <Filter className="w-8 h-8 text-gray-400" />
  };

  return (
    <div className="text-center py-12">
      <div className="w-16 h-16 mx-auto mb-4 bg-gray-50 rounded-full flex items-center justify-center">
        {icons[type]}
      </div>
      <p className="text-gray-500">{message}</p>
      {onAction && (
        <button
          onClick={onAction}
          className="mt-4 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}