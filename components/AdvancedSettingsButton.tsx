import React, { ComponentProps } from "react";
import { useRouter } from "expo-router";
import { Button, ButtonText, ButtonIcon } from "@/components/ui/button";
import { SettingsIcon } from "@/components/ui/icon";

interface AdvancedSettingsButtonProp extends ComponentProps<typeof Button> {}

export const AdvancedSettingsButton: React.FC<AdvancedSettingsButtonProp> = ({
  variant = "outline",
  size = "md",
  disabled = false,
}) => {
  const router = useRouter();

  const handlePress = () => {
    router.push("/settings/advanced");
  };

  return (
    <Button
      variant={variant}
      size={size}
      onPress={handlePress}
      isDisabled={disabled ?? undefined}
      className="w-full"
    >
      <ButtonIcon as={SettingsIcon} size="sm" />
      <ButtonText className="text-primary">Advanced Settings</ButtonText>
    </Button>
  );
};
