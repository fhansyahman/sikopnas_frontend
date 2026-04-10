"use client";

import { Palette } from "lucide-react";

export function SketJalanCanvas({
  canvasRef,
  selectedArea,
  color,
  sections,
  currentColors,
  onCanvasClick,
  onColorChange,
  onColorApply,
  onResetColors
}) {
  return (
    <div className="border border-slate-200 rounded-lg p-4 bg-slate-50/50">
      <label className="block text-sm font-medium text-slate-700 mb-3 flex items-center space-x-2">
        <Palette className="w-4 h-4" />
        <span>Denah Pekerjaan Jalan</span>
      </label>

      <div className="flex flex-col md:flex-row items-center gap-4">
        <div className="border border-slate-300 rounded bg-white p-3 shadow-sm overflow-auto max-w-full">
          <canvas
            ref={canvasRef}
            className="cursor-pointer rounded max-w-full border border-slate-200"
            onClick={onCanvasClick}
            style={{
              maxWidth: '100%',
              height: 'auto',
              display: 'block'
            }}
          />
        </div>
        
        <div className="flex flex-col gap-3 w-full md:max-w-[200px]">
          <div>
            <label className="text-sm font-medium text-slate-600 mb-2 block">
              Pilih Warna
            </label>
            <input
              type="color"
              value={color}
              onChange={(e) => onColorChange(e.target.value)}
              className="w-full h-10 rounded border border-slate-300 cursor-pointer"
            />
          </div>
          
          <button
            type="button"
            onClick={onColorApply}
            disabled={selectedArea === null}
            className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Terapkan Warna
          </button>

          <button
            type="button"
            onClick={onResetColors}
            className="px-4 py-2 bg-slate-600 text-white text-sm rounded-lg hover:bg-slate-700 transition-colors font-medium"
          >
            Reset Warna
          </button>
          
          {selectedArea !== null && (
            <div className="text-sm text-slate-600 p-3 bg-white rounded border border-slate-200">
              <p className="font-medium">Area Terpilih:</p>
              <p>{sections[selectedArea].label}</p>
            </div>
          )}
        </div>
      </div>
      
      <div className="mt-3 text-center">
        <p className="text-sm text-slate-600">
          Klik pada area denah untuk memilih, lalu pilih warna dan terapkan
        </p>
      </div>
    </div>
  );
}