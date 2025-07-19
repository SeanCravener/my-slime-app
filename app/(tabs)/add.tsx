import React from "react";
import { useRouter } from "expo-router";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { AddItemForm } from "@/components/AddItemForm";
import { Box } from "@/components/ui/box";
import { VStack } from "@/components/ui/vstack";
import { Text } from "@/components/ui/text";

export default function AddItemScreen() {
  const { shouldRender, isLoading, session } = useRequireAuth();
  const router = useRouter();

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

  const handleSuccess = (item: { id: string }) => {
    // Delay navigation to prevent view hierarchy conflicts
    setTimeout(() => {
      router.push(`/item/${item.id}`);
    }, 150);
  };

  return <AddItemForm userId={session!.user.id} onSuccess={handleSuccess} />;
}
