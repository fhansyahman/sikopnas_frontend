"use client";

import { BarChart3, MapPin, Building, Users2, UserCheck2, UserX } from "lucide-react";

export function StatistikTab({ statistik, usersList }) {
  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <SummaryCard
          title="Total Pegawai"
          value={statistik.total_pegawai || 0}
          icon={<Users2 className="w-6 h-6 text-blue-600" />}
          bgColor="from-blue-50 to-cyan-50"
        />
        <SummaryCard
          title="Aktif"
          value={statistik.aktif || 0}
          percentage={statistik.persen_aktif || 0}
          icon={<UserCheck2 className="w-6 h-6 text-emerald-600" />}
          bgColor="from-green-50 to-emerald-50"
          valueColor="text-emerald-600"
        />
        <SummaryCard
          title="Nonaktif"
          value={statistik.nonaktif || 0}
          percentage={statistik.persen_nonaktif || 0}
          icon={<UserX className="w-6 h-6 text-rose-600" />}
          bgColor="from-red-50 to-rose-50"
          valueColor="text-rose-600"
        />
      </div>

      {/* Detail Statistik */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DistribusiChart statistik={statistik} />
        <WilayahRekap statistik={statistik} />
      </div>
    </div>
  );
}

function SummaryCard({ title, value, percentage, icon, bgColor, valueColor = "text-gray-800" }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className={`text-2xl font-bold ${valueColor} mt-1`}>{value}</p>
          {percentage !== undefined && (
            <p className="text-sm text-gray-600 mt-1">{percentage}%</p>
          )}
        </div>
        <div className={`w-12 h-12 bg-gradient-to-br ${bgColor} rounded-xl flex items-center justify-center`}>
          {icon}
        </div>
      </div>
    </div>
  );
}

function DistribusiChart({ statistik }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <BarChart3 size={20} className="text-blue-500" />
          Distribusi Status Pegawai
        </h3>
      </div>
      
      <div className="space-y-6">
        <ProgressBar
          label="Aktif"
          value={statistik.aktif || 0}
          percentage={statistik.persen_aktif || 0}
          color="bg-emerald-500"
          dotColor="bg-emerald-500"
          textColor="text-emerald-600"
        />
        
        <ProgressBar
          label="Nonaktif"
          value={statistik.nonaktif || 0}
          percentage={statistik.persen_nonaktif || 0}
          color="bg-rose-500"
          dotColor="bg-rose-500"
          textColor="text-rose-600"
        />
      </div>
      
      <div className="mt-8 pt-6 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Total Data Pegawai</p>
            <p className="text-lg font-bold text-gray-900">{statistik.total_pegawai || 0} record</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProgressBar({ label, value, percentage, color, dotColor, textColor }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${dotColor}`}></div>
          <span className="text-sm text-gray-700">{label}</span>
        </div>
        <div className="text-right">
          <span className={`font-semibold ${textColor}`}>{percentage}%</span>
          <p className="text-xs text-gray-400">{value} pegawai</p>
        </div>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-3">
        <div 
          className={`${color} h-3 rounded-full transition-all duration-500`} 
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

function WilayahRekap({ statistik }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <MapPin size={20} className="text-blue-500" />
          Rekap per Wilayah
        </h3>
      </div>
      
      <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
        {statistik.wilayah && Object.keys(statistik.wilayah).length > 0 ? (
          Object.entries(statistik.wilayah).map(([wilayah, data]) => {
            const persenAktif = data.total > 0 ? Math.round((data.aktif / data.total) * 100) : 0;                            
            return (
              <WilayahItem
                key={wilayah}
                wilayah={wilayah}
                data={data}
                persenAktif={persenAktif}
              />
            );
          })
        ) : (
          <EmptyWilayah />
        )}
      </div>
      
      <Legend />
    </div>
  );
}

function WilayahItem({ wilayah, data, persenAktif }) {
  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
          <Building className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <span className="font-medium text-gray-900">{wilayah}</span>
          <p className="text-xs text-gray-500">{data.total} pegawai</p>
        </div>
      </div>
      <div className="text-right">
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-end gap-2">
            <span className="text-lg font-semibold text-emerald-600">{data.aktif}</span>
            <span className="text-xs text-gray-500">aktif</span>
          </div>
          <div className="flex items-center justify-end gap-2">
            <span className="text-sm font-medium text-rose-600">{data.nonaktif}</span>
            <span className="text-xs text-gray-500">nonaktif</span>
          </div>
          <p className="text-xs text-gray-500">{persenAktif}% aktif</p>
        </div>
      </div>
    </div>
  );
}

function EmptyWilayah() {
  return (
    <div className="text-center py-8">
      <div className="w-12 h-12 mx-auto mb-3 bg-gray-100 rounded-full flex items-center justify-center">
        <MapPin className="w-6 h-6 text-gray-400" />
      </div>
      <p className="text-gray-500">Tidak ada data wilayah</p>
    </div>
  );
}

function Legend() {
  return (
    <div className="mt-6 pt-4 border-t border-gray-200">
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
          <span className="text-gray-600">Aktif</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-rose-500"></div>
          <span className="text-gray-600">Nonaktif</span>
        </div>
      </div>
    </div>
  );
}