import React from "react";
import { Button, ButtonIcon } from "@/components/ui/button";
import { EditIcon } from "@/components/ui/icon";

interface EditButtonProps {
  onPress: () => void;
  size?: "xs" | "sm" | "md" | "lg";
  variant?: "solid" | "outline" | "link";
  disabled?: boolean;
}

// Was having issues with button not doing anything when testing in Android
// Changing onPress to onPressIn fixees issue, but it is not ideal.
// TODO: Make sure onPressIn won't cause issues or find fix for onPress not working.
export const EditButton: React.FC<EditButtonProps> = ({
  onPress,
  size = "md",
  variant = "outline",
  disabled = false,
}) => {
  return (
    <Button
      variant={variant}
      size={size}
      onPressIn={onPress}
      isDisabled={disabled}
      className="w-10 h-10 rounded-lg p-1 ml-2 mr-2"
    >
      <ButtonIcon as={EditIcon} size={size} />
    </Button>
  );
};
