import React, { useState } from "react";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { Stack } from "expo-router";
import { Box } from "@/components/ui/box";
import { VStack } from "@/components/ui/vstack";
import { Text } from "@/components/ui/text";
import { SettingsHeaderButton } from "@/components/SettingsHeaderButton";
import { AuthorInfo } from "@/components/AuthorInfo";
import { ToggleButton } from "@/components/ToggleButton";
import { ItemList } from "@/components/ItemList";
import { useUserItems, useFavoriteItems } from "@/hooks/useItems";

type TabType = "created" | "favorited";

const toggleOptions = [
  { value: "created", label: "Created" },
  { value: "favorited", label: "Favorited" },
];

export default function ProfileScreen() {
  const { shouldRender, isLoading, session } = useRequireAuth();
  const [activeTab, setActiveTab] = useState<TabType>("created");

  // Get items based on active tab
  const {
    data: createdItems,
    isLoading: isLoadingCreated,
    isFetchingNextPage: isFetchingNextPageCreated,
    hasNextPage: hasNextPageCreated,
    fetchNextPage: fetchNextPageCreated,
  } = useUserItems();

  const {
    data: favoriteItems,
    isLoading: isLoadingFavorites,
    isFetchingNextPage: isFetchingNextPageFavorites,
    hasNextPage: hasNextPageFavorites,
    fetchNextPage: fetchNextPageFavorites,
  } = useFavoriteItems();

  if (isLoading) {
    return (
      <Box className="flex-1 items-center justify-center px-6">
        <VStack space="md" className="items-center">
          <Text className="text-lg text-muted-foreground">Loading...</Text>
        </VStack>
      </Box>
    );
  }

  if (!shouldRender) {
    return null;
  }

  const user = session!.user;

  return (
    <>
      {/* Header Section */}
      <VStack space="lg" className="px-6 pt-4 pb-6 bg-background-0">
        <Box className="items-end">
          <SettingsHeaderButton />
        </Box>
        {/* Avatar and Username */}
        <AuthorInfo userId={user.id} size="2xl" variant="profile" />

        {/* Toggle Buttons */}
        <ToggleButton
          options={toggleOptions}
          activeValue={activeTab}
          onValueChange={(value) => setActiveTab(value as TabType)}
        />
      </VStack>

      {/* Content Section */}
      <Box className="flex-1">
        {activeTab === "created" ? (
          <ItemList
            data={createdItems}
            isLoading={isLoadingCreated}
            isFetchingNextPage={isFetchingNextPageCreated}
            hasNextPage={hasNextPageCreated}
            fetchNextPage={fetchNextPageCreated}
            emptyText="No items created yet"
          />
        ) : (
          <ItemList
            data={favoriteItems}
            isLoading={isLoadingFavorites}
            isFetchingNextPage={isFetchingNextPageFavorites}
            hasNextPage={hasNextPageFavorites}
            fetchNextPage={fetchNextPageFavorites}
            emptyText="No favorite items yet"
          />
        )}
      </Box>
    </>
  );
}
