import React, { useState, useEffect } from "react";
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
import { Input, InputField } from "@/components/ui/input";
import { Heading } from "@/components/ui/heading";
import { X } from "lucide-react-native";
import {
  FormControl,
  FormControlError,
  FormControlErrorText,
  FormControlHelper,
  FormControlHelperText,
} from "@/components/ui/form-control";

interface IngredientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (value: string) => void;
  onDelete?: () => void;
  initialValue?: string;
  isEdit?: boolean;
}

export const IngredientModal: React.FC<IngredientModalProps> = ({
  isOpen,
  onClose,
  onSave,
  onDelete,
  initialValue = "",
  isEdit = false,
}) => {
  const [value, setValue] = useState(initialValue);
  const [error, setError] = useState("");

  // Reset value when modal opens
  useEffect(() => {
    if (isOpen) {
      setValue(initialValue);
      setError("");
    }
  }, [isOpen, initialValue]);

  const handleSave = () => {
    const trimmedValue = value.trim();
    if (!trimmedValue) {
      setError("Ingredient cannot be empty");
      return;
    }
    onSave(trimmedValue);
    setValue("");
    onClose();
  };

  const handleCancel = () => {
    setValue("");
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
      <ModalContent className="w-11/12 max-w-md">
        <ModalHeader>
          <Heading size="lg">
            {isEdit ? "Edit Ingredient" : "Add Ingredient"}
          </Heading>
          <ModalCloseButton>
            <X size={16} />
          </ModalCloseButton>
        </ModalHeader>

        <ModalBody>
          <VStack space="md">
            <FormControl isInvalid={!!error}>
              <Input variant="outline">
                <InputField
                  value={value}
                  onChangeText={(text) => {
                    setValue(text);
                    if (error) setError("");
                  }}
                  placeholder="e.g., 2 cups flour"
                  autoFocus
                />
              </Input>

              {error && (
                <FormControlError>
                  <FormControlErrorText>{error}</FormControlErrorText>
                </FormControlError>
              )}

              <FormControlHelper>
                <FormControlHelperText>
                  <Text size="sm" className="text-muted-foreground">
                    Include quantity and unit (e.g., "250g butter", "1 tsp
                    salt")
                  </Text>
                </FormControlHelperText>
              </FormControlHelper>
            </FormControl>
          </VStack>
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
