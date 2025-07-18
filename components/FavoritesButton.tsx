import React from "react";
import { Button, ButtonIcon } from "@/components/ui/button";
import { FavouriteIcon } from "@/components/ui/icon";
import { useFavorites } from "@/hooks/useFavorites"; // Updated import path

interface FavoriteButtonProps {
  itemId: string;
  variant?: "solid" | "outline" | "link" | undefined;
  disabled?: boolean;
  size?: "sm" | "md" | "lg" | "xs" | "xl";
}

export const FavoriteButton: React.FC<FavoriteButtonProps> = ({
  itemId,
  variant = "outline",
  disabled = false,
  size = "md",
}) => {
  const { favoritedItemIds, isLoading, toggleFavorite } = useFavorites();

  const isFavorited = favoritedItemIds.includes(itemId);

  const handlePress = async () => {
    if (!isLoading && !disabled) {
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
      variant={variant}
      size={size}
      onPress={handlePress}
      isDisabled={isLoading || disabled}
      className="w-10 h-10 rounded-lg border-muted-foreground p-1"
    >
      <ButtonIcon
        as={FavouriteIcon}
        size={size}
        className={
          isFavorited
            ? "text-red-500 fill-red-500"
            : "text-muted-foreground fill-transparent"
        }
      />
    </Button>
  );
};
