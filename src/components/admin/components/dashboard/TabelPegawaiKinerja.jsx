"use client";

import { Download } from "lucide-react";
import { formatNumber } from "../../utils/dashboard/formatters";
import { getStatusLabelKinerja, getStatusColorKinerja, getStatusIconKinerja } from "../../utils/dashboard/chartHelpers";

export function TabelPegawaiKinerja({ chartData, onExport }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm text-black">
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Detail Data Pegawai</h3>
            <p className="text-sm text-gray-600">Rincian kinerja per pegawai untuk bulan ini</p>
          </div>
          <button
            onClick={onExport}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-lg hover:from-emerald-600 hover:to-green-700 transition-all shadow-sm"
          >
            <Download size={16} />
            <span>Export Data</span>
          </button>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="py-3 px-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Pegawai</th>
              <th className="py-3 px-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Wilayah</th>
              <th className="py-3 px-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">Total KR</th>
              <th className="py-3 px-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">Total KN</th>
              <th className="py-3 px-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">Target KR</th>
              <th className="py-3 px-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">Target KN</th>
              <th className="py-3 px-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">Pencapaian KR</th>
              <th className="py-3 px-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">Pencapaian KN</th>
              <th className="py-3 px-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {chartData.labels.map((label, index) => {
              const pegawaiData = chartData.pegawaiData[label];
              return (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4">
                    <p className="font-medium text-gray-900">{label}</p>
                  </td>
                  <td className="py-3 px-4">
                    <p className="text-sm text-gray-600">{pegawaiData?.data?.wilayah_penugasan || '-'}</p>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className="font-semibold text-emerald-600">
                      {formatNumber(chartData.totalKR[index] || 0)}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span className="font-semibold text-purple-600">
                      {formatNumber(chartData.totalKN[index] || 0)}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right text-gray-600">
                    {formatNumber(chartData.targetKR[index] || 0)}
                  </td>
                  <td className="py-3 px-4 text-right text-gray-600">
                    {formatNumber(chartData.targetKN[index] || 0)}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <span className="font-medium text-gray-900">
                        {chartData.pencapaianKR?.[index]?.toFixed(1) || 0}%
                      </span>
                      <div className="w-16 bg-gray-200 rounded-full h-1.5">
                        <div 
                          className={`h-1.5 rounded-full ${
                            chartData.pencapaianKR?.[index] >= 100 ? 'bg-emerald-500' :
                            chartData.pencapaianKR?.[index] >= 80 ? 'bg-green-500' :
                            chartData.pencapaianKR?.[index] >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${Math.min(chartData.pencapaianKR?.[index] || 0, 100)}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <span className="font-medium text-gray-900">
                        {chartData.pencapaianKN?.[index]?.toFixed(1) || 0}%
                      </span>
                      <div className="w-16 bg-gray-200 rounded-full h-1.5">
                        <div 
                          className={`h-1.5 rounded-full ${
                            chartData.pencapaianKN?.[index] >= 100 ? 'bg-emerald-500' :
                            chartData.pencapaianKN?.[index] >= 80 ? 'bg-green-500' :
                            chartData.pencapaianKN?.[index] >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${Math.min(chartData.pencapaianKN?.[index] || 0, 100)}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <div className={`px-2 py-1 rounded-full text-xs font-medium inline-flex items-center gap-1 ${
                      getStatusColorKinerja(chartData.status?.[index])
                    }`}>
                      {getStatusIconKinerja(chartData.status?.[index])}
                      {getStatusLabelKinerja(chartData.status?.[index])}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}