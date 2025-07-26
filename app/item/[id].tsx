import React, { useEffect, useRef } from "react";
import { ScrollView, Image } from "react-native";
import { useLocalSearchParams, router, Stack } from "expo-router";
import { useItem } from "@/hooks/useItem";
import { useIncrementView } from "@/hooks/useIncrementView";
import { useAuth } from "@/context/AuthContext";
import { Box } from "@/components/ui/box";
import { HStack } from "@/components/ui/hstack";
import { Button, ButtonText } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { ItemDetails } from "@/components/ItemDetails";
import { ShareButton } from "@/components/ShareButton";
import { EditButton } from "@/components/EditButton";
import { BackButton } from "@/components/BackButton";

// Need to figure out how to make this responsive.
const IMAGE_HEIGHT = 300;
const CONTENT_OVERLAP = 40;

// Session-based view tracking - persists across component mounts but resets on sign out/in
const sessionViewedItems = new Set<string>();

// TODO: Make image responsive.
// TODO: Break up into smaller components if needed.
// TODO: Go through all the styles and convert to tailwind classes.
export default function ItemDetailScreen() {
  const { id } = useLocalSearchParams();
  const { data: item, isLoading } = useItem(id as string);
  const { session } = useAuth();
  const incrementView = useIncrementView();

  // Track session changes to clear viewed items when user signs out/in
  const currentUserId = useRef(session?.user?.id);

  useEffect(() => {
    // Clear viewed items if user changes (sign out/in)
    if (currentUserId.current !== session?.user?.id) {
      sessionViewedItems.clear();
      currentUserId.current = session?.user?.id;
    }
  }, [session?.user?.id]);

  // Track view when item loads (only once per session)
  useEffect(() => {
    if (item && id && !isLoading && session?.user) {
      // Added session?.user check
      const itemId = id as string;
      const isOwner = session.user.id === item.user_id;

      // Only increment if not owner and haven't viewed this item in current session
      if (!isOwner && !sessionViewedItems.has(itemId)) {
        sessionViewedItems.add(itemId);
        incrementView.mutate({ itemId });
      }
    }
  }, [item?.id, id, isLoading, session?.user?.id]);

  const handleStartRecipe = () => {
    router.push(`/item/${id}/instructions`);
  };

  const handleEditRecipe = () => {
    router.push(`/item/${id}/edit`);
  };

  if (isLoading || !item) {
    return (
      <Box className="flex-1 justify-center items-center">
        <Spinner size="large" />
      </Box>
    );
  }

  const isOwner = session?.user?.id === item.user_id;

  // Need to go through and fix all the styles to use tailwind classes
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
          headerRight: isOwner
            ? () => (
                <EditButton
                  onPress={handleEditRecipe}
                  size="md"
                  variant="solid"
                />
              )
            : undefined,
          headerLeft: () => <BackButton size="md" variant="solid" />,
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
              <ItemDetails
                id={item.id}
                title={item.title}
                category={item.category}
                rating={item.average_rating || 0}
                description={item.description}
                ingredients={(item.ingredients || []).map((ingredient) =>
                  typeof ingredient === "string"
                    ? { value: ingredient }
                    : ingredient
                )}
                authorId={item.user_id}
              />
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
          <HStack space="md" className="items-center">
            <Button size="lg" onPress={handleStartRecipe} className="flex-1">
              <ButtonText>Start Recipe</ButtonText>
            </Button>

            <ShareButton
              title={item.title}
              message={`Check out this recipe: ${item.title}`}
              size="lg"
              variant="outline"
            />
          </HStack>
        </Box>
      </Box>
    </>
  );
}
