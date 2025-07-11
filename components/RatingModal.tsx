import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalBackdrop,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@/components/ui/modal";
import { Button, ButtonText, ButtonIcon } from "@/components/ui/button";
import { StarIcon } from "@/components/ui/icon";
import { HStack } from "@/components//ui/hstack";
import { Heading } from "@/components/ui/heading";

interface RatingModalProps {
  isOpen: boolean;
  onSubmit: (rating: number) => void;
  onClose: () => void;
  initialRating?: number;
  maxRating?: number;
  title?: string;
}

export const RatingModal: React.FC<RatingModalProps> = ({
  isOpen,
  onSubmit,
  onClose,
  initialRating = 0,
  maxRating = 5,
  title = "No Title",
}) => {
  const [selectedRating, setSelectedRating] = useState(initialRating);

  // TODO: Try without useEffect, resets when the modal is opened.
  useEffect(() => {
    if (isOpen) {
      setSelectedRating(initialRating);
    }
  }, [isOpen, initialRating]);

  const handleSave = () => {
    onSubmit(selectedRating);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalBackdrop />
      <ModalContent>
        <ModalHeader>
          <Heading className="text-center">
            How would you rate {title} Recipe?
          </Heading>
        </ModalHeader>
        <ModalBody>
          <HStack space="xs" className="justify-evenly">
            {Array.from({ length: maxRating }, (_, index) => {
              const filled = index < selectedRating;
              return (
                <Button
                  variant="link"
                  key={index}
                  onPress={() => setSelectedRating(index + 1)}
                  hitSlop={8}
                >
                  <ButtonIcon
                    as={StarIcon}
                    className={
                      filled
                        ? "text-yellow-500 fill-yellow-500"
                        : "text-muted-foreground fill-transparent"
                    }
                  />
                </Button>
              );
            })}
          </HStack>
        </ModalBody>
        <ModalFooter>
          <HStack space="md" className="flex-1">
            <Button variant="outline" onPress={onClose} className="flex-1">
              <ButtonText>Not Now</ButtonText>
            </Button>
            <Button variant="solid" onPress={handleSave} className="flex-1">
              <ButtonText>Save Rating</ButtonText>
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
