"use client";

export function LoadingSpinner({ fullScreen, message = "Memuat data..." }) {
  const content = (
    <div className="text-center flex flex-col items-center">
      <div className="relative w-16 h-16">
        <div className="w-16 h-16 border-4 border-gray-200 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-blue-500 rounded-full animate-spin border-t-transparent"></div>
      </div>
      <p className="mt-4 text-gray-600">{message}</p>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-50 z-50">
        {content}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center p-8">
      {content}
    </div>
  );
}