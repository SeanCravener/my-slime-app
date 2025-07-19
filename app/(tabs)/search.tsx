import React, { useState } from "react";
import { Stack } from "expo-router";
import { Box } from "@/components/ui/box";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { useSearchItems } from "@/hooks/useItems";
import { SearchBar } from "@/components/SearchBar";
import { ItemList } from "@/components/ItemList";
import { useDebouncedCallback } from "use-debounce";

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState("");

  const {
    data: items,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useSearchItems(searchQuery);

  const debouncedSearch = useDebouncedCallback((query: string) => {
    setSearchQuery(query);
  }, 300);

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
                {/* Title Row */}
                <HStack className="justify-between w-full items-center px-4 py-2">
                  <Text size="xl" className="font-bold text-foreground">
                    Search
                  </Text>
                </HStack>

                {/* Search Bar Row */}
                <SearchBar
                  onSearch={debouncedSearch}
                  placeholder="Search recipes..."
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
    </>
  );
}
