import React from "react";
import { Button, ButtonIcon } from "@/components/ui/button";
import { ArrowLeftIcon } from "@/components/ui/icon";
import { router } from "expo-router";

interface BackButtonProps {
  size?: "xs" | "sm" | "md" | "lg";
  variant?: "solid" | "outline" | "link";
  disabled?: boolean;
}

export const BackButton: React.FC<BackButtonProps> = ({
  size = "md",
  variant = "outline",
  disabled = false,
}) => {
  const handlePress = () => {
    console.log(router.canGoBack());
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/(tabs)");
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onPress={handlePress}
      isDisabled={disabled}
      className="w-10 h-10 rounded-lg p-1 ml-2 mr-2"
    >
      <ButtonIcon as={ArrowLeftIcon} size={size} />
    </Button>
  );
};
