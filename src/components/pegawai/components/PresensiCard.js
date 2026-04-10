export default function PresensiCard({ today, currentTime, presensiHariIni, statusKehadiran }) {
  const statusColor = !presensiHariIni.masuk 
    ? "bg-yellow-100 text-yellow-700" 
    : !presensiHariIni.pulang 
      ? "bg-blue-100 text-blue-700" 
      : "bg-green-100 text-green-700";

  return (
    <div className="bg-white shadow-lg rounded-xl p-6 w-[90%] absolute top-36 border border-slate-200">
      <div className="text-center mb-4">
        <h3 className="text-slate-700 font-semibold text-lg">{today}</h3>
        <p className="text-sm text-slate-500">{currentTime} WIB</p>
      </div>

      <div className="flex justify-between bg-slate-50 rounded-lg px-6 py-4 border border-slate-200">
        <div className="flex flex-col items-center w-1/2 border-r border-slate-300">
          <span className="text-sm text-slate-500 mb-1">Check In</span>
          <span className="font-bold text-xl text-blue-600">{presensiHariIni.masuk || "-- : --"}</span>
        </div>
        <div className="flex flex-col items-center w-1/2">
          <span className="text-sm text-slate-500 mb-1">Check Out</span>
          <span className="font-bold text-xl text-green-600">{presensiHariIni.pulang || "-- : --"}</span>
        </div>
      </div>
      
      <div className="mt-4 text-center">
        <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${statusColor}`}>
          {statusKehadiran}
        </span>
      </div>
    </div>
  );
}