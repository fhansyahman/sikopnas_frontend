"use client";

import { useState, useMemo } from "react";

export function useSelection(currentItems) {
  const [selectedItems, setSelectedItems] = useState([]);

  const toggleSelectItem = (id) => {
    setSelectedItems(prev => 
      prev.includes(id) 
        ? prev.filter(itemId => itemId !== id)
        : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    const currentPageIds = currentItems.map(item => item.id);
    const allSelected = currentPageIds.every(id => selectedItems.includes(id));
    
    if (allSelected) {
      setSelectedItems(prev => prev.filter(id => !currentPageIds.includes(id)));
    } else {
      const newSelected = [...new Set([...selectedItems, ...currentPageIds])];
      setSelectedItems(newSelected);
    }
  };

  const isAllSelected = useMemo(() => {
    if (currentItems.length === 0) return false;
    return currentItems.every(item => selectedItems.includes(item.id));
  }, [currentItems, selectedItems]);

  return {
    selectedItems,
    toggleSelectItem,
    toggleSelectAll,
    isAllSelected
  };
}