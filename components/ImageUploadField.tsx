import React, { useState, useCallback } from "react";
import { Pressable, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
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
  // Deferred upload props
  deferUpload?: boolean;
  onImagePicked?: (uri: string) => void;
  localImageUri?: string;
  // Additional props for better UX
  maxSize?: number; // Max file size in MB
  acceptedFormats?: string[]; // Accepted file formats
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
  maxSize = 10, // 10MB default
  acceptedFormats = ["jpg", "jpeg", "png", "webp"],
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Determine what to display: local image takes precedence over uploaded URL
  const displayUri = localImageUri || value;

  // Validate image before processing
  const validateImage = useCallback(
    (asset: ImagePicker.ImagePickerAsset): boolean => {
      // Check file size
      if (asset.fileSize && asset.fileSize > maxSize * 1024 * 1024) {
        setError(`Image size must be less than ${maxSize}MB`);
        return false;
      }

      // Check file format
      const extension = asset.uri.split(".").pop()?.toLowerCase();
      if (extension && !acceptedFormats.includes(extension)) {
        setError(`Only ${acceptedFormats.join(", ")} formats are supported`);
        return false;
      }

      return true;
    },
    [maxSize, acceptedFormats]
  );

  // Request camera permissions if needed
  const requestPermissions = useCallback(async (): Promise<boolean> => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      Alert.alert(
        "Permission Required",
        "Please grant photo library access to upload images.",
        [{ text: "OK" }]
      );
      return false;
    }

    return true;
  }, []);

  // Handle image selection
  const handleImageSelect = useCallback(async () => {
    if (disabled || isProcessing) return;

    try {
      setError(null);
      setIsProcessing(true);

      // Check permissions
      const hasPermission = await requestPermissions();
      if (!hasPermission) return;

      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [16, 9],
        quality: 0.8,
        exif: false, // Don't include EXIF data for privacy
      });

      if (result.canceled || !result.assets?.[0]) return;

      const selectedImage = result.assets[0];

      // Validate the selected image
      if (!validateImage(selectedImage)) return;

      if (deferUpload && onImagePicked) {
        // Deferred mode: just store the local URI
        onImagePicked(selectedImage.uri);
        onChange(""); // Clear the URL value since we're using local image
      } else {
        // Immediate mode: would need upload logic here
        // For now, this component is designed primarily for deferred mode
        console.warn(
          "Immediate upload mode not implemented in optimized version"
        );
        if (onImagePicked) {
          onImagePicked(selectedImage.uri);
        }
      }
    } catch (error) {
      console.error("Error selecting image:", error);
      setError("Failed to select image. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  }, [
    disabled,
    isProcessing,
    deferUpload,
    onImagePicked,
    onChange,
    validateImage,
    requestPermissions,
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
    onRemove?.();

    setError(null);
  }, [disabled, onChange, onRemove, deferUpload, onImagePicked]);

  // Show image selection options (could be extended to include camera)
  const showImageOptions = useCallback(() => {
    Alert.alert("Select Image", "Choose how you'd like to add an image", [
      { text: "Cancel", style: "cancel" },
      { text: "Photo Library", onPress: handleImageSelect },
      // Could add camera option here: { text: "Camera", onPress: handleCameraSelect },
    ]);
  }, [handleImageSelect]);

  const isDisabled = disabled || isProcessing;
  const hasImage = !!displayUri;

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

          {hasImage && showRemoveButton && (
            <Button
              variant="link"
              size="sm"
              onPress={handleRemove}
              isDisabled={isDisabled}
              accessibilityLabel="Remove image"
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
          onPress={showImageOptions}
          disabled={isDisabled}
          style={({ pressed }) => ({
            opacity: isDisabled ? 0.6 : pressed ? 0.8 : 1,
          })}
          accessibilityRole="button"
          accessibilityLabel={hasImage ? "Change image" : "Select image"}
          accessibilityState={{ disabled: isDisabled }}
          accessibilityHint={`Maximum size: ${maxSize}MB. Supported formats: ${acceptedFormats.join(
            ", "
          )}`}
        >
          <Card
            variant="outline"
            className={`overflow-hidden ${error ? "border-destructive" : ""} ${
              isProcessing ? "border-dashed border-primary" : ""
            }`}
            style={{ height }}
          >
            {hasImage && !isProcessing ? (
              // Show image preview
              <Box className="relative w-full h-full">
                <Image
                  source={{ uri: displayUri }}
                  alt="Selected image"
                  className="w-full h-full"
                  resizeMode="cover"
                  onError={() => setError("Failed to load image")}
                />

                {/* Change icon overlay */}
                <Box
                  className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm rounded-md p-2"
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
                {isProcessing ? (
                  <VStack space="sm" className="items-center">
                    <Spinner size="small" />
                    <Text size="sm" className="text-muted-foreground">
                      Processing...
                    </Text>
                  </VStack>
                ) : (
                  <VStack space="sm" className="items-center px-4">
                    <ImagePlus size={32} className="text-muted-foreground" />
                    <Text
                      size="sm"
                      className="text-muted-foreground font-medium text-center"
                    >
                      {placeholder}
                    </Text>
                    {!disabled && (
                      <VStack space="xs" className="items-center">
                        <Text
                          size="xs"
                          className="text-muted-foreground text-center"
                        >
                          Tap to select
                        </Text>
                        <Text
                          size="xs"
                          className="text-muted-foreground/70 text-center"
                        >
                          Max {maxSize}MB •{" "}
                          {acceptedFormats.join(", ").toUpperCase()}
                        </Text>
                      </VStack>
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
