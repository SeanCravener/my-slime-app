import React from "react";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { Stack } from "expo-router";
import { Box } from "@/components/ui/box";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { Card } from "@/components/ui/card";
import { User } from "lucide-react-native";
import { SettingsHeaderButton } from "@/components/SettingsHeaderButton";

export default function ProfileScreen() {
  const { shouldRender, isLoading, session } = useRequireAuth();

  if (isLoading) {
    return (
      <Box className="flex-1 items-center justify-center px-6">
        <VStack space="md" className="items-center">
          <Text className="text-lg text-muted-foreground">Loading...</Text>
        </VStack>
      </Box>
    );
  }

  if (!shouldRender) {
    return null;
  }

  const user = session!.user;

  return (
    <Box className="flex-1 px-6 py-8">
      <HStack className="justify-between items-center mb-6">
        <VStack space="lg">
          <Text className="text-3xl font-bold text-foreground">Profile</Text>
          <Text className="text-base text-muted-foreground">
            Manage your account and preferences
          </Text>
        </VStack>
        <SettingsHeaderButton />
      </HStack>

      <Card className="p-6 mb-6" variant="elevated">
        <VStack space="md">
          <HStack space="md" className="items-center">
            <Box className="w-16 h-16 bg-primary/10 rounded-full items-center justify-center">
              <User size={32} color="#007AFF" />
            </Box>
            <VStack className="flex-1">
              <Text className="text-lg font-semibold text-foreground">
                Welcome back!
              </Text>
              <Text className="text-sm text-muted-foreground">
                {user.email || "No email available"}
              </Text>
            </VStack>
          </HStack>
        </VStack>
      </Card>
    </Box>
  );
}
