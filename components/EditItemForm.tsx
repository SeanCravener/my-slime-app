import React, { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ScrollView } from "react-native";
import { itemFormSchema } from "@/lib/schemas";
import { ItemFormData } from "@/types/item";
import { useDeferredFormImages } from "@/hooks/useDeferredFormImages";
import { Box } from "@/components/ui/box";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { Button, ButtonText } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import {
  Modal,
  ModalBackdrop,
  ModalContent,
  ModalBody,
} from "@/components/ui/modal";
import {
  AlertDialog,
  AlertDialogBackdrop,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogCloseButton,
  AlertDialogFooter,
  AlertDialogBody,
} from "@/components/ui/alert-dialog";
import { Icon, AlertCircleIcon, CloseIcon } from "@/components/ui/icon";
import { FormSection } from "@/components/FormSection";
import { ItemFormField } from "@/components/ItemFormField";
import { CategorySelect } from "@/components/CategorySelect";
import { ImageUploadField } from "@/components/ImageUploadField";
import { IngredientsList } from "@/components/IngredientsList";
import { InstructionsList } from "@/components/InstructionsList";

interface EditItemFormProps {
  initialValues: ItemFormData;
  onSubmit: (data: ItemFormData & { imagesToCleanup?: string[] }) => void;
  onDelete: () => void;
  isSaving: boolean;
  isDeleting: boolean;
  error?: Error | null;
}

export const EditItemForm: React.FC<EditItemFormProps> = ({
  initialValues,
  onSubmit,
  onDelete,
  isSaving,
  isDeleting,
  error,
}) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const {
    setLocalImage,
    clearLocalImage,
    clearAllLocalImages,
    uploadAllImages,
    isUploading,
    getLocalImageUri,
    hasLocalImage,
  } = useDeferredFormImages();

  // Custom resolver that handles deferred images
  const customResolver = React.useCallback(
    async (data: any, context: any, options: any) => {
      const dataToValidate = { ...data };
      if (hasLocalImage("main_image") && !dataToValidate.main_image) {
        dataToValidate.main_image = "will-be-uploaded";
      }
      return zodResolver(itemFormSchema)(dataToValidate, context, options);
    },
    [hasLocalImage]
  );

  const { control, handleSubmit, setValue, watch, reset, formState } =
    useForm<ItemFormData>({
      resolver: customResolver,
      defaultValues: initialValues,
    });

  const ingredientsArray = useFieldArray({
    control,
    name: "ingredients",
  });

  const instructionsArray = useFieldArray({
    control,
    name: "instructions",
  });

  // Reset form when initial values change
  useEffect(() => {
    reset(initialValues);
    clearAllLocalImages();
  }, [initialValues, reset, clearAllLocalImages]);

  const handleFormSubmit = async (data: ItemFormData) => {
    try {
      const imagesToCleanup: string[] = [];

      // Upload all local images
      const uploadResults = await uploadAllImages();

      // Create final data with uploaded URLs
      let finalData = { ...data };

      // Update form data with uploaded URLs and track replaced images
      uploadResults.forEach(({ fieldPath, url }) => {
        if (fieldPath === "main_image") {
          // Mark old main image for cleanup if replacing
          if (initialValues.main_image && initialValues.main_image !== url) {
            imagesToCleanup.push(initialValues.main_image);
          }
          finalData.main_image = url;
        } else if (fieldPath.startsWith("instructions.")) {
          const match = fieldPath.match(/instructions\.(\d+)\.image-url/);
          if (match) {
            const index = parseInt(match[1]);
            if (finalData.instructions[index]) {
              // Mark old instruction image for cleanup if replacing
              const oldUrl = initialValues.instructions[index]?.["image-url"];
              if (oldUrl && oldUrl !== url) {
                imagesToCleanup.push(oldUrl);
              }
              finalData.instructions[index]["image-url"] = url;
            }
          }
        }
      });

      // Check for removed instruction images
      initialValues.instructions.forEach((instruction, index) => {
        if (instruction["image-url"]) {
          if (finalData.instructions[index]) {
            // Image was removed (not replaced)
            if (
              !finalData.instructions[index]["image-url"] &&
              !hasLocalImage(`instructions.${index}.image-url`)
            ) {
              imagesToCleanup.push(instruction["image-url"]);
            }
          } else {
            // Instruction was deleted, cleanup its image
            imagesToCleanup.push(instruction["image-url"]);
          }
        }
      });

      // Submit with uploaded URLs and cleanup list
      onSubmit({ ...finalData, imagesToCleanup });
    } catch (error) {
      console.error("Form submission error:", error);
    }
  };

  const handleDeleteConfirm = () => {
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    setDeleteDialogOpen(false);
    onDelete();
  };

  const isFormDisabled = isSaving || isDeleting || isUploading;

  const handleMainImagePicked = (uri: string) => {
    if (uri) {
      setLocalImage("main_image", uri, "item-images");
      setValue("main_image", "");
    } else {
      clearLocalImage("main_image");
      setValue("main_image", initialValues.main_image);
    }
  };

  return (
    <Box className="flex-1">
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          padding: 16,
          paddingBottom: 120,
        }}
        showsVerticalScrollIndicator={false}
      >
        <VStack space="md">
          <FormSection>
            <ImageUploadField
              label="Recipe Photo"
              value={watch("main_image")}
              onChange={(url) => setValue("main_image", url)}
              bucket="item-images"
              disabled={isFormDisabled}
              required
              helpText="Update your recipe photo"
              height={240}
              placeholder="Change Recipe Photo"
              deferUpload={true}
              onImagePicked={handleMainImagePicked}
              localImageUri={getLocalImageUri("main_image")}
            />
          </FormSection>

          <FormSection title="Recipe Details">
            <VStack space="lg">
              <ItemFormField
                control={control}
                name="title"
                label="Recipe Title"
                placeholder="Enter recipe title"
                disabled={isFormDisabled}
                required
                helpText="Update your recipe name"
              />

              <ItemFormField
                control={control}
                name="description"
                label="Description"
                placeholder="Describe your recipe..."
                multiline
                disabled={isFormDisabled}
                helpText="Modify your recipe description"
              />

              <CategorySelect
                control={control}
                disabled={isFormDisabled}
                required
                helpText="Update the category that best describes your recipe"
              />
            </VStack>
          </FormSection>

          <FormSection
            title="Ingredients"
            subtitle={`${ingredientsArray.fields.length}/20 ingredients`}
          >
            <IngredientsList
              ingredients={ingredientsArray.fields}
              onAdd={(value) => ingredientsArray.append({ value })}
              onEdit={(index, value) =>
                ingredientsArray.update(index, { value })
              }
              onDelete={(index) => ingredientsArray.remove(index)}
              disabled={isFormDisabled}
              maxItems={20}
            />
          </FormSection>

          <FormSection
            title="Steps"
            subtitle={`${instructionsArray.fields.length}/15 steps`}
          >
            <InstructionsList
              instructions={instructionsArray.fields}
              onAdd={(instruction) => instructionsArray.append(instruction)}
              onEdit={(index, instruction) =>
                instructionsArray.update(index, instruction)
              }
              onDelete={(index) => {
                clearLocalImage(`instructions.${index}.image-url`);
                instructionsArray.remove(index);

                // Update field paths for remaining instruction images
                const totalInstructions = instructionsArray.fields.length;
                for (let i = index + 1; i < totalInstructions; i++) {
                  const oldPath = `instructions.${i}.image-url`;
                  const newPath = `instructions.${i - 1}.image-url`;
                  const uri = getLocalImageUri(oldPath);
                  if (uri) {
                    clearLocalImage(oldPath);
                    setLocalImage(newPath, uri, "instruction-images");
                  }
                }
              }}
              disabled={isFormDisabled}
              maxItems={15}
              deferUpload={true}
              onInstructionImagePicked={(index, uri) => {
                if (uri) {
                  setLocalImage(
                    `instructions.${index}.image-url`,
                    uri,
                    "instruction-images"
                  );
                } else {
                  clearLocalImage(`instructions.${index}.image-url`);
                }
              }}
              localImageUris={(() => {
                const uris: { [key: number]: string } = {};
                instructionsArray.fields.forEach((_, index) => {
                  const uri = getLocalImageUri(
                    `instructions.${index}.image-url`
                  );
                  if (uri) {
                    uris[index] = uri;
                  }
                });
                return uris;
              })()}
            />
          </FormSection>

          <HStack space="md" className="mt-4">
            <Button
              variant="outline"
              size="lg"
              onPress={handleDeleteConfirm}
              isDisabled={isFormDisabled}
              className="flex-1 border-destructive"
            >
              <ButtonText className="text-destructive">
                {isDeleting ? "Deleting..." : "Delete Recipe"}
              </ButtonText>
            </Button>

            <Button
              size="lg"
              onPress={handleSubmit(handleFormSubmit)}
              isDisabled={isFormDisabled || !formState.isValid}
              className="flex-1"
            >
              <ButtonText>
                {isSaving
                  ? "Saving..."
                  : isUploading
                  ? "Uploading..."
                  : "Save Changes"}
              </ButtonText>
            </Button>
          </HStack>
        </VStack>
      </ScrollView>

      <AlertDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <AlertDialogBackdrop />
        <AlertDialogContent>
          <AlertDialogHeader>
            <Text size="lg" className="font-semibold">
              Delete Recipe
            </Text>
            <AlertDialogCloseButton>
              <Icon as={CloseIcon} />
            </AlertDialogCloseButton>
          </AlertDialogHeader>
          <AlertDialogBody>
            <Text className="text-muted-foreground">
              Are you sure you want to delete this recipe? This action cannot be
              undone and will permanently remove the recipe and all its data.
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

      <AlertDialog isOpen={!!error} onClose={() => {}}>
        <AlertDialogBackdrop />
        <AlertDialogContent>
          <AlertDialogHeader>
            <HStack space="sm" className="items-center">
              <Icon as={AlertCircleIcon} className="text-error" />
              <Text size="lg" className="font-semibold">
                Error
              </Text>
            </HStack>
          </AlertDialogHeader>
          <AlertDialogBody>
            <Text className="text-muted-foreground">
              {error?.message ||
                "An error occurred while processing your request"}
            </Text>
          </AlertDialogBody>
        </AlertDialogContent>
      </AlertDialog>

      <Modal isOpen={isUploading} onClose={() => {}}>
        <ModalBackdrop />
        <ModalContent className="w-4/5 max-w-sm">
          <ModalBody className="p-6">
            <VStack space="md" className="items-center">
              <Spinner size="large" />
              <Text size="md" className="font-medium text-foreground">
                Uploading Images...
              </Text>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};
