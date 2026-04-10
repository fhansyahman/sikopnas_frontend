"use client";

import { useState,useEffect  } from "react";
import { Sidebar } from "./components/pembagianwilayah/Sidebar";
import { Header } from "./components/pembagianwilayah/Header";
import { MobileOverlay } from "./components/pembagianwilayah/MobileOverlay";
import { StatCards } from "./components/pembagianwilayah/StatCards";
import { ActionBar } from "./components/pembagianwilayah/ActionBar";
import { TabNavigation } from "./components/pembagianwilayah/TabNavigation";
import { WilayahTab } from "./components/pembagianwilayah/WilayahTab";
import { AssignmentTab } from "./components/pembagianwilayah/AssignmentTab";
import { StatisticsTab } from "./components/pembagianwilayah/StatisticsTab";
import { WilayahModal } from "./components/pembagianwilayah/WilayahModal";
import { AssignModal } from "./components/pembagianwilayah/AssignModal";
import { UsersModal } from "./components/pembagianwilayah/UsersModal";
import { LoadingState } from "./components/pembagianwilayah/LoadingState";
import { useWilayahData } from "./hooks/pembagianwilayah/useWilayahData";
import { useUsersData } from "./hooks/pembagianwilayah/useUsersData";
import { useStatsData } from "./hooks/pembagianwilayah/useStatsData";
import { useSidebar } from "./hooks/pembagianwilayah/useSidebar";

export default function ManajemenWilayah() {
  const [activeTab, setActiveTab] = useState('wilayah');
  const [search, setSearch] = useState("");
  const [showFormModal, setShowFormModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showUsersModal, setShowUsersModal] = useState(false);
  const [selectedWilayah, setSelectedWilayah] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isEdit, setIsEdit] = useState(false);

  const { sidebarOpen, setSidebarOpen, handleLogout } = useSidebar();
  
  // Initialize hooks
  const wilayahHook = useWilayahData();
  const usersHook = useUsersData();
  const statsHook = useStatsData();

  // Load stats when tab changes
  useEffect(() => {
    if (activeTab === 'stats') {
      statsHook.loadWilayahStats();
    }
  }, [activeTab]);

  const isLoading = wilayahHook.loading || usersHook.loading || statsHook.loading;
  
  const filteredWilayah = wilayahHook.wilayahList.filter((wilayah) =>
    wilayah.nama_wilayah?.toLowerCase().includes(search.toLowerCase()) ||
    wilayah.keterangan?.toLowerCase().includes(search.toLowerCase())
  );

  const filteredUsers = usersHook.usersList.filter((user) =>
    user.nama?.toLowerCase().includes(search.toLowerCase()) ||
    user.jabatan?.toLowerCase().includes(search.toLowerCase()) ||
    user.wilayah_penugasan?.toLowerCase().includes(search.toLowerCase())
  );

  const handleRefresh = () => {
    if (activeTab === 'wilayah') wilayahHook.loadWilayahData();
    else if (activeTab === 'assignment') usersHook.loadUsersData();
    else statsHook.loadWilayahStats();
  };

  const handleFormSubmit = async (e) => {
    const success = await wilayahHook.handleSubmit(
      e, 
      wilayahHook.formData, 
      isEdit, 
      selectedWilayah,
      () => {
        setShowFormModal(false);
        wilayahHook.resetForm(wilayahHook.setFormData);
        wilayahHook.loadWilayahData();
      }
    );
  };

  const handleAssignSubmit = async (e) => {
    const success = await usersHook.handleAssign(
      e,
      selectedUser,
      usersHook.assignmentData,
      () => {
        setShowAssignModal(false);
        usersHook.resetAssignmentForm(usersHook.setAssignmentData);
        usersHook.loadUsersData();
        statsHook.loadWilayahStats();
      }
    );
  };

  if (isLoading && wilayahHook.wilayahList.length === 0) {
    return <LoadingState />;
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <MobileOverlay sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
        <Header 
          sidebarOpen={sidebarOpen} 
          setSidebarOpen={setSidebarOpen} 
          handleLogout={handleLogout}
        />

        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          <StatCards 
            wilayahList={wilayahHook.wilayahList}
            usersList={usersHook.usersList}
            wilayahStats={statsHook.wilayahStats}
          />

          <ActionBar
            search={search}
            setSearch={setSearch}
            activeTab={activeTab}
            onRefresh={handleRefresh}
            onAddWilayah={() => {
              wilayahHook.resetForm(wilayahHook.setFormData);
              setShowFormModal(true);
            }}
          />

          <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab}>
            {activeTab === 'wilayah' && (
              <WilayahTab
                filteredWilayah={filteredWilayah}
                search={search}
                onEdit={(wilayah) => wilayahHook.handleEdit(
                  wilayah, 
                  wilayahHook.setFormData, 
                  setIsEdit, 
                  setSelectedWilayah, 
                  setShowFormModal
                )}
                onDelete={(id, nama) => wilayahHook.handleDelete(
                  id, 
                  nama, 
                  () => {
                    wilayahHook.loadWilayahData();
                    statsHook.loadWilayahStats();
                  }
                )}
                onViewUsers={(wilayah) => wilayahHook.handleViewUsers(
                  wilayah, 
                  setSelectedWilayah, 
                  setShowUsersModal
                )}
              />
            )}

            {activeTab === 'assignment' && (
              <AssignmentTab
                filteredUsers={filteredUsers}
                search={search}
                onAssignClick={(user) => usersHook.handleAssignClick(
                  user, 
                  setSelectedUser, 
                  usersHook.setAssignmentData, 
                  setShowAssignModal
                )}
                onRemoveAssignment={(user) => usersHook.handleRemoveAssignment(
                  user, 
                  () => {
                    usersHook.loadUsersData();
                    statsHook.loadWilayahStats();
                  }
                )}
              />
            )}

            {activeTab === 'stats' && (
              <StatisticsTab
                wilayahList={wilayahHook.wilayahList}
                usersList={usersHook.usersList}
                wilayahStats={statsHook.wilayahStats}
              />
            )}
          </TabNavigation>
        </main>
      </div>

      <WilayahModal
        isOpen={showFormModal}
        onClose={() => {
          setShowFormModal(false);
          wilayahHook.resetForm(wilayahHook.setFormData);
          setIsEdit(false);
          setSelectedWilayah(null);
        }}
        formData={wilayahHook.formData}
        setFormData={wilayahHook.setFormData}
        onSubmit={handleFormSubmit}
        isEdit={isEdit}
      />

      <AssignModal
        isOpen={showAssignModal}
        onClose={() => {
          setShowAssignModal(false);
          usersHook.resetAssignmentForm(usersHook.setAssignmentData);
          setSelectedUser(null);
        }}
        selectedUser={selectedUser}
        assignmentData={usersHook.assignmentData}
        setAssignmentData={usersHook.setAssignmentData}
        wilayahList={wilayahHook.wilayahList}
        onSubmit={handleAssignSubmit}
      />

      <UsersModal
        isOpen={showUsersModal}
        onClose={() => setShowUsersModal(false)}
        selectedWilayah={selectedWilayah}
      />
    </div>
  );
}