import React, { useState } from "react";
import { Stack } from "expo-router";
import { Box } from "@/components/ui/box";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { useItems } from "@/hooks/useItems";
import { SearchBar } from "@/components/SearchBar";
import { ItemList } from "@/components/ItemList";
import { SortFilterModal } from "@/components/SortFilterModal";
import { useFilterSort } from "@/hooks/useFilterSort";
import { useDebouncedCallback } from "use-debounce";

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    appliedFilters,
    appliedSort,
    hasActiveFilters,
    pendingFilters,
    pendingSort,
    toggleCategory,
    toggleRating,
    setSortBy,
    applyChanges,
    cancelChanges,
    syncPendingWithApplied,
    clearAll,
  } = useFilterSort();

  // Convert filters to the format expected by useItems
  const filterOptions = {
    categories:
      appliedFilters.categories.length > 0
        ? appliedFilters.categories
        : undefined,
    ratings:
      appliedFilters.ratings.length > 0 ? appliedFilters.ratings : undefined,
  };

  const {
    data: items,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useItems({
    mode: searchQuery.trim() ? "search" : "general",
    searchQuery: searchQuery.trim(),
    enabled: true,
    sortBy: appliedSort.sortBy,
    sortOrder: appliedSort.sortOrder,
    filters: filterOptions,
  });

  const debouncedSearch = useDebouncedCallback((query: string) => {
    setSearchQuery(query);
  }, 300);

  const handleOpenModal = () => {
    syncPendingWithApplied(); // Sync pending state with current applied state
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    cancelChanges(); // Reset pending changes when closing
    setIsModalOpen(false);
  };

  const handleApplyFilters = () => {
    applyChanges();
    setIsModalOpen(false);
  };

  const handleClearFilters = () => {
    clearAll();
    setIsModalOpen(false);
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          title: "Search",
          headerStyle: {
            backgroundColor: "transparent",
          },
          headerShadowVisible: false,
          header: () => (
            <Box
              className="bg-background border-b border-border"
              style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 3,
              }}
            >
              <VStack space="sm" className="pt-12 pb-2">
                <HStack className="justify-between w-full items-center px-4 py-2">
                  <Text size="xl" className="font-bold text-foreground">
                    Search
                  </Text>
                </HStack>

                <SearchBar
                  onSearch={debouncedSearch}
                  placeholder="Search recipes..."
                  onFilterPress={handleOpenModal}
                  hasActiveFilters={hasActiveFilters}
                />
              </VStack>
            </Box>
          ),
        }}
      />

      <Box className="flex-1 pt-2">
        <ItemList
          data={items}
          isLoading={isLoading}
          isFetchingNextPage={isFetchingNextPage}
          hasNextPage={hasNextPage}
          fetchNextPage={fetchNextPage}
          emptyText={
            searchQuery
              ? "No recipes found for your search"
              : "Start typing to search recipes"
          }
        />
      </Box>

      <SortFilterModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        pendingFilters={pendingFilters}
        pendingSort={pendingSort}
        onToggleCategory={toggleCategory}
        onToggleRating={toggleRating}
        onUpdateSort={setSortBy}
        onClear={handleClearFilters}
        onApply={handleApplyFilters}
        onCancel={cancelChanges}
      />
    </>
  );
}
