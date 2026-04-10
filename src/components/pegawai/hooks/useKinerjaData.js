import { useState, useEffect, useRef } from "react";
import { kinerjaAPI } from "@/lib/api";
import { 
  daftarKegiatan, 
  sections, 
  calculateStats, 
  extractAvailableYears, 
  formatDate as formatDateUtil 
} from "../utils/kinerjaUtils";
import { drawTemplate } from "../utils/canvasUtils";

export function useKinerjaData(setSelectedImage, setImageModalOpen) {
  const [form, setForm] = useState({
    tanggal: new Date().toISOString().split('T')[0],
    ruas_jalan: "",
    kegiatan: "",
    panjang_kr: "",
    panjang_kn: "",
    sket_image: "",
    foto_0: "",
    foto_50: "",
    foto_100: ""
  });
  const [loading, setLoading] = useState(false);
  const [kinerjaList, setKinerjaList] = useState([]);
  const [filteredKinerja, setFilteredKinerja] = useState([]);
  const [editId, setEditId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMonth, setSelectedMonth] = useState((new Date().getMonth() + 1).toString());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
  const [availableYears, setAvailableYears] = useState([]);
  const [stats, setStats] = useState({
    total_laporan: 0,
    total_panjang: 0,
    avg_panjang: 0
  });
  const [error, setError] = useState("");
  const [preview, setPreview] = useState({
    foto_0: null,
    foto_50: null,
    foto_100: null
  });
  const [selectedArea, setSelectedArea] = useState(null);
  const [color, setColor] = useState("#3b82f6");
  const [currentColors, setCurrentColors] = useState([
    "#ffffff", "#ffffff", "#ffffff", "#ffffff", "#ffffff"
  ]);

  const canvasRef = useRef(null);

  // Initialize canvas
  useEffect(() => {
    const initCanvas = () => {
      if (canvasRef.current) {
        drawTemplate(canvasRef.current, sections, currentColors);
      }
    };
    initCanvas();
  }, [currentColors]);

  // Filter data based on search term
  useEffect(() => {
    const filtered = kinerjaList.filter(kinerja => {
      return kinerja.ruas_jalan?.toLowerCase().includes(searchTerm.toLowerCase()) ||
             kinerja.kegiatan?.toLowerCase().includes(searchTerm.toLowerCase());
    });
    setFilteredKinerja(filtered);
  }, [searchTerm, kinerjaList]);

  const loadKinerja = async () => {
    try {
      setLoading(true);
      setError("");
      
      const response = await kinerjaAPI.getMyKinerja({
        bulan: selectedMonth,
        tahun: selectedYear
      });
      
      if (response.data.success) {
        const data = response.data.data || [];
        setKinerjaList(data);
        calculateStats(data, setStats);
        extractAvailableYears(data, setAvailableYears, selectedYear, setSelectedYear);
      } else {
        throw new Error(response.data.message || 'Gagal memuat data kinerja');
      }
    } catch (error) {
      let errorMessage = 'Gagal memuat data kinerja';
      
      if (error.response?.status === 500) {
        errorMessage = 'Server error: Terjadi masalah pada server. Silakan coba lagi.';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const url = event.target?.result;
        setForm(prev => ({ ...prev, [name]: url }));
        setPreview(prev => ({ ...prev, [name]: url }));
      };
      reader.readAsDataURL(files[0]);
    }
  };

  const clearPhoto = (photoKey) => {
    setForm(prev => ({ ...prev, [photoKey]: "" }));
    setPreview(prev => ({ ...prev, [photoKey]: null }));

    const fileInput = document.getElementById(photoKey);
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const resetForm = () => {
    setForm({
      tanggal: new Date().toISOString().split('T')[0],
      ruas_jalan: "",
      kegiatan: "",
      panjang_kr: "",
      panjang_kn: "",
      sket_image: "",
      foto_0: "",
      foto_50: "",
      foto_100: ""
    });
    setPreview({ foto_0: null, foto_50: null, foto_100: null });
    setEditId(null);
    setSelectedArea(null);
    setColor("#3b82f6");
    setCurrentColors(["#ffffff", "#ffffff", "#ffffff", "#ffffff", "#ffffff"]);
    setError("");

    const fileInputs = document.querySelectorAll('input[type="file"]');
    fileInputs.forEach(input => {
      input.value = '';
    });

    if (canvasRef.current) {
      drawTemplate(canvasRef.current, sections, currentColors);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.tanggal || !form.ruas_jalan || !form.kegiatan || !form.panjang_kr || !form.panjang_kn) {
      setError("Harap isi semua field yang wajib!");
      return;
    }

    if (isNaN(form.panjang_kr) || isNaN(form.panjang_kn)) {
      setError("Panjang KR dan KN harus berupa angka!");
      return;
    }

    try {
      setLoading(true);
      
      let sketImage = "";
      if (canvasRef.current) {
        drawTemplate(canvasRef.current, sections, currentColors);
        sketImage = canvasRef.current.toDataURL("image/png");
      }

      const requestBody = {
        tanggal: form.tanggal,
        ruas_jalan: form.ruas_jalan,
        kegiatan: form.kegiatan,
        panjang_kr: parseFloat(form.panjang_kr),
        panjang_kn: parseFloat(form.panjang_kn),
        sket_image: sketImage || form.sket_image,
        foto_0: form.foto_0 || null,
        foto_50: form.foto_50 || null,
        foto_100: form.foto_100 || null
      };

      let response;
      if (editId !== null) {
        response = await kinerjaAPI.update(editId, requestBody);
      } else {
        response = await kinerjaAPI.create(requestBody);
      }

      if (response.data.success) {
        const successMessage = editId !== null ? "Data kinerja berhasil diperbarui!" : "Laporan kinerja berhasil disimpan!";
        alert(successMessage);
        resetForm();
        await loadKinerja();
      } else {
        throw new Error(response.data.message || 'Gagal menyimpan data');
      }
      
    } catch (error) {
      let errorMessage = 'Gagal menyimpan laporan kinerja';
      
      if (error.response?.status === 500) {
        errorMessage = 'Server error: Terjadi masalah pada server. Silakan coba lagi.';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (id) => {
    const item = kinerjaList.find(kinerja => kinerja.id === id);
    if (item) {
      const originalDate = item.tanggal;
      
      setForm({
        tanggal: originalDate,
        ruas_jalan: item.ruas_jalan,
        kegiatan: item.kegiatan,
        panjang_kr: item.panjang_kr?.toString().replace(' meter', '') || "",
        panjang_kn: item.panjang_kn?.toString().replace(' meter', '') || "",
        sket_image: item.sket_image || "",
        foto_0: item.foto_0 || "",
        foto_50: item.foto_50 || "",
        foto_100: item.foto_100 || ""
      });
      
      setPreview({
        foto_0: item.foto_0 || null,
        foto_50: item.foto_50 || null,
        foto_100: item.foto_100 || null,
      });
      
      setEditId(id);
      
      setCurrentColors(["#ffffff", "#ffffff", "#ffffff", "#ffffff", "#ffffff"]);
      setSelectedArea(null);
      setColor("#3b82f6");
      
      setTimeout(() => {
        if (canvasRef.current) {
          drawTemplate(canvasRef.current, sections, currentColors);
        }
      }, 200);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Yakin ingin menghapus laporan kinerja ini?")) return;

    try {
      setLoading(true);
      const response = await kinerjaAPI.delete(id);

      if (response.data.success) {
        await loadKinerja();
        alert('Laporan kinerja berhasil dihapus');
      } else {
        throw new Error(response.data.message || 'Gagal menghapus data');
      }
    } catch (error) {
      let errorMessage = 'Gagal menghapus laporan kinerja';
      
      if (error.response?.status === 500) {
        errorMessage = 'Server error: Terjadi masalah pada server. Silakan coba lagi.';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const openImageModal = (imageUrl) => {
    setSelectedImage(imageUrl);
    setImageModalOpen(true);
  };

  const closeImageModal = () => {
    setImageModalOpen(false);
    setSelectedImage(null);
  };

  const handleCanvasClick = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const y = e.clientY - rect.top - 10;
    
    let accumulatedHeight = 0;
    for (let i = 0; i < sections.length; i++) {
      accumulatedHeight += sections[i].height;
      if (y < accumulatedHeight) {
        setSelectedArea(i);
        return;
      }
    }
    setSelectedArea(null);
  };

  const handleColorApply = () => {
    if (selectedArea === null) return;
    const newColors = [...currentColors];
    newColors[selectedArea] = color;
    setCurrentColors(newColors);
  };

  const handleResetColors = () => {
    setCurrentColors(["#ffffff", "#ffffff", "#ffffff", "#ffffff", "#ffffff"]);
    setSelectedArea(null);
  };

  const downloadImage = (url, filename) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getFilenameFromUrl = (url) => {
    if (!url) return "gambar.jpg";
    if (url.startsWith("data:image")) {
      return `gambar-${Date.now()}.png`;
    }
    return url.split("/").pop() || `gambar-${Date.now()}.jpg`;
  };

  const formatDate = formatDateUtil;

  return {
    form,
    setForm,
    loading,
    kinerjaList,
    filteredKinerja,
    stats,
    editId,
    searchTerm,
    selectedMonth,
    selectedYear,
    availableYears,
    error,
    preview,
    selectedArea,
    color,
    currentColors,
    canvasRef,
    daftarKegiatan,
    sections,
    setEditId,
    setSearchTerm,
    setSelectedMonth,
    setSelectedYear,
    setError,
    setSelectedArea,
    setColor,
    setCurrentColors,
    setPreview,
    loadKinerja,
    handleFormChange,
    handleFileChange,
    clearPhoto,
    resetForm,
    handleSubmit,
    handleEdit,
    handleDelete,
    openImageModal,
    closeImageModal,
    downloadImage,
    getFilenameFromUrl,
    formatDate,
    handleCanvasClick,
    handleColorApply,
    handleResetColors
  };
}