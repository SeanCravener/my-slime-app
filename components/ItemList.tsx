import React, { useCallback } from "react";
import { FlatList, FlatListProps } from "react-native";
import { ItemSummaryWithAuthor } from "@/types/item";
import { ItemCard } from "@/components/ItemCard";
import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { Spinner } from "@/components/ui/spinner";
import { router } from "expo-router";

interface ItemListProps {
  data: ItemSummaryWithAuthor[] | undefined;
  isLoading: boolean;
  isFetchingNextPage: boolean;
  hasNextPage: boolean;
  fetchNextPage: () => void;
  ListHeaderComponent?: FlatListProps<ItemSummaryWithAuthor>["ListHeaderComponent"];
  emptyText?: string;
}

export const ItemList = ({
  data,
  isLoading,
  isFetchingNextPage,
  hasNextPage,
  fetchNextPage,
  ListHeaderComponent,
  emptyText = "No items found",
}: ItemListProps) => {
  const handleItemPress = useCallback((itemId: string) => {
    console.log(`Item pressed: ${itemId}`); // TEMPORARY
    router.push(`/item/${itemId}`);
  }, []);

  const renderItem = useCallback(
    ({ item }: { item: ItemSummaryWithAuthor }) => (
      <ItemCard item={item} onPress={() => handleItemPress(item.id)} />
    ),
    [handleItemPress]
  );

  const loadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const renderFooter = useCallback(() => {
    if (!isFetchingNextPage) return null;
    return (
      <Box className="p-6 items-center">
        <Spinner size="small" />
      </Box>
    );
  }, [isFetchingNextPage]);

  const renderEmptyComponent = useCallback(
    () => (
      <Box className="flex-1 justify-center items-center p-6 min-h-[300px]">
        <Text className="text-center text-muted-foreground text-lg">
          {emptyText}
        </Text>
      </Box>
    ),
    [emptyText]
  );

  if (isLoading) {
    return (
      <Box className="flex-1 justify-center items-center">
        <Spinner size="small" />
      </Box>
    );
  }

  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      ListHeaderComponent={ListHeaderComponent}
      keyExtractor={(item) => item.id}
      showsVerticalScrollIndicator={false}
      onEndReached={loadMore}
      onEndReachedThreshold={0.5}
      ListFooterComponent={renderFooter}
      ListEmptyComponent={renderEmptyComponent}
      contentContainerStyle={
        !data || data.length === 0
          ? { flex: 1 }
          : { paddingTop: 8, paddingBottom: 24 }
      }
      style={{ flex: 1 }}
      removeClippedSubviews={false}
      initialNumToRender={10}
      maxToRenderPerBatch={5}
      windowSize={10}
    />
  );
};
