export default function ActionButton({ icon, label, color, onClick, disabled }) {
  return (
    <button 
      onClick={onClick} 
      disabled={disabled}
      className={`flex items-center space-x-3 p-3 rounded-xl shadow-sm border border-slate-200 transition-all ${
        disabled 
          ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
          : 'bg-white hover:shadow-md hover:border-slate-300'
      }`}
    >
      <div className={`bg-gradient-to-r ${color} text-white rounded-lg p-2 ${disabled && 'opacity-50'}`}>
        {icon}
      </div>
      <span className={`text-sm font-medium ${disabled ? 'text-slate-400' : 'text-slate-700'}`}>
        {label}
      </span>
    </button>
  );
}