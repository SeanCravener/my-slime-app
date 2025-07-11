import React, { useState, useCallback, useMemo } from "react";
import { ScrollView, Image } from "react-native";
import { useLocalSearchParams, router, Stack } from "expo-router";
import { useItem } from "@/hooks/useItem";
import { useAuth } from "@/context/AuthContext";
import { useRateItem } from "@/hooks/useRateItem";
import { Instruction } from "@/types/item";
import { RatingModal } from "@/components/RatingModal";
import { StepProgressBar } from "@/components/StepProgressBar";
import { IngredientsDrawer } from "@/components/IngredientsDrawer";
import { Spinner } from "@/components/ui/spinner";
import { Button, ButtonText } from "@/components/ui/button";
import { Box } from "@/components/ui/box";
import { HStack } from "@/components/ui/hstack";
import { Center } from "@/components/ui/center";
import { Text } from "@/components/ui/text";
import { Heading } from "@/components/ui/heading";
import { Divider } from "@/components/ui/divider";
import { VStack } from "@/components/ui/vstack";
// Need to figure out how to make this responsive.
const IMAGE_HEIGHT = 300;
const CONTENT_OVERLAP = 40;

export default function Instructions() {
  const { id } = useLocalSearchParams();
  const { data: item, isLoading } = useItem(id as string);
  const { saveRating, isSaving, isError, error } = useRateItem(id as string);
  const { session } = useAuth();

  const [currentStep, setCurrentStep] = useState(0);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isRatingModalVisible, setIsRatingModalVisible] = useState(false);

  const handleExit = () => {
    router.back();
  };

  const handleCloseRating = () => {
    setIsRatingModalVisible(false);
    router.back();
  };

  const handleFinish = useCallback(() => {
    if (!session) return router.back();
    setIsRatingModalVisible(true);
  }, [session]);

  const handlePrevious = useCallback(() => {
    if (currentStep > 0) setCurrentStep((prev) => prev - 1);
  }, [currentStep]);

  const handleNext = useCallback(() => {
    if (item?.instructions && currentStep < item.instructions.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  }, [currentStep, item]);

  const handleRating = async (rating: number) => {
    console.log("handleRating called with:", rating);
    try {
      await saveRating(rating);
      console.log("Rating saved, closing modal");
      setIsRatingModalVisible(false);
      setTimeout(() => {
        router.back();
      }, 200);
    } catch (error) {
      console.error("Rating error:", error);
    }
  };

  if (isLoading || !item) {
    return (
      <Center>
        <Spinner size="large" />
      </Center>
    );
  }

  if (!item.instructions || item.instructions.length === 0) {
    return (
      <Center>
        <Text>No instructions available.</Text>
      </Center>
    );
  }

  const currentInstruction = useMemo(
    () => item.instructions?.[currentStep] as Instruction,
    [item.instructions, currentStep]
  );

  const isLastStep = useMemo(
    () => currentStep === item.instructions.length - 1,
    [currentStep, item.instructions]
  );

  // Transform ingredients for the drawer
  const transformedIngredients = useMemo(
    () =>
      (item.ingredients || []).map((ingredient) =>
        typeof ingredient === "string" ? { value: ingredient } : ingredient
      ),
    [item.ingredients]
  );

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: "",
          headerTransparent: true,
          headerStyle: {
            backgroundColor: "transparent",
          },
          headerTintColor: "#FFFFFF",
          headerRight: () =>
            !isDrawerOpen ? (
              <Button
                variant="solid"
                size="sm"
                onPress={() => setIsDrawerOpen(true)}
                className="mr-4"
              >
                <ButtonText>Ingredients</ButtonText>
              </Button>
            ) : null,
          headerLeft: () => null,
        }}
      />
      <Box className="flex-1">
        {/* Fixed Image - Top Half */}
        <Image
          source={{ uri: item.main_image }}
          alt="Recipe image"
          style={{
            height: IMAGE_HEIGHT,
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 1,
            resizeMode: "cover",
          }}
        />
        {/* Content Container - Bottom with overlap */}
        <Box
          style={{
            position: "absolute",
            top: IMAGE_HEIGHT - CONTENT_OVERLAP,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 2,
          }}
        >
          <Box
            style={{
              backgroundColor: "#FFFFFF",
              flex: 1,
              borderTopLeftRadius: 16,
              borderTopRightRadius: 16,
              boxShadow: "0px 0px 15px 2px #41111D",
              overflow: "hidden",
            }}
          >
            {/* Scrollable Content */}
            <ScrollView
              style={{ flex: 1 }}
              contentContainerStyle={{
                paddingBottom: 80,
              }}
              showsVerticalScrollIndicator={false}
            >
              <VStack space="lg" className="p-6">
                <Heading>{item.title}</Heading>
                <Divider orientation="horizontal" />
                {/* Description */}
                <Text bold={true}>Step {currentStep + 1}</Text>
                <Text className="ml-4">{currentInstruction.content}</Text>
              </VStack>
            </ScrollView>
          </Box>
        </Box>
        {/* Fixed Footer */}
        <Box
          className="absolute bottom-0 left-0 right-0 border-t border-border px-4 py-4"
          style={{
            zIndex: 3,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: 0.15,
            shadowRadius: 8,
            backgroundColor: "#FFFFFF",
            elevation: 5,
          }}
        >
          <VStack space="md">
            <StepProgressBar
              currentStep={currentStep + 1}
              totalSteps={item.instructions.length}
            />
            <HStack space="md" className="items-center">
              {isLastStep ? (
                <Button variant="solid" size="lg" onPress={handleFinish}>
                  <ButtonText>Finish Recipe</ButtonText>
                </Button>
              ) : (
                <HStack space="md" className="flex-1">
                  <Button
                    variant="solid"
                    size="md"
                    onPress={handleExit}
                    className="flex-1"
                  >
                    <ButtonText>Exit</ButtonText>
                  </Button>
                  <Button
                    variant="solid"
                    size="md"
                    onPress={handlePrevious}
                    disabled={currentStep === 0}
                    className="flex-1"
                  >
                    <ButtonText>Previous</ButtonText>
                  </Button>
                  <Button
                    variant="solid"
                    size="md"
                    onPress={handleNext}
                    className="flex-1"
                  >
                    <ButtonText>Next</ButtonText>
                  </Button>
                </HStack>
              )}
            </HStack>
          </VStack>
        </Box>
      </Box>
      <IngredientsDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        ingredients={transformedIngredients}
      />

      <RatingModal
        isOpen={isRatingModalVisible}
        onClose={handleCloseRating}
        onSubmit={handleRating}
        title={item.title}
      />
    </>
  );
}
