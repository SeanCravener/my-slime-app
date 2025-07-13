import React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ScrollView } from "react-native";
import { itemFormSchema } from "@/lib/schemas";
import { ItemFormData } from "@/types/item";
import { useAddItem } from "@/hooks/useAddItem";
import { useDeferredFormImages } from "@/hooks/useDeferredFormImages";
import { supabase } from "@/lib/supabase";
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
  AlertDialogBody,
} from "@/components/ui/alert-dialog";
import { Icon, AlertCircleIcon } from "@/components/ui/icon";
import { FormSection } from "@/components/FormSection";
import { ItemFormField } from "@/components/ItemFormField";
import { CategorySelect } from "@/components/CategorySelect";
import { ImageUploadField } from "@/components/ImageUploadField";
import { IngredientsList } from "@/components/IngredientsList";
import { InstructionsList } from "@/components/InstructionsList";

import { deleteStorageFile } from "@/lib/storage";

interface AddItemFormProps {
  userId: string;
  onSuccess: (item: { id: string }) => void;
}

export const AddItemForm: React.FC<AddItemFormProps> = ({
  userId,
  onSuccess,
}) => {
  const addItemMutation = useAddItem(userId);

  // Deferred image handling
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
      // If we have a local image but no URL, temporarily satisfy validation
      const dataToValidate = { ...data };
      if (hasLocalImage("main_image") && !dataToValidate.main_image) {
        dataToValidate.main_image = "will-be-uploaded";
      }

      // Run the normal validation
      return zodResolver(itemFormSchema)(dataToValidate, context, options);
    },
    [hasLocalImage]
  );

  const { control, handleSubmit, setValue, watch, reset, formState } =
    useForm<ItemFormData>({
      resolver: customResolver,
      defaultValues: {
        title: "",
        description: "",
        main_image: "",
        category_id: null,
        ingredients: [],
        instructions: [],
      },
    });

  const ingredientsArray = useFieldArray({
    control,
    name: "ingredients",
  });

  const instructionsArray = useFieldArray({
    control,
    name: "instructions",
  });

  const onSubmit = async (data: ItemFormData) => {
    console.log("Form submitted", data);

    let uploadedUrls: string[] = [];

    try {
      // First, upload all local images
      const uploadResults = await uploadAllImages();
      console.log("Upload results:", uploadResults);

      // Track uploaded URLs for potential cleanup
      uploadedUrls = uploadResults.map((result) => result.url);

      // Create a clean copy of the data
      let finalData = { ...data };

      // Update form data with uploaded URLs
      uploadResults.forEach(({ fieldPath, url }) => {
        if (fieldPath === "main_image") {
          finalData.main_image = url;
        } else if (fieldPath.startsWith("instructions.")) {
          const match = fieldPath.match(/instructions\.(\d+)\.image-url/);
          if (match) {
            const index = parseInt(match[1]);
            if (finalData.instructions[index]) {
              finalData.instructions[index]["image-url"] = url;
            }
          }
        }
      });

      // Ensure we don't have any placeholder values
      if (finalData.main_image === "pending" || finalData.main_image === "") {
        if (hasLocalImage("main_image")) {
          console.log("Main image failed to upload");
        }
      }

      console.log("Final data to submit:", finalData);

      // Submit with uploaded URLs
      addItemMutation.mutate(finalData, {
        onSuccess: (item) => {
          reset();
          clearAllLocalImages();
          onSuccess(item);
        },
        onError: async (error) => {
          console.error("Add item error:", error);
          // Clean up uploaded images if submission fails
          if (uploadedUrls.length > 0) {
            console.log("Cleaning up uploaded images after failure");
            for (const url of uploadedUrls) {
              try {
                const path = url.split("/").pop();
                if (path) {
                  const bucket = url.includes("instruction-images")
                    ? "instruction-images"
                    : "item-images";
                  await supabase.storage.from(bucket).remove([path]);
                }
              } catch (cleanupError) {
                console.error("Error cleaning up image:", cleanupError);
              }
            }
          }
        },
      });
    } catch (error) {
      console.error("Form submission error:", error);
      // Clean up any uploaded images if we failed before submission
      if (uploadedUrls.length > 0) {
        await Promise.all(uploadedUrls.map((url) => deleteStorageFile(url)));
      }
    }
  };

  const isFormDisabled = addItemMutation.isPending || isUploading;

  // Handle main image selection
  const handleMainImagePicked = (uri: string) => {
    if (uri) {
      setLocalImage("main_image", uri, "item-images");
      // Don't set a value in the form, let the custom resolver handle it
    } else {
      clearLocalImage("main_image");
    }
  };

  // Debug form state
  React.useEffect(() => {
    console.log("Form validation state:", {
      isValid: formState.isValid,
      errors: formState.errors,
      values: {
        title: watch("title"),
        description: watch("description"),
        main_image: watch("main_image"),
        category_id: watch("category_id"),
        ingredientsCount: watch("ingredients")?.length,
        instructionsCount: watch("instructions")?.length,
      },
    });
  }, [formState.isValid, formState.errors, watch]);

  return (
    <Box className="flex-1">
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          padding: 16,
          paddingBottom: 100,
        }}
        showsVerticalScrollIndicator={false}
      >
        <VStack space="md">
          {/* Main Image Section */}
          <FormSection>
            <ImageUploadField
              label="Recipe Photo"
              value={watch("main_image")}
              onChange={(url) => setValue("main_image", url)}
              bucket="item-images"
              disabled={isFormDisabled}
              required
              helpText="Add an appetizing photo of your finished recipe"
              height={240}
              placeholder="Add Recipe Photo"
              deferUpload={true}
              onImagePicked={handleMainImagePicked}
              localImageUri={getLocalImageUri("main_image")}
            />
          </FormSection>

          {/* Recipe Details Section */}
          <FormSection title="Recipe Details">
            <VStack space="lg">
              <ItemFormField
                control={control}
                name="title"
                label="Recipe Title"
                placeholder="Enter the title of your new recipe"
                disabled={isFormDisabled}
                required
                helpText="Give your recipe a descriptive and appetizing name"
              />

              <ItemFormField
                control={control}
                name="description"
                label="Description"
                placeholder="Describe your recipe..."
                multiline
                disabled={isFormDisabled}
                helpText="Tell people what makes this recipe special"
              />

              <CategorySelect
                control={control}
                disabled={isFormDisabled}
                required
                helpText="Choose the category that best describes your recipe"
              />
            </VStack>
          </FormSection>

          {/* Ingredients Section */}
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

          {/* Instructions Section */}
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
                // Clear local image for this instruction if it exists
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

          {/* Action Buttons */}
          <HStack space="md" className="mt-4">
            <Button
              variant="outline"
              size="lg"
              onPress={() => {
                reset();
                clearAllLocalImages();
              }}
              isDisabled={isFormDisabled}
              className="flex-1"
            >
              <ButtonText>Clear</ButtonText>
            </Button>

            <Button
              size="lg"
              onPress={handleSubmit(onSubmit)}
              isDisabled={isFormDisabled || !formState.isValid}
              className="flex-1"
            >
              <ButtonText>
                {addItemMutation.isPending ? "Publishing..." : "Publish"}
              </ButtonText>
            </Button>
          </HStack>
        </VStack>
      </ScrollView>

      {/* Error Dialog */}
      <AlertDialog
        isOpen={!!addItemMutation.error}
        onClose={() => addItemMutation.reset()}
      >
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
              {addItemMutation.error instanceof Error
                ? addItemMutation.error.message
                : "Failed to add recipe. Please try again."}
            </Text>
          </AlertDialogBody>
        </AlertDialogContent>
      </AlertDialog>

      {/* Upload Progress Modal */}
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
