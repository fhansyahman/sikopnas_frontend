"use client";

import { useState, useCallback, useMemo } from "react";

export function useSelection(items = []) {
  const [selectedItems, setSelectedItems] = useState([]);

  const toggleSelectItem = useCallback((id) => {
    setSelectedItems(prev => 
      prev.includes(id) 
        ? prev.filter(itemId => itemId !== id)
        : [...prev, id]
    );
  }, []);

  const toggleSelectAll = useCallback(() => {
    if (selectedItems.length === items.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(items.map(item => item.id));
    }
  }, [items, selectedItems.length]);

  const clearSelection = useCallback(() => {
    setSelectedItems([]);
  }, []);

  const isAllSelected = useMemo(() => {
    return items.length > 0 && selectedItems.length === items.length;
  }, [items.length, selectedItems.length]);

  const isIndeterminate = useMemo(() => {
    return selectedItems.length > 0 && selectedItems.length < items.length;
  }, [items.length, selectedItems.length]);

  return {
    selectedItems,
    setSelectedItems,
    toggleSelectItem,
    toggleSelectAll,
    clearSelection,
    isAllSelected,
    isIndeterminate
  };
}