"use client";

export function LoadingSpinner({ fullScreen = false, message = "Memuat data..." }) {
  const content = (
    <div className="flex flex-col items-center justify-center">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-gray-200 rounded-full"></div>
        <div className="absolute top-0 left-0 w-16 h-16 border-4 border-blue-500 rounded-full animate-spin border-t-transparent"></div>
      </div>
      <p className="mt-4 text-gray-600 font-medium">{message}</p>
      <p className="text-gray-400 text-sm mt-2">Mohon tunggu sebentar</p>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        {content}
      </div>
    );
  }

  return (
    <div className="p-12 text-center">
      {content}
    </div>
  );
}