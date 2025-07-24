import React from "react";
import { useRouter } from "expo-router";
import { Pressable } from "@/components/ui/pressable";
import { Icon, SettingsIcon } from "@/components/ui/icon";

export const SettingsHeaderButton: React.FC = () => {
  const router = useRouter();

  const handlePress = () => {
    router.push("/settings");
  };

  return (
    <Pressable
      onPress={handlePress}
      hitSlop={8}
      style={({ pressed }) => ({
        opacity: pressed ? 0.7 : 1,
      })}
      accessibilityRole="button"
      accessibilityLabel="Open Settings"
    >
      <Icon as={SettingsIcon} size="lg" className="text-foreground" />
    </Pressable>
  );
};
