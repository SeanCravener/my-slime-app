import React, { useState } from "react";
import { ScrollView } from "react-native";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "expo-router";
import { AuthForm } from "@/components/auth/AuthForm";
import { Box } from "@/components/ui/box";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { Button, ButtonText } from "@/components/ui/button";
import { Pressable } from "@/components/ui/pressable";
import { ArrowLeft } from "lucide-react-native";
import type { SignInSchema, SignUpSchema } from "@/lib/schemas";

export default function AuthScreen() {
  const { signIn, signUp } = useAuth();
  const router = useRouter();
  const [mode, setMode] = useState<"signIn" | "signUp">("signIn");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (formData: SignInSchema | SignUpSchema) => {
    try {
      setIsLoading(true);
      setError(null);

      if (mode === "signIn") {
        await signIn(formData.email, formData.password);
      } else {
        await signUp(
          (formData as SignUpSchema).email,
          (formData as SignUpSchema).password,
          (formData as SignUpSchema).confirmPassword
        );
      }

      // Replace with home so user can't go back to auth screen
      router.replace("/");
    } catch (err) {
      const error = err as Error;
      setError(error?.message || "An error occurred during authentication");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackPress = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      // If no history, replace with home
      router.replace("/");
    }
  };

  const handleModeChange = (newMode: "signIn" | "signUp") => {
    setMode(newMode);
    setError(null);
  };

  return (
    <ScrollView
      className="flex-1"
      contentContainerStyle={{
        paddingTop: 20,
        paddingBottom: 40,
        flexGrow: 1,
      }}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      {/** Back Button */}
      <Box className="px-6 mb-8">
        <Pressable onPress={handleBackPress} hitSlop={8}>
          <ArrowLeft size={24} color="#000000" />
        </Pressable>
      </Box>
      {/* Title and Toggle Section */}
      <VStack space="xl" className="items-center px-6 mb-8">
        {/* Title */}
        <Text className="text-3xl font-bold text-foreground text-center">
          {mode === "signIn" ? "Welcome Back!" : "Join Us!"}
        </Text>

        {/* Mode Toggle */}
        <Box className="bg-muted/30 p-1 rounded-xl">
          <HStack space="xs">
            <Button
              variant={mode === "signIn" ? "solid" : "outline"}
              size="md"
              onPress={() => handleModeChange("signIn")}
              isDisabled={isLoading}
              className={`min-w-24 ${
                mode === "signIn"
                  ? "bg-primary"
                  : "bg-transparent border-transparent"
              }`}
            >
              <ButtonText
                className={
                  mode === "signIn"
                    ? "text-primary-foreground font-medium"
                    : "text-muted-foreground"
                }
              >
                Sign In
              </ButtonText>
            </Button>

            <Button
              variant={mode === "signUp" ? "solid" : "outline"}
              size="md"
              onPress={() => handleModeChange("signUp")}
              isDisabled={isLoading}
              className={`min-w-24 ${
                mode === "signUp"
                  ? "bg-primary"
                  : "bg-transparent border-transparent"
              }`}
            >
              <ButtonText
                className={
                  mode === "signUp"
                    ? "text-primary-foreground font-medium"
                    : "text-muted-foreground"
                }
              >
                Sign Up
              </ButtonText>
            </Button>
          </HStack>
        </Box>
      </VStack>
      {/* Auth Form */}
      <Box className="flex-1">
        <AuthForm
          mode={mode}
          onSubmit={handleSubmit}
          isLoading={isLoading}
          error={error ? ({ message: error } as Error) : null}
        />
      </Box>
    </ScrollView>
  );
}
