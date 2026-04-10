"use client";

import { useCallback } from "react";

export function useImageHandler() {
  const downloadImage = useCallback((url, filename) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, []);

  const getFilenameFromUrl = useCallback((url) => {
    if (!url) return "gambar.jpg";
    if (url.startsWith("data:image")) {
      return `gambar-${Date.now()}.png`;
    }
    return url.split("/").pop() || `gambar-${Date.now()}.jpg`;
  }, []);

  return {
    downloadImage,
    getFilenameFromUrl
  };
}