"use client";

export default function StatusBadge({ status }) {
  const getStatusConfig = () => {
    switch (status) {
      case "Belum Absen":
        return { bg: "bg-yellow-100", text: "text-yellow-700" };
      case "Sedang Bekerja":
        return { bg: "bg-blue-100", text: "text-blue-700" };
      case "Selesai Bekerja":
        return { bg: "bg-green-100", text: "text-green-700" };
      default:
        return { bg: "bg-gray-100", text: "text-gray-700" };
    }
  };

  const config = getStatusConfig();

  return (
    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${config.bg} ${config.text}`}>
      {status}
    </span>
  );
}