import React, { useState } from "react";
import { useRouter } from "expo-router";
import { useAuth } from "@/context/AuthContext";
import { useDeleteAccount } from "@/hooks/useDeleteAccount";
import { useGetUserProfile } from "@/hooks/useGetUserProfile";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { ScrollView } from "react-native";
import { Box } from "@/components/ui/box";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { Heading } from "@/components/ui/heading";
import { Button, ButtonText } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Pressable } from "@/components/ui/pressable";
import { Input, InputField, InputSlot, InputIcon } from "@/components/ui/input";
import {
  FormControl,
  FormControlLabel,
  FormControlError,
  FormControlErrorText,
} from "@/components/ui/form-control";
import {
  AlertDialog,
  AlertDialogBackdrop,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";
import {
  Icon,
  ArrowLeftIcon,
  TrashIcon,
  AlertCircleIcon,
  EyeIcon,
  EyeOffIcon,
} from "@/components/ui/icon";
import { FormSection } from "@/components/FormSection";

export default function AccountSettingsScreen() {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const { shouldRender, isLoading: authLoading } = useRequireAuth();
  const deleteAccountMutation = useDeleteAccount();

  // Get current profile for avatar URL
  const { data: profileData } = useGetUserProfile(user?.id || "");
  const currentProfile = profileData?.[0];

  // Delete confirmation state
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  // Auth loading state
  if (authLoading) {
    return (
      <Box className="flex-1 items-center justify-center px-6">
        <VStack space="md" className="items-center">
          <Spinner size="large" />
          <Text className="text-lg text-muted-foreground">Loading...</Text>
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

  const handleDeleteAccount = () => {
    setShowDeleteDialog(true);
    setDeletePassword("");
    setPasswordError("");
  };

  const confirmDelete = async () => {
    if (!deletePassword.trim()) {
      setPasswordError("Password is required");
      return;
    }

    setPasswordError("");

    deleteAccountMutation.mutate(
      {
        password: deletePassword,
        avatarUrl: currentProfile?.avatar_url || undefined,
      },
      {
        onSuccess: () => {
          // Account deleted successfully, user is signed out
          // Navigate to welcome/auth screen
          router.replace("/auth");
        },
        onError: (error) => {
          if (error.message === "Incorrect password") {
            setPasswordError("Incorrect password");
          } else {
            setPasswordError(error.message || "Failed to delete account");
          }
        },
      }
    );
  };

  const cancelDelete = () => {
    setShowDeleteDialog(false);
    setDeletePassword("");
    setPasswordError("");
  };

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
                Account Settings
              </Heading>
              <Text className="text-muted-foreground">
                Manage your account and data
              </Text>
            </VStack>
          </HStack>

          {/* Account Info Section */}
          <FormSection title="Account Information">
            <VStack space="sm">
              <HStack className="justify-between items-center">
                <Text className="text-sm text-muted-foreground">Email</Text>
                <Text className="text-sm text-foreground font-medium">
                  {user?.email}
                </Text>
              </HStack>
              <HStack className="justify-between items-center">
                <Text className="text-sm text-muted-foreground">Username</Text>
                <Text className="text-sm text-foreground font-medium">
                  {currentProfile?.username || "Not set"}
                </Text>
              </HStack>
            </VStack>
          </FormSection>

          {/* Danger Zone Section */}
          <FormSection title="Danger Zone" variant="outline">
            <VStack space="md">
              <VStack space="sm">
                <Text className="text-sm text-muted-foreground">
                  Once you delete your account, there is no going back. This
                  will:
                </Text>
                <VStack space="xs" className="pl-4">
                  <Text className="text-xs text-muted-foreground">
                    • Permanently delete your profile and recipes
                  </Text>
                  <Text className="text-xs text-muted-foreground">
                    • Remove all your images and content
                  </Text>
                  <Text className="text-xs text-muted-foreground">
                    • Delete your account permanently
                  </Text>
                </VStack>
              </VStack>

              <Button
                variant="outline"
                size="lg"
                onPress={handleDeleteAccount}
                className="w-full border-destructive"
              >
                <HStack space="sm" className="items-center">
                  <Icon as={TrashIcon} size="sm" className="text-destructive" />
                  <ButtonText className="text-destructive font-medium">
                    Delete My Account
                  </ButtonText>
                </HStack>
              </Button>
            </VStack>
          </FormSection>
        </VStack>
      </ScrollView>

      {/* Delete Account Confirmation Dialog */}
      <AlertDialog isOpen={showDeleteDialog} onClose={cancelDelete}>
        <AlertDialogBackdrop />
        <AlertDialogContent>
          <AlertDialogHeader>
            <HStack space="sm" className="items-center">
              <Icon
                as={AlertCircleIcon}
                size="lg"
                className="text-destructive"
              />
              <VStack className="flex-1">
                <Text size="lg" className="font-semibold text-foreground">
                  Delete Account
                </Text>
                <Text size="sm" className="text-muted-foreground">
                  This action cannot be undone
                </Text>
              </VStack>
            </HStack>
          </AlertDialogHeader>

          <AlertDialogBody>
            <VStack space="md">
              <Text className="text-muted-foreground">
                Are you sure you want to permanently delete your account? All
                your data will be lost forever.
              </Text>

              <FormControl isInvalid={!!passwordError}>
                <FormControlLabel>
                  <Text className="text-sm font-medium text-foreground">
                    Enter your password to confirm
                  </Text>
                </FormControlLabel>
                <Input variant="outline">
                  <InputField
                    placeholder="Enter your password"
                    secureTextEntry={!showPassword}
                    value={deletePassword}
                    onChangeText={(text) => {
                      setDeletePassword(text);
                      setPasswordError("");
                    }}
                    autoComplete="current-password"
                  />
                  <InputSlot className="pr-3">
                    <Pressable onPress={() => setShowPassword(!showPassword)}>
                      <InputIcon
                        as={showPassword ? EyeOffIcon : EyeIcon}
                        className="text-muted-foreground"
                      />
                    </Pressable>
                  </InputSlot>
                </Input>
                {passwordError && (
                  <FormControlError>
                    <FormControlErrorText>{passwordError}</FormControlErrorText>
                  </FormControlError>
                )}
              </FormControl>
            </VStack>
          </AlertDialogBody>

          <AlertDialogFooter>
            <HStack space="sm" className="w-full">
              <Button
                variant="outline"
                size="lg"
                onPress={cancelDelete}
                isDisabled={deleteAccountMutation.isPending}
                className="flex-1"
              >
                <ButtonText>Cancel</ButtonText>
              </Button>
              <Button
                variant="solid"
                size="lg"
                onPress={confirmDelete}
                isDisabled={
                  deleteAccountMutation.isPending || !deletePassword.trim()
                }
                className="flex-1 bg-destructive"
              >
                <ButtonText className="text-white">
                  {deleteAccountMutation.isPending
                    ? "Deleting..."
                    : "Delete Forever"}
                </ButtonText>
              </Button>
            </HStack>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Box>
  );
}
