"use client";

import { useState, useEffect } from "react";
import { Layout } from "./components/dashboard/Layout";
import { MonitoringTab } from "./components/dashboard/MonitoringTab";
import { PresensiTab } from "./components/dashboard/PresensiTab";
import { KinerjaTab } from "./components/dashboard/KinerjaTab";
import { MapPresensiTab } from "./hooks/dashboard/MapPresensiTab";
import { usePresensiData } from "./hooks/dashboard/usePresensiData";
import { useKinerjaData } from "./hooks/dashboard/useKinerjaData";
import { useMonitoringData } from "./hooks/dashboard/useMonitoringData";
import { useSidebar } from "./hooks/dashboard/useSidebar";
import { LoadingSpinner } from "./components/dashboard/LoadingSpinner";

export default function DashboardGrafikPage() {
  const [activeTab, setActiveTab] = useState('monitoring');
  const [loading, setLoading] = useState(true);
  
  const { sidebarOpen, setSidebarOpen, sidebarMenu } = useSidebar(setActiveTab);
  
  const presensi = usePresensiData();
  const kinerja = useKinerjaData();
  const monitoring = useMonitoringData();

  // Load all data on tab change
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        if (activeTab === 'presensi') {
          await presensi.loadPresensiData();
        } else if (activeTab === 'kinerja') {
          await kinerja.processKinerjaChartData();
        } else if (activeTab === 'monitoring') {
          await monitoring.fetchMonitoringData(monitoring.selectedDate);
        } else if (activeTab === 'map') {
          // Untuk map, data akan di-load oleh komponen MapPresensiTab sendiri
          setLoading(false);
        }
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        if (activeTab !== 'map') {
          setLoading(false);
        }
      }
    };

    loadData();
  }, [activeTab]);

  const renderContent = () => {
    if (loading && activeTab !== 'map') {
      return (
        <div className="h-96 flex items-center justify-center">
          <LoadingSpinner size="lg" text="Memuat data..." />
        </div>
      );
    }

    switch (activeTab) {
      case 'presensi':
        return <PresensiTab {...presensi} />;
      case 'kinerja':
        return <KinerjaTab {...kinerja} />;
      case 'monitoring':
        return <MonitoringTab {...monitoring} />;
      case 'map':
        return (
          <MapPresensiTab 
            selectedDate={monitoring.selectedDate}
            onDateChange={monitoring.handleDateChange}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Layout
      sidebarOpen={sidebarOpen}
      setSidebarOpen={setSidebarOpen}
      sidebarMenu={sidebarMenu}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
    >
      {renderContent()}
    </Layout>
  );
}