import React from "react";
import { useLocalSearchParams } from "expo-router";
import { useItem } from "@/hooks/useItem";
import { useEditItem } from "@/hooks/useEditItem";
import { VStack } from "@/components/ui/vstack";
import { Text } from "@/components/ui/text";
import { Spinner } from "@/components/ui/spinner";
import { Center } from "@/components/ui/center";
import { EditItemForm } from "@/components/EditItemForm";
import { ItemFormData } from "@/types/item";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

export default function EditItem() {
  return (
    <ProtectedRoute>
      <EditItemScreen />
    </ProtectedRoute>
  );
}

function EditItemScreen() {
  const { id } = useLocalSearchParams();
  const { data: item, isLoading } = useItem(id as string);
  const { editItem, deleteItem, isEditing, isDeleting, error } = useEditItem(
    id as string
  );

  const handleSubmit = (
    data: ItemFormData & { imagesToCleanup?: string[] }
  ) => {
    editItem(data);
  };

  const handleDelete = () => {
    deleteItem();
  };

  if (isLoading || !item) {
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
