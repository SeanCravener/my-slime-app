import React from "react";
import { useRouter } from "expo-router";
import { useAuth } from "@/context/AuthContext";
import { VStack } from "@/components/ui/vstack";
import { Text } from "@/components/ui/text";
import { Center } from "@/components/ui/center";
import { AddItemForm } from "@/components/AddItemForm";

export default function AddItemScreen() {
  const { session } = useAuth();
  const router = useRouter();

  if (!session?.user?.id) {
    return (
      <Center className="flex-1 px-6">
        <VStack space="md" className="items-center">
          <Text size="lg" className="text-destructive font-medium text-center">
            Authentication Required
          </Text>
          <Text size="md" className="text-muted-foreground text-center">
            You must be signed in to add a recipe.
          </Text>
        </VStack>
      </Center>
    );
  }

  const handleSuccess = (item: { id: string }) => {
    // Fixed route to match your app structure
    router.replace(`/item/${item.id}`);
  };

  return <AddItemForm userId={session.user.id} onSuccess={handleSuccess} />;
}
