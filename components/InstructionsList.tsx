import React, { useState } from "react";
import { Image } from "react-native";
import { Box } from "@/components/ui/box";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { Button, ButtonText, ButtonIcon } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge, BadgeText } from "@/components/ui/badge";
import { ImagePlus } from "lucide-react-native";
import {
  AlertDialog,
  AlertDialogBackdrop,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogCloseButton,
  AlertDialogFooter,
  AlertDialogBody,
} from "@/components/ui/alert-dialog";
import { Icon, AddIcon, TrashIcon, CloseIcon } from "@/components/ui/icon";
import { EditButton } from "@/components/EditButton";
import { InstructionModal } from "@/components/InstructionModal";

interface Instruction {
  content: string;
  "image-url": string;
}

interface InstructionsListProps {
  instructions: Instruction[];
  onAdd: (instruction: Instruction) => void;
  onEdit: (index: number, instruction: Instruction) => void;
  onDelete: (index: number) => void;
  disabled?: boolean;
  maxItems?: number;
  // New props for deferred upload
  deferUpload?: boolean;
  onInstructionImagePicked?: (index: number, uri: string) => void;
  localImageUris?: { [key: number]: string };
}

export const InstructionsList: React.FC<InstructionsListProps> = ({
  instructions,
  onAdd,
  onEdit,
  onDelete,
  disabled = false,
  maxItems = 15,
  deferUpload = false,
  onInstructionImagePicked,
  localImageUris = {},
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [tempLocalImageUri, setTempLocalImageUri] = useState<string>("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingIndex, setDeletingIndex] = useState<number | null>(null);

  const handleAddClick = () => {
    setEditingIndex(null);
    setTempLocalImageUri("");
    setModalVisible(true);
  };

  const handleEditClick = (index: number) => {
    setEditingIndex(index);
    setTempLocalImageUri(localImageUris[index] || "");
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

  const handleSave = (instruction: Instruction) => {
    if (editingIndex !== null) {
      onEdit(editingIndex, instruction);
      // Update local image if changed
      if (
        deferUpload &&
        onInstructionImagePicked &&
        tempLocalImageUri !== localImageUris[editingIndex]
      ) {
        onInstructionImagePicked(editingIndex, tempLocalImageUri);
      }
    } else {
      onAdd(instruction);
      // Set local image for new instruction
      if (deferUpload && onInstructionImagePicked && tempLocalImageUri) {
        const newIndex = instructions.length;
        onInstructionImagePicked(newIndex, tempLocalImageUri);
      }
    }
    setModalVisible(false);
    setEditingIndex(null);
    setTempLocalImageUri("");
  };

  const handleDelete = () => {
    if (editingIndex !== null) {
      onDelete(editingIndex);
    }
    setModalVisible(false);
    setEditingIndex(null);
  };

  const canAddMore = instructions.length < maxItems;

  const renderInstruction = (instruction: Instruction, index: number) => {
    const stepNumber = index + 1;
    // Use local image if available, otherwise use the URL
    const displayImageUri = localImageUris[index] || instruction["image-url"];
    const hasImage = displayImageUri && displayImageUri.length > 0;

    return (
      <Card
        key={index}
        variant="outline"
        className={`p-4 ${disabled ? "opacity-60" : ""}`}
      >
        <HStack space="md" className="items-start">
          {/* Step Number Badge */}
          <Badge
            variant="solid"
            className="bg-primary w-7 h-7 rounded-full items-center justify-center mt-1"
          >
            <BadgeText className="text-primary-foreground text-sm font-bold">
              {stepNumber}
            </BadgeText>
          </Badge>

          {/* Content Area */}
          <VStack space="sm" className="flex-1">
            <HStack space="md" className="items-start">
              {/* Thumbnail */}
              <Box
                className="w-15 h-15 rounded-md bg-muted overflow-hidden"
                style={{ width: 60, height: 60 }}
              >
                {hasImage ? (
                  <Image
                    source={{ uri: displayImageUri }}
                    style={{ width: "100%", height: "100%" }}
                    resizeMode="cover"
                  />
                ) : (
                  <Box className="flex-1 items-center justify-center">
                    <ImagePlus size={20} className="text-muted-foreground" />
                  </Box>
                )}
              </Box>

              {/* Instruction Text */}
              <Text
                size="md"
                className="flex-1 text-foreground leading-5"
                numberOfLines={3}
              >
                {instruction.content}
              </Text>
            </HStack>
          </VStack>

          {/* Action Buttons */}
          <HStack space="xs" className="items-center">
            <EditButton
              onPress={disabled ? () => {} : () => handleEditClick(index)}
              disabled={disabled}
              variant="solid"
            />

            <Button
              onPress={disabled ? undefined : () => handleDeleteClick(index)}
              disabled={disabled}
              variant="solid"
              action="negative"
              className="p-1 rounded-lg"
            >
              <ButtonIcon as={TrashIcon} />
            </Button>
          </HStack>
        </HStack>
      </Card>
    );
  };

  return (
    <>
      <VStack space="md">
        {/* Instructions List */}
        {instructions.length === 0 ? (
          <Card variant="outline" className="p-4">
            <Text size="sm" className="text-muted-foreground text-center">
              No steps added yet
            </Text>
          </Card>
        ) : (
          <VStack space="xs">
            {instructions.map((instruction, index) =>
              renderInstruction(instruction, index)
            )}
          </VStack>
        )}

        {/* Add Button */}
        <Button
          variant="outline"
          size="md"
          onPress={handleAddClick}
          isDisabled={disabled || !canAddMore}
          className="w-full"
          action="positive"
        >
          <ButtonIcon as={AddIcon} />
          <ButtonText>Add Step</ButtonText>
        </Button>

        {/* Max items reached message */}
        {!canAddMore && (
          <Text size="sm" className="text-muted-foreground text-center italic">
            Maximum {maxItems} steps reached
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
              Delete Step
            </Text>
            <AlertDialogCloseButton>
              <Icon as={CloseIcon} />
            </AlertDialogCloseButton>
          </AlertDialogHeader>
          <AlertDialogBody>
            <Text className="text-muted-foreground">
              Are you sure you want to remove this step? This action cannot be
              undone.
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
      <InstructionModal
        isOpen={modalVisible}
        onClose={() => {
          setModalVisible(false);
          setTempLocalImageUri("");
        }}
        onSave={handleSave}
        onDelete={editingIndex !== null ? handleDelete : undefined}
        initialValue={
          editingIndex !== null
            ? instructions[editingIndex]
            : { content: "", "image-url": "" }
        }
        isEdit={editingIndex !== null}
        stepNumber={
          editingIndex !== null ? editingIndex + 1 : instructions.length + 1
        }
        deferUpload={deferUpload}
        onImagePicked={setTempLocalImageUri}
        localImageUri={tempLocalImageUri}
      />
    </>
  );
};
