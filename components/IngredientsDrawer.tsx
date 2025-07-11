import React from "react";
import {
  Drawer,
  DrawerBackdrop,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
} from "@/components/ui/drawer";
import { HStack } from "@/components/ui/hstack";
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
    <Drawer isOpen={isOpen} onClose={onClose} closeOnOverlayClick={true}>
      <DrawerBackdrop />
      <DrawerContent>
        <DrawerHeader>
          <Heading>{heading}</Heading>
        </DrawerHeader>
        <DrawerBody>
          <HStack space="xs">
            {ingredients.map((ingredient, index) => (
              <Text key={index}>• {ingredient.value}</Text>
            ))}
          </HStack>
        </DrawerBody>
        <DrawerFooter>
          {" "}
          <Button action="primary" variant="solid" size="lg" onPress={onClose}>
            <ButtonText>Close</ButtonText>
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
