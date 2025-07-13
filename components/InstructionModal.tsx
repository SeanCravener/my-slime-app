import React, { useState, useEffect } from "react";
import { ScrollView } from "react-native";
import {
  Modal,
  ModalBackdrop,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
} from "@/components/ui/modal";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { Button, ButtonText } from "@/components/ui/button";
import { Textarea, TextareaInput } from "@/components/ui/textarea";
import { Heading } from "@/components/ui/heading";
import { X } from "lucide-react-native";
import {
  FormControl,
  FormControlLabel,
  FormControlError,
  FormControlErrorText,
  FormControlHelper,
  FormControlHelperText,
} from "@/components/ui/form-control";
import { ImageUploadField } from "@/components/ImageUploadField";

interface InstructionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { content: string; "image-url": string }) => void;
  onDelete?: () => void;
  initialValue?: { content: string; "image-url": string };
  isEdit?: boolean;
  stepNumber?: number;
  // New props for deferred upload
  deferUpload?: boolean;
  onImagePicked?: (uri: string) => void;
  localImageUri?: string;
}

export const InstructionModal: React.FC<InstructionModalProps> = ({
  isOpen,
  onClose,
  onSave,
  onDelete,
  initialValue = { content: "", "image-url": "" },
  isEdit = false,
  stepNumber,
  deferUpload = false,
  onImagePicked,
  localImageUri,
}) => {
  const [content, setContent] = useState(initialValue.content);
  const [imageUrl, setImageUrl] = useState(initialValue["image-url"]);
  const [error, setError] = useState("");

  // Reset values when modal opens
  useEffect(() => {
    if (isOpen) {
      setContent(initialValue.content);
      setImageUrl(initialValue["image-url"]);
      setError("");
    }
  }, [isOpen, initialValue]);

  const handleSave = () => {
    const trimmedContent = content.trim();
    if (!trimmedContent) {
      setError("Instruction cannot be empty");
      return;
    }
    onSave({ content: trimmedContent, "image-url": imageUrl });
    setContent("");
    setImageUrl("");
    onClose();
  };

  const handleCancel = () => {
    setContent("");
    setImageUrl("");
    setError("");
    onClose();
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete();
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleCancel}>
      <ModalBackdrop />
      <ModalContent className="w-11/12 max-w-lg max-h-4/5">
        <ModalHeader>
          <Heading size="lg">
            {isEdit
              ? `Edit Step ${stepNumber || ""}`
              : `Add Step ${stepNumber || ""}`}
          </Heading>
          <ModalCloseButton>
            <X size={16} />
          </ModalCloseButton>
        </ModalHeader>

        <ModalBody>
          <ScrollView showsVerticalScrollIndicator={false}>
            <VStack space="lg">
              {/* Instruction Content */}
              <FormControl isInvalid={!!error}>
                <FormControlLabel>
                  <Text size="sm" className="font-medium text-foreground mb-2">
                    Instruction
                  </Text>
                </FormControlLabel>

                <Textarea>
                  <TextareaInput
                    value={content}
                    onChangeText={(text) => {
                      setContent(text);
                      if (error) setError("");
                    }}
                    placeholder="Describe this step in detail..."
                    style={{ minHeight: 120 }}
                    autoFocus
                  />
                </Textarea>

                {error && (
                  <FormControlError>
                    <FormControlErrorText>{error}</FormControlErrorText>
                  </FormControlError>
                )}

                <FormControlHelper>
                  <FormControlHelperText>
                    <Text size="sm" className="text-muted-foreground">
                      Be clear and specific about what to do in this step
                    </Text>
                  </FormControlHelperText>
                </FormControlHelper>
              </FormControl>

              {/* Image Upload */}
              <ImageUploadField
                label="Step Image (Optional)"
                value={imageUrl}
                onChange={setImageUrl}
                bucket="instruction-images"
                height={160}
                helpText="Add a photo to help visualize this step"
                placeholder="Add Step Image"
                deferUpload={deferUpload}
                onImagePicked={onImagePicked}
                localImageUri={localImageUri}
              />
            </VStack>
          </ScrollView>
        </ModalBody>

        <ModalFooter>
          <HStack space="sm" className="w-full">
            {isEdit && onDelete && (
              <Button
                variant="outline"
                size="sm"
                onPress={handleDelete}
                className="flex-1 border-destructive"
              >
                <ButtonText className="text-destructive">Delete</ButtonText>
              </Button>
            )}

            <Button
              variant="outline"
              size="sm"
              onPress={handleCancel}
              className="flex-1"
            >
              <ButtonText>Cancel</ButtonText>
            </Button>

            <Button
              variant="solid"
              size="sm"
              onPress={handleSave}
              className="flex-1"
            >
              <ButtonText>Save</ButtonText>
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
