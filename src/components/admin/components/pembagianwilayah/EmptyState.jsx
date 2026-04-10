"use client";

export function EmptyState({ icon, title, description }) {
  return (
    <div className="text-center py-12">
      <div className="w-16 h-16 mx-auto mb-4 bg-gray-50 rounded-full flex items-center justify-center">
        {icon}
      </div>
      <p className="text-gray-500">{title}</p>
      {description && <p className="text-sm text-gray-400 mt-2">{description}</p>}
    </div>
  );
}