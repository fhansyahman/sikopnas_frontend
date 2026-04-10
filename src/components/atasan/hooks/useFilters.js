"use client";

import { useState, useMemo } from "react";

export function useFilters(users) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("semua");
  const [roleFilter, setRoleFilter] = useState("semua");

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch = user.nama?.toLowerCase().includes(search.toLowerCase()) ||
                           user.username?.toLowerCase().includes(search.toLowerCase()) ||
                           user.no_hp?.includes(search);
      
      const matchesStatus = statusFilter === "semua" || 
                           (statusFilter === "aktif" && user.is_active) ||
                           (statusFilter === "nonaktif" && !user.is_active);
      
      const matchesRole = roleFilter === "semua" || user.roles === roleFilter;
      
      return matchesSearch && matchesStatus && matchesRole;
    });
  }, [users, search, statusFilter, roleFilter]);

  return {
    search,
    statusFilter,
    roleFilter,
    filteredUsers,
    setSearch,
    setStatusFilter,
    setRoleFilter
  };
}