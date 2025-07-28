import React, { ComponentProps } from "react";
import { Button, ButtonIcon } from "@/components/ui/button";
import { FavouriteIcon } from "@/components/ui/icon";
import { useFavorites } from "@/hooks/useFavorites"; // Updated import path

interface FavoriteButtonProps extends ComponentProps<typeof Button> {
  itemId: string;
}

export const FavoriteButton: React.FC<FavoriteButtonProps> = ({
  itemId,
  variant = "solid",
  isDisabled = false,
  size = "md",
}) => {
  const { favoritedItemIds, isLoading, toggleFavorite } = useFavorites();

  const isFavorited = favoritedItemIds.includes(itemId);

  const handlePress = async () => {
    if (!isLoading && !isDisabled) {
      try {
        await toggleFavorite(itemId, !isFavorited);
      } catch (error) {
        console.error("Failed to toggle favorite:", error);
        // Could add toast notification here if you have one
      }
    }
  };

  return (
    <Button
      variant="solid"
      size={size}
      onPress={handlePress}
      isDisabled={isLoading || isDisabled}
      className="w-10 h-10 rounded-lg p-1"
    >
      <ButtonIcon
        as={FavouriteIcon}
        size={size}
        className={
          isFavorited ? "text-red-500 fill-red-500" : "text-black fill-white"
        }
      />
    </Button>
  );
};
