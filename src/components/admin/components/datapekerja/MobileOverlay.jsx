"use client";

export function MobileOverlay({ sidebarOpen, setSidebarOpen }) {
  if (!sidebarOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
      onClick={() => setSidebarOpen(false)}
    />
  );
}