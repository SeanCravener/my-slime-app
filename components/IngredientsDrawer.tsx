import React from "react";
import {
  Drawer,
  DrawerBackdrop,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
} from "@/components/ui/drawer";
import { VStack } from "@/components/ui/vstack";
import { Divider } from "@/components/ui/divider";
import { Button, ButtonText } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { Ingredient } from "@/types/item";

interface IngredientsDrawerProps {
  ingredients: Ingredient[];
  isOpen: boolean;
  onClose: () => void;
}

export const IngredientsDrawer: React.FC<IngredientsDrawerProps> = ({
  ingredients,
  isOpen,
  onClose,
}) => {
  const heading: String = "Ingredients";

  return (
    <Drawer
      size="lg"
      isOpen={isOpen}
      onClose={onClose}
      closeOnOverlayClick={true}
    >
      <DrawerBackdrop />
      <DrawerContent>
        <DrawerHeader>
          <Heading>{heading}</Heading>
        </DrawerHeader>
        <DrawerBody>
          <VStack space="xs" className="overflow-auto">
            <Divider orientation="horizontal" />
            {ingredients.map((ingredient, index) => (
              <Text size="sm" key={index}>
                • {ingredient.value}
              </Text>
            ))}
          </VStack>
        </DrawerBody>
        <DrawerFooter>
          <Button action="primary" variant="solid" size="lg" onPress={onClose}>
            <ButtonText>Close</ButtonText>
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
