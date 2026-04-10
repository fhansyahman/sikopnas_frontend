"use client";

export default function UserHeader({ user }) {
  return (
    <div className="w-full bg-gradient-to-b from-slate-700 to-slate-600 pb-16 shadow-md text-white">
      <div className="pt-8 px-6">
        <div className="flex items-center space-x-4">
          {user?.foto ? (
            <img 
              src={user.foto} 
              alt="Foto Profil"
              className="w-16 h-16 rounded-full border-2 border-slate-400 object-cover"
            />
          ) : (
            <img 
              src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
              alt="User"
              className="w-16 h-16 rounded-full border-2 border-slate-400" 
            />
          )}
          <div className="flex-1">
            <h2 className="font-semibold text-lg">{user?.nama || "User"}</h2>
            <p className="text-sm opacity-90">{user?.jabatan || "Karyawan"}</p>
            <p className="text-xs opacity-75 mt-1">{user?.wilayah_penugasan || "Department"}</p>
          </div>
        </div>
      </div>
    </div>
  );
}