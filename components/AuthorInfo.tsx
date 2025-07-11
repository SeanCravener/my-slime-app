import React from "react";
import {
  Avatar,
  AvatarImage,
  AvatarFallbackText,
} from "@/components/ui/avatar";
import { Text } from "@/components/ui/text";
import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";
import { useGetUserProfile } from "@/hooks/useGetUserProfile";
import { Author } from "@/types/item";

interface AuthorInfoProps {
  author?: Author; // Optional, if provided use this data
  userId: string; // If author not provided, fetch using userId
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
  orientation?: "horizontal" | "vertical";
}

export const AuthorInfo: React.FC<AuthorInfoProps> = ({
  author,
  userId,
  size = "md",
  orientation = "horizontal",
}) => {
  const { data: fetchedAuthor, isLoading } = useGetUserProfile(userId || "");

  // Use provided author or fetched author
  const displayAuthor = author || fetchedAuthor?.[0];

  if (isLoading) {
    return (
      <HStack space="sm" className="items-center">
        <Avatar size={size}>
          <AvatarFallbackText>...</AvatarFallbackText>
        </Avatar>
        <Text size={size} className={`text-muted-foreground`}>
          Loading...
        </Text>
      </HStack>
    );
  }

  if (!displayAuthor) {
    return (
      <HStack space="sm" className="items-center">
        <Avatar size={size}>
          <AvatarFallbackText>?</AvatarFallbackText>
        </Avatar>
        <Text className="text-muted-foreground">Unknown author</Text>
      </HStack>
    );
  }

  const Component = orientation === "vertical" ? VStack : HStack;
  const spacing = orientation === "vertical" ? "xs" : "sm";
  const alignment =
    orientation === "vertical" ? "items-center" : "items-center";

  return (
    <Component space={spacing} className={alignment}>
      <Avatar size={size}>
        <AvatarFallbackText>{displayAuthor.username}</AvatarFallbackText>
        {displayAuthor.avatar_url && (
          <AvatarImage
            source={{ uri: displayAuthor.avatar_url }}
            alt={`${displayAuthor.username}'s avatar`}
          />
        )}
      </Avatar>
      <Text
        size={size}
        className={`text-foreground font-medium`}
        numberOfLines={1}
      >
        {displayAuthor.username}
      </Text>
    </Component>
  );
};
