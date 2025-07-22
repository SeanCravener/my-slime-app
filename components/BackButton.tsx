import React from "react";
import { Button, ButtonIcon } from "@/components/ui/button";
import { ArrowLeftIcon } from "@/components/ui/icon";
import { router } from "expo-router";

interface BackButtonProps {
  size?: "xs" | "sm" | "md" | "lg";
  variant?: "solid" | "outline" | "link";
  disabled?: boolean;
}

// Was having issues with button not doing anything when testing in Android
// Changing onPress to onPressIn fixees issue, but it is not ideal.
// TODO: Make sure onPressIn won't cause issues or find fix for onPress not working.
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
      onPressIn={handlePress}
      isDisabled={disabled}
      className="w-10 h-10 rounded-lg p-1 ml-2 mr-2"
    >
      <ButtonIcon as={ArrowLeftIcon} size={size} />
    </Button>
  );
};
