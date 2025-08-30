import { useState, useEffect, useCallback } from "react";
import { fetchUsers } from "../users.api";

export const useUsers = (filters) => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasFetched, setHasFetched] = useState(false);

  const fetchUsersData = useCallback(async (currentPage = page) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await fetchUsers({ ...filters, page: currentPage, limit: 10 });
      
      if (data.success) {
        setUsers(data.data || []);
        setTotalPages(data.totalPages || 1);
        setHasFetched(true);
      } else {
        setError(data.message || "Failed to fetch users");
        setUsers([]);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      setError(error.response?.data?.message || "Failed to fetch users");
      setUsers([]);
    } finally {
      setIsLoading(false);
    }
  }, [filters, page]);

  // Fetch data when filters or page changes
  useEffect(() => {
    fetchUsersData();
  }, [fetchUsersData]);

  // Reset to page 1 when filters change (except page)
  useEffect(() => {
    setPage(1);
  }, [
    filters.searchTerm,
    JSON.stringify(filters.selectedAdCategories),
    JSON.stringify(filters.selectedPlatforms),
    JSON.stringify(filters.selectedAudienceTypes),
    JSON.stringify(filters.selectedLocations),
    filters.minFollowers,
    filters.maxFollowers
  ]);

  const refetch = () => {
    fetchUsersData();
  };

  const goToPage = (newPage) => {
    setPage(newPage);
  };

  return { 
    users, 
    isLoading, 
    error, 
    page, 
    totalPages, 
    goToPage, 
    refetch,
    hasFetched 
  };
};