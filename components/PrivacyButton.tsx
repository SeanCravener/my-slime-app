import React, { ComponentProps } from "react";
import { useRouter } from "expo-router";
import { Button, ButtonText, ButtonIcon } from "@/components/ui/button";
import { Shield } from "lucide-react-native";

interface PrivacyButtonProp extends ComponentProps<typeof Button> {}

export const PrivacyButton: React.FC<PrivacyButtonProp> = ({
  variant = "outline",
  size = "md",
  disabled = false,
}) => {
  const router = useRouter();

  const handlePress = () => {
    router.push("/legal/privacy");
  };

  return (
    <Button
      variant={variant}
      size={size}
      onPress={handlePress}
      isDisabled={disabled ?? undefined}
      className="w-full"
    >
      <ButtonIcon as={Shield} size="sm" />
      <ButtonText className="text-primary">Privacy Policy</ButtonText>
    </Button>
  );
};
