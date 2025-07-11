import React from "react";
import { Icon, StarIcon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { HStack } from "@/components/ui/hstack";

type RatingDisplayType = "full" | "compact";

interface RatingDisplayProps {
  rating: number;
  type?: RatingDisplayType;
  size?: "xs" | "sm" | "md" | "lg";
  maxRating?: number;
  showCount?: boolean;
  reviewCount?: number;
}

export const RatingDisplay: React.FC<RatingDisplayProps> = ({
  rating = 0,
  type = "full",
  size = "md",
  maxRating = 5,
  showCount = false,
  reviewCount,
}) => {
  const displayRating = Math.max(0, Math.min(rating, maxRating));

  if (type === "compact") {
    return (
      <HStack space="xs" className="items-center">
        <Icon
          as={StarIcon}
          size={size}
          className="text-yellow-500 fill-yellow-500"
        />
        <Text size={size} className={`font-medium text-foreground`}>
          {displayRating.toFixed(1)}
        </Text>
        {showCount && reviewCount !== undefined && (
          <Text size={size} className={`text-muted-foreground`}>
            ({reviewCount})
          </Text>
        )}
      </HStack>
    );
  }

  return (
    <HStack space="xs" className="items-center">
      {/* Star Icons */}
      <HStack space="xs" className="items-center">
        {Array.from({ length: maxRating }, (_, index) => {
          const starValue = index + 1;
          const isFullStar = displayRating >= starValue;
          const isHalfStar =
            displayRating >= starValue - 0.5 && displayRating < starValue;

          return (
            <Icon
              key={index}
              as={StarIcon}
              size={size}
              className={
                isFullStar || isHalfStar
                  ? "text-yellow-500 fill-yellow-500"
                  : "text-gray-300 fill-gray-300"
              }
            />
          );
        })}
      </HStack>

      {/* Rating Text */}
      <Text size={size} className={`font-medium text-foreground`}>
        {displayRating.toFixed(1)}
      </Text>

      {/* Review Count */}
      {showCount && reviewCount !== undefined && (
        <Text size={size} className={`text-muted-foreground`}>
          ({reviewCount} {reviewCount === 1 ? "review" : "reviews"})
        </Text>
      )}
    </HStack>
  );
};
