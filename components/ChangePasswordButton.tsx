import React, { ComponentProps } from "react";
import { useRouter } from "expo-router";
import { Button, ButtonText, ButtonIcon } from "@/components/ui/button";
import { LockIcon } from "@/components/ui/icon";

interface ChangePasswordButtonProps extends ComponentProps<typeof Button> {}

// Messing around with importing and extending Button Props instead of manually entering.
// TODO: Need to test, research, and mess around with it more.
// TODO: If it ends up being fine, can apply same logic to a lot of other components and reduce code significally.
export const ChangePasswordButton: React.FC<ChangePasswordButtonProps> = ({
  variant = "outline",
  size = "md",
  disabled = false,
}) => {
  const router = useRouter();

  const handlePress = () => {
    router.push("/settings/change-password");
  };

  return (
    <Button
      variant={variant}
      size={size}
      onPress={handlePress}
      isDisabled={disabled ?? undefined}
      className="w-full"
    >
      <ButtonIcon as={LockIcon} size="sm" />
      <ButtonText className="text-primary">Change Password</ButtonText>
    </Button>
  );
};
