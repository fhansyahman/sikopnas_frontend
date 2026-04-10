"use client";

import { useState, useMemo } from "react";

export function usePagination(items, itemsPerPage = 10) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = useMemo(() => 
    Math.ceil(items.length / itemsPerPage), 
    [items.length, itemsPerPage]
  );

  const startIndex = useMemo(() => 
    (currentPage - 1) * itemsPerPage, 
    [currentPage, itemsPerPage]
  );

  const paginatedItems = useMemo(() => 
    items.slice(startIndex, startIndex + itemsPerPage),
    [items, startIndex, itemsPerPage]
  );

  return {
    currentPage,
    totalPages,
    paginatedItems,
    startIndex,
    itemsPerPage,
    setCurrentPage
  };
}