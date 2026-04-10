"use client";

import { AlertCircle } from "lucide-react";

export function ErrorAlert({ error, onRetry }) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <AlertCircle className="w-5 h-5 text-red-500" />
          <p className="text-red-700 text-sm">{error}</p>
        </div>
        <button
          onClick={onRetry}
          className="text-red-600 hover:text-red-800 text-sm font-medium"
        >
          Coba Lagi
        </button>
      </div>
    </div>
  );
}