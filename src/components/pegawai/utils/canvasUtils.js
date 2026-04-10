export function drawTemplate(canvas, sections, currentColors) {
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const isMobile = window.innerWidth < 768;
  const canvasWidth = isMobile ? 320 : 480;
  const canvasHeight = isMobile ? 200 : 220;
  
  if (canvas.width !== canvasWidth || canvas.height !== canvasHeight) {
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
}