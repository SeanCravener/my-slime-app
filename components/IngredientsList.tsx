import React, { useState } from "react";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { Button, ButtonText, ButtonIcon } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogBackdrop,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogCloseButton,
  AlertDialogFooter,
  AlertDialogBody,
} from "@/components/ui/alert-dialog";
import { Card } from "@/components/ui/card";
import { IngredientModal } from "@/components/IngredientModal";
import { Icon, AddIcon, TrashIcon, CloseIcon } from "@/components/ui/icon";
import { EditButton } from "@/components/EditButton";

interface IngredientsListProps {
  ingredients: { value: string }[];
  onAdd: (value: string) => void;
  onEdit: (index: number, value: string) => void;
  onDelete: (index: number) => void;
  disabled?: boolean;
  maxItems?: number;
}

export const IngredientsList: React.FC<IngredientsListProps> = ({
  ingredients,
  onAdd,
  onEdit,
  onDelete,
  disabled = false,
  maxItems = 20,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingIndex, setDeletingIndex] = useState<number | null>(null);

  const handleAddClick = () => {
    setEditingIndex(null);
    setModalVisible(true);
  };

  const handleEditClick = (index: number) => {
    setEditingIndex(index);
    setModalVisible(true);
  };

  const handleDeleteClick = (index: number) => {
    setDeletingIndex(index);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (deletingIndex !== null) {
      onDelete(deletingIndex);
    }
    setDeleteDialogOpen(false);
    setDeletingIndex(null);
  };

  const handleSave = (value: string) => {
    if (editingIndex !== null) {
      onEdit(editingIndex, value);
    } else {
      onAdd(value);
    }
    setModalVisible(false);
    setEditingIndex(null);
  };

  const handleDelete = () => {
    if (editingIndex !== null) {
      onDelete(editingIndex);
    }
    setModalVisible(false);
    setEditingIndex(null);
  };

  const canAddMore = ingredients.length < maxItems;

  return (
    <>
      <VStack space="md">
        {/* Ingredients List */}
        {ingredients.length === 0 ? (
          <Card variant="outline" className="p-4">
            <Text size="sm" className="text-muted-foreground text-center">
              No ingredients added yet
            </Text>
          </Card>
        ) : (
          <VStack space="xs">
            {ingredients.map((ingredient, index) => (
              <Card
                key={index}
                variant="outline"
                className={`p-3 ${disabled ? "opacity-60" : ""}`}
              >
                <HStack className="items-center justify-between">
                  <Text size="md" className="flex-1 text-foreground mr-3">
                    {ingredient.value}
                  </Text>

                  <HStack space="xs">
                    <EditButton
                      onPress={
                        disabled ? () => {} : () => handleEditClick(index)
                      }
                      disabled={disabled}
                      variant="solid"
                    />
                    <Button
                      onPress={
                        disabled ? undefined : () => handleDeleteClick(index)
                      }
                      disabled={disabled}
                      className="p-1 rounded-lg"
                      variant="solid"
                      action="negative"
                    >
                      <ButtonIcon as={TrashIcon} />
                    </Button>
                  </HStack>
                </HStack>
              </Card>
            ))}
          </VStack>
        )}

        {/* Add Button */}
        <Button
          variant="outline"
          size="md"
          onPress={handleAddClick}
          isDisabled={disabled || !canAddMore}
          className="w-full p-1"
        >
          <ButtonIcon as={AddIcon} />
          <ButtonText>Add Ingredient</ButtonText>
        </Button>

        {/* Max items reached message */}
        {!canAddMore && (
          <Text size="sm" className="text-muted-foreground text-center italic">
            Maximum {maxItems} ingredients reached
          </Text>
        )}
      </VStack>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <AlertDialogBackdrop />
        <AlertDialogContent>
          <AlertDialogHeader>
            <Text size="lg" className="font-semibold">
              Delete Ingredient
            </Text>
            <AlertDialogCloseButton>
              <Icon as={CloseIcon} />
            </AlertDialogCloseButton>
          </AlertDialogHeader>
          <AlertDialogBody>
            <Text className="text-muted-foreground">
              Are you sure you want to remove this ingredient? This action
              cannot be undone.
            </Text>
          </AlertDialogBody>
          <AlertDialogFooter>
            <HStack space="md" className="w-full">
              <Button
                variant="outline"
                size="sm"
                onPress={() => setDeleteDialogOpen(false)}
                className="flex-1"
              >
                <ButtonText>Cancel</ButtonText>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onPress={confirmDelete}
                className="flex-1 border-destructive"
              >
                <ButtonText className="text-destructive">Delete</ButtonText>
              </Button>
            </HStack>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Modal */}
      <IngredientModal
        isOpen={modalVisible}
        onClose={() => setModalVisible(false)}
        onSave={handleSave}
        onDelete={editingIndex !== null ? handleDelete : undefined}
        initialValue={
          editingIndex !== null ? ingredients[editingIndex].value : ""
        }
        isEdit={editingIndex !== null}
      />
    </>
  );
};
