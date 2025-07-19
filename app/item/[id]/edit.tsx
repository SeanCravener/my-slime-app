import React from "react";
import { useLocalSearchParams } from "expo-router";
import { useItem } from "@/hooks/useItem";
import { useEditItem } from "@/hooks/useEditItem";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { VStack } from "@/components/ui/vstack";
import { Text } from "@/components/ui/text";
import { Spinner } from "@/components/ui/spinner";
import { Center } from "@/components/ui/center";
import { Box } from "@/components/ui/box";
import { EditItemForm } from "@/components/EditItemForm";
import { ItemFormData } from "@/types/item";

export default function EditItemScreen() {
  const { shouldRender, isLoading: authLoading } = useRequireAuth();
  const { id } = useLocalSearchParams();
  const { data: item, isLoading: itemLoading } = useItem(id as string);
  const { editItem, deleteItem, isEditing, isDeleting, error } = useEditItem(
    id as string
  );

  if (authLoading) {
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

  if (itemLoading || !item) {
    return (
      <Center className="flex-1">
        <VStack space="md" className="items-center">
          <Spinner size="large" />
          <Text size="md" className="text-muted-foreground">
            Loading recipe...
          </Text>
        </VStack>
      </Center>
    );
  }

  const handleSubmit = (
    data: ItemFormData & { imagesToCleanup?: string[] }
  ) => {
    editItem(data);
  };

  const handleDelete = () => {
    deleteItem();
  };

  return (
    <EditItemForm
      initialValues={item}
      onSubmit={handleSubmit}
      onDelete={handleDelete}
      isSaving={isEditing}
      isDeleting={isDeleting}
      error={error}
    />
  );
}
