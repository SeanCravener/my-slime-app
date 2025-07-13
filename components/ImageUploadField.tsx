import React, { useState, useCallback } from "react";
import { Pressable } from "react-native";
import { useImageUpload } from "@/hooks/useImageUpload";
import { Box } from "@/components/ui/box";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { Image } from "@/components/ui/image";
import { Card } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { Button, ButtonIcon } from "@/components/ui/button";
import { Center } from "@/components/ui/center";
import { Badge, BadgeText } from "@/components/ui/badge";
import { ImagePlus, Edit3, X } from "lucide-react-native";
import {
  FormControl,
  FormControlLabel,
  FormControlError,
  FormControlErrorText,
  FormControlHelper,
  FormControlHelperText,
} from "@/components/ui/form-control";

interface ImageUploadFieldProps {
  value?: string;
  onChange: (url: string) => void;
  label: string;
  bucket?: "item-images" | "instruction-images";
  disabled?: boolean;
  required?: boolean;
  helpText?: string;
  height?: number;
  showRemoveButton?: boolean;
  onRemove?: () => void;
  placeholder?: string;
  // New props for deferred mode
  deferUpload?: boolean;
  onImagePicked?: (uri: string) => void;
  localImageUri?: string;
}

export const ImageUploadField: React.FC<ImageUploadFieldProps> = ({
  value,
  onChange,
  label,
  bucket = "item-images",
  disabled = false,
  required = false,
  helpText,
  height = 200,
  showRemoveButton = true,
  onRemove,
  placeholder = "Upload Image",
  deferUpload = false,
  onImagePicked,
  localImageUri,
}) => {
  const { pickImage, uploadImage, isUploading } = useImageUpload();
  const [error, setError] = useState<string | null>(null);

  // Determine what to display: local image takes precedence over uploaded URL
  const displayUri = localImageUri || value;

  // Handle image selection
  const handleImageSelect = useCallback(async () => {
    if (disabled || isUploading) return;

    try {
      setError(null);
      const image = await pickImage();

      if (image) {
        if (deferUpload && onImagePicked) {
          // In deferred mode, just pass the local URI
          onImagePicked(image.uri);
          // Clear the value since we're using local image
          onChange("");
        } else {
          // In immediate mode, upload right away
          const url = await uploadImage(image.uri, bucket, value);
          onChange(url);
        }
      }
    } catch (error) {
      console.error("Error handling image:", error);
      setError("Failed to process image. Please try again.");
    }
  }, [
    disabled,
    isUploading,
    pickImage,
    uploadImage,
    bucket,
    value,
    onChange,
    deferUpload,
    onImagePicked,
  ]);

  // Handle remove
  const handleRemove = useCallback(() => {
    if (disabled) return;

    // Clear local image if in deferred mode
    if (deferUpload && onImagePicked) {
      onImagePicked("");
    }

    // Clear the value
    onChange("");

    // Call custom remove handler if provided
    if (onRemove) {
      onRemove();
    }

    setError(null);
  }, [disabled, onChange, onRemove, deferUpload, onImagePicked]);

  const isDisabled = disabled || isUploading;

  return (
    <FormControl isInvalid={!!error} isDisabled={isDisabled}>
      <VStack space="sm">
        {/* Label and Remove Button */}
        <HStack className="justify-between items-center">
          <FormControlLabel>
            <Text size="sm" className="font-medium text-foreground">
              {label}
              {required && <Text className="text-destructive"> *</Text>}
            </Text>
          </FormControlLabel>

          {displayUri && showRemoveButton && (
            <Button
              variant="link"
              size="sm"
              onPress={handleRemove}
              isDisabled={isDisabled}
            >
              <ButtonIcon as={X} className="text-destructive" />
            </Button>
          )}
        </HStack>

        {helpText && (
          <FormControlHelper>
            <FormControlHelperText>
              <Text size="sm" className="text-muted-foreground">
                {helpText}
              </Text>
            </FormControlHelperText>
          </FormControlHelper>
        )}

        {/* Upload Area */}
        <Pressable
          onPress={handleImageSelect}
          disabled={isDisabled}
          style={({ pressed }) => ({
            opacity: isDisabled ? 0.6 : pressed ? 0.8 : 1,
          })}
          accessibilityRole="button"
          accessibilityLabel={displayUri ? "Change image" : "Select image"}
          accessibilityState={{ disabled: isDisabled }}
        >
          <Card
            variant="outline"
            className={`overflow-hidden ${error ? "border-destructive" : ""} ${
              isUploading ? "border-dashed border-primary" : ""
            }`}
            style={{ height }}
          >
            {displayUri && !isUploading ? (
              // Show image preview
              <Box className="relative w-full h-full">
                <Image
                  source={{ uri: displayUri }}
                  alt="Selected image"
                  className="w-full h-full"
                  resizeMode="cover"
                />

                {/* Change icon overlay */}
                <Box
                  className="absolute top-2 right-2 bg-background rounded-md p-2"
                  style={{
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.15,
                    shadowRadius: 4,
                    elevation: 3,
                  }}
                >
                  <Edit3 size={16} className="text-foreground" />
                </Box>

                {/* Show indicator for local images */}
                {deferUpload && localImageUri && !value && (
                  <Box className="absolute bottom-2 left-2">
                    <Badge variant="solid" className="bg-primary">
                      <BadgeText className="text-primary-foreground">
                        Ready to upload
                      </BadgeText>
                    </Badge>
                  </Box>
                )}
              </Box>
            ) : (
              // Show placeholder
              <Center className="flex-1 bg-muted">
                {isUploading ? (
                  <VStack space="sm" className="items-center">
                    <Spinner size="small" />
                    <Text size="sm" className="text-muted-foreground">
                      Uploading...
                    </Text>
                  </VStack>
                ) : (
                  <VStack space="sm" className="items-center">
                    <ImagePlus size={32} className="text-muted-foreground" />
                    <Text
                      size="sm"
                      className="text-muted-foreground font-medium"
                    >
                      {placeholder}
                    </Text>
                    {!disabled && (
                      <Text size="xs" className="text-muted-foreground">
                        Tap to select
                      </Text>
                    )}
                  </VStack>
                )}
              </Center>
            )}
          </Card>
        </Pressable>

        {/* Error Message */}
        {error && (
          <FormControlError>
            <FormControlErrorText>{error}</FormControlErrorText>
          </FormControlError>
        )}
      </VStack>
    </FormControl>
  );
};
