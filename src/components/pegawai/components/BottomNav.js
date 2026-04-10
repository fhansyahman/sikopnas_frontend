import { Home, UserRound } from "lucide-react";

export default function BottomNav({ router }) {
  return (
    <div className="fixed bottom-0 w-full bg-white border-t border-slate-200 shadow-lg flex justify-around py-3">
      <button
        onClick={() => router.push("/pegawai/dashboard")}
        className="flex flex-col items-center gap-1 text-blue-600"
      >
        <Home size={22} />
        <span className="text-xs font-medium">Home</span>
      </button>

      <button
        onClick={() => router.push("/pegawai/akun")}
        className="flex flex-col items-center gap-1 text-slate-500 hover:text-slate-700 transition-colors duration-200"
      >
        <UserRound size={22} />
        <span className="text-xs font-semibold">Akun</span>
      </button>
    </div>
  );
}