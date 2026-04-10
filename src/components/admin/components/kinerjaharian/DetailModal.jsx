"use client";

import { X, Ruler, PaintBucket, Image, FileOutput, Edit, Calendar, MapPin, User, Clock } from "lucide-react";

export function DetailModal({
  isOpen,
  onClose,
  kinerja,
  onDownload,
  onEdit,
  onOpenImage,
  formatDate = (date) => date || '-', // Default function jika tidak ada
  formatDateTime = (date) => date || '-', // Default function jika tidak ada
  getImageList
}) {
  if (!isOpen || !kinerja) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto border border-gray-200 shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-4 md:px-6 py-4 flex items-center justify-between">
          <div className="min-w-0">
            <h2 className="text-lg md:text-xl font-bold text-gray-900 truncate">Detail Laporan Kinerja</h2>
            <p className="text-sm text-blue-600 truncate">{kinerja.nama}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X size={20} className="text-gray-500 hover:text-gray-700" />
            </button>
          </div>
        </div>

        <div className="p-4 md:p-6">
          {/* Header Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
            <InfoCard
              items={[
                { 
                  icon: <Calendar size={16} />, 
                  label: "Tanggal Laporan", 
                  value: formatDate(kinerja.tanggal) 
                },
                { 
                  icon: <User size={16} />, 
                  label: "Pegawai", 
                  value: kinerja.nama,
                  subValue: kinerja.jabatan 
                },
                { 
                  icon: <MapPin size={16} />, 
                  label: "Wilayah Penugasan", 
                  value: kinerja.wilayah_penugasan 
                }
              ]}
            />

            <InfoCard
              items={[
                { 
                  icon: <Ruler size={16} />, 
                  label: "Ruas Jalan", 
                  value: kinerja.ruas_jalan 
                },
                { 
                  icon: <Clock size={16} />, 
                  label: "Dibuat", 
                  value: formatDateTime(kinerja.created_at) 
                }
              ]}
            />
          </div>

          {/* Kegiatan */}
          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <h4 className="font-semibold text-gray-900 mb-2">Kegiatan</h4>
            <p className="text-gray-800">{kinerja.kegiatan}</p>
          </div>

          {/* Pengukuran */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6">
            <MeasurementCard
              title="Panjang KR"
              value={kinerja.panjang_kr}
              color="amber"
              gradient="from-amber-50 to-orange-50"
            />
            <MeasurementCard
              title="Panjang KN"
              value={kinerja.panjang_kn}
              color="purple"
              gradient="from-purple-50 to-violet-50"
            />
          </div>

          {/* Warna Sket */}
          {kinerja.warna_sket && hasWarna(kinerja.warna_sket) && (
            <WarnaSketSection warnaSket={kinerja.warna_sket} />
          )}

          {/* Dokumentasi Gambar */}
          <ImageSection
            kinerja={kinerja}
            onOpenImage={onOpenImage}
            getImageList={getImageList}
          />

          {/* Action Buttons */}
          <ActionButtons
            onClose={onClose}
            onDownload={() => onDownload(kinerja)}
            onEdit={() => {
              onClose();
              onEdit(kinerja);
            }}
          />
        </div>
      </div>
    </div>
  );
}

// Sub-components
function InfoCard({ items }) {
  return (
    <div className="bg-gray-50 rounded-xl p-4 md:p-5">
      <div className="space-y-3">
        {items.map((item, index) => (
          <div key={index}>
            <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
              {item.icon}
              {item.label}
            </div>
            <p className="text-gray-900 font-medium">{item.value}</p>
            {item.subValue && (
              <p className="text-sm text-gray-600">{item.subValue}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function MeasurementCard({ title, value, color, gradient }) {
  const colorClasses = {
    amber: "text-amber-800 border-amber-200",
    purple: "text-purple-800 border-purple-200"
  };

  return (
    <div className={`bg-gradient-to-br ${gradient} rounded-xl p-4 md:p-5 border ${colorClasses[color]}`}>
      <h4 className={`font-semibold ${colorClasses[color]} mb-3 flex items-center gap-2`}>
        <Ruler size={18} />
        {title}
      </h4>
      <div className="text-center">
        <p className={`text-3xl md:text-4xl font-bold ${colorClasses[color]}`}>{value}</p>
        <p className={`text-sm ${colorClasses[color]} mt-2`}>Meter</p>
      </div>
    </div>
  );
}

function WarnaSketSection({ warnaSket }) {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-4 md:p-5 mb-6 border border-blue-200">
      <h4 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
        <PaintBucket size={18} />
        Warna Sket
      </h4>
      <div className="flex flex-wrap gap-4 justify-center">
        {warnaSket.warna1 && (
          <WarnaItem color={warnaSket.warna1} label="Warna 1" />
        )}
        {warnaSket.warna2 && (
          <WarnaItem color={warnaSket.warna2} label="Warna 2" />
        )}
        {warnaSket.warna3 && (
          <WarnaItem color={warnaSket.warna3} label="Warna 3" />
        )}
      </div>
    </div>
  );
}

function WarnaItem({ color, label }) {
  return (
    <div className="text-center">
      <div 
        className="w-12 h-12 md:w-16 md:h-16 rounded-xl border-2 border-blue-300 mx-auto shadow-sm"
        style={{ backgroundColor: color }}
      />
      <p className="text-sm text-blue-700 mt-2">{label}</p>
      <p className="text-xs text-blue-600 truncate max-w-[80px] md:max-w-none">{color}</p>
    </div>
  );
}

function ImageSection({ kinerja, onOpenImage, getImageList }) {
  const images = getImageList(kinerja);
  const hasImages = images.length > 0;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 md:p-5 mb-6">
      <h4 className="font-semibold text-gray-900 mb-4 md:mb-6 flex items-center gap-2">
        <Image size={18} />
        Dokumentasi Foto
      </h4>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {kinerja.sket_image && (
          <ImageItem
            src={kinerja.sket_image}
            title="Sket"
            subtitle="Gambar sket"
            index={images.indexOf(kinerja.sket_image)}
            onOpen={() => onOpenImage(kinerja.sket_image, images, images.indexOf(kinerja.sket_image))}
          />
        )}
        {kinerja.foto_0 && (
          <ImageItem
            src={kinerja.foto_0}
            title="Foto 0%"
            subtitle="Progress awal"
            index={images.indexOf(kinerja.foto_0)}
            onOpen={() => onOpenImage(kinerja.foto_0, images, images.indexOf(kinerja.foto_0))}
          />
        )}
        {kinerja.foto_50 && (
          <ImageItem
            src={kinerja.foto_50}
            title="Foto 50%"
            subtitle="Progress setengah"
            index={images.indexOf(kinerja.foto_50)}
            onOpen={() => onOpenImage(kinerja.foto_50, images, images.indexOf(kinerja.foto_50))}
          />
        )}
        {kinerja.foto_100 && (
          <ImageItem
            src={kinerja.foto_100}
            title="Foto 100%"
            subtitle="Progress selesai"
            index={images.indexOf(kinerja.foto_100)}
            onOpen={() => onOpenImage(kinerja.foto_100, images, images.indexOf(kinerja.foto_100))}
          />
        )}
      </div>

      {!hasImages && (
        <div className="text-center py-8">
          <div className="w-16 h-16 mx-auto mb-3 bg-gray-100 rounded-full flex items-center justify-center">
            <Image className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-500">Tidak ada dokumentasi foto</p>
        </div>
      )}
    </div>
  );
}

function ImageItem({ src, title, subtitle, onOpen }) {
  return (
    <div className="bg-gray-50 rounded-lg border border-gray-200 p-3 md:p-4 hover:border-blue-300 transition-colors">
      <div className="relative cursor-pointer" onClick={onOpen}>
        <img 
          src={src} 
          alt={title} 
          className="w-full h-32 md:h-40 object-cover rounded-lg mb-3 hover:opacity-90 transition-opacity"
        />
      </div>
      <div className="flex items-center justify-between">
        <div className="min-w-0">
          <p className="font-medium text-gray-900 truncate">{title}</p>
          <p className="text-xs text-gray-500">{subtitle}</p>
        </div>
      </div>
    </div>
  );
}

function ActionButtons({ onClose, onDownload, onEdit }) {
  return (
    <div className="flex flex-wrap justify-end gap-2 md:gap-3 pt-4 md:pt-6 border-t border-gray-200">
      <button
        onClick={onClose}
        className="px-4 md:px-5 py-2.5 bg-gray-100 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-200 flex-1 md:flex-none"
      >
        Tutup
      </button>
    </div>
  );
}

function hasWarna(warnaSket) {
  return warnaSket.warna1 || warnaSket.warna2 || warnaSket.warna3;
}