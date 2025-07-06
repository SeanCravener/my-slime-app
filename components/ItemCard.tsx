import React from "react";
import { Pressable } from "react-native";
import { Card } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";
import { AuthorInfo } from "@/components/AuthorInfo";
import { RatingDisplay } from "@/components/RatingDisplay";
import { FavoriteButton } from "@/components/FavoritesButton";
import { Image } from "@/components/ui/image";
import { ItemSummaryWithAuthor } from "@/types/item";

interface ItemCardProps {
  item: ItemSummaryWithAuthor;
  onPress?: () => void;
}

export const ItemCard: React.FC<ItemCardProps> = ({ item, onPress }) => {
  return (
    <Pressable onPress={onPress} className="mx-4 mb-4">
      <Card className="p-0 overflow-hidden" variant="elevated">
        <HStack space="md" className="p-4" style={{ overflow: "hidden" }}>
          {/* Image */}
          <Image
            source={{ uri: item.main_image }}
            className="w-20 h-20 rounded-lg"
            resizeMode="cover"
          />

          {/* Content */}
          <VStack className="flex-1" space="xs">
            <Text
              className="text-lg font-bold text-foreground leading-tight truncate"
              numberOfLines={2}
            >
              {item.title}
            </Text>

            <AuthorInfo author={item.author} size="xs" />

            <HStack space="md" className="items-center">
              <RatingDisplay
                rating={item.average_rating || 0}
                type="compact"
                size="xs"
              />
              <Text size="xs" className="text-muted-foreground">
                {item.category}
              </Text>
            </HStack>
          </VStack>

          {/* Favorite Button */}
          <VStack className="justify-start">
            <FavoriteButton itemId={item.id} size="sm" variant="outline" />
          </VStack>
        </HStack>
      </Card>
    </Pressable>
  );
};
