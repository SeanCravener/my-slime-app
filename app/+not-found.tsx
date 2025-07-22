import React from "react";
import { useRouter } from "expo-router";
import { Box } from "@/components/ui/box";
import { VStack } from "@/components/ui/vstack";
import { Text } from "@/components/ui/text";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Center } from "@/components/ui/center";
import { HStack } from "@/components/ui/hstack";
import { ArrowLeftIcon } from "@/components/ui/icon";

// TODO: Finalize Styling
export default function NotFoundScreen() {
  const router = useRouter();

  const handleGoHome = () => {
    router.replace("/(tabs)");
  };

  const handleGoBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/(tabs)");
    }
  };

  return (
    <Box className="flex-1 bg-background">
      <Center className="flex-1 px-6">
        <VStack space="xl" className="items-center max-w-sm">
          {/* Large 404 Text */}
          <VStack space="sm" className="items-center">
            <Text
              className="text-8xl font-bold text-primary"
              style={{ fontVariant: ["tabular-nums"] }}
            >
              404
            </Text>
            <Heading size="xl" className="text-foreground text-center">
              Page Not Found
            </Heading>
          </VStack>

          {/* Description */}
          <Text className="text-muted-foreground text-center text-base leading-relaxed">
            Oops! The page you're looking for doesn't exist. It might have been
            moved, deleted, or you entered the wrong URL.
          </Text>

          {/* Action Buttons */}
          <HStack space="sm" className="w-full">
            <Button variant="solid" size="lg" onPress={handleGoHome}>
              <ButtonText>Go to Home</ButtonText>
            </Button>

            <Button variant="outline" size="lg" onPress={handleGoBack}>
              <ButtonText>Go Back</ButtonText>
              <ButtonIcon as={ArrowLeftIcon} />
            </Button>
          </HStack>
        </VStack>
      </Center>
    </Box>
  );
}
