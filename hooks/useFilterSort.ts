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
  const [filters, setFilters] = useState<FilterState>({
    ...defaultFilters,
    ...initialState?.filters,
  });

  const [sort, setSort] = useState<SortState>({
    ...defaultSort,
    ...initialState?.sort,
  });

  // Filter actions
  const toggleCategory = useCallback((categoryId: number) => {
    setFilters((prev) => ({
      ...prev,
      categories: prev.categories.includes(categoryId)
        ? prev.categories.filter((id) => id !== categoryId)
        : [...prev.categories, categoryId],
    }));
  }, []);

  const toggleRating = useCallback((rating: number) => {
    setFilters((prev) => ({
      ...prev,
      ratings: prev.ratings.includes(rating)
        ? prev.ratings.filter((r) => r !== rating)
        : [...prev.ratings, rating],
    }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  // Sort actions
  const updateSort = useCallback((newSort: Partial<SortState>) => {
    setSort((prev) => ({ ...prev, ...newSort }));
  }, []);

  const setSortBy = useCallback((sortBy: SortOption) => {
    setSort((prev) => ({ ...prev, sortBy }));
  }, []);

  const setSortOrder = useCallback((sortOrder: SortOrder) => {
    setSort((prev) => ({ ...prev, sortOrder }));
  }, []);

  // Reset everything
  const resetAll = useCallback(() => {
    setFilters(defaultFilters);
    setSort(defaultSort);
  }, []);

  // Check if any filters are active
  const hasActiveFilters = useMemo(() => {
    return filters.categories.length > 0 || filters.ratings.length > 0;
  }, [filters]);

  // Check if sort is different from default
  const hasCustomSort = useMemo(() => {
    return (
      sort.sortBy !== defaultSort.sortBy ||
      sort.sortOrder !== defaultSort.sortOrder
    );
  }, [sort]);

  return {
    // State
    filters,
    sort,
    hasActiveFilters,
    hasCustomSort,

    // Filter actions
    toggleCategory,
    toggleRating,
    clearFilters,

    // Sort actions
    updateSort,
    setSortBy,
    setSortOrder,

    // Reset
    resetAll,

    // Setters for bulk updates
    setFilters,
    setSort,
  };
}
