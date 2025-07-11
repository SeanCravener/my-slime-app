import React from "react";
import { Share, Alert } from "react-native";
import { Button, ButtonIcon } from "@/components/ui/button";
import { ShareIcon } from "@/components/ui/icon";

interface ShareButtonProps {
  title: string;
  message: string;
  url?: string;
  size?: "xs" | "sm" | "md" | "lg";
  variant?: "solid" | "outline" | "link";
  disabled?: boolean;
}

export const ShareButton: React.FC<ShareButtonProps> = ({
  title,
  message,
  url,
  size = "md",
  variant = "outline",
  disabled = false,
}) => {
  const handleShare = async () => {
    if (disabled) return;

    try {
      const shareOptions = {
        title,
        message: url ? `${message}\n${url}` : message,
        ...(url && { url }),
      };

      const result = await Share.share(shareOptions);

      // Optional: Handle the share result
      if (result.action === Share.sharedAction) {
        // Content was shared successfully
        console.log("Content shared successfully");
      } else if (result.action === Share.dismissedAction) {
        // Share dialog was dismissed
        console.log("Share dialog dismissed");
      }
    } catch (error) {
      console.error("Error sharing:", error);
      Alert.alert(
        "Share Error",
        "Unable to share at this time. Please try again later."
      );
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onPress={handleShare}
      isDisabled={disabled}
      className="w-12 h-12 rounded-lg p-1"
    >
      <ButtonIcon as={ShareIcon} size={size} />
    </Button>
  );
};
