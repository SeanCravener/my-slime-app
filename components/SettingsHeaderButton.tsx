import React, { ComponentProps } from "react";
import { useRouter } from "expo-router";
import { Button, ButtonIcon } from "@/components/ui/button";
import { SettingsIcon } from "@/components/ui/icon";

interface SettingsHeaderButtonProps extends ComponentProps<typeof Button> {}

export const SettingsHeaderButton: React.FC<SettingsHeaderButtonProps> = ({
  variant = "outline",
  size = "xl",
  disabled = false,
}) => {
  const router = useRouter();

  const handlePress = () => {
    router.push("/settings");
  };

  return (
    <Button
      variant={variant}
      size={size}
      disabled={disabled}
      onPress={handlePress}
      hitSlop={8}
      accessibilityRole="button"
      accessibilityLabel="Open Settings"
      className="p-3"
    >
      <ButtonIcon as={SettingsIcon} />
    </Button>
  );
};
