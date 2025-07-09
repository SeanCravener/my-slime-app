import React, { useState } from "react";
import { SafeAreaView } from "react-native";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "expo-router";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
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

export default function ProfileScreen() {
  // Wrap the entire component content in ProtectedRoute
  return (
    <ProtectedRoute>
      <ProfileContent />
    </ProtectedRoute>
  );
}

function ProfileContent() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [showLogoutAlert, setShowLogoutAlert] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOut = async () => {
    try {
      setIsSigningOut(true);
      await signOut();
      setShowLogoutAlert(false);
      // Replace with home so user can't navigate back to protected screen
      router.replace("/");
    } catch (error) {
      console.error("Sign out error:", error);
    } finally {
      setIsSigningOut(false);
    }
  };

  return (
    <ProtectedRoute>
      <SafeAreaView className="flex-1 bg-background">
        <Box className="flex-1 px-6 py-8">
          {/* Header */}
          <VStack space="lg" className="mb-8">
            <Text className="text-3xl font-bold text-foreground">Profile</Text>
            <Text className="text-base text-muted-foreground">
              Manage your account and preferences
            </Text>
          </VStack>

          {/* User Info Card */}
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
                    {user?.email || "No email available"}
                  </Text>
                </VStack>
              </HStack>

              {/* User ID for testing */}
              <Box className="bg-muted/30 p-3 rounded-lg">
                <Text className="text-xs font-medium text-muted-foreground mb-1">
                  User ID (for testing)
                </Text>
                <Text className="text-sm font-mono text-foreground break-all">
                  {user?.id || "No ID available"}
                </Text>
              </Box>
            </VStack>
          </Card>

          {/* Actions */}
          <VStack space="md">
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

          {/* Logout Confirmation Alert */}
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
      </SafeAreaView>
    </ProtectedRoute>
  );
}
