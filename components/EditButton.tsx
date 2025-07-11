import React from "react";
import { Button, ButtonIcon } from "@/components/ui/button";
import { EditIcon } from "@/components/ui/icon";

interface EditButtonProps {
  onPress: () => void;
  size?: "xs" | "sm" | "md" | "lg";
  variant?: "solid" | "outline" | "link";
  disabled?: boolean;
}

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
      onPress={onPress}
      isDisabled={disabled}
      className="rounded-lg p-1"
    >
      <ButtonIcon as={EditIcon} size={size} />
    </Button>
  );
};
