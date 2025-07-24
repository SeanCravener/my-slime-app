import React, { useState } from "react";
import { useRouter } from "expo-router";
import { useAuth } from "@/context/AuthContext";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { ScrollView } from "react-native";
import { Box } from "@/components/ui/box";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { Heading } from "@/components/ui/heading";
import { Button, ButtonText } from "@/components/ui/button";
import { Pressable } from "@/components/ui/pressable";
import { Divider } from "@/components/ui/divider";
import {
  AlertDialog,
  AlertDialogBackdrop,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogCloseButton,
  AlertDialogFooter,
  AlertDialogBody,
} from "@/components/ui/alert-dialog";
import { Icon, ArrowLeftIcon, CloseIcon } from "@/components/ui/icon";
import { LogOut } from "lucide-react-native";
import { EditProfileButton } from "@/components/EditProfileButton";
import { ThemeToggleButton } from "@/components/ThemeToggleButton";
import { ChangePasswordButton } from "@/components/ChangePasswordButton";
import { AdvancedSettingsButton } from "@/components/AdvancedSettingsButton";
import { TermsButton } from "@/components/TermsButton";
import { PrivacyButton } from "@/components/PrivacyButton";

export default function SettingsScreen() {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const { shouldRender, isLoading } = useRequireAuth();
  const [showLogoutAlert, setShowLogoutAlert] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  // Auth loading state
  if (isLoading) {
    return (
      <Box className="flex-1 items-center justify-center px-6">
        <VStack space="md" className="items-center">
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

  const handleSignOut = async () => {
    try {
      setIsSigningOut(true);
      await signOut();
      setShowLogoutAlert(false);
    } catch (error) {
      console.error("Sign out error:", error);
    } finally {
      setIsSigningOut(false);
    }
  };

  return (
    <>
      <Box className="flex-1 bg-background">
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{
            paddingBottom: 100,
          }}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <Box className="px-6 py-8">
            <HStack space="md" className="items-center mb-4">
              <Pressable onPress={handleBack} hitSlop={8}>
                <Icon
                  as={ArrowLeftIcon}
                  size="lg"
                  className="text-foreground"
                />
              </Pressable>
              <VStack className="flex-1">
                <Heading size="xl" className="text-foreground">
                  Settings
                </Heading>
                <Text className="text-muted-foreground">
                  Customize your app experience
                </Text>
              </VStack>
            </HStack>
          </Box>

          {/* Settings Sections */}
          <VStack space="lg" className="px-6">
            {/* Profile Section */}
            <VStack space="sm">
              <Text className="text-sm font-semibold text-muted-foreground uppercase tracking-wide px-4">
                Profile
              </Text>
              <Box className="bg-card rounded-lg border border-border">
                <EditProfileButton />
                <Divider className="mx-4" />
                <ChangePasswordButton />
              </Box>
            </VStack>

            {/* Preferences Section */}
            <VStack space="sm">
              <Text className="text-sm font-semibold text-muted-foreground uppercase tracking-wide px-4">
                Preferences
              </Text>
              <Box className="bg-card rounded-lg border border-border">
                <ThemeToggleButton />
              </Box>
            </VStack>

            {/* Account Section */}
            <VStack space="sm">
              <Text className="text-sm font-semibold text-muted-foreground uppercase tracking-wide px-4">
                Account
              </Text>
              <Box className="bg-card rounded-lg border border-border">
                <AdvancedSettingsButton />
                <Divider className="mx-4" />
                <Pressable onPress={() => setShowLogoutAlert(true)}>
                  <HStack space="md" className="items-center py-4 px-4">
                    <Icon as={LogOut} size="sm" color="#EF4444" />
                    <VStack className="flex-1">
                      <Text className="font-medium text-foreground">
                        Sign Out
                      </Text>
                      <Text className="text-sm text-muted-foreground">
                        Sign out of your account
                      </Text>
                    </VStack>
                  </HStack>
                </Pressable>
              </Box>
            </VStack>

            {/* Legal Section */}
            <VStack space="sm">
              <Text className="text-sm font-semibold text-muted-foreground uppercase tracking-wide px-4">
                Legal
              </Text>
              <Box className="bg-card rounded-lg border border-border">
                <TermsButton />
                <Divider className="mx-4" />
                <PrivacyButton />
              </Box>
            </VStack>

            {/* App Info Section */}
            <VStack space="sm">
              <Text className="text-sm font-semibold text-muted-foreground uppercase tracking-wide px-4">
                About
              </Text>
              <Box className="bg-card rounded-lg border border-border p-4">
                <VStack space="xs">
                  <HStack className="justify-between items-center">
                    <Text className="text-sm text-muted-foreground">
                      Version
                    </Text>
                    <Text className="text-sm text-foreground font-medium">
                      1.0.0
                    </Text>
                  </HStack>
                  <HStack className="justify-between items-center">
                    <Text className="text-sm text-muted-foreground">
                      User ID
                    </Text>
                    <Text className="text-xs text-foreground font-mono">
                      {user?.id.slice(0, 8)}...
                    </Text>
                  </HStack>
                </VStack>
              </Box>
            </VStack>
          </VStack>
        </ScrollView>

        {/* Logout Confirmation Dialog */}
        <AlertDialog
          isOpen={showLogoutAlert}
          onClose={() => setShowLogoutAlert(false)}
        >
          <AlertDialogBackdrop />
          <AlertDialogContent>
            <AlertDialogHeader>
              <Text className="text-lg font-semibold">Sign Out</Text>
              <AlertDialogCloseButton>
                <Icon as={CloseIcon} size="sm" />
              </AlertDialogCloseButton>
            </AlertDialogHeader>
            <AlertDialogBody>
              <Text className="text-muted-foreground">
                Are you sure you want to sign out? You'll be redirected to the
                home screen.
              </Text>
            </AlertDialogBody>
            <AlertDialogFooter>
              <HStack space="md" className="w-full">
                <Button
                  variant="outline"
                  size="sm"
                  onPress={() => setShowLogoutAlert(false)}
                  className="flex-1"
                  isDisabled={isSigningOut}
                >
                  <ButtonText>Cancel</ButtonText>
                </Button>
                <Button
                  variant="solid"
                  size="sm"
                  onPress={handleSignOut}
                  className="flex-1 bg-destructive"
                  isDisabled={isSigningOut}
                >
                  <ButtonText className="text-destructive-foreground">
                    {isSigningOut ? "Signing Out..." : "Sign Out"}
                  </ButtonText>
                </Button>
              </HStack>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </Box>
    </>
  );
}
