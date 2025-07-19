import React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ScrollView } from "react-native";
import { itemFormSchema } from "@/lib/schemas";
import { ItemFormData } from "@/types/item";
import { useAddItem } from "@/hooks/useAddItem";
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
  AlertDialogBody,
} from "@/components/ui/alert-dialog";
import { Icon, AlertCircleIcon } from "@/components/ui/icon";
import { FormSection } from "@/components/FormSection";
import { ItemFormField } from "@/components/ItemFormField";
import { CategorySelect } from "@/components/CategorySelect";
import { ImageUploadField } from "@/components/ImageUploadField";
import { IngredientsList } from "@/components/IngredientsList";
import { InstructionsList } from "@/components/InstructionsList";

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
    console.log("🚀 Form submitted", data);

    try {
      // Validate we have required images
      if (!hasLocalImage("main_image") && !data.main_image) {
        throw new Error("Main image is required");
      }

      // Upload all local images first
      console.log("📤 Starting image uploads...");
      const uploadResults = await uploadAllImages();
      console.log("✅ Upload results:", uploadResults);

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

      if (
        !finalData.main_image ||
        finalData.main_image === "will-be-uploaded"
      ) {
        throw new Error("Failed to upload main image");
      }

      // Submit with uploaded URLs
      addItemMutation.mutate(finalData, {
        onSuccess: (item) => {
          reset();
          clearAllLocalImages();

          // Delay navigation to prevent view hierarchy conflicts
          setTimeout(() => {
            onSuccess(item);
          }, 100);
        },
        onError: async (error) => {
          throw error;
        },
      });
    } catch (error) {
      console.error("Form submission error:", error);
    }
  };

  const isFormDisabled = addItemMutation.isPending || isUploading;

  // Handle main image selection
  const handleMainImagePicked = (uri: string) => {
    if (uri) {
      console.log("🖼️ Main image selected:", uri);
      setLocalImage("main_image", uri, "item-images");
      // Don't set a value in the form, let the custom resolver handle it
    } else {
      console.log("🗑️ Main image cleared");
      clearLocalImage("main_image");
    }
  };

  // Determine current error to display
  const displayError = addItemMutation.error || (formState.errors as any)?.root;

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
        isOpen={!!displayError}
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
              {displayError instanceof Error
                ? displayError.message
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
              <Text size="sm" className="text-muted-foreground">
                Please don't close the app
              </Text>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};
