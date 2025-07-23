import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { profileFormSchema, ProfileFormData } from "@/lib/schemas";
import { useAuth } from "@/context/AuthContext";
import { useUpdateProfile } from "@/hooks/useUpdateProfile";
import { useDeferredFormImages } from "@/hooks/useDeferredFormImages";
import { useGetUserProfile } from "@/hooks/useGetUserProfile";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { Box } from "@/components/ui/box";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { Heading } from "@/components/ui/heading";
import { Button, ButtonText } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Pressable } from "@/components/ui/pressable";
import {
  Modal,
  ModalBackdrop,
  ModalContent,
  ModalBody,
} from "@/components/ui/modal";
import {
  AlertDialog,
  AlertDialogBackdrop,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
} from "@/components/ui/alert-dialog";
import { Icon, AlertCircleIcon, ArrowLeftIcon } from "@/components/ui/icon";
import { FormSection } from "@/components/FormSection";
import { ItemFormField } from "@/components/ItemFormField";
import { ImageUploadField } from "@/components/ImageUploadField";

export default function EditProfileScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { shouldRender, isLoading: authLoading } = useRequireAuth();
  const updateProfileMutation = useUpdateProfile(user?.id);

  // Get current profile data
  const { data: profileData, isLoading: profileLoading } = useGetUserProfile(
    user?.id || ""
  );
  const currentProfile = profileData?.[0];

  // Deferred image handling
  const {
    setLocalImage,
    clearLocalImage,
    clearAllLocalImages,
    uploadAllImages,
    isUploading,
    getLocalImageUri,
    hasLocalImage,
  } = useDeferredFormImages();

  // Custom resolver that handles deferred images
  const customResolver = React.useCallback(
    async (data: any, context: any, options: any) => {
      // If we have a local image but no URL, temporarily satisfy validation
      const dataToValidate = { ...data };
      if (hasLocalImage("avatar_url") && !dataToValidate.avatar_url) {
        dataToValidate.avatar_url = "will-be-uploaded";
      }

      // Run the normal validation
      return zodResolver(profileFormSchema)(dataToValidate, context, options);
    },
    [hasLocalImage]
  );

  const { control, handleSubmit, setValue, watch, reset, formState } =
    useForm<ProfileFormData>({
      resolver: customResolver,
      defaultValues: {
        username: "",
        avatar_url: "",
      },
    });

  // Load current profile data into form
  React.useEffect(() => {
    if (currentProfile) {
      reset({
        username: currentProfile.username || "",
        avatar_url: currentProfile.avatar_url || "",
      });
    }
  }, [currentProfile, reset]);

  // Auth loading state
  if (authLoading || profileLoading) {
    return (
      <Box className="flex-1 items-center justify-center px-6">
        <VStack space="md" className="items-center">
          <Spinner size="large" />
          <Text className="text-lg text-muted-foreground">
            Loading profile...
          </Text>
        </VStack>
      </Box>
    );
  }

  // Not authenticated
  if (!shouldRender) {
    return null;
  }

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/(tabs)/profile");
    }
  };

  const onSubmit = async (data: ProfileFormData) => {
    try {
      // Create a clean copy of the data
      let finalData: { username: string; avatar_url?: string } = {
        username: data.username,
      };

      // Upload avatar if we have a local image
      if (hasLocalImage("avatar_url")) {
        const uploadResults = await uploadAllImages();

        // Update form data with uploaded URL
        uploadResults.forEach(({ fieldPath, url }) => {
          if (fieldPath === "avatar_url") {
            finalData.avatar_url = url;
          }
        });
      } else if (data.avatar_url) {
        // Keep existing avatar URL
        finalData.avatar_url = data.avatar_url;
      }

      // Submit with uploaded URL
      updateProfileMutation.mutate(finalData, {
        onSuccess: () => {
          clearAllLocalImages();
          setTimeout(() => {
            handleBack();
          }, 100);
        },
      });
    } catch (error) {
      console.error("Profile update error:", error);
    }
  };

  const isFormDisabled = updateProfileMutation.isPending || isUploading;

  // Handle avatar image selection
  const handleAvatarPicked = (uri: string) => {
    if (uri) {
      setLocalImage("avatar_url", uri, "user-avatars");
    } else {
      clearLocalImage("avatar_url");
    }
  };

  // Determine current error to display
  const displayError =
    updateProfileMutation.error || (formState.errors as any)?.root;

  return (
    <Box className="flex-1 bg-background">
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          padding: 16,
          paddingBottom: 100,
        }}
        showsVerticalScrollIndicator={false}
      >
        <VStack space="md">
          {/* Header */}
          <HStack space="md" className="items-center mb-4">
            <Pressable onPress={handleBack} hitSlop={8}>
              <Icon as={ArrowLeftIcon} size="lg" className="text-foreground" />
            </Pressable>
            <VStack className="flex-1">
              <Heading size="xl" className="text-foreground">
                Edit Profile
              </Heading>
              <Text className="text-muted-foreground">
                Update your profile information
              </Text>
            </VStack>
          </HStack>

          {/* Avatar Section */}
          <FormSection title="Profile Picture">
            <ImageUploadField
              label="Avatar"
              value={watch("avatar_url")}
              onChange={(url) => setValue("avatar_url", url)}
              bucket="user-avatars"
              disabled={isFormDisabled}
              helpText="Upload a profile picture (optional)"
              height={200}
              placeholder="Add Profile Picture"
              deferUpload={true}
              onImagePicked={handleAvatarPicked}
              localImageUri={getLocalImageUri("avatar_url")}
              maxSize={5}
            />
          </FormSection>

          {/* Profile Details Section */}
          <FormSection title="Profile Details">
            <ItemFormField
              control={control}
              name="username"
              label="Username"
              placeholder="Enter your username"
              disabled={isFormDisabled}
              required
              helpText="Your username will be visible to other users"
            />
          </FormSection>

          {/* Action Buttons */}
          <HStack space="md" className="mt-4">
            <Button
              variant="outline"
              size="lg"
              onPress={handleBack}
              isDisabled={isFormDisabled}
              className="flex-1"
            >
              <ButtonText>Cancel</ButtonText>
            </Button>

            <Button
              size="lg"
              onPress={handleSubmit(onSubmit)}
              isDisabled={isFormDisabled || !formState.isValid}
              className="flex-1"
            >
              <ButtonText>
                {updateProfileMutation.isPending ? "Saving..." : "Save Changes"}
              </ButtonText>
            </Button>
          </HStack>
        </VStack>
      </ScrollView>

      {/* Error Dialog */}
      <AlertDialog
        isOpen={!!displayError}
        onClose={() => updateProfileMutation.reset()}
      >
        <AlertDialogBackdrop />
        <AlertDialogContent>
          <AlertDialogHeader>
            <HStack space="sm" className="items-center">
              <Icon as={AlertCircleIcon} className="text-error" />
              <Text size="lg" className="font-semibold">
                Error
              </Text>
            </HStack>
          </AlertDialogHeader>
          <AlertDialogBody>
            <Text className="text-muted-foreground">
              {displayError instanceof Error
                ? displayError.message
                : "Failed to update profile. Please try again."}
            </Text>
          </AlertDialogBody>
        </AlertDialogContent>
      </AlertDialog>

      {/* Upload Progress Modal */}
      <Modal isOpen={isUploading} onClose={() => {}}>
        <ModalBackdrop />
        <ModalContent className="w-4/5 max-w-sm">
          <ModalBody className="p-6">
            <VStack space="md" className="items-center">
              <Spinner size="large" />
              <Text size="md" className="font-medium text-foreground">
                Uploading Avatar...
              </Text>
              <Text size="sm" className="text-muted-foreground">
                Please don't close the app
              </Text>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
}
