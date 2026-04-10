"use client";

import { CheckCircle, Clock, XCircle } from "lucide-react";

export function StatusBadge({ status }) {
  const getStatusColor = (status) => {
    switch (status) {
      case "Disetujui":
        return "bg-green-100 text-green-800 border-green-200";
      case "Pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Ditolak":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Disetujui":
        return <CheckCircle className="w-4 h-4" />;
      case "Pending":
        return <Clock className="w-4 h-4" />;
      case "Ditolak":
        return <XCircle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
        status
      )}`}
    >
      {getStatusIcon(status)}
      <span className="ml-1.5">{status}</span>
    </span>
  );
}