import React from "react";
import { useRouter } from "expo-router";
import { Button, ButtonText } from "@/components/ui/button";
import { Icon, EditIcon } from "@/components/ui/icon";

interface EditProfileButtonProps {
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
}

export const EditProfileButton: React.FC<EditProfileButtonProps> = ({
  size = "md",
  disabled = false,
}) => {
  const router = useRouter();

  const handlePress = () => {
    router.push("/settings/edit-profile");
  };

  return (
    <Button
      variant="outline"
      size={size}
      onPress={handlePress}
      isDisabled={disabled}
      className="w-full"
    >
      <Icon as={EditIcon} size="sm" color="#007AFF" />
      <ButtonText className="text-primary">Edit Profile</ButtonText>
    </Button>
  );
};
