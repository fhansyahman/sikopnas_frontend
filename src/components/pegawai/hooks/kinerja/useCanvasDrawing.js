"use client";

import { useState, useEffect, useRef, useCallback } from "react";

export function useCanvasDrawing() {
  const canvasRef = useRef(null);
  const [selectedArea, setSelectedArea] = useState(null);
  const [color, setColor] = useState("#3b82f6");
  const [currentColors, setCurrentColors] = useState([
    "#ffffff", "#ffffff", "#ffffff", "#ffffff", "#ffffff"
  ]);

  const sections = [
    { height: 25, label: "Bahu Atas" },
    { height: 25, label: "Lap Atas" },
    { height: 80, label: "Badan Jalan" },
    { height: 25, label: "Lap Bawah" },
    { height: 25, label: "Bahu Bawah" },
  ];

  const drawTemplate = useCallback((forceRedraw = false) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const isMobile = window.innerWidth < 768;
    const canvasWidth = isMobile ? 320 : 480;
    const canvasHeight = isMobile ? 200 : 220;
    
    if (canvas.width !== canvasWidth || canvas.height !== canvasHeight || forceRedraw) {
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;
    }

    const startX = 10;
    const startY = 10;
    const width = canvasWidth - 20;
    const totalHeight = sections.reduce((sum, s) => sum + s.height, 0);

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    
    // Background
    ctx.fillStyle = "#f8fafc";
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    
    // Border utama
    ctx.strokeStyle = "#334155";
    ctx.lineWidth = 2;
    ctx.strokeRect(startX, startY, width, totalHeight);

    // Gambar sections dengan warna yang bisa diubah
    let y = startY;
    for (let i = 0; i < sections.length; i++) {
      const h = sections[i].height;
      
      // Fill warna section dari currentColors
      ctx.fillStyle = currentColors[i];
      ctx.fillRect(startX, y, width, h);
      
      // Border section
      ctx.strokeStyle = "#64748b";
      ctx.lineWidth = 1;
      ctx.strokeRect(startX, y, width, h);
      
      // Label
      if (h >= 25) {
        ctx.fillStyle = "#334155";
        ctx.font = isMobile ? "8px system-ui" : "10px system-ui";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(sections[i].label, startX + width/2, y + h/2);
      }
      
      y += h;
    }
  }, [currentColors, sections]);

  const handleCanvasClick = useCallback((e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const y = e.clientY - rect.top - 10; // kurangi startY
    
    let accumulatedHeight = 0;
    for (let i = 0; i < sections.length; i++) {
      accumulatedHeight += sections[i].height;
      if (y < accumulatedHeight) {
        setSelectedArea(i);
        return;
      }
    }
    setSelectedArea(null);
  }, [sections]);

  const handleColorApply = useCallback(() => {
    if (selectedArea === null) return;
    
    const newColors = [...currentColors];
    newColors[selectedArea] = color;
    setCurrentColors(newColors);
  }, [selectedArea, color, currentColors]);

  const handleResetColors = useCallback(() => {
    setCurrentColors(["#ffffff", "#ffffff", "#ffffff", "#ffffff", "#ffffff"]);
    setSelectedArea(null);
  }, []);

  const getSketImage = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return "";
    drawTemplate(); // Pastikan canvas ter-update
    return canvas.toDataURL("image/png");
  }, [drawTemplate]);

  useEffect(() => {
    const timer = setTimeout(() => {
      drawTemplate(true);
    }, 100);
    return () => clearTimeout(timer);
  }, [drawTemplate]);

  useEffect(() => {
    drawTemplate();
  }, [currentColors, drawTemplate]);

  useEffect(() => {
    const handleResize = () => {
      drawTemplate(true);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [drawTemplate]);

  return {
    canvasRef,
    selectedArea,
    color,
    currentColors,
    sections,
    setColor,
    handleCanvasClick,
    handleColorApply,
    handleResetColors,
    getSketImage
  };
}