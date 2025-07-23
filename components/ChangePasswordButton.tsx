import React from "react";
import { useRouter } from "expo-router";
import { HStack } from "@/components/ui/hstack";
import { Button, ButtonText } from "@/components/ui/button";
import { Lock } from "lucide-react-native";

interface ChangePasswordButtonProps {
  variant?: "solid" | "outline" | "link";
  size?: "sm" | "md" | "lg" | "xl";
  disabled?: boolean;
}

export const ChangePasswordButton: React.FC<ChangePasswordButtonProps> = ({
  variant = "list-item",
  size = "md",
  disabled = false,
}) => {
  const router = useRouter();

  const handlePress = () => {
    router.push("/settings/change-password");
  };

  return (
    <Button
      variant="solid"
      size={size}
      onPress={handlePress}
      isDisabled={disabled}
      className="w-full"
    >
      <HStack space="sm" className="items-center">
        <Lock size={16} color="#007AFF" />
        <ButtonText className="text-primary">Change Password</ButtonText>
      </HStack>
    </Button>
  );
};
