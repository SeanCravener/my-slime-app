import React from "react";
import { Box } from "@/components/ui/box";
import { VStack } from "@/components/ui/vstack";
import { Text } from "@/components/ui/text";
import { ItemList } from "@/components/ItemList";
import { useGeneralItems } from "@/hooks/useItems";

export default function HomeScreen() {
  const {
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    error,
  } = useGeneralItems();

  if (error) {
    return (
      <Box className="flex-1 bg-background justify-center items-center p-4">
        <VStack space="md" className="items-center">
          <Text className="text-xl font-bold text-destructive">
            Oops! Something went wrong
          </Text>
          <Text className="text-muted-foreground text-center">
            {error.message || "Failed to load items"}
          </Text>
        </VStack>
      </Box>
    );
  }

  return (
    <Box className="flex-1 bg-background">
      {/* Header */}
      <Box className="px-4 py-6 border-b border-border bg-background">
        <VStack space="xs">
          <Text className="text-3xl font-bold text-foreground">
            Latest Recipes
          </Text>
          <Text className="text-base text-muted-foreground">
            Discover amazing recipes from our community
          </Text>
        </VStack>
      </Box>

      {/* Items List */}
      <ItemList
        data={data}
        isLoading={isLoading}
        isFetchingNextPage={isFetchingNextPage}
        hasNextPage={hasNextPage}
        fetchNextPage={fetchNextPage}
        emptyText="No recipes found. Be the first to share one!"
      />
    </Box>
  );
}
