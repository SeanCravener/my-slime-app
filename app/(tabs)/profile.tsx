import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { Box } from "@/components/ui/box";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { Button, ButtonText } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { User, LogOut, X } from "lucide-react-native";
import {
  AlertDialog,
  AlertDialogBackdrop,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogCloseButton,
  AlertDialogFooter,
  AlertDialogBody,
} from "@/components/ui/alert-dialog";
import { router } from "expo-router";

export default function ProfileScreen() {
  const { signOut } = useAuth();
  const { shouldRender, isLoading, session } = useRequireAuth();
  const [showLogoutAlert, setShowLogoutAlert] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  if (isLoading) {
    return (
      <Box className="flex-1 items-center justify-center px-6">
        <VStack space="md" className="items-center">
          <Text className="text-lg text-muted-foreground">Loading...</Text>
        </VStack>
      </Box>
    );
  }

  if (!shouldRender) {
    return null;
  }

  const user = session!.user;

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
      <Box className="flex-1 px-6 py-8">
        <VStack space="lg" className="mb-8">
          <Text className="text-3xl font-bold text-foreground">Profile</Text>
          <Text className="text-base text-muted-foreground">
            Manage your account and preferences
          </Text>
        </VStack>

        <Card className="p-6 mb-6" variant="elevated">
          <VStack space="md">
            <HStack space="md" className="items-center">
              <Box className="w-16 h-16 bg-primary/10 rounded-full items-center justify-center">
                <User size={32} color="#007AFF" />
              </Box>
              <VStack className="flex-1">
                <Text className="text-lg font-semibold text-foreground">
                  Welcome back!
                </Text>
                <Text className="text-sm text-muted-foreground">
                  {user.email || "No email available"}
                </Text>
              </VStack>
            </HStack>
          </VStack>
        </Card>

        <VStack space="md">
          <Button
            variant="outline"
            size="lg"
            onPress={() => router.push("/auth/reset-password")}
            className="w-full"
          >
            <ButtonText className="text-destructive">Reset Password</ButtonText>
          </Button>
          <Button
            variant="outline"
            size="lg"
            onPress={() => setShowLogoutAlert(true)}
            isDisabled={isSigningOut}
            className="w-full"
          >
            <HStack space="sm" className="items-center">
              <LogOut size={16} color="#EF4444" />
              <ButtonText className="text-destructive">
                {isSigningOut ? "Signing Out..." : "Sign Out"}
              </ButtonText>
            </HStack>
          </Button>
        </VStack>

        <AlertDialog
          isOpen={showLogoutAlert}
          onClose={() => setShowLogoutAlert(false)}
        >
          <AlertDialogBackdrop />
          <AlertDialogContent>
            <AlertDialogHeader>
              <Text className="text-lg font-semibold">Sign Out</Text>
              <AlertDialogCloseButton>
                <X size={16} />
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
