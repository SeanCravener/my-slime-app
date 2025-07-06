import React from "react";
import {
  Avatar,
  AvatarImage,
  AvatarFallbackText,
} from "@/components/ui/avatar";
import { Text } from "@/components/ui/text";
import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";

interface Author {
  id: string;
  username: string;
  avatar_url: string | null;
}

interface AuthorInfoProps {
  author: Author;
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
  orientation?: "horizontal" | "vertical";
}

export const AuthorInfo: React.FC<AuthorInfoProps> = ({
  author,
  size = "md",
  orientation = "horizontal",
}) => {
  const Component = orientation === "vertical" ? VStack : HStack;

  return (
    <Component
      space="xs"
      className={`items-center ${
        orientation === "vertical" ? "items-center" : "items-center"
      }`}
    >
      <Avatar size={size}>
        <AvatarFallbackText>{author.username}</AvatarFallbackText>
        {author.avatar_url && (
          <AvatarImage source={{ uri: author.avatar_url }} />
        )}
      </Avatar>
      <Text size={size} className="text-muted-foreground font-medium">
        {author.username}
      </Text>
    </Component>
  );
};
