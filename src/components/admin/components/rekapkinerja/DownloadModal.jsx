'use client';

import { ModalWrapper } from "./ModalWrapper";
import LaporanGenerator from '../../components/LaporanGenerator';
import LaporanGeneratorRekap from '../../components/LaporanGeneratorRekap';

export function DownloadModal({ isOpen, onClose, type, data, wilayah, tanggal, formatDateShort }) {
  const getTitle = () => {
    if (type === 'rekap') {
      return `Download Rekap Wilayah ${wilayah || 'Semua'}`;
    }
    return 'Download PDF Perorangan';
  };

  const getSubtitle = () => {
    if (type === 'rekap') {
      return `Tanggal: ${formatDateShort(tanggal)} • ${data.length} data`;
    }
    return `${data?.nama} • ${formatDateShort(data?.tanggal)}`;
  };

  return (
    <ModalWrapper
      isOpen={isOpen}
      onClose={onClose}
      title={getTitle()}
      subtitle={getSubtitle()}
    >
      {type === 'rekap' ? (
        <LaporanGeneratorRekap
          data={data}
          wilayah={wilayah || 'Semua Wilayah'}
          tanggal={tanggal}
          isLoading={false}
        />
      ) : (
        <LaporanGenerator
          data={data}
          isLoading={false}
        />
      )}
    </ModalWrapper>
  );
}