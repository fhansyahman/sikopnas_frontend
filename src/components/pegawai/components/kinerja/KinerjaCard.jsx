"use client";

import { Calendar, BarChart3, Edit, Trash2, Palette } from "lucide-react";

export function KinerjaCard({ item, onEdit, onDelete, onImageClick, formatDate }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 hover:shadow-sm transition-shadow group">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
        <div className="flex space-x-4 flex-1">
          <div className="bg-green-100 p-3 rounded-lg flex-shrink-0">
            <BarChart3 className="text-green-600 w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-2">
              <div>
                <h3 className="font-semibold text-slate-800 text-lg mb-1">
                  {item.ruas_jalan}
                </h3>
                <div className="flex flex-wrap gap-2 mb-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    <Calendar className="w-3 h-3 mr-1" />
                    {formatDate(item.tanggal)}
                  </span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {item.kegiatan}
                  </span>
                  {item.sket_image && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                      <Palette className="w-3 h-3 mr-1" />
                      Ada Denah
                    </span>
                  )}
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex gap-4 text-sm text-slate-600">
                <div>
                  <span className="font-medium">Panjang KR:</span> {item.panjang_kr}
                </div>
                <div>
                  <span className="font-medium">Panjang KN:</span> {item.panjang_kn}
                </div>
              </div>
            </div>

            {/* Gambar Preview */}
            <div className="flex justify-between items-center mt-3">
              {/* Denah Jalan */}
              {item.sket_image && (
                <ImagePreview
                  src={item.sket_image}
                  label="Denah Jalan"
                  onClick={() => onImageClick(item.sket_image)}
                />
              )}

              {/* Foto Progress */}
              <div className="flex space-x-3">
                <ProgressImages
                  images={[
                    { img: item.foto_0, label: "0%" },
                    { img: item.foto_50, label: "50%" },
                    { img: item.foto_100, label: "100%" }
                  ]}
                  onImageClick={onImageClick}
                />
              </div>
            </div>
          </div>
        </div>
        
        <ActionButtons
          onEdit={onEdit}
          onDelete={onDelete}
        />
      </div>
    </div>
  );
}

function ImagePreview({ src, label, onClick }) {
  return (
    <div className="flex flex-col items-center space-y-1">
      <img
        src={src}
        alt={label}
        className="w-12 h-12 object-contain border rounded cursor-pointer hover:opacity-80"
        onClick={onClick}
      />
      <span className="text-[10px] text-slate-500">{label}</span>
    </div>
  );
}

function ProgressImages({ images, onImageClick }) {
  return (
    <>
      {images.map(({ img, label }) => (
        img && (
          <div key={label} className="flex flex-col items-center space-y-1">
            <img
              src={img}
              alt={`Progress ${label}`}
              className="w-12 h-12 object-cover border rounded cursor-pointer hover:opacity-80"
              onClick={() => onImageClick(img)}
            />
            <span className="text-[10px] text-slate-500">{label}</span>
          </div>
        )
      ))}
    </>
  );
}

function ActionButtons({ onEdit, onDelete }) {
  return (
    <div className="flex space-x-3 mt-3 sm:mt-0 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
      <button
        onClick={onEdit}
        className="flex items-center text-blue-600 text-sm hover:text-blue-700 transition-colors p-1"
        title="Edit kinerja"
      >
        <Edit className="w-4 h-4" />
      </button>
      <button
        onClick={onDelete}
        className="flex items-center text-red-600 text-sm hover:text-red-700 transition-colors p-1"
        title="Hapus kinerja"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}