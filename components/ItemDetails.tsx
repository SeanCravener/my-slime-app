import React from "react";
import { Box } from "@/components/ui/box";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { Divider } from "@/components/ui/divider";
import { FavoriteButton } from "@/components/FavoritesButton";
import { RatingDisplay } from "@/components/RatingDisplay";
import { AuthorInfo } from "@/components/AuthorInfo";
import { Ingredient } from "@/types/item";

export interface ItemDetailsProps {
  id: string;
  title: string;
  category: string;
  rating: number;
  description: string;
  ingredients: Ingredient[];
  authorId: string;
}

export const ItemDetails: React.FC<ItemDetailsProps> = ({
  id,
  title,
  category,
  rating,
  description,
  ingredients,
  authorId,
}) => {
  return (
    <VStack space="lg" className="p-6">
      {/* Header Section */}
      <HStack space="md" className="items-start">
        <VStack className="flex-1" space="xs">
          <Text
            size="2xl"
            className="font-bold text-foreground leading-tight"
            numberOfLines={2}
          >
            {title}
          </Text>

          <VStack space="xs">
            <RatingDisplay rating={rating} type="full" size="sm" />
            <Text size="sm" className="text-muted-foreground font-medium">
              {category}
            </Text>
          </VStack>
        </VStack>

        <FavoriteButton itemId={id} variant="outline" size="md" />
      </HStack>

      <Divider />

      {/* Description Section */}
      <VStack space="sm">
        <Text size="lg" className="font-semibold text-foreground">
          Description
        </Text>
        <Text size="md" className="ml-4 text-foreground leading-relaxed">
          {description}
        </Text>
      </VStack>

      <Divider />

      {/* Ingredients Section */}
      <VStack space="md">
        <HStack className="items-center justify-between">
          <Text size="lg" className="font-semibold text-foreground">
            Ingredients
          </Text>
          <Text size="xs" className="text-muted-foreground font-medium">
            {ingredients.length} items
          </Text>
        </HStack>

        <VStack space="xs">
          {ingredients.map((ingredient, index) => (
            <Text key={index} size="md" className="ml-4 text-foreground flex-1">
              {ingredient.value}
            </Text>
          ))}
        </VStack>
      </VStack>

      <Divider />

      {/* Author Section */}
      <VStack space="sm">
        <Text size="lg" className="font-semibold text-foreground">
          Recipe by
        </Text>
        <Box className="ml-4">
          <AuthorInfo userId={authorId} size="md" orientation="horizontal" />
        </Box>
      </VStack>
    </VStack>
  );
};
