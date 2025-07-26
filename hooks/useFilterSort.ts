import { useState, useCallback, useMemo } from "react";
import { SortOption, SortOrder } from "@/types/item";

export interface FilterState {
  categories: number[];
  ratings: number[];
}

export interface SortState {
  sortBy: SortOption;
  sortOrder: SortOrder;
}

export interface FilterSortState {
  filters: FilterState;
  sort: SortState;
}

const defaultFilters: FilterState = {
  categories: [],
  ratings: [],
};

const defaultSort: SortState = {
  sortBy: "date",
  sortOrder: "desc",
};

export function useFilterSort(initialState?: Partial<FilterSortState>) {
  // Applied state - this is what gets used by the items query
  const [appliedFilters, setAppliedFilters] = useState<FilterState>({
    ...defaultFilters,
    ...initialState?.filters,
  });

  const [appliedSort, setAppliedSort] = useState<SortState>({
    ...defaultSort,
    ...initialState?.sort,
  });

  // Pending state - this is what gets modified in the modal
  const [pendingFilters, setPendingFilters] = useState<FilterState>({
    ...defaultFilters,
    ...initialState?.filters,
  });

  const [pendingSort, setPendingSort] = useState<SortState>({
    ...defaultSort,
    ...initialState?.sort,
  });

  // Filter actions (modify pending state)
  const toggleCategory = useCallback((categoryId: number) => {
    setPendingFilters((prev) => ({
      ...prev,
      categories: prev.categories.includes(categoryId)
        ? prev.categories.filter((id) => id !== categoryId)
        : [...prev.categories, categoryId],
    }));
  }, []);

  const toggleRating = useCallback((rating: number) => {
    setPendingFilters((prev) => ({
      ...prev,
      ratings: prev.ratings.includes(rating)
        ? prev.ratings.filter((r) => r !== rating)
        : [...prev.ratings, rating],
    }));
  }, []);

  // Sort actions (modify pending state with toggle logic)
  const setSortBy = useCallback((sortBy: SortOption) => {
    setPendingSort((prev) => {
      if (prev.sortBy === sortBy) {
        // If same sort option is selected, toggle the order
        return {
          ...prev,
          sortOrder: prev.sortOrder === "desc" ? "asc" : "desc",
        };
      } else {
        // If different sort option, set it with default desc order
        return {
          ...prev,
          sortBy,
          sortOrder: "desc",
        };
      }
    });
  }, []);

  // Apply pending changes to applied state
  const applyChanges = useCallback(() => {
    setAppliedFilters(pendingFilters);
    setAppliedSort(pendingSort);
    // Keep pending state in sync with applied state after applying
    // This ensures next time modal opens, it shows current applied settings
  }, [pendingFilters, pendingSort]);

  // Reset pending to match applied (cancel changes)
  const cancelChanges = useCallback(() => {
    setPendingFilters(appliedFilters);
    setPendingSort(appliedSort);
  }, [appliedFilters, appliedSort]);

  // Sync pending state with applied state (call when opening modal)
  const syncPendingWithApplied = useCallback(() => {
    setPendingFilters(appliedFilters);
    setPendingSort(appliedSort);
  }, [appliedFilters, appliedSort]);

  // Clear all filters (both pending and applied)
  const clearAll = useCallback(() => {
    setPendingFilters(defaultFilters);
    setPendingSort(defaultSort);
    setAppliedFilters(defaultFilters);
    setAppliedSort(defaultSort);
  }, []);

  // Check if any applied filters are active
  const hasActiveFilters = useMemo(() => {
    return (
      appliedFilters.categories.length > 0 || appliedFilters.ratings.length > 0
    );
  }, [appliedFilters]);

  // Check if there are pending changes
  const hasPendingChanges = useMemo(() => {
    return (
      JSON.stringify(pendingFilters) !== JSON.stringify(appliedFilters) ||
      JSON.stringify(pendingSort) !== JSON.stringify(appliedSort)
    );
  }, [pendingFilters, appliedFilters, pendingSort, appliedSort]);

  return {
    // Applied state (used by queries)
    appliedFilters,
    appliedSort,
    hasActiveFilters,

    // Pending state (used by modal)
    pendingFilters,
    pendingSort,
    hasPendingChanges,

    // Actions
    toggleCategory,
    toggleRating,
    setSortBy,
    applyChanges,
    cancelChanges,
    syncPendingWithApplied,
    clearAll,
  };
}
