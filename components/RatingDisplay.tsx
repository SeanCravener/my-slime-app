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
}

export const RatingDisplay: React.FC<RatingDisplayProps> = ({
  rating = 0,
  type = "full",
  size = "md",
  maxRating = 5,
}) => {
  const iconSize = size === "sm" ? "sm" : size === "lg" ? "lg" : "md";
  const textSize =
    size === "sm" ? "text-sm" : size === "lg" ? "text-lg" : "text-base";

  return (
    <HStack space="xs" className="items-center">
      <Icon
        as={StarIcon}
        size={size}
        className="text-yellow-500 fill-yellow-500"
      />
      <Text size={size} className={`font-medium text-foreground`}>
        ({rating.toFixed(1)})
      </Text>
    </HStack>
  );
};
