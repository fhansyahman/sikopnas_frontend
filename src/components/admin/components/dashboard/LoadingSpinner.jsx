export function LoadingSpinner({ size = 'md', text = 'Memuat data...' }) {
  const sizeClasses = {
    sm: 'h-6 w-6 border-2',
    md: 'h-10 w-10 border-4',
    lg: 'h-16 w-16 border-4'
  };

  return (
    <div className="text-center">
      <div className={`inline-block animate-spin rounded-full ${sizeClasses[size]} border-solid border-blue-600 border-r-transparent`}></div>
      <p className="mt-3 text-gray-500">{text}</p>
    </div>
  );
}